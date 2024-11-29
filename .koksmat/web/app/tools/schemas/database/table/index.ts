// This file is auto-generated. Do not edit manually.

import { z } from "zod";
import * as accesspoint from "./accesspoint";
export type Accesspoint = z.infer<typeof accesspoint.schema>;
import * as auditlog from "./auditlog";
export type Auditlog = z.infer<typeof auditlog.schema>;
import * as category from "./category";
export type Category = z.infer<typeof category.schema>;
import * as country from "./country";
export type Country = z.infer<typeof country.schema>;
import * as event from "./event";
export type Event = z.infer<typeof event.schema>;
import * as language from "./language";
export type Language = z.infer<typeof language.schema>;
import * as purpose from "./purpose";
export type Purpose = z.infer<typeof purpose.schema>;
import * as region from "./region";
export type Region = z.infer<typeof region.schema>;
import * as tool from "./tool";
export type Tool = z.infer<typeof tool.schema>;
import * as toolgroup from "./toolgroup";
export type Toolgroup = z.infer<typeof toolgroup.schema>;
import * as userprofile from "./userprofile";
export type UserProfile = z.infer<typeof userprofile.schema>;
import * as usergroup from "./usergroup";
export type Usergroup = z.infer<typeof usergroup.schema>;
import * as userrole from "./userrole";
import { kInfo } from "@/lib/koksmat-logger-client";
import { version } from "@/app/koksmat";
export type Userrole = z.infer<typeof userrole.schema>;
export const table = {
  accesspoint,
  auditlog,
  category,
  country,
  event,
  language,
  purpose,
  region,
  tool,
  toolgroup,
  userprofile,
  usergroup,
  userrole,
};

// Usage example:
// import { schemas, CountryPatch } from './tools';
// const accessPointDeleteSchema = schemas.accesspointDelete;
// const countryPatchData: CountryPatch = { /* ... */ };
