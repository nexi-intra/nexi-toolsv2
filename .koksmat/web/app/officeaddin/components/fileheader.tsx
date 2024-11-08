"use client";

import { useEffect, useState } from "react";

import { useProcess } from "@/app/koksmat0/useprocess";

interface FileHeader {
  title: string;
  description: string;
  environment: string[];
  connections: string[];
  parameters: {
    mandatory: boolean;
    name: string;
    type: string;
    help: string;
  }[];
}

export default function FileHeader(props: {
  workspace: string;
  station: string;
  file: string;
}) {
  const { workspace, station, file } = props;
  const [fileheader, setfileheader] = useState<FileHeader>();
  const [hasMetadata, sethasMetadata] = useState(false);
  const { isLoading, error, data } = useProcess(
    "koksmat",
    [
      "kitchen",
      "script",
      "meta",
      decodeURIComponent(file),
      "--kitchen",
      decodeURIComponent(workspace),
      "--station",
      decodeURIComponent(station),
    ],
    20,
    "echo11"
  );

  useEffect(() => {
    if (!data) return;

    const kitchen: FileHeader = JSON.parse(data);
    setfileheader(kitchen);

    sethasMetadata(
      kitchen.connections?.length > 0 ||
      kitchen.parameters?.length > 0 ||
      kitchen.environment?.length > 0
    );
  }, [data]);

  return (
    <div>
      {error && <pre className="text-red-700">{error}</pre>}

      <div>
        <div className="text-3xl ">{fileheader?.title}</div>
        <div className="mt-3">{fileheader?.description}</div>

        {hasMetadata && (
          <div
            className={
              false ? "mt-5 w-full space-x-2 rounded-2xl bg-slate-300 p-4 " : ""
            }
          >
            {fileheader && fileheader.parameters.length > 0 && (
              <div>
                {fileheader && fileheader.parameters.length > 0 && (
                  <div className="text-xl ">Parameters </div>
                )}
                <table>
                  <tr>
                    <td className="px-2">Name</td>
                    <td className="px-2">Type</td>
                    <td className="px-2">Mandatory</td>
                    <td className="px-2">Help</td>
                  </tr>
                  {fileheader?.parameters.map((e, k) => {
                    return (
                      <tr key={k}>
                        <td className="px-2 font-semibold">{e.name}</td>
                        <td className="px-2 font-semibold">
                          {e.type ? e.type : "string"}
                        </td>
                        <td className="px-2 font-semibold">
                          {" "}
                          {e.mandatory ? "Mandatory" : ""}
                        </td>
                        <td className="px-2 font-semibold"> {e.help}</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            )}

            <div className="mt-4 text-xl ">Connections</div>
            <div className="flex space-x-2">
              {fileheader?.connections?.map((e, k) => {
                return (
                  <div key={k} className="items-center p-4">
                    <img
                      title={e}
                      className="h-12 w-12"
                      src={`/365admin/connection/${e}.png`}
                      alt="Icon"
                    />
                  </div>
                );
              })}
            </div>

            {fileheader && fileheader.environment?.length > 0 && (
              <div className="my-4 text-xl ">Environment variables</div>
            )}
            <div className="flex space-x-2">
              {fileheader?.environment?.map((e, k) => {
                return (
                  <div className="bg-slate-500 p-2 text-white" key={k}>
                    {e}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* <SocketLogger channelname={"echo11"} /> */}
    </div>
  );
}
