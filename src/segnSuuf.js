// Bridge to Sëgn Suuf, SuufScan's land-law assistant (RAG over Senegalese land texts).
// Opt-in: the ask_segn_suuf tool exists only when SUUFSCAN_GUIDANCE_URL is set,
// so a local run of this repo never calls SuufScan's production assistant by default.
const DEFAULT_TIMEOUT_MS = 45_000;

export function guidanceUrl() {
  return process.env.SUUFSCAN_GUIDANCE_URL || null;
}

export function sessionTag() {
  // Lets SuufScan tell demo traffic apart from real users in its logs.
  return process.env.SUUFSCAN_GUIDANCE_SESSION || "mcp-hackathon-demo";
}

export async function askSegnSuuf(question, history = [], { fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const url = guidanceUrl();
  if (!url) throw new Error("SUUFSCAN_GUIDANCE_URL is not set");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        transcript: String(question).slice(0, 1000),
        history: (history || []).slice(-8).map((t) => ({ role: t.role === "user" ? "user" : "assistant", text: String(t.text || "") })),
        sessionId: sessionTag(),
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sëgn Suuf answered HTTP ${res.status}`);
    const data = await res.json();
    if (!data || typeof data.text !== "string" || !data.text.trim()) throw new Error("Empty answer from Sëgn Suuf");
    return {
      text: data.text.trim(),
      language: data.language_detected || "fr",
      suggest_scan: Boolean(data.suggest_scan),
      timeout: Boolean(data.timeout),
    };
  } finally {
    clearTimeout(timer);
  }
}
