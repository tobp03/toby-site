const RAW_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_BASE_PATH =
  RAW_BASE_PATH === "/" ? "" : RAW_BASE_PATH.replace(/\/$/, "");

export function withBasePath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return value;
  }

  return `${SITE_BASE_PATH}${value}`;
}
