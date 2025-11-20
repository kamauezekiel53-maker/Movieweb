"use client";
import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const register = trpc.auth.register.useMutation();
  const router = useRouter();

  const doRegister = async () => {
    try {
      const res = await register.mutateAsync({ email, password, name });
      if (res?.token) {
        localStorage.setItem("token", res.token);
        router.refresh();
      }
    } catch (err: any) {
      alert(String(err?.message ?? "Registration failed"));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>
      <div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name (optional)" />
      </div>
      <div style={{ marginTop: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      </div>
      <div style={{ marginTop: 8 }}>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={doRegister}>Register</button>
      </div>
    </div>
  );
}