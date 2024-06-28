"use client"

import { useEffect, useState } from "react"
//import {Office} from "office-js"

export function OfficeX(props: {loaded:boolean}) {
  
 
  const [error, seterror] = useState("")
  
  useEffect(() => {
    if (!props.loaded) return 
    try {
      Office.onReady(callback=>{
        console.log("Office is ready")
        console.log(callback.host)
        console.log(callback.platform)
      })
    } catch (error: any) {
      seterror(error.message ?? "Unknown error loading Office integration")
    }
 
  }, [])
  if (!props.loaded) return null
  if (error) return <div className="text-red-500">{error}</div>
  return null
}