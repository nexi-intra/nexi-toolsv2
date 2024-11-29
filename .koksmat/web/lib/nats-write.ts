import { run } from "@/app/koksmat0/magicservices";
import { tryCatch } from "@/app/officeaddin/actions/outlook-samples";
import { nanoid } from "nanoid";
import { NatsConnection, connect, StringCodec } from "nats";

export async function NatsWrite(
  sessionid: string,
  args: string[]
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let nc: NatsConnection | null = null;
    try {
      const reply_to = "autopilot.response." + nanoid();
      const request = {
        session_id: sessionid,
        action: "write",
        command: "",
        reply_to,
        args,
      };
      const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
      nc = await connect({
        servers: [connectionString],
      });
      let waiting = true;
      let loopcounter = 0;
      try {
        const sub = nc.subscribe(reply_to, {
          callback: (err, msg) => {
            const sc = StringCodec();
            if (err) {
              console.log("subscription error", err.message);
              return;
            }
            const requestBody = sc.decode(msg.data);
            console.log("request", requestBody);

            resolve(requestBody);
            waiting = false;
            sub.unsubscribe();
          },
        });
        nc.publish(
          "autopilot.request." + sessionid,
          StringCodec().encode(JSON.stringify(request))
        );
        while (waiting) {
          loopcounter++;

          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (loopcounter > 5) {
            waiting = false;
            sub.unsubscribe();
            const errorResponse = JSON.stringify({ errormessage: "timeout" });
            resolve(errorResponse);
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
