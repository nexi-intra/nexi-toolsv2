"use client";

import { useContext, useState } from "react";
import { MagicboxContext, ServiceCallLogEntry } from "../magicbox-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Service } from "nats";
import { useService } from "../useservice";
import { Button } from "@/components/ui/button";

function ShowLogEntryDetails(props: {
  entry: ServiceCallLogEntry;

  dialogChange: (open: boolean) => void;
  isOpen: boolean;
}) {
  const { entry, dialogChange, isOpen } = props;
  const [showResponse, setshowResponse] = useState(false);

  return (
    <Dialog onOpenChange={dialogChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry.servicename}</DialogTitle>
          <DialogDescription className="p-2 overflow-scroll">
            <div>Arguments</div>
            <div>{entry.request.args.join(",")}</div>

            <div>
              <Button
                onClick={() => {
                  setshowResponse(!showResponse);
                }}
                variant={"link"}
              >
                Show response
              </Button>
              <Button
                onClick={async () => {
                  navigator.clipboard
                    .writeText(
                      JSON.stringify(
                        entry.response.data ?? "No data - sorry",
                        null,
                        2
                      )
                    )
                    .then(() => {
                      console.log("copied");
                    })
                    .catch((error) => {
                      console.error("copy failed", error);
                    });
                }}
                variant={"link"}
              >
                Copy to clipboard
              </Button>
            </div>
            <div></div>
            <div></div>

            {showResponse && (
              <div className="max-h-96">
                <pre>{JSON.stringify(entry.response, null, 2)}</pre>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function ShowLogEntry(props: { entry: ServiceCallLogEntry }) {
  const { entry } = props;
  const [showdetails, setshowdetails] = useState(false);
  const time =
    entry.responedTimestamp.getTime() - entry.calledTimestamp.getTime();
  return (
    <div
      className="text-xs hover:text-blue-600 cursor-pointer "
      onClick={() => setshowdetails(true)}
    >
      <div className="whitespace-nowrap">
        {entry.transactionId}&nbsp;
        {entry.servicename}&nbsp;
        {entry.request.args.length > 0 && entry.request.args[0]}&nbsp;
        {time}ms&nbsp;
        {entry.response.hasError && <span className="text-red-500">error</span>}
        {setshowdetails &&
          ShowLogEntryDetails({
            entry,
            dialogChange: setshowdetails,
            isOpen: showdetails,
          })}
      </div>
    </div>
  );
}

export default function Tracer() {
  const magicbox = useContext(MagicboxContext);

  return (
    <div>
      {magicbox.servicecalllog.map((log, index) => (
        <div key={index}>
          <ShowLogEntry entry={log} />
        </div>
      ))}
    </div>
  );
}
