// End-to-end test: starts the server, connects with the official MCP client over Streamable HTTP,
// lists tools and calls each one.
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createApp } from "../src/server.js";

const httpServer = createApp().listen(0);
const port = httpServer.address().port;

try {
  const client = new Client({ name: "smoke-test", version: "0.0.1" });
  const transport = new StreamableHTTPClientTransport(new URL(`http://localhost:${port}/mcp`));
  await client.connect(transport);
  console.log("negotiated protocol:", transport.protocolVersion ?? "(see server)");

  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  assert.deepEqual(names, ["buyer_protection_steps", "explain_land_document", "find_land_offices", "land_warning_signs"]);
  console.log("tools:", names.join(", "));

  const steps = await client.callTool({ name: "buyer_protection_steps", arguments: { land_status: "deliberation", commune: "Mbour" } });
  assert.equal(steps.structuredContent.land_status, "deliberation");
  assert.ok(steps.structuredContent.steps.length >= 6);
  console.log("\nbuyer_protection_steps speech:\n ", steps.structuredContent.speech);

  const offices = await client.callTool({ name: "find_land_offices", arguments: { commune: "Saly", limit: 2 } });
  assert.equal(offices.structuredContent.offices.length, 2);
  console.log("\nfind_land_offices speech:\n ", offices.structuredContent.speech);

  const pin = await client.callTool({ name: "find_land_offices", arguments: { lat: 16.03, lng: -16.48, limit: 1 } });
  assert.match(pin.structuredContent.offices[0].commune, /Saint-Louis/);

  const ask = await client.callTool({ name: "find_land_offices", arguments: {} });
  assert.equal(ask.structuredContent.offices.length, 0);

  const warn = await client.callTool({ name: "land_warning_signs", arguments: {} });
  assert.ok(warn.structuredContent.warning_signs.length >= 5);
  console.log("\nland_warning_signs speech:\n ", warn.structuredContent.speech);

  const doc = await client.callTool({ name: "explain_land_document", arguments: { document: "NICAD" } });
  assert.match(doc.structuredContent.speech, /NICAD/);
  console.log("\nexplain_land_document speech:\n ", doc.structuredContent.speech);

  await client.close();
  console.log("\nOK — all checks passed");
} finally {
  httpServer.close();
}
