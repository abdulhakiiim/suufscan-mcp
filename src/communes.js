// Approximate town-centre coordinates (WGS84) used only to rank offices by distance
// when the user names a commune instead of giving a map pin.
export const COMMUNES = {
  dakar: { name: "Dakar", lat: 14.6928, lng: -17.4467 },
  pikine: { name: "Pikine", lat: 14.7549, lng: -17.3902 },
  guediawaye: { name: "Guédiawaye", lat: 14.7745, lng: -17.3958 },
  rufisque: { name: "Rufisque", lat: 14.7158, lng: -17.2733 },
  bargny: { name: "Bargny", lat: 14.6967, lng: -17.2264 },
  diamniadio: { name: "Diamniadio", lat: 14.7253, lng: -17.1814 },
  sebikotane: { name: "Sébikotane", lat: 14.7469, lng: -17.1361 },
  bambylor: { name: "Bambylor", lat: 14.7781, lng: -17.2347 },
  thies: { name: "Thiès", lat: 14.791, lng: -16.9256 },
  pout: { name: "Pout", lat: 14.77, lng: -17.06 },
  popenguine: { name: "Popenguine", lat: 14.5536, lng: -17.1131 },
  nguekhokh: { name: "Nguékhokh", lat: 14.5167, lng: -17.0 },
  somone: { name: "Somone", lat: 14.4889, lng: -17.0811 },
  ngaparou: { name: "Ngaparou", lat: 14.4639, lng: -17.0533 },
  saly: { name: "Saly Portudal", lat: 14.4467, lng: -17.0089 },
  malicounda: { name: "Malicounda", lat: 14.4806, lng: -16.9617 },
  mbour: { name: "Mbour", lat: 14.4198, lng: -16.9637 },
  joal: { name: "Joal-Fadiouth", lat: 14.1667, lng: -16.8333 },
  "saint-louis": { name: "Saint-Louis", lat: 16.0326, lng: -16.4818 },
  gandiol: { name: "Gandiol", lat: 15.92, lng: -16.48 },
  "richard-toll": { name: "Richard-Toll", lat: 16.4625, lng: -15.7008 },
  dagana: { name: "Dagana", lat: 16.5167, lng: -15.5 },
};

export function normalizeText(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/saint louis/g, "saint-louis")
    .replace(/richard toll/g, "richard-toll")
    .trim();
}

export function findCommune(text) {
  const t = normalizeText(text);
  if (!t) return null;
  // longest key first so "saint-louis" wins over shorter matches
  const keys = Object.keys(COMMUNES).sort((a, b) => b.length - a.length);
  const key = keys.find((k) => t.includes(k));
  return key ? { key, ...COMMUNES[key] } : null;
}
