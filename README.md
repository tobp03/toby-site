# toby-site

Personal site for Toby, built with Next.js. The app lives in `frontend/` and renders notes, projects, and a resume from Markdown content.

## Structure

- `frontend/`: Next.js app
- `frontend/content/notes/_published/`: published notes
- `frontend/content/projects/`: project entries
- `frontend/content/resume.md`: resume content
- `frontend/public/resume.pdf`: optional downloadable resume PDF

## Development

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
cd frontend
npm run build
npm run start
```

## Content updates

- Notes: add or edit Markdown files in `frontend/content/notes/_published/`.
- Resume: edit `frontend/content/resume.md`.
- Resume PDF: place a generated PDF at `frontend/public/resume.pdf` to enable the download button.

## Notion sync (`sync_notion`)

Notes can be synced from a Notion database using `backend/sync_notion.py`.

Environment variables:

- `NOTION_TOKEN`: Notion integration token
- `NOTION_DATABASE_ID`: database ID to pull pages from
- `NOTION_VERSION` (optional): Notion API version (default `2022-06-28`)

Run:

```bash
cd backend
python sync_notion.py
```

Outputs:

- Markdown notes to `frontend/content/notes/_published/`
- Images to `frontend/public/images/<note-title>/`

## Deployment

Deploy the `frontend/` app with your preferred Next.js host.
