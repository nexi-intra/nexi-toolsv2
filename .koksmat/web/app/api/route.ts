/**
 * GitHubRepoInfoRoute
 *
 * A Next.js API route that fetches comprehensive information about a GitHub repository
 * using the getGitHubRepoInfo function. It handles requests with org and repo query parameters.
 */

import { NextRequest, NextResponse } from "next/server";
import { getGitHubRepoInfo } from "./getGitHubRepoInfo";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const org = searchParams.get("org");
  const repo = searchParams.get("repo");

  if (!org || !repo) {
    return NextResponse.json(
      { error: "Missing required parameters: org and repo" },
      { status: 400 }
    );
  }

  try {
    const repoInfo = await getGitHubRepoInfo(org, repo);
    return NextResponse.json(repoInfo);
  } catch (error) {
    console.error("Error fetching GitHub repo info:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
