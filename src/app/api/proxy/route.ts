import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("url");
  if (!target) return new NextResponse("Missing url", { status: 400 });

  if (!/^https?:\/\//.test(target)) return new NextResponse("Invalid url", { status: 400 });

  // whitelist enforcement
  const whitelistRaw = process.env.PROXY_WHITELIST || "";
  const whitelist = whitelistRaw.split(",").map((s) => s.trim()).filter(Boolean);
  try {
    const u = new URL(target);
    if (whitelist.length > 0 && !whitelist.includes(u.hostname)) {
      return new NextResponse("Host not allowed", { status: 403 });
    }
  } catch (e) {
    return new NextResponse("Invalid target url", { status: 400 });
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        "user-agent": req.headers.get("user-agent") ?? "moviehub-proxy",
        accept: req.headers.get("accept") ?? "*/*",
      },
    });

    const headers = new Headers(upstream.headers);
    headers.set("x-proxied-by", "moviehub");
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err: any) {
    return new NextResponse(String(err?.message ?? "fetch error"), { status: 500 });
  }
}