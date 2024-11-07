import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "pong",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
