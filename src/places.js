// Land governance offices (the SuufScan "Explorer" directory).
// Source is configurable so that no third-party dataset is committed to this repo:
//   SUUFSCAN_PLACES_URL  -> JSON served by SuufScan (e.g. its /api/governance-places endpoint)
//   SUUFSCAN_PLACES_FILE -> local JSON file (default: data/places.example.json)
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { normalizeText } from "./communes.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_FILE = path.join(here, "..", "data", "places.example.json");
const CACHE_MS = 10 * 60 * 1000;

let cache = { at: 0, places: [], source: null };

function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return undefined;
}

// Accepts an array, {data|places|items: [...]}, or a GeoJSON FeatureCollection.
// Keeps only institutional fields: no personal phone numbers or names of individuals.
export function normalizePlaces(raw) {
  let list = raw;
  if (!Array.isArray(list)) list = raw?.features || raw?.data || raw?.places || raw?.items || [];
  return list
    .map((item) => {
      const p = item?.type === "Feature" ? { ...item.properties } : { ...item };
      let lat = Number(pick(p, ["lat", "latitude", "y"]));
      let lng = Number(pick(p, ["lng", "lon", "long", "longitude", "x"]));
      if (item?.type === "Feature" && item.geometry?.type === "Point") {
        [lng, lat] = item.geometry.coordinates;
      }
      const name = pick(p, ["name", "nom", "label", "title"]);
      if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return {
        name: String(name),
        type: String(pick(p, ["type", "category", "categorie", "kind"]) || "office"),
        commune: pick(p, ["commune", "city", "ville", "locality"]) || null,
        address: pick(p, ["address", "adresse"]) || null,
        lat,
        lng,
      };
    })
    .filter(Boolean);
}

export async function loadPlaces() {
  if (Date.now() - cache.at < CACHE_MS && cache.places.length) return cache;
  const url = process.env.SUUFSCAN_PLACES_URL;
  let raw;
  let source;
  if (url) {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`Places source answered HTTP ${res.status}`);
    raw = await res.json();
    source = "suufscan-explorer";
  } else {
    const file = process.env.SUUFSCAN_PLACES_FILE || DEFAULT_FILE;
    raw = JSON.parse(await readFile(file, "utf8"));
    source = file === DEFAULT_FILE ? "example-data" : "local-file";
  }
  cache = { at: Date.now(), places: normalizePlaces(raw), source };
  return cache;
}

export function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestPlaces(places, origin, { officeType, limit = 3 } = {}) {
  const wanted = officeType ? normalizeText(officeType) : null;
  return places
    .filter((p) => !wanted || normalizeText(p.type).includes(wanted) || normalizeText(p.name).includes(wanted))
    .map((p) => ({ ...p, distance_km: Math.round(haversineKm(origin, p) * 10) / 10 }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);
}
