import { run } from "@/app/koksmat0/magicservices";
import { th } from "date-fns/locale";
import { jwtDecode } from "jwt-decode";
export async function getUPNfromToken(token: string) {
  const jwt: any = jwtDecode(token!);
  // debugger;
  return jwt.upn; // "niels.johansen@nexigroup.com";
}
export async function getWorkspaces(upn: string) {
  const result = await run<any>(
    "magic-mix.app",
    [
      "query",
      "mix",
      `
    select name,key,id from workspace
where created_by = '${upn}'
    `,
    ],
    "",
    600,
    "x"
  );
  if (result.hasError) {
    console.log("Error in getWorkspaces: " + result.errorMessage);
    return [];
  } else {
    return result.data.Result.map((x: any) => {
      return x.key;
    });
  }
}
async function query(sql: string) {
  return run("magic-mix.app", ["query", "mix", sql], "", 600, "x");
}
export async function execute(
  token: string,
  database: string,
  process: string,
  body: string
) {
  return run(
    "magic-mix.app",
    ["execute", database, process, token, body],
    "",
    600,
    "x"
  );
}
export async function getUserFromUPN(upn: string) {
  return query(`
  
    select * from public.user where name='${upn}'
  
  `);
}

export async function ensureUser(
  token: string
): Promise<{ errorMessage: string; id: string }> {
  const upn = await getUPNfromToken(token);
  const result = await getUserFromUPN(upn);
  if (result.hasError) {
    return { errorMessage: result.errorMessage ?? "Unknown error", id: "" };
  }
  if (!result.data) {
    const createResult = run(
      "magic-mix.app",
      [
        "execute",
        "mix",
        "create_user",
        JSON.stringify({
          name: upn,
          description: "",
          body: {},
          tenant: "",
          searchindex: "name:" + upn,
        }),
      ],
      "",
      600,
      "x"
    );
  }
  return { errorMessage: "", id: JSON.stringify(result.data) };
}
