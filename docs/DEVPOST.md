# Devpost submission — copy/paste fields

> Lines marked **[BABACAR]** must be filled or confirmed by you before submitting. Everything else is ready to paste.

---

## Project name
SuufScan for Alexa+ — land buyer protection for the Senegalese diaspora

## Elevator pitch (short tagline)
Ask Alexa what to do before buying land in Senegal from abroad: the documents to request, the offices to go to, and the scams to avoid — served by SuufScan's MCP server.

## Track and mini challenges
- **Primary track:** Alexa+ — self-hosted MCP server (spec 2025-11-25, Streamable HTTP), demonstrated through a simulated Alexa+ experience in a web app.
- **Mini challenges:** none.

## About the project (description)

### Inspiration
Millions of Senegalese live abroad. Buying a plot back home, for a house or for their parents, is one of the biggest decisions a family makes, and most of it happens remotely, through relatives or brokers. Land fraud is widely reported in the Senegalese press: the same plot sold twice, fake titles, inherited land sold without the other heirs' consent, plots in unapproved subdivisions. The buyer abroad usually doesn't know which document to ask for, or which office can confirm it.

SuufScan is a Senegalese PropTech built to help buyers protect themselves *before* they buy. We wanted that help to live where the diaspora already is — in their kitchen, by voice.

### What it does
SuufScan for Alexa+ answers questions like:

> "Alexa, I live in New York and want to buy land in Mbour for my mother. The seller has a délibération. What should I do before I pay?"

It returns, by voice:
- **Steps to follow before paying**, adapted to the land document the seller holds (land title, State lease or municipal allocation).
- **The nearest land offices** to the plot (tax and Domains centre with its cadastre desk, town hall, prefecture, urban planning) from SuufScan's office directory.
- **The common warning signs** of land fraud in Senegal.
- **Plain-language explanations** of the documents the buyer will hear about (NICAD, état des droits réels, Certificat d'Urbanisme…).

It never says a plot is "safe" and never gives a price. It tells the buyer what to ask, and who to ask.

### How we built it
- A **self-hosted MCP server** in Node.js with the official MCP TypeScript SDK, exposing 4 read-only tools over **Streamable HTTP**, negotiating protocol **2025-11-25**. It is stateless (one server instance per request), so it can sit behind any HTTPS load balancer.
- Every tool returns structured data **plus a short `speech` field written for voice**, so an assistant can read the answer aloud without rewriting it.
- The office directory is loaded from SuufScan's Explorer (configurable URL), ranked by distance from the commune or a map pin.
- A **simulated Alexa+ experience** in the browser: Chrome speech recognition in, deterministic intent routing, real MCP JSON-RPC calls (`initialize` → `tools/list` → `tools/call`) to the server, speech synthesis out. A side panel shows the live MCP traffic.
- An end-to-end test uses the official MCP SDK client over Streamable HTTP and calls every tool.

### Challenges we ran into
- Writing for the ear: legal procedures are long; each tool had to produce a 20–30 second answer, with the full detail kept in structured data.
- Staying on the right side of the line: the assistant must help the buyer ask the right questions without ever pretending to rule on a specific plot.
- Keeping French legal designations ("titre foncier", "délibération") inside English answers, because those are the words buyers will hear at the offices.

### Accomplishments we're proud of
- A working MCP server on the latest spec, with a voice demo end to end.
- The same server can be plugged into Alexa+ or any MCP-capable assistant without changes.

### What we learned
**[BABACAR — 1–2 sentences in your own words, e.g. what MCP changed in how you think about SuufScan's distribution.]**

### What's next
- Register the server in the Alexa+ developer Preview and test with real diaspora users.
- Add the office directory for more regions.
- Link each answer to SuufScan's web app, where a buyer can get a written land risk report for one specific plot.

## Built with
Node.js · Express · MCP TypeScript SDK (`@modelcontextprotocol/sdk`) · Model Context Protocol 2025-11-25 · Streamable HTTP · Zod · Web Speech API · OpenStreetMap data (ODbL)

## Did the project exist before the hackathon?
SuufScan (the web platform: an AI land-information chat, a land-office directory and a land risk report) existed before the hackathon. **Everything in this repository was built during the submission window**: the MCP server, its 4 tools, the voice-oriented answers, the office-ranking logic, the simulated Alexa+ experience and the tests. No code from the SuufScan web platform is reused here.

**[BABACAR — confirm this is true: the repo is new and was built in October 2026.]**

## Product feedback (required)

**[BABACAR — rewrite with your real experience. Below is a draft based only on what was used to build this repo.]**

- **Tools used:** Model Context Protocol specification 2025-11-25, MCP TypeScript SDK (server `McpServer` + `StreamableHTTPServerTransport`, client `StreamableHTTPClientTransport`), Alexa+ MCP integration documentation.
- **What we used them for:** exposing SuufScan's buyer-protection content and land-office directory as MCP tools for a voice assistant.
- **What worked well:** the SDK negotiated protocol 2025-11-25 out of the box; stateless Streamable HTTP with JSON responses made the server simple to host and to call from a plain browser `fetch`; tool annotations (`readOnlyHint`) and `structuredContent` fit voice use well.
- **What needs work:** **[BABACAR — e.g. how hard it was to get access to the Alexa+ Preview to test on a real device, if you tried.]**
- **Onboarding:** **[BABACAR]**
- **Would we build with it again?** **[BABACAR]**
- **AWS services:** none used.

## Feature requests (optional)
- **Important —** Multilingual Alexa+ for diaspora markets: French first, then local languages (Wolof). Many diaspora users speak French at home.
- **Nice-to-have —** A guideline for "speech-ready" fields in MCP tool results, so voice assistants can read tool output directly.

## Friction log (optional, up to +10%)
Only add entries you actually experienced. Template per entry:
- **Task attempted:**
- **Steps taken:**
- **Expected vs. actual:**
- **Severity:** low / medium / high
- **Workaround:**
- **Suggestion:**

## Links
- **GitHub repo:** **[BABACAR — https://github.com/<you>/suufscan-mcp]**
- **Demo video (YouTube, public, English, < 3 min):** **[BABACAR]**
