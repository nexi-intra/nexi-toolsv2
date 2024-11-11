import { NextRequest, NextResponse } from "next/server";

import { handleDatabaseMessagesServer } from "@/app/koksmat/src/v.next/endpoints/database-messages-server";

export async function POST(request: NextRequest) {
  return handleDatabaseMessagesServer(request);
}
