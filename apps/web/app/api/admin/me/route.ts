import { NextResponse } from "next/server";

export async function GET() {
  const API_ORIGIN =
    process.env.API_ORIGIN ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";
  const res = await fetch(`${API_ORIGIN}/auth/me`, {
    // forward cookies from the browser to API automatically is not possible here,
    // so this endpoint is best used from the CLIENT with `credentials: 'include'`
    // For server-side protection, we’ll fetch the API directly from the layout using absolute API and `cookies()` header in a next step if needed.
    cache: "no-store",
    credentials: "include" as any,
  });
  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
