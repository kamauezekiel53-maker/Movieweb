"use client";
import React from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

export default function Header() {
  const auth = trpc.auth.me.useQuery();
  const router = useRouter();

  const logout = () => {
    // simple local logout: remove token and reload
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      router.refresh();
    }
  };

  return (
    <header style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderBottom: "1px solid #eee" }}>
      <Link href="/" style={{ fontWeight: 700, fontSize: 18 }}>
        Moviehub
      </Link>

      <nav style={{ marginLeft: 12 }}>
        <Link href="/">Home</Link>
      </nav>

      <div style={{ marginLeft: "auto" }}>
        {auth.data ? (
          <>
            <span style={{ marginRight: 12 }}>{auth.data.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ marginRight: 8 }}>Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}