import datetime
import mimetypes
import os
import re
import time
from pathlib import Path
from typing import List, Optional
from urllib.parse import quote, urlparse

import requests
from dotenv import load_dotenv

# --------------------------------------------------
# Setup
# --------------------------------------------------

dotenv_paths = [
    Path(__file__).resolve().parent / ".env",
    Path(__file__).resolve().parent.parent / ".env",
]
for dotenv_path in dotenv_paths:
    if dotenv_path.exists():
        load_dotenv(dotenv_path=dotenv_path)
        break

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID = os.getenv("NOTION_DATABASE_ID")
NOTION_VERSION = os.getenv("NOTION_VERSION", "2022-06-28")

if not NOTION_TOKEN or not DATABASE_ID:
    raise ValueError("NOTION_TOKEN and NOTION_DATABASE_ID must be set in the environment")

BASE_URL = "https://api.notion.com/v1"
HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
}

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / "frontend/content/notes/_published"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FRONT_MATTER_RE = re.compile(r"^---\n(.*?)\n---", re.DOTALL)

# --------------------------------------------------
# Helpers
# --------------------------------------------------

def request_json(method: str, path: str, *, json: Optional[dict] = None, params: Optional[dict] = None) -> dict:
    url = f"{BASE_URL}{path}"
    response = requests.request(method, url, headers=HEADERS, json=json, params=params, timeout=20)
    response.raise_for_status()
    return response.json()


def rich_text(rt: List[dict]) -> str:
    parts = []
    for token in rt:
        token_type = token.get("type")
        if token_type == "equation":
            expr = token.get("equation", {}).get("expression", "")
            parts.append(f"${expr}$")
            continue

        if token_type == "text":
            parts.append(token.get("text", {}).get("content", ""))
            continue

        parts.append(token.get("plain_text", ""))
    return "".join(parts)


def iso_to_date(iso_str: Optional[str]) -> Optional[str]:
    if not iso_str:
        return None
    return datetime.datetime.fromisoformat(iso_str.replace("Z", "+00:00")).date().isoformat()


def iso_to_datetime(iso_str: Optional[str]) -> Optional[str]:
    if not iso_str:
        return None
    dt = datetime.datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
    return dt.isoformat()


def extract_existing_date(md_text: str) -> Optional[str]:
    match = FRONT_MATTER_RE.match(md_text)
    if not match:
        return None

    for line in match.group(1).splitlines():
        if line.startswith("date:"):
            return line.split(":", 1)[1].strip().strip('"')
    return None


def extract_existing_updated(md_text: str) -> Optional[str]:
    match = FRONT_MATTER_RE.match(md_text)
    if not match:
        return None

    for line in match.group(1).splitlines():
        if line.startswith("updated:"):
            return line.split(":", 1)[1].strip().strip('"')
    return None


def parse_date(value: Optional[str]) -> Optional[datetime.date]:
    if not value:
        return None
    try:
        return datetime.date.fromisoformat(value)
    except ValueError:
        return None


def parse_datetime(value: Optional[str]) -> Optional[datetime.datetime]:
    if not value:
        return None
    try:
        parsed = datetime.datetime.fromisoformat(value)
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=datetime.timezone.utc)
        return parsed.astimezone(datetime.timezone.utc)
    except ValueError:
        return None


def transform(
    md_text: str,
    *,
    title: Optional[str] = None,
    subjects: Optional[List[str]] = None,
    topics: Optional[List[str]] = None,
    date: Optional[str] = None,
    updated: Optional[str] = None,
    existing_md: Optional[str] = None,
) -> str:
    lines = md_text.splitlines()

    extracted_title = None
    body = md_text
    if lines and lines[0].startswith("# "):
        extracted_title = lines[0][2:].strip()
        if title and extracted_title:
            def normalize(value: str) -> str:
                return "".join(ch.lower() for ch in value if ch.isalnum())

            if normalize(title) == normalize(extracted_title):
                body = "\n".join(lines[1:]).lstrip()

    final_title = title or extracted_title or "Untitled"

    now = datetime.date.today().isoformat()

    original_date = extract_existing_date(existing_md) if existing_md else None
    date_value = original_date or date or now
    updated_value = updated or now

    subjects = subjects or []
    topics = topics or []

    front_matter = f"""---
title: \"{final_title}\"
date: \"{date_value}\"
updated: \"{updated_value}\"
subjects: {subjects}
topics: {topics}
---
"""

    return front_matter + "\n" + body


