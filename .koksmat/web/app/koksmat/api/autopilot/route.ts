import { run } from "@/app/koksmat0/magicservices";
import { NatsConnection, connect, StringCodec } from "nats";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  let nc: NatsConnection | null = null;
  try {
    const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
    nc = await connect({
      servers: [connectionString],
    });
    await nc.publish(body.reply_to, StringCodec().encode(JSON.stringify(body)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    if (nc) {
      nc.close();
    }
  }
}
