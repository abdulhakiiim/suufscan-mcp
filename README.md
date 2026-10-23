# SuufScan for Alexa+ — land buyer protection for Senegal and its diaspora

**Track:** Alexa+ · self-hosted MCP server (Streamable HTTP, MCP spec **2025-11-25**) + a simulated Alexa+ voice experience in the browser.

Millions of Senegalese live abroad, and buying land back home is one of the biggest decisions a family makes. Most of them buy from thousands of kilometres away, through relatives or brokers, and land fraud is widely reported in the Senegalese press: the same plot sold twice, fake titles, inherited land sold without the other heirs, plots in unapproved subdivisions.

**SuufScan** is a Senegalese PropTech that helps buyers protect themselves *before* they buy. This repository exposes SuufScan's buyer-protection knowledge and its directory of land offices as an **MCP server**, so a voice assistant like Alexa+ can answer questions such as:

> *"Alexa, I live in New York and want to buy land in Mbour for my mother. The seller has a délibération. What should I do before I pay?"*

The answer is a set of concrete steps, the documents to ask for, and the offices to go to. It never says a plot is "safe" and never gives a price: it helps the buyer ask the right questions to the right people.

## What's inside

| Path | What it is |
|---|---|
| `src/server.js` | Express app. `POST /mcp` = MCP endpoint (stateless Streamable HTTP, JSON responses). Also serves the simulator at `/` and `/health`. |
| `src/tools.js` | The MCP tools (below): 4 always on, plus `ask_segn_suuf` when enabled. Every result has a short `speech` field written for voice, plus structured data. |
| `src/content.js` | Buyer-protection steps per land status, warning signs, glossary of Senegalese land documents. |
| `src/places.js` | Loads the land-office directory (SuufScan Explorer) from a URL or a local file, ranks offices by distance. |
| `src/communes.js` | Approximate town-centre coordinates for communes of the Dakar–Thiès–Mbour corridor and the Saint-Louis region. |
| `public/index.html` | **Simulated Alexa+ experience**: voice in (Web Speech API), deterministic intent routing, real MCP JSON-RPC calls to `/mcp`, voice out. A side panel shows the live MCP traffic. |
| `test/smoke.js` | End-to-end test with the official MCP TypeScript SDK client over Streamable HTTP. |

### MCP tools

| Tool | Use it when the user asks… |
|---|---|
| `buyer_protection_steps(land_status, commune?)` | "What should I do / ask for before buying?" — `land_status` ∈ `titre_foncier` (land title), `bail` (State lease), `deliberation` (municipal allocation), `unknown` |
| `find_land_offices(commune? \| lat,lng, office_type?, limit?)` | "Where should I go?" — nearest tax and Domains centre (with its cadastre desk), town hall, prefecture, urban planning service |
| `land_warning_signs()` | "What are the scams to watch out for?" |
| `explain_land_document(document)` | "What is a NICAD / an état des droits réels / a délibération?" |
| `ask_segn_suuf(question, history?)` — *opt-in* | Any other land question (inheritance, family land, a specific situation): answered **live by Sëgn Suuf**, SuufScan's land-law assistant grounded in Senegalese land texts in force. Answers in French; the assistant can translate. |

All tools are read-only (`readOnlyHint: true`).

`ask_segn_suuf` is registered only when `SUUFSCAN_GUIDANCE_URL` is set: each call is a real model call on SuufScan's side, so a plain local run never triggers it. Demo traffic is tagged with the session id `mcp-hackathon-demo` (`SUUFSCAN_GUIDANCE_SESSION`).

## Run it

Requires Node.js 18+.

```bash
npm install
npm start          # MCP server on http://localhost:3333/mcp, simulator on http://localhost:3333/
npm test           # end-to-end MCP test
```

Open `http://localhost:3333/` in Chrome, tap the ring and speak (English), or click an example question.

### Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3333` | HTTP port |
| `SUUFSCAN_PLACES_URL` | — | JSON source for the office directory (SuufScan Explorer). Accepts an array, `{places:[…]}` / `{data:[…]}`, or a GeoJSON FeatureCollection. |
| `SUUFSCAN_PLACES_FILE` | `data/places.example.json` | Local JSON file, used when no URL is set |
| `SUUFSCAN_PLACES_ATTRIBUTION` | SuufScan Explorer + © OpenStreetMap contributors, licensed under ODbL | Attribution returned with office results |

`data/places.example.json` contains **placeholder entries only** (labelled "Example…", located at town centres) so the project runs out of the box. Real office data is served by SuufScan and is not committed here.

### Connect an MCP client

Any MCP client that speaks Streamable HTTP can use `http://<host>:3333/mcp`, for example the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector
# Transport: Streamable HTTP · URL: http://localhost:3333/mcp
```

For Alexa+, the same endpoint is the integration point: deploy it behind HTTPS and register it as an MCP server in the Alexa+ developer Preview.

## How it works

```
 voice ──► Alexa+ (simulated in the browser)
              │  intent routing → tool + arguments
              ▼
        POST /mcp  (JSON-RPC 2.0, MCP 2025-11-25, Streamable HTTP)
              │  initialize → tools/list → tools/call
              ▼
        SuufScan MCP server ──► buyer-protection content
              │                └► land-office directory (SuufScan Explorer)
              ▼
        { speech, steps / offices / warning_signs, disclaimer } ──► spoken answer
```

The server is stateless: each HTTP request gets its own MCP server instance and transport, so it scales horizontally and needs no session store.

## Scope and limits

- General information to help a buyer protect themselves before purchase. **Not legal advice.** For a binding answer on a specific plot, ask a notary.
- The tools never return a verdict on a plot or a price.
- French legal designations ("titre foncier", "état des droits réels", "Certificat d'Urbanisme"…) are kept as-is: they are the names buyers will hear at the offices.
- Voice input in the simulator is English (Chrome Web Speech API).

## License

MIT — see `LICENSE`. Office directory data, when loaded from SuufScan, carries its own attribution (OpenStreetMap contributors, ODbL).

The SuufScan name and logo are © SuufScan and are not covered by the MIT license.
