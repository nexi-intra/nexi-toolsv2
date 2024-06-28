"use client";

import { useRouter } from "next/navigation";
import { APPNAME } from "../global";

export default function Page() {
  const router = useRouter();
  return (
    <div className="space-x-2 h-[90vh] place-content-center ">
      <div className="text-4xl">Welcome to {APPNAME}</div>
    </div>
  );
}
