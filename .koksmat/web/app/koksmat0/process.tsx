"use client";
import { https } from "@/app/koksmat0/httphelper";
import { MagicboxContext } from "@/app/koksmat0/magicbox-context";
import { run } from "@/app/koksmat0/magicservices";

import { useMsal, useAccount } from "@azure/msal-react";
import { useContext, useEffect, useState } from "react";
interface CaseProps {
  scopes: string[];
  title: string;
  testurl: string;
  token?: string;
}
const UserProfileAPI: CaseProps = {
  scopes: ["User.Read"],
  title: "Read user profile",
  testurl: "https://graph.microsoft.com/v1.0/me",
};

export interface ProcessProps {
  servicename: string;
  processname: string;
  payload: any;
  onError?: (error: any) => void;
  onSuccess?: (response: any) => void;
}
export default function Process(props: ProcessProps) {
  const { servicename, processname, payload, onError, onSuccess } = props;
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [latestResponse, setlatestResponse] = useState<any>();
  const [token, settoken] = useState("");
  const [latestError, setlatestError] = useState<any>();

  const magicbox = useContext(MagicboxContext);
  const aquireToken = async (thisCase: CaseProps) => {
    setlatestError(undefined);
    setlatestResponse(undefined);
    if (account && thisCase) {
      try {
        const response = await instance.acquireTokenSilent({
          scopes: thisCase?.scopes ?? [],
          account: account,
        });
        thisCase.token = response.accessToken;
        magicbox.setAuthToken(response.accessToken, "MSAL");
        settoken(response.accessToken);
        const getResponse = await https(
          response.accessToken,
          "GET",
          thisCase.testurl
        );
        setlatestResponse(getResponse);
      } catch (error) {
        try {
          const response = await instance.acquireTokenPopup({
            scopes: thisCase?.scopes ?? [],
            account: account,
          });
          thisCase.token = response.accessToken;
          settoken(response.accessToken);
          magicbox.setAuthToken(response.accessToken, "MSAL");

          const getResponse = await https(
            response.accessToken,
            "GET",
            thisCase.testurl
          );
          setlatestResponse(getResponse);
        } catch (error) {
          setlatestError(error);
        }
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      if (magicbox.authtoken) {
        settoken(magicbox.authtoken);
        return;
      }
      await aquireToken(UserProfileAPI);
    };
    load();
  }, []);
  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const calledTimestamp = new Date();
      const args = ["process", processname, token, JSON.stringify(payload)];
      const result = await run(servicename, args, "", 600, "x");
      magicbox.logServiceCall({
        calledTimestamp,
        responedTimestamp: new Date(),
        request: {
          args: ["process", processname, JSON.stringify(payload)],
          body: "",
          channel: servicename,
          timeout: 600,
        },
        servicename,
        response: result,
        transactionId: "x",
      });

      if (result.hasError) {
        onError?.(result.errorMessage ?? "unknown error");
      } else {
        onSuccess?.(result.data);
      }
    };
    load();
  }, [token]);
  return <div></div>;
}
