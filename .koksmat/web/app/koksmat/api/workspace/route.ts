import { nanoid } from "nanoid";
import { ensureUser, execute, getUserFromUPN, getWorkspaces } from ".";
import { jwtDecode } from "jwt-decode";
import { NextResponse, NextRequest } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token" },
        { status: 500 }
      );
    }
    const jwt: any = jwtDecode(token!);

    const upn = jwt.upn;
    const workspaces = await getWorkspaces(upn);

    return NextResponse.json(workspaces);

    // return NextResponse.json(
    //   { success: false, error: "not implemented " + upn },
    //   { status: 500 }
    // );
  } catch (error) {
    return Response.error();
  }
}
export async function POST(
  request: NextRequest,
  { params }: { params: { packageid: string } }
) {
  try {
    //const res = await request.json();
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const jwt: any = jwtDecode(token!);

    const id = nanoid();
    const body = await request.json();
    const upn = jwt.upn;

    const result = await execute(
      token!,
      "mix",
      "new_workspace",
      JSON.stringify({
        name: id,
        description: "",
        upn,
        body,
        key: id,
        tenant: "",
        searchindex: "name:",
      })
    );
    if (result.hasError) {
      console.log(
        request.url,
        request.method,
        body,
        "ERROR:",
        result.errorMessage
      );
      return NextResponse.json(
        { success: false, error: result.errorMessage },
        { status: 500 }
      );
    }
    return Response.json({ id });
  } catch (error) {
    return Response.error();
  }
}