def get_title(page: dict) -> Optional[str]:
    props = page.get("properties", {})
    for prop in props.values():
        if prop.get("type") == "title":
            title_prop = prop.get("title", [])
            if title_prop:
                return title_prop[0].get("plain_text")
    return None


def get_status(page: dict) -> Optional[str]:
    props = page.get("properties", {})
    prop = props.get("Status")
    if not prop:
        for candidate in props.values():
            if candidate.get("type") in {"status", "select"}:
                prop = candidate
                break

    if not prop:
        return None

    prop_type = prop.get("type")
    if prop_type == "status":
        status = prop.get("status")
        return status.get("name") if status else None
    if prop_type == "select":
        select = prop.get("select")
        return select.get("name") if select else None
    return None


def get_categories(page: dict) -> List[str]:
    props = page.get("properties", {})
    prop = props.get("Category")
    if not prop:
        return []

    prop_type = prop.get("type")
    if prop_type == "select":
        select = prop.get("select")
        return [select.get("name")] if select else []
    if prop_type == "multi_select":
        return [item.get("name") for item in prop.get("multi_select", []) if item.get("name")]
    return []

def safe_dirname(title: str) -> str:
    cleaned = title.replace("/", "-").strip()
    return cleaned or "Untitled"


def download_image(url: str, dest_dir: Path, fallback_stem: str) -> str:
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    stem, ext = os.path.splitext(filename)
    if not stem:
        stem = fallback_stem
    if not ext:
        ext = ""

    response = requests.get(url, timeout=30)
    response.raise_for_status()

    if not ext:
        content_type = response.headers.get("Content-Type", "").split(";", 1)[0]
        ext = mimetypes.guess_extension(content_type) or ".png"

    final_name = f"{stem}{ext}"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / final_name
    dest_path.write_bytes(response.content)
    return final_name


# --------------------------------------------------
# Recursive block -> Markdown
# --------------------------------------------------

def list_block_children(block_id: str) -> List[dict]:
    results = []
    cursor = None
    while True:
        params = {"start_cursor": cursor} if cursor else None
        data = request_json("GET", f"/blocks/{block_id}/children", params=params)
        results.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")
        time.sleep(0.1)
    return results


def block_to_md(
    block: dict,
    indent: int = 0,
    image_dir: Optional[Path] = None,
    image_url_prefix: str = "/images",
    image_folder_name: Optional[str] = None,
) -> str:
    md = ""
    block_type = block.get("type")
    data = block.get(block_type, {})
    pad = "  " * indent
    handled_children = False

    def sanitize_cell(value: str) -> str:
        return value.replace("|", "\\|").replace("\n", "<br>")

    def text() -> str:
        return rich_text(data.get("rich_text", []))

    if block_type == "paragraph":
        md += pad + text() + "\n\n"
    elif block_type == "heading_1":
        md += "# " + text() + "\n\n"
    elif block_type == "heading_2":
        md += "## " + text() + "\n\n"
    elif block_type == "heading_3":
        md += "### " + text() + "\n\n"
    elif block_type == "bulleted_list_item":
        md += pad + "- " + text() + "\n"
    elif block_type == "numbered_list_item":
        md += pad + "1. " + text() + "\n"
    elif block_type == "quote":
        md += pad + "> " + text() + "\n\n"
    elif block_type == "code":
        language = data.get("language", "")
        md += f"```{language}\n{text()}\n```\n\n"
    elif block_type == "equation":
        expr = data.get("expression", "")
        md += f"$$\n{expr}\n$$\n\n"
    elif block_type == "image" and image_dir and image_folder_name:
        image_type = data.get("type")
        url = None
        if image_type == "external":
            url = data.get("external", {}).get("url")
        elif image_type == "file":
            url = data.get("file", {}).get("url")

        if url:
            filename = download_image(url, image_dir, block["id"])
            alt_text = rich_text(data.get("caption", [])) or "image"
            folder_encoded = quote(image_folder_name, safe="-_().")
            filename_encoded = quote(filename, safe="-_().")
            md += f"![{alt_text}]({image_url_prefix}/{folder_encoded}/{filename_encoded})\n\n"
    elif block_type == "callout":
        icon = data.get("icon") or {}
        emoji = icon.get("emoji") if icon.get("type") == "emoji" else ""
        callout_text = text()
        md += "<aside>\n\n"
        if emoji or callout_text:
            combined = f"{emoji} {callout_text}".strip()
            md += f"{combined}\n\n"
        if block.get("has_children"):
            for child in list_block_children(block["id"]):
                md += block_to_md(
                    child,
                    indent,
                    image_dir=image_dir,
                    image_url_prefix=image_url_prefix,
                    image_folder_name=image_folder_name,
                )
        md += "</aside>\n\n"
        handled_children = True
    elif block_type == "table":
        rows = []
        for child in list_block_children(block["id"]):
            if child.get("type") != "table_row":
                continue
            cells = child.get("table_row", {}).get("cells", [])
            row = [sanitize_cell(rich_text(cell)) for cell in cells]
            rows.append(row)

        if rows:
            col_count = max(len(row) for row in rows)
            has_col_header = data.get("has_column_header", False)

            def pad_row(row):
                return row + [""] * (col_count - len(row))

            if has_col_header:
                header = pad_row(rows[0])
                body = [pad_row(r) for r in rows[1:]]
            else:
                header = [""] * col_count
                body = [pad_row(r) for r in rows]

            md += "| " + " | ".join(header) + " |\n"
            md += "| " + " | ".join(["---"] * col_count) + " |\n"
            for row in body:
                md += "| " + " | ".join(row) + " |\n"
            md += "\n"

        handled_children = True

    if block.get("has_children") and not handled_children:
        child_indent = indent + 1 if block_type and block_type.endswith("_list_item") else indent
        for child in list_block_children(block["id"]):
            md += block_to_md(
                child,
                child_indent,
                image_dir=image_dir,
                image_url_prefix=image_url_prefix,
                image_folder_name=image_folder_name,
            )

    return md


