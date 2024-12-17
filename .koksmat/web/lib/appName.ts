import { APPDISPLAYNAME, APPNAME } from "@/app/global";
import { BRANCH } from "@/branch";

export function appName() {
  const branch = BRANCH;
  if (branch === "master" || branch === "main") {
    return APPDISPLAYNAME;
  } else {
    return APPDISPLAYNAME + " (" + branch.toUpperCase() + " VERSION)";
  }
}

export function appShortName() {
  const branch = BRANCH;
  if (branch === "master" || branch === "main") {
    return APPNAME.toLowerCase();
  } else {
    return APPNAME.toLowerCase() + "_" + branch.toLowerCase();
  }
}
