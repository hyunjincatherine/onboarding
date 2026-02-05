import { NextResponse } from "next/server";

let STORE: Record<string, any> = {};

export async function GET() {
  return NextResponse.json(Object.values(STORE));
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, name, email, checked } = body;

  STORE[userId] = { userId, name, email, checked, updatedAt: new Date().toISOString() };
  return NextResponse.json({ ok: true });
}
