import { KoksmatProvider } from "@/components/koksmat-provider"
import { ContextProvider } from "./contextprovider"
import { APPNAME } from "../global"




export default function JourneyLayoutRoot(props: {
    children: React.ReactNode
}) {


    return (
        // <TopNav rootPath="/officeaddin/" />
        <KoksmatProvider >
            <ContextProvider rootPath={""} isLocalEnv={false}>
                <div>
                    {props.children}
                </div>
            </ContextProvider>
        </KoksmatProvider>

    )
}