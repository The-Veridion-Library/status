import { Octokit } from "@octokit/rest";

// Initialize Octokit with your fine-grained token (server-side only)
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Type for service returned to the frontend
export interface ServiceStatus {
  name: string;
  status: string;       // up | down | degraded | unknown
  lastUpdated: string;
  commentsUrl?: string;
}

/**
 * Fetch all services from GitHub Issues
 * Each issue represents a service
 */
export async function getServices(): Promise<ServiceStatus[]> {
  const repoEnv = process.env.GITHUB_REPO;
  if (!repoEnv) throw new Error("Missing GITHUB_REPO env variable");

  const [owner, repo] = repoEnv.split("/");
  if (!owner || !repo) throw new Error("Invalid GITHUB_REPO format, should be 'owner/repo'");

  // List all open issues with status labels
  const { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: "open",
    labels: "up,down,degraded",
    per_page: 100,
  });

  // Map issues to our service format
  return issues.map((issue) => {
    const firstLabel = issue.labels[0];
    let status: string;

    // Handle labels that may be strings or objects
    if (typeof firstLabel === "string") {
      status = firstLabel;
    } else {
      status = firstLabel?.name || "unknown";
    }

    return {
      name: issue.title,
      status,
      lastUpdated: issue.updated_at,
      commentsUrl: issue.comments_url,
    };
  });
}

/**
 * Optional helper to fetch latest comments for a service
 */
export async function getServiceComments(commentsUrl: string) {
  const res = await octokit.request(`GET ${commentsUrl}`);
  return res.data.map((comment: any) => ({
    body: comment.body,
    updated: comment.updated_at,
    author: comment.user?.login,
  }));
}