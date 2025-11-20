"use client";
import React from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc";

export default function MoviePageInner() {
  const params = useParams();
  const id = params?.id as string;
  const movie = trpc.movie.get.useQuery({ id });
  const sources = trpc.movie.sources.useQuery({ id });
  const auth = trpc.auth.me.useQuery();

  return (
    <main style={{ padding: 20 }}>
      <a href="/">← Back</a>
      {movie.isLoading ? (
        <div>Loading movie…</div>
      ) : movie.error ? (
        <div>Error: {String(movie.error.message)}</div>
      ) : movie.data ? (
        <>
          <h1>{movie.data.title || movie.data.name}</h1>
          <p>{movie.data.description || movie.data.overview}</p>
        </>
      ) : null}

      <h3>Sources</h3>
      {sources.isLoading ? (
        <div>Loading sources…</div>
      ) : (
        <ul>
          {sources.data?.results?.map((s: any, i: number) => {
            const upstream = s.file || s.download || s.url || s.link;
            const proxied = upstream ? `/api/proxy?url=${encodeURIComponent(upstream)}` : null;
            return (
              <li key={i}>
                {proxied ? (
                  <a href={`/watch/${id}?source=${encodeURIComponent(proxied)}`}>Play {s.quality || i}</a>
                ) : (
                  <span>No playable URL</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div style={{ marginTop: 12 }}>
        {auth.data ? (
          <div>Signed in as {auth.data.email}</div>
        ) : (
          <div>
            <a href="/login">Sign in</a> to save your watch progress.
          </div>
        )}
      </div>
    </main>
  );
}