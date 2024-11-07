import { databaseHandler, version } from "@/app/koksmat";
import { databases } from "@/app/tools/api/database";

export const regionTable = () => {
  return new databaseHandler.DatabaseHandler(
    databases.tools.table.region.schema,
    {
      send: () => {
        return Promise.resolve("ok");
      },
    },
    () => "" // Replace this with your own token provider
  );
};

function t() {
  regionTable().create({
    name: "test",
    tenant: "",
    searchindex: "",
  });
}
