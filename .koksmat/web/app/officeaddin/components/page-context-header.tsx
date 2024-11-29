"use client"

import { useContext } from "react"
import Link from "next/link"



//import { openVScode } from "@/app/koksmat0/vscode/server"

export function PageContextHeader(props: { title: string, description?: string }) {
  return null
  /*
  const { title,description } = props
  const { tenant, site, kitchen, station, options, domain, currentstation } =
    useContext(KoksmatContext)
  return (
    <div>
      <div className="m-3 ml-0 rounded-xl  text-slate-800">
        <div className="ml-3 p-4 text-3xl">{title} </div>
{description && <div className="ml-3 p-4 text-sm">{description} </div>}
      </div>
      {options.showContext && false && (
        <div>
          <div className="ml-2 mr-6  mt-[-10px] flex space-x-2  text-xs">
            <div className="flex">
              <div className="text-slate-600">tenant:</div>
              <Link href="/koksmat">{tenant}</Link>
            </div>
            {site && (
              <div className="flex">
                <div>site:</div>{" "}
                <Link href={`/koksmat/tenants/${tenant}/site`}>{site}</Link>{" "}
              </div>
            )}
            {site && (
              <div className="flex">
                <div>kitchen:</div>{" "}
                <Link href={`/koksmat/tenants/${tenant}/site/${site}/kitchen`}>
                  {kitchen ? kitchen : "<select>"}
                </Link>{" "}
              </div>
            )}
            {kitchen && (
              <div className="flex">
                <div>station:</div>{" "}
                <Link
                  href={`/koksmat/tenants/${tenant}/site/${site}/kitchen/${station}`}
                >
                  {station ? station : "<select>"}
                </Link>{" "}
              </div>
            )}

            <div className="flex">
              <div>azure:</div>{" "}
              <Link href={`/koksmat/azure`}>
                {domain ? domain : "<select>"}
              </Link>{" "}
            </div>
            <div className="grow "/>
            <div className=" cursor-pointer" onClick={()=>{
              if (!currentstation?.cwd) return
              openVScode(currentstation?.cwd)
            }}> {currentstation?.cwd}</div>
          </div>
        </div>
      )}
      {options.showEcho && (
        <div>
          <SocketLogger channelname="echo" />
        </div>
      )}
    </div>
  )
  */
}
