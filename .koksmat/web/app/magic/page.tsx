"use client";
import { MSALTest } from "@/app/koksmat0/msal/test";

export default function Home() {
  return (
    <div className="p-10">
      <div className="flex bg-slate-300 h-5/6">
        <div></div>
        <div className="grow"></div>
        <div className="w-screen md:container h-screen">
          <h1 className="text-xl font-semibold">Playground</h1>
        </div>
        <div className="grow"></div>
        <div></div>
      </div>
    </div>
  );
}
