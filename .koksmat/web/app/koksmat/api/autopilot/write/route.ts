import { NatsWrite } from "@/lib/nats-write";

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  const result = await NatsWrite("auto", [JSON.stringify(body)]);

  return new Response(result);
}
