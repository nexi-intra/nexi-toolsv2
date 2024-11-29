import { run } from "@/app/koksmat0/magicservices";
import { tryCatch } from "@/app/officeaddin/actions/outlook-samples";
import { NatsRPC } from "@/lib/nats-rpc";
import { NatsConnection, connect, StringCodec } from "nats";

export async function GET(
  request: Request,
  { params }: { params: { sessionid: string } }
): Promise<Response> {
  const response = await NatsRPC(
    "/api/autopilot/ping/[sessionid]",
    "ping",
    "koksmat",
    ["context", "kitchenRoot"]
  );
  return new Response(response);
}
