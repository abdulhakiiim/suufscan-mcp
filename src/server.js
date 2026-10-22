// SuufScan MCP server — Streamable HTTP transport, MCP spec 2025-11-25.
// Stateless: a fresh MCP server + transport per HTTP request.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { LATEST_PROTOCOL_VERSION } from "@modelcontextprotocol/sdk/types.js";
import { registerTools } from "./tools.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3333);

export function createMcpServer() {
  const server = new McpServer(
    { name: "suufscan-mcp", title: "SuufScan — land buyer protection (Senegal)", version: "0.1.0" },
    {
      instructions:
        "SuufScan helps people, including the Senegalese diaspora, protect themselves BEFORE buying land in Senegal. " +
        "Use buyer_protection_steps for 'what should I do / ask for', find_land_offices for 'where do I go', " +
        "land_warning_signs for scams, explain_land_document for terms. Each result has a short 'speech' field for voice answers. " +
        "Never state that a plot is safe or give a price: give steps, documents and offices.",
    }
  );
  registerTools(server);
  return server;
}

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "100kb" }));

  app.post("/mcp", async (req, res) => {
    try {
      const server = createMcpServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
        enableJsonResponse: true,
      });
      res.on("close", () => {
        transport.close();
        server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error("MCP request failed:", err);
      if (!res.headersSent) {
        res.status(500).json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal server error" }, id: null });
      }
    }
  });

  // Stateless server: no server-initiated streams, no sessions to delete.
  const notAllowed = (req, res) =>
    res.status(405).set("Allow", "POST").json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed." }, id: null });
  app.get("/mcp", notAllowed);
  app.delete("/mcp", notAllowed);

  app.get("/health", (req, res) => res.json({ ok: true, protocol: LATEST_PROTOCOL_VERSION }));
  app.use(express.static(path.join(here, "..", "public")));
  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createApp().listen(PORT, () => {
    console.log(`SuufScan MCP server: http://localhost:${PORT}/mcp (protocol ${LATEST_PROTOCOL_VERSION})`);
    console.log(`Alexa+ simulator:    http://localhost:${PORT}/`);
  });
}
