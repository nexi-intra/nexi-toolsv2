import Ping from "@/app/koksmat0/streams/ping";
import { StreamSpawnProcess } from "@/app/koksmat0/streams/spawn";

export default function Page() {
  return (
    <div className="flex">
      <Ping domain="nexigroup.com" count={4} />
      <Ping domain="google.com" count={3} />
      <StreamSpawnProcess cmd={"ping"} args={["google.com"]} timeout={10} />
    </div>
  );
}
