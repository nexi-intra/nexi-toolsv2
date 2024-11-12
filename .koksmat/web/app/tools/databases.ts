export const todelete = 1;
// import { databaseHandler, version } from "@/app/koksmat";
// import { databases } from "@/app/tools/api/database";
// import { kWarn } from "@/lib/koksmat-logger-client";
// import { DatabaseMessageType } from "../koksmat/src/v.next/lib/database-handler";

// function send(): (message: DatabaseMessageType) => Promise<any> {
//   return () => {
//     kWarn("applogic", "send not implemented", __dirname, __filename);
//     return Promise.resolve("dummy");
//   };
// }
// function token() {
//   return "";
// }

// function factory(schema: any) {
//   return new databaseHandler.DatabaseHandler(
//     schema,
//     {
//       send: send(),
//     },
//     () => token()
//   );
// }

// export const regionTable = () => factory(databases.tools.table.region.schema);
// export const userTable = () => factory(databases.tools.table.user.schema);
// export const userRoleTable = () =>
//   factory(databases.tools.table.userrole.schema);
// export const userGroupTable = () =>
//   factory(databases.tools.table.usergroup.schema);
// export const toolTable = () => factory(databases.tools.table.tool.schema);
// export const toolGroupTable = () =>
//   factory(databases.tools.table.toolgroup.schema);
// export const purposeTable = () => factory(databases.tools.table.purpose.schema);
// export const languageTable = () =>
//   factory(databases.tools.table.language.schema);
// export const eventTable = () => factory(databases.tools.table.event.schema);
// export const countryTable = () => factory(databases.tools.table.country.schema);
// export const categoryTable = () =>
//   factory(databases.tools.table.category.schema);
// export const auditLogTable = () =>
//   factory(databases.tools.table.auditlog.schema);
// export const accessPointTable = () =>
//   factory(databases.tools.table.accesspoint.schema);
