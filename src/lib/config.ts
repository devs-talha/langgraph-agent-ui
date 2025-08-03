/**
 * Application configuration
 * Values are read from environment variables with fallbacks
 */

export const config = {
  appTitle: process.env.NEXT_PUBLIC_APP_TITLE || "Agent Chat",
  appDescription:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Agent Chat UX by LangChain",
  allowAttachments: process.env.NEXT_PUBLIC_ALLOW_ATTACHMENTS || false,
  githubRepoUrl:
    process.env.NEXT_PUBLIC_GITHUB_REPO_URL ||
    "https://github.com/devs-talha/langgraph-agent-ui",
  proxyApiUrl:
    process.env.NEXT_PUBLIC_PROXY_API_URL || "http://localhost:3000/api",
  assistantId: process.env.NEXT_PUBLIC_ASSISTANT_ID || "agent",
};
