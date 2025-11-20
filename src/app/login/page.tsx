"use client";
import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.auth.login.useMutation();
  const router = useRouter();

  const doLogin = async () => {
    try {
      const res = await login.mutateAsync({ email, password });
      if (res?.token) {
        localStorage.setItem("token", res.token);
        // reload to update authenticated queries
        router.refresh();
      }
    } catch (err: any) {
      alert(String(err?.message ?? "Login failed"));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      </div>
      <div style={{ marginTop: 8 }}>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={doLogin}>Login</button>
      </div>
    </div>
  );
}