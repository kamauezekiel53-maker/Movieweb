"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Player from "@/components/Player";
import { trpc } from "@/lib/trpc";

export default function WatchPage() {
  const params = useParams();
  const id = params?.id as string;
  const sp = useSearchParams();
  const srcParam = sp?.get("source") ?? "";
  // srcParam might already be encoded proxied path
  const src = decodeURIComponent(srcParam);
  const [startAt, setStartAt] = useState(0);
  const historyGet = trpc.history.getForUser.useQuery({ movieId: id }, { enabled: !!id });
  const historyUpsert = trpc.history.upsert.useMutation();

  useEffect(() => {
    if (historyGet.data?.position) {
      setStartAt(historyGet.data.position);
    } else {
      // fallback to localStorage
      const local = typeof window !== "undefined" ? localStorage.getItem(`lastpos:${id}`) : null;
      if (local) setStartAt(parseInt(local, 10) || 0);
    }
  }, [historyGet.data, id]);

  // debounce-like save every 5 seconds in onTimeUpdate implementation
  const savePosition = useCallback(
    (posSeconds: number) => {
      if (typeof window !== "undefined") localStorage.setItem(`lastpos:${id}`, String(posSeconds));
      // persist to server every 5s chunk
      if (posSeconds % 5 === 0) {
        historyUpsert.mutate({ movieId: id, position: posSeconds });
      }
    },
    [id, historyUpsert]
  );

  return (
    <main style={{ padding: 20 }}>
      <a href={`/movie/${id}`}>← Back to movie</a>
      <h1>Watching {id}</h1>
      {src ? (
        <Player src={src} title={`Movie ${id}`} startTime={startAt} onTimeUpdate={(sec) => savePosition(sec)} />
      ) : (
        <div>No source provided. Go back and select a source.</div>
      )}
    </main>
  );
}