import { NextRequest, NextResponse } from "next/server";

import { endpoints } from "@/app/koksmat";

export async function POST(request: NextRequest) {
  const handleDatabaseMessagesServer =
    endpoints.databaseMessageServer.handleDatabaseMessagesServer;
  return handleDatabaseMessagesServer(request);
}
