/**
 ---
  koksmat: true
 ---

 This is the client side component for the Koksmat system. It listens for messages from the server side component and sends messages to the server side component.
 */
"use client";
import React, { use, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function KoksmatClient() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const eventHandler = (event: any) => {
      if (event.data.koksmat) {
        console.log("Client", "Recieved message", event.data.message);
        if (event.data.message.type === "navigate") {
          router.push(event.data.message.url);
        }
      }
    };

    window.addEventListener("message", eventHandler);

    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, []);

  const sendMessage = (message: any) => {
    let currentWindow: Window | null = window;

    while (currentWindow.parent && currentWindow !== currentWindow.parent) {
      console.log("Client", "Sending message", message);
      currentWindow.parent.postMessage(
        {
          koksmat: true,
          message,
        },
        "*"
      );
      currentWindow = currentWindow.parent;
    }
  };

  const sendPathname = () => {
    sendMessage({ type: "pathname", pathname });
  };

  useEffect(() => {
    sendPathname();
  }, [pathname]);

  return null;
}
