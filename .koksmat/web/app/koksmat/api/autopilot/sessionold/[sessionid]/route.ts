import { run } from "@/app/koksmat0/magicservices";
import { tryCatch } from "@/app/officeaddin/actions/outlook-samples";
import { NatsConnection, connect, StringCodec } from "nats";

export async function GET(
  request: Request,
  { params }: { params: { sessionid: string } }
): Promise<Response> {
  return new Promise(async (resolve, reject) => {
    const { sessionid } = params;
    let nc: NatsConnection | null = null;
    try {
      const result = {
        session_id: sessionid,
        command: "COMMAND_A",
      };
      const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
      nc = await connect({
        servers: [connectionString],
      });
      const js = nc.jetstream();

      let waiting = true;
      let loopcounter = 0;
      try {
        const sub = nc.subscribe("autopilot.request." + sessionid, {
          callback: (err, msg) => {
            const sc = StringCodec();
            if (err) {
              console.log("subscription error", err.message);
              return;
            }
            const requestBody = sc.decode(msg.data);
            console.log("request", requestBody);

            resolve(new Response(requestBody));
            waiting = false;
            sub.unsubscribe();
          },
        });
        while (waiting) {
          loopcounter++;

          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (loopcounter > 30) {
            waiting = false;
            sub.unsubscribe();
            const errorResponse = JSON.stringify({ errormessage: "timeout" });
            resolve(new Response(errorResponse));
          }
        }
      } catch (error) {
      } finally {
        if (nc) {
          nc.close();
        }
      }
    } catch (error) {
      return Response.error();
    }
  });
}

/**
 * 
 * 
  const { packageid } = req.query;

 
  res.status(200).json(result);
 */
