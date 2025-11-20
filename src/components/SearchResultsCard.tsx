"use client";
import React from "react";
import Link from "next/link";

export default function SearchResultCard({ item }: { item: any }) {
  const title = item.title || item.name || item.id;
  const overview = item.description || item.overview || "";
  return (
    <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, marginBottom: 8 }}>
      <Link href={`/movie/${item.id}`}>
        <h3>{title}</h3>
      </Link>
      <p style={{ maxHeight: 48, overflow: "hidden", fontSize: 13 }}>{overview}</p>
    </div>
  );
}