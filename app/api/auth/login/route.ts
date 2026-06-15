import { NextRequest, NextResponse } from "next/server";

const EMAIL = "bia@bia-ai.com";
const PASSWORD = "Bi@2026";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as {
    email: string;
    password: string;
  };

  if (email !== EMAIL || password !== PASSWORD) {
    return NextResponse.json(
      { error: "E-mail ou senha inválidos" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("bia-auth", "1", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}