# --------------------------------------------------
# Page -> Markdown
# --------------------------------------------------

def page_to_md(
    page_id: str,
    *,
    image_dir: Optional[Path] = None,
    image_url_prefix: str = "/images",
    image_folder_name: Optional[str] = None,
) -> str:
    md = ""
    for block in list_block_children(page_id):
        md += block_to_md(
            block,
            image_dir=image_dir,
            image_url_prefix=image_url_prefix,
            image_folder_name=image_folder_name,
        )
    return md


def safe_filename(title: str, page_id: str) -> str:
    safe_title = title.replace("/", "-").strip() or "Untitled"
    return f"{safe_title} {page_id}.md"


# --------------------------------------------------
# MAIN
# --------------------------------------------------

print("Retrieving database pages...")

data = request_json("POST", f"/databases/{DATABASE_ID}/query", json={})
pages = data.get("results", [])

while data.get("has_more"):
    cursor = data.get("next_cursor")
    data = request_json("POST", f"/databases/{DATABASE_ID}/query", json={"start_cursor": cursor})
    pages.extend(data.get("results", []))
    time.sleep(0.1)

print(f"Fetched {len(pages)} pages")

published_pages = []
for page in pages:
    status = get_status(page)
    if status and status.strip().lower() == "published":
        published_pages.append(page)

print(f"Publishing {len(published_pages)} pages")

for page in published_pages:
    page_id = page["id"]
    title = get_title(page) or "Untitled"
    categories = get_categories(page)
    created_date = iso_to_date(page.get("created_time"))
    updated_date = iso_to_datetime(page.get("last_edited_time"))

    print(f"Exporting: {title} ({page_id})")

    output_path = OUTPUT_DIR / safe_filename(title, page_id)
    existing_md = output_path.read_text(encoding="utf-8") if output_path.exists() else None

    existing_updated = parse_datetime(extract_existing_updated(existing_md)) if existing_md else None
    incoming_updated = parse_datetime(updated_date)
    if existing_updated and incoming_updated and existing_updated >= incoming_updated:
        print(f"Skipping (up-to-date): {output_path.name}")
        continue

    image_folder_name = safe_dirname(title)
    image_dir = REPO_ROOT / "frontend/public/images" / image_folder_name
    body_md = page_to_md(
        page_id,
        image_dir=image_dir,
        image_folder_name=image_folder_name,
    )

    final_md = transform(
        body_md,
        title=title,
        subjects=["data science"],
        topics=categories,
        date=created_date,
        updated=updated_date,
        existing_md=existing_md,
    )

    output_path.write_text(final_md, encoding="utf-8")

print(f"Export complete -> {OUTPUT_DIR}")
