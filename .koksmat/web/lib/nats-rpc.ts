import { run } from "@/app/koksmat0/magicservices";
import { tryCatch } from "@/app/officeaddin/actions/outlook-samples";
import { nanoid } from "nanoid";
import { NatsConnection, connect, StringCodec } from "nats";

export async function NatsRPC(
  sessionid: string,
  action: string,
  command: string,
  args: string[],
  cwd?: string,
  options?: { onStart?: (echoSubject: string) => void }
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let nc: NatsConnection | null = null;
    const id = nanoid();
    try {
      const reply_to = "autopilot.response." + id;
      const echo = "autopilot.response." + id + ".echo";
      if (options?.onStart) {
        options.onStart(echo);
      }
      const request = {
        session_id: sessionid,
        action: "execute-nostream",
        command,
        reply_to,
        args,
        cwd,
      };
      if (!command) {
        resolve(JSON.stringify({ errormessage: "no command" }));
        return;
      }
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
