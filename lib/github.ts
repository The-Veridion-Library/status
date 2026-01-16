import { Octokit } from "@octokit/rest";

// Initialize Octokit with your Fine-grained token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // server-side only
});

/**
 * Fetch all service issues from GitHub
 * Each Issue represents a service, labels define status
 */
export async function getServices() {
  const [owner, repo] = (process.env.GITHUB_REPO || "").split("/");
  if (!owner || !repo) throw new Error("Missing GITHUB_REPO env");

  // Fetch all open issues with relevant labels
  const { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: "open",
    labels: "up,down,degraded",
    per_page: 100, // adjust if you have more than 100 services
  });

  // Map issues to service objects
  return issues.map(issue => ({
    name: issue.title,                     // Service name
    status: issue.labels[0]?.name || "unknown", // Label defines status
    lastUpdated: issue.updated_at,         // Last updated timestamp
    commentsUrl: issue.comments_url,       // Optional: fetch comments if you want
  }));
}