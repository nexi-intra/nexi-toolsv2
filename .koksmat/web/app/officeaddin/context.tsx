"use client"
import { createContext } from "react";
import { IView } from "./components/viewcards";




export type Options = {
  showContext?: boolean
  showToolbar?: boolean
  showNavigation?: boolean
  showFooter?: boolean
  showMenu?: boolean
  showSidebar?: boolean
  showHeader?: boolean
  showEcho?: boolean
  showDebug?: boolean
}

export type ContextProps = {

  isloaded: boolean,
  options:Options,
  rootPath:string,
  workspaces: IView[]
  hosttype: Office.HostType|undefined
  platformtype: Office.PlatformType |undefined

  setOptions:(options:Options)=>void
  
}
export const Context = createContext<ContextProps>({
  isloaded: false,
  options: {
    showContext: false
  },
  setOptions: function (options: Options): void {
    throw new Error("Function not implemented.");
  },
  rootPath: "",
  workspaces: [],
  hosttype: undefined,
  platformtype: undefined
})
