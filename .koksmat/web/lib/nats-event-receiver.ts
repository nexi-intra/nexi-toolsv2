import { nanoid } from "nanoid";
import {
  NatsConnection,
  connect,
  StringCodec,
  AckPolicy,
  millis,
  JetStreamManager,
  RetentionPolicy,
  StreamConfig,
  StorageType,
  DiscardPolicy,
  nanos,
} from "nats";
import { JsMsgImpl } from "nats/lib/jetstream/jsmsg";
import { kInfo, kVerbose } from "./koksmat-logger-client";

async function createStream(
  subject: string,
  stream_name: string,
  jsm: JetStreamManager
) {
  const config: StreamConfig = {
    name: stream_name,
    subjects: [subject + ".>"],
    retention: RetentionPolicy.Interest,
    storage: StorageType.Memory,
    max_consumers: 0,
    sealed: false,
    first_seq: 0,
    max_msgs_per_subject: 0,
    max_msgs: 0,
    max_age: nanos(1000 * 30), // 30 secs
    max_bytes: 0,
    max_msg_size: 0,
    discard: DiscardPolicy.Old,
    discard_new_per_subject: false,
    duplicate_window: 0,
    allow_rollup_hdrs: false,
    num_replicas: 0,
    deny_delete: false,
    deny_purge: false,
    allow_direct: false,
    mirror_direct: false,
  };
  await jsm.streams.add(config);
  return true;
}
async function ensureStream(
  subject: string,
  stream_name: string,
  jsm: JetStreamManager
) {
  return createStream(subject, stream_name, jsm);
  // try {
  //   const x = await jsm.streams.find(SUBJECT + ".1");
  //   return true;
  // } catch (error) {
  //   return createStream(stream_name, jsm);
  // }
}

export async function NatsEventReceiver(
  subject: string,
  durable_name: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let nc: NatsConnection | null = null;

    const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
    nc = await connect({
      servers: [connectionString],
    });
    try {
      const name = subject.replace(/\./g, "-");
      const js = nc.jetstream();
      const jsm = await js.jetstreamManager();
      //const durable_name = "NatsMessageReceiver";
      // Use a unique consumer name or ephemeral consumer

      const streamOk = await ensureStream(subject, name, jsm);
      kVerbose("library", "streamOk", streamOk);
      let c = await js.consumers.get(name, durable_name).catch((error) => {
        return null;
      });

      if (!c) {
        await jsm.consumers.add(name, {
          durable_name,
          ack_policy: AckPolicy.NotSet,
          filter_subject: name + ".>",
        });
        c = await js.consumers.get(name, durable_name);
        kVerbose("library", "consumer added", durable_name);
      }

      kVerbose("library", "waiting for message");
      let m = await c.next();
      if (m) {
        kInfo("library", "message received with subject", m.subject);
        const mi = m as JsMsgImpl;
        const subj = mi.msg.reply!;
        //nc.publish(subj, "+ACK");
        m.ack();
        await nc.flush();

        const sc = StringCodec();
        const message = sc.decode(m.data);

        resolve(message);
      } else {
        kVerbose("library", "no message");
        resolve("");
      }
      kVerbose("library", "deleting consumer", name);
      await jsm.consumers.delete(name, durable_name);
    } catch (error) {
      console.log("error", error);
      resolve("");
    } finally {
      if (nc) {
        kVerbose("library", "closing connection");
        //await nc.drain();
        await nc.close();
      }
    }
  });
}
