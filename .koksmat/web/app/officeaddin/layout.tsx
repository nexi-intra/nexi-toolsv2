import { APPNAME } from "../global";
import { ContextProvider } from "./contextprovider";
import { KoksmatProvider } from "@/app/koksmat0/contextprovider";

export default function JourneyLayoutRoot(props: {
  children: React.ReactNode;
}) {
  return (
    // <TopNav rootPath="/officeaddin/" />
    <KoksmatProvider app={APPNAME}>
      <ContextProvider rootPath={""} isLocalEnv={false}>
        <div>{props.children}</div>
      </ContextProvider>
    </KoksmatProvider>
  );
}
