// Tests the ask_segn_suuf bridge against a local fake of SuufScan's /api/guidance (no production call).
import assert from "node:assert/strict";
import http from "node:http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createApp } from "../src/server.js";

let received = null;
const fake = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    received = JSON.parse(body);
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ text: "Réponse de test de Sëgn Suuf.", suggest_scan: true, language_detected: "fr" }));
  });
}).listen(0);
process.env.SUUFSCAN_GUIDANCE_URL = `http://localhost:${fake.address().port}/api/guidance`;

const app = createApp().listen(0);
try {
  const client = new Client({ name: "segn-suuf-test", version: "0.0.1" });
  await client.connect(new StreamableHTTPClientTransport(new URL(`http://localhost:${app.address().port}/mcp`)));
  const names = (await client.listTools()).tools.map((t) => t.name);
  assert.ok(names.includes("ask_segn_suuf"), "ask_segn_suuf is registered when SUUFSCAN_GUIDANCE_URL is set");
  assert.equal(names.length, 5);

  const r = await client.callTool({
    name: "ask_segn_suuf",
    arguments: { question: "Can my uncle sell me inherited land?", history: [{ role: "user", text: "Hello" }] },
  });
  assert.equal(r.structuredContent.speech, "Réponse de test de Sëgn Suuf.");
  assert.equal(r.structuredContent.answer_language, "fr");
  assert.ok(r.structuredContent.next_step);
  assert.equal(received.transcript, "Can my uncle sell me inherited land?");
  assert.equal(received.sessionId, "mcp-hackathon-demo");
  assert.deepEqual(received.history, [{ role: "user", text: "Hello" }]);

  fake.close();
  const down = await client.callTool({ name: "ask_segn_suuf", arguments: { question: "Anyone there?" } });
  assert.match(down.structuredContent.speech, /could not answer/);

  await client.close();
  console.log("OK — ask_segn_suuf bridge checks passed");
} finally {
  app.close();
  fake.close();
}
