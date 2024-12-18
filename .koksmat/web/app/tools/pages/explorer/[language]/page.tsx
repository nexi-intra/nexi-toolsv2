"use client";

import { useLanguage, SupportedLanguage } from "@/components/language-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { APPNAME } from "@/app/global";


export default function LanguageSelectorPage(props: { params: { language: SupportedLanguage } }) {

  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    setLanguage(props.params.language);

    router.push("/" + APPNAME + "/tools/explorer");
  }, [props.params.language]);

  return (
    <div className="h-full w-full">

    </div>
  );
}
