/**
 * Every external URL the site references, in one place.
 * Real project: github.com/charantek1styearbtech/andriod-mcp
 */
export const LINKS = {
  repo: "https://github.com/charantek1styearbtech/andriod-mcp",
  repoClone: "https://github.com/charantek1styearbtech/andriod-mcp.git",
  apkDownload:
    "https://github.com/charantek1styearbtech/andriod-mcp/releases/download/v1.1.0/app-debug.apk",
  releases: "https://github.com/charantek1styearbtech/andriod-mcp/releases",
  docs: "https://github.com/charantek1styearbtech/andriod-mcp#readme",
  architecture: "https://github.com/charantek1styearbtech/andriod-mcp#architecture",
  issues: "https://github.com/charantek1styearbtech/andriod-mcp/issues",
  license: "https://github.com/charantek1styearbtech/andriod-mcp/blob/main/LICENSE",
  gateway: "https://andriod-mcp-gateway.onrender.com",
  gatewaySse: "https://andriod-mcp-gateway.onrender.com/sse",
  gatewayWs: "wss://andriod-mcp-gateway.onrender.com/device/ws",
  oauth: "https://andriod-mcp-gateway.onrender.com/oauth/google",
  apkVersion: "v1.1.0",
  apkSize: "19.2 MB",
} as const;

/** One-click MCP registration command (email is a runtime user value). */
export const claudeAddCommand = (email = "you@gmail.com") =>
  `claude mcp add android -- ${LINKS.gatewaySse}?email=${email}`;
