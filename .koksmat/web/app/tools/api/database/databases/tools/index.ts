// This file is auto-generated. Do not edit manually.

import { z } from "zod";
import * as accesspoint from "./schemas/accesspoint";
export type Accesspoint = z.infer<typeof accesspoint.schema>;
import * as auditlog from "./schemas/auditlog";
export type Auditlog = z.infer<typeof auditlog.schema>;
import * as category from "./schemas/category";
export type Category = z.infer<typeof category.schema>;
import * as country from "./schemas/country";
export type Country = z.infer<typeof country.schema>;
import * as event from "./schemas/event";
export type Event = z.infer<typeof event.schema>;
import * as language from "./schemas/language";
export type Language = z.infer<typeof language.schema>;
import * as purpose from "./schemas/purpose";
export type Purpose = z.infer<typeof purpose.schema>;
import * as region from "./schemas/region";
export type Region = z.infer<typeof region.schema>;
import * as tool from "./schemas/tool";
export type Tool = z.infer<typeof tool.schema>;
import * as toolgroup from "./schemas/toolgroup";
export type Toolgroup = z.infer<typeof toolgroup.schema>;
import * as user from "./schemas/user";
export type User = z.infer<typeof user.schema>;
import * as usergroup from "./schemas/usergroup";
export type Usergroup = z.infer<typeof usergroup.schema>;
import * as userrole from "./schemas/userrole";
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
  user,
  usergroup,
  userrole,
};

// Usage example:
// import { schemas, CountryPatch } from './tools';
// const accessPointDeleteSchema = schemas.accesspointDelete;
// const countryPatchData: CountryPatch = { /* ... */ };
