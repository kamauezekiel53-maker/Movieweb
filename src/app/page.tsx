"use client";
import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import SearchResultCard from "@/components/SearchResultCard";
import { motion } from "framer-motion";

export default function Home() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const search = trpc.movie.search.useQuery({ q: submitted, page: 1 }, { enabled: submitted.length > 0 });

  return (
    <div style={{ padding: 20 }}>
      <motion.h1 initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        Moviehub
      </motion.h1>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search movies..."
          style={{ padding: 8, width: "60%" }}
        />
        <button
          onClick={() => setSubmitted(q.trim())}
          style={{ marginLeft: 8, padding: "8px 12px" }}
        >
          Search
        </button>
      </div>

      {search.isLoading && <div>Searching…</div>}
      {search.error && <div>Error: {String(search.error.message)}</div>}
      <div style={{ marginTop: 12 }}>
        {search.data?.results?.length ? (
          search.data.results.map((m: any) => <SearchResultCard key={m.id} item={m} />)
        ) : submitted ? (
          <div>No results</div>
        ) : (
          <div>Search for a movie to begin.</div>
        )}
      </div>
    </div>
  );
}