"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname() || "";
  const isNoteDetail =
    pathname.startsWith("/notes/") && !pathname.startsWith("/notes/subject");

  if (isNoteDetail) {
    return null;
  }

  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ccc" }}>
      <strong style={{ marginRight: 20 }}>Toby</strong>
      <Link href="/">Home</Link>{" "}
      <Link href="/projects">Projects</Link>{" "}
      <Link href="/notes">Notes</Link>{" "}
      <Link href="/resume">Resume</Link>
    </nav>
  );
}
