import { highlightLines } from "@/lib/shiki";
import BugBountyClient from "./BugBountyClient";

const EVENTS = `network_get_events({ host: "api.target.com", test_id: "idor_user_profile", limit: 50 })
[
  { url: "https://api-staging.internal.target.com/v2/user/42",
    method: "GET", status: 200, durationMs: 118, testId: "idor_user_profile" },
  { url: "https://api.target.com/v2/user/77/invoices",
    method: "GET", status: 403, durationMs: 241 },
  { url: "https://telemetry.target.com/collect",
    method: "POST", status: 200, durationMs: 64, note: "device identifiers" }
]`;

const SUMMARY = `network_stop_monitor()
{
  "totalRequests": 42,   "failedRequests": 3,
  "http5xxErrors": 1,    "http4xxErrors": 2,
  "totalBytesSent": 18450, "totalBytesReceived": 94230,
  "avgDurationMs": 142
}`;

export default async function BugBounty() {
  const [eventsLines, summaryLines] = await Promise.all([
    highlightLines(EVENTS, "json"),
    highlightLines(SUMMARY, "json"),
  ]);
  return <BugBountyClient eventsLines={eventsLines} summaryLines={summaryLines} />;
}
