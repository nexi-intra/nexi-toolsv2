"use client";

import { useContext, useEffect, useState } from "react";
import { Context } from "./context";
import { Button } from "@/components/ui/button";
import {
  insertHeader,
  addContentControls,
  addFooter,
  addParagraphs,
  changeCustomer,
} from "./actions/word-samples";
import { set } from "date-fns";
import CavaPanel from "./components/outlook-cava";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const OfficeContext = () => {
  const context: Office.Context = Office.context;
  const [info, setinfo] = useState<any>();
  useEffect(() => {
    setinfo({
      displayLanguage: context.displayLanguage,
      contentLanguage: context.contentLanguage,
      diagnostics: context.diagnostics,
      host: context.host,
      documentUrl: context?.document?.url,
      documentMode: context?.document?.mode,
      platform: context.platform,
    });
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
};

const MagicAppPhase1 = () => {
  const [params, setparams] = useState("");
  useEffect(() => {
    if (!Office.context) return;

    let url: string | undefined = Office.context?.document?.url;
    if (!url && Office.context?.mailbox) {
      url = Office.context.mailbox.item?.itemType.toString();
    }

    const host = Office.context.host;
    const platform = Office.context.platform;
    setparams(`url=${url}&host=${host}&platform=${platform}`);
  }, [Office.context]);
  if (!params) return <div>Loading ...</div>;
  return (
    <div>
      <iframe
        style={{ width: "100%", height: "100vh", border: "none" }}
        src={
          "https://apps.powerapps.com/play/e/default-79dc228f-c8f2-4016-8bf0-b990b6c72e98/a/fed04ba5-18b3-43c1-9069-a1af90ceeae1?tenantId=79dc228f-c8f2-4016-8bf0-b990b6c72e98&hint=db950e92-f6d3-44da-9f6e-c29d8b6101b0&sourcetime=1708519962117&" +
          params
        }
      ></iframe>
    </div>
  );
};
type ActionType = {
  name: string;

  method: () => void;
  component?: React.ReactNode;
};

const showPowerApp: ActionType = {
  name: "Show PowerApp",
  method: async () => {},
  component: <MagicAppPhase1 />,
};
//  //+ Office.context?.document?.url + "&platform="+Office.context.platform + "&host="+Office.context.host
const wordActions: ActionType[] = [
  {
    name: "Insert Header",
    method: async () => {
      await insertHeader();
    },
  },
  {
    name: "Insert 2 Header",
    method: async () => {
      await insertHeader();
    },
  },
  {
    name: "Add Paragraphs",
    method: async () => {
      await addParagraphs();
    },
  },
  {
    name: "Add Content Controls",
    method: async () => {
      await addContentControls();
    },
  },

  {
    name: "Change Customer",
    method: async () => {
      await changeCustomer();
    },
  },
  {
    name: "Add Footer",
    method: async () => {
      await addFooter();
    },
  },
  {
    name: "Office Context",
    method: async () => {},
    component: <OfficeContext />,
  },
  {
    name: "Debugger",
    method: async () => {
      debugger;
      const x = {
        displayLanguage: Office.context.displayLanguage,
      };
    },
  },
  showPowerApp,
];

const outlookActions: ActionType[] = [
  {
    name: "Meeting",
    method: async () => {},
    component: <CavaPanel title="Cava" isOfficeInitialized={true} />,
  },
  {
    name: "Debugger",
    method: async () => {
      debugger;
      const x = {
        displayLanguage: Office.context.displayLanguage,
      };
    },
  },
  {
    name: "Office Context",
    method: async () => {},
    component: <OfficeContext />,
  },
  {
    name: "Show Dialogue",
    method: async () => {
      Office.context.ui.displayDialogAsync(
        "https://localhost:1234",
        { height: 30, width: 20 },
        (result) => {
          console.log(result);
        }
      );
    },
  },
  showPowerApp,
];
const powerpointActions: ActionType[] = [
  {
    name: "Insert Slide",
    method: async () => {},
  },
  {
    name: "Insert Image",
    method: async () => {},
  },
  {
    name: "Insert Product Details",
    method: async () => {},
  },
  {
    name: "Office Context",
    method: async () => {},
    component: <OfficeContext />,
  },
  {
    name: "Debugger",
    method: async () => {
      debugger;
      const x = {
        displayLanguage: Office.context.displayLanguage,
      };
    },
  },
  showPowerApp,
];
const excelActions: ActionType[] = [
  {
    name: "Insert Table",
    method: async () => {},
  },
  {
    name: "Insert Chart",
    method: async () => {},
  },
  {
    name: "Insert Formula",
    method: async () => {},
  },
  {
    name: "Office Context",
    method: async () => {},
    component: <OfficeContext />,
  },
  {
    name: "Debugger",
    method: async () => {
      debugger;
      const x = {
        displayLanguage: Office.context.displayLanguage,
      };
    },
  },
  showPowerApp,
];
export default function Index() {
  const context = useContext(Context);
  const [hosttypename, sethosttypename] = useState("");
  const [platformtypename, setplatformtypename] = useState("");
  const [actions, setactions] = useState<ActionType[]>([]);
  const [panel, setpanel] = useState<React.ReactNode>(null);
  const { hosttype, platformtype } = context;

  const [open, setopen] = useState(true);

  useEffect(() => {
    if (!context.isloaded) return;
    switch (hosttype) {
      case Office.HostType.Word:
        setactions(wordActions);
        sethosttypename("Word");
        break;
      case Office.HostType.Excel:
        setactions(excelActions);
        sethosttypename("Excel");
        break;
      case Office.HostType.PowerPoint:
        setactions(powerpointActions);
        sethosttypename("PowerPoint");
        break;
      case Office.HostType.Outlook:
        setactions(outlookActions);
        sethosttypename("Outlook");
        // setpanel(<CavaPanel title="Cava" isOfficeInitialized={true} />)
        break;
      case Office.HostType.OneNote:
        setactions([]);
        sethosttypename("OneNote");
        break;
      case Office.HostType.Project:
        setactions([]);
        sethosttypename("Project");
        break;
      case Office.HostType.Access:
        setactions([]);
        sethosttypename("Access");
        break;

      default:
        sethosttypename("");
        setactions([]);
        break;
    }
  }, [hosttype]);

  if (!context.isloaded) return <div>Loading ...</div>;
  return (
    <div>
      <Sheet open={open} onOpenChange={setopen}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Actions</SheetTitle>
            <SheetDescription>
              {hosttypename} - {platformtypename}
              {actions.map((action, index) => {
                return (
                  <div key={index} className="p-3">
                    <Button
                      onClick={() => {
                        if (action.component) {
                          setpanel(action.component);
                          setopen(false);
                        } else {
                          setpanel(null);
                          action.method();
                          setopen(false);
                        }
                      }}
                    >
                      {action.name}
                    </Button>
                  </div>
                );
              })}
            </SheetDescription>
            <SheetContent></SheetContent>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <div>{panel}</div>
    </div>
  );
}
