/**
 * GitHubRepoInfo
 *
 * A server-side function that fetches comprehensive information about a GitHub repository
 * using a GitHub App for authentication. It returns details including title, about info,
 * branches, actions, releases, and open issues.
 */

import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { marked } from "marked";

// Define the structure of our return object
interface RepoInfo {
  title: string;
  aboutHtml: string;
  branches: Array<{ name: string; url: string }>;
  actions: Array<{ name: string; url: string }>;
  releases: Array<{ name: string; url: string }>;
  openIssues: Array<{ title: string; status: string; url: string }>;
}

export async function getGitHubRepoInfo(
  org: string,
  repo: string
): Promise<RepoInfo> {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY;
  const installationId = process.env.GITHUB_INSTALLATION_ID;

  if (!appId || !privateKey || !installationId) {
    throw new Error("GitHub App credentials are not properly configured");
  }

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
  });

  try {
    // Fetch repository information
    const { data: repoData } = await octokit.repos.get({ owner: org, repo });

    // Fetch branches
    const { data: branchesData } = await octokit.repos.listBranches({
      owner: org,
      repo,
    });

    // Fetch workflows (actions)
    const { data: workflowsData } = await octokit.actions.listRepoWorkflows({
      owner: org,
      repo,
    });

    // Fetch releases
    const { data: releasesData } = await octokit.repos.listReleases({
      owner: org,
      repo,
    });

    // Fetch open issues
    const { data: issuesData } = await octokit.issues.listForRepo({
      owner: org,
      repo,
      state: "open",
      per_page: 100, // Adjust as needed
    });

    // Compile the information
    const repoInfo: RepoInfo = {
      title: repoData.name,
      aboutHtml: await marked(repoData.description || ""),
      branches: branchesData.map((branch) => ({
        name: branch.name,
        url: `https://github.com/${org}/${repo}/tree/${branch.name}`,
      })),
      actions: workflowsData.workflows.map((workflow) => ({
        name: workflow.name,
        url: workflow.html_url,
      })),
      releases: releasesData.map((release) => ({
        name: release.name || release.tag_name,
        url: release.html_url,
      })),
      openIssues: issuesData.map((issue) => ({
        title: issue.title,
        status: issue.state,
        url: issue.html_url,
      })),
    };

    return repoInfo;
  } catch (error) {
    console.error("Error fetching GitHub repo info:", error);
    throw error;
  }
}
