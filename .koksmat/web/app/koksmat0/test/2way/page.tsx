"use client";
import Ping from "@/app/koksmat0/streams/ping";
import { StreamSpawnProcess } from "@/app/koksmat0/streams/spawn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function KillProcess() {
  const [pid, setpid] = useState<number>(0);
  const [execute, setexecute] = useState(false);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        console.log(event);
      }}
    >
      <div className="flex space-x-2 pr-10">
        <Input
          type="number"
          onChange={(e) => {
            setpid(parseInt(e.target.value));
            setexecute(false);
          }}
          value={pid}
        />

        <Button disabled={pid < 1} onClick={() => setexecute(true)}>
          Kill
        </Button>
        {execute && (
          <StreamSpawnProcess cmd="kill" args={[pid.toString()]} timeout={5} />
        )}
      </div>
    </form>
  );
}

export default function Page() {
  return (
    <div className="flex">
      <div>
        {" "}
        <StreamSpawnProcess
          cmd={"pwsh"}
          args={[
            "-Command",
            `

# $PSStyle.OutputRendering = [System.Management.Automation.OutputRendering]::PlainText

  function Generate-RandomDelay {
      $minDelay = 500
      $maxDelay = 2000
      $random = Get-Random -Minimum $minDelay -Maximum $maxDelay
      Start-Sleep -Milliseconds $random
  }
  $ProcessID = $PID
Write-Host "Current Process ID: $ProcessID"
  try {
      for ($i = 1; $i -le 50; $i++) {
          Write-Output "Output $i"
          Generate-RandomDelay
      }
      throw "An intentional error occurred."
  }
  catch {
      Write-Error $_.Exception.Message
  }
      
  `,
          ]}
          timeout={1000}
        />
      </div>
      <div className="grow"></div>
      <div>
        <KillProcess />
      </div>
      {/* <Ping domain="nexigroup.com" count={4} />
      <Ping domain="google.com" count={3} /> */}
    </div>
  );
}
