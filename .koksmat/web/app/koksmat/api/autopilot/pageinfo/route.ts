import { findPageFileForUrl } from "@/lib/findPage";
import path from "path";

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body.url);
  const pageInfo = findPageFileForUrl(body.url, path.resolve("app"));
  return Response.json(pageInfo);
  //return new Response(pageInfo);
}
