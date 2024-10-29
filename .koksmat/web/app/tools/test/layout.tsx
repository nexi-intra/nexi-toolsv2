import { APPNAME } from "@/app/global"
import { SidebarLayoutServer } from "@/components/components-layout-sidebar-layout-server"


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    // <SidebarLayoutServer rootFolder={"/app/" + APPNAME + "/test"}>
    { children }
    // </SidebarLayoutServer>


  )
}