import { z } from "zod";
import {
  DISCLAIMER,
  SCAN_PARCELLE_HINT,
  LAND_STATUSES,
  buyerProtectionSteps,
  WARNING_SIGNS,
  GLOSSARY,
  explainDocument,
} from "./content.js";
import { findCommune, COMMUNES } from "./communes.js";
import { loadPlaces, nearestPlaces } from "./places.js";

const ATTRIBUTION =
  process.env.SUUFSCAN_PLACES_ATTRIBUTION ||
  "Office directory: SuufScan Explorer. Map data © OpenStreetMap contributors, licensed under ODbL (osm.org/copyright).";

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

function result(speech, data) {
  const structuredContent = { speech, ...data, disclaimer: DISCLAIMER };
  return {
    content: [{ type: "text", text: JSON.stringify(structuredContent, null, 2) }],
    structuredContent,
  };
}

export function registerTools(server) {
  server.registerTool(
    "buyer_protection_steps",
    {
      title: "Buyer protection steps",
      description:
        "Ordered steps a land buyer in Senegal should follow BEFORE paying, depending on the land document the seller holds " +
        "(titre_foncier = land title, bail = State lease, deliberation = municipal allocation, unknown). " +
        "Use it when someone asks what to do, what to ask for, or how to protect themselves before buying land. " +
        "It gives general steps, never a verdict on a specific plot.",
      inputSchema: {
        land_status: z.enum(LAND_STATUSES).default("unknown").describe("Document the seller holds, if known"),
        commune: z.string().optional().describe("Commune where the plot is, e.g. Mbour, Saly, Thiès, Saint-Louis"),
      },
      annotations: READ_ONLY,
    },
    async ({ land_status = "unknown", commune }) => {
      const { speech: statusSpeech, ...r } = buyerProtectionSteps(land_status);
      const c = findCommune(commune);
      const where = c ? ` in ${c.name}` : "";
      const speech =
        `Before paying for land${where}: get the exact map pin of the plot and the seller's ID. ` +
        `${statusSpeech} ` +
        `Then ask for a Certificat d'Urbanisme, and sign and pay through a notary, never in cash.`;
      return result(speech, { commune: c?.name || commune || null, ...r, next_step: SCAN_PARCELLE_HINT });
    }
  );

  server.registerTool(
    "find_land_offices",
    {
      title: "Find land offices near a plot",
      description:
        "Nearest land governance offices (tax and Domains centre with its cadastre desk, town hall, prefecture, urban planning) " +
        "for a commune or a map pin in Senegal, from the SuufScan Explorer directory. " +
        "Use it when someone asks where to go, or who to ask, about a plot.",
      inputSchema: {
        commune: z.string().optional().describe("Commune name, e.g. Mbour"),
        lat: z.number().min(-90).max(90).optional(),
        lng: z.number().min(-180).max(180).optional(),
        office_type: z
          .string()
          .optional()
          .describe("Optional filter: domaines, cadastre, mairie, prefecture, urbanisme"),
        limit: z.number().int().min(1).max(10).default(3),
      },
      annotations: { ...READ_ONLY, openWorldHint: true },
    },
    async ({ commune, lat, lng, office_type, limit = 3 }) => {
      let origin = null;
      let originLabel = null;
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        origin = { lat, lng };
        originLabel = "your map pin";
      } else {
        const c = findCommune(commune);
        if (c) {
          origin = { lat: c.lat, lng: c.lng };
          originLabel = c.name;
        }
      }
      if (!origin) {
        return result(
          "Which town is the plot in? For example Mbour, Saly, Thiès or Saint-Louis.",
          { offices: [], known_communes: Object.values(COMMUNES).map((c) => c.name) }
        );
      }
      const { places, source } = await loadPlaces();
      const offices = nearestPlaces(places, origin, { officeType: office_type, limit });
      const speech = offices.length
        ? `Near ${originLabel}, the closest offices are: ` +
          offices
            .map((o) => `${o.name}, ${o.distance_km < 1 ? "in town" : `about ${Math.round(o.distance_km)} kilometres away`}`)
            .join("; ") +
          "."
        : `I could not find an office near ${originLabel} in the directory.`;
      return result(speech, {
        origin: { label: originLabel, ...origin, approximate: originLabel !== "your map pin" },
        offices,
        data_source: source,
        attribution: ATTRIBUTION,
      });
    }
  );

  server.registerTool(
    "land_warning_signs",
    {
      title: "Land purchase warning signs",
      description:
        "Common warning signs of land fraud in Senegal (double sale, fake documents, undeclared co-ownership, " +
        "unapproved subdivision, risk areas). Use it when someone asks about scams or what to watch out for.",
      inputSchema: {},
      annotations: READ_ONLY,
    },
    async () => {
      const speech =
        "Watch out for these: " +
        WARNING_SIGNS.slice(0, 5).map((w) => w.sign.replace(/\s*\(.*\)/, "")).join("; ") +
        ". And never pay in cash before a notarized deed.";
      return result(speech, { warning_signs: WARNING_SIGNS });
    }
  );

  server.registerTool(
    "explain_land_document",
    {
      title: "Explain a land document",
      description:
        "Plain-language explanation of a Senegalese land document or term: titre_foncier, bail, deliberation, nicad, " +
        "etat_des_droits_reels, certificat_urbanisme, acte_notarie, lotissement, procuration.",
      inputSchema: {
        document: z.string().describe("Document or term to explain"),
      },
      annotations: READ_ONLY,
    },
    async ({ document }) => {
      const d = explainDocument(document);
      if (!d) {
        return result("I can explain: land title, State lease, délibération, NICAD, état des droits réels, Certificat d'Urbanisme, notarized deed, subdivision, power of attorney.", {
          known_documents: Object.keys(GLOSSARY),
        });
      }
      return result(`${d.term}: ${d.meaning}`, { document: d });
    }
  );
}
