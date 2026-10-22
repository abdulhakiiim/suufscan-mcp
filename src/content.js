// Buyer-protection knowledge served by the SuufScan MCP server.
// General information for land buyers in Senegal, before purchase.
// French legal designations are kept as-is (they are the official names).

export const DISCLAIMER =
  "General information to help a buyer protect themselves before a land purchase in Senegal. " +
  "It is not legal advice. For a binding answer on a specific plot, ask a notary (\"notaire\").";

export const SCAN_PARCELLE_HINT =
  "For a written land risk report with recommendations for one specific plot, " +
  "the buyer can create an account on SuufScan and run a Scan Parcelle.";

export const LAND_STATUSES = ["titre_foncier", "bail", "deliberation", "unknown"];

const COMMON_BEFORE = [
  {
    step: "Pin the exact plot",
    detail:
      "Get the GPS location of the plot (a map pin), its surface and its boundaries. Visit it, or send someone you trust, and ask the neighbours who uses the land today.",
  },
  {
    step: "Know who is selling",
    detail:
      "Ask for the seller's national ID card. The person selling must be the person named on the land document. If someone sells 'on behalf of' the owner, ask for a notarized power of attorney (\"procuration\").",
  },
];

const COMMON_AFTER = [
  {
    step: "Ask what can be built",
    detail:
      "Ask the urban planning service for a \"Certificat d'Urbanisme\". It tells you the zoning of the plot and whether it sits in a reserved, flood-prone or coastal-erosion area.",
  },
  {
    step: "Sign with a notary, pay through the notary",
    detail:
      "Have the sale written as a notarized deed (\"acte notarié\"). Pay through the notary or by bank transfer, never in cash to an intermediary, and never pay the full amount before the deed is signed.",
  },
  {
    step: "If you live abroad",
    detail:
      "Give a written, limited power of attorney (\"procuration\") to one person you trust, and ask the notary for scanned copies of every document before any payment.",
  },
];

const BY_STATUS = {
  titre_foncier: {
    label: "Land title (\"titre foncier\")",
    speech:
      "The seller says he has a land title. Ask for the title number, then ask the land registry office for a recent état des droits réels: the owner named on it must be the seller, with no mortgage on the plot.",
    what_it_is:
      "The plot is registered in the land register (\"livre foncier\"). This is the strongest form of private ownership in Senegal.",
    documents_to_request: [
      "The land title number (\"numéro du titre foncier\") and a copy of the title",
      "The plot's cadastral number (\"NICAD\") if the seller has it",
      "A recent \"état des droits réels\" issued by the land registry office",
    ],
    where_to_ask:
      "Land registry office (\"Conservation de la propriété et des droits fonciers\", DGID) for the \"état des droits réels\"; cadastre service for the NICAD and the plan.",
    what_to_look_for: [
      "The owner named on the \"état des droits réels\" is the seller",
      "No mortgage (\"hypothèque\"), seizure or other charge registered on the title",
      "The plan matches the plot you visited",
    ],
  },
  bail: {
    label: "State lease (\"bail\")",
    speech:
      "The seller holds a State lease, so the State owns the land. Ask for the lease contract and the fee receipts, and ask the Domains office whether the lease is still running and whether its transfer needs the administration's authorization.",
    what_it_is:
      "The land belongs to the State. The seller holds a lease (\"bail\") from the State, not ownership of the land.",
    documents_to_request: [
      "The lease contract (\"contrat de bail\") and its reference",
      "Receipts showing the lease fee (\"redevance\") has been paid",
      "The plan of the plot",
    ],
    where_to_ask:
      "Domains office (\"Bureau des Domaines\", DGID) of the area where the plot is located.",
    what_to_look_for: [
      "The lease is in the seller's name and still running",
      "Ask the Domains office whether transferring this lease needs the administration's authorization, and how long it takes",
      "Ask whether a conversion of the lease into a land title is possible, and under which conditions",
    ],
  },
  deliberation: {
    label: "Municipal allocation (\"délibération\")",
    speech:
      "The seller holds a délibération. That is a right to use the land, not ownership. Ask the town hall to show it in the council's register, in the seller's name, and ask whether the subdivision is approved.",
    what_it_is:
      "The land is part of the national domain (Loi 64-46). A municipal council decision (\"délibération\") gives a right to use the land (\"affectation\"). It is not ownership.",
    documents_to_request: [
      "A copy of the \"délibération\" with its number and date",
      "Proof that the \"délibération\" was approved by the State's local representative",
      "The plan of the plot and, if it is in a subdivision, the subdivision plan (\"plan de lotissement\")",
    ],
    where_to_ask:
      "The town hall (\"mairie\") of the commune: ask to see the \"délibération\" in the council's register. Urban planning service for the subdivision status.",
    what_to_look_for: [
      "The \"délibération\" exists in the town hall's register, in the seller's name",
      "An allocation is a personal right of use: ask the town hall how a change of beneficiary is handled in this commune, and treat any 'sale' of an allocation as fragile",
      "Whether the subdivision is approved (\"lotissement approuvé\")",
      "Whether a lease or a land title can be obtained later, and through which procedure",
    ],
  },
  unknown: {
    label: "Land status not known yet",
    speech:
      "First, ask the seller which document he holds: a land title, a State lease, or a délibération. A seller with none of these is a strong warning sign.",
    what_it_is:
      "The first question to ask the seller is: which document do you hold for this land? In Senegal it is usually a land title (\"titre foncier\"), a State lease (\"bail\") or a municipal allocation (\"délibération\").",
    documents_to_request: [
      "The land document the seller holds, whatever it is",
      "The seller's national ID card",
    ],
    where_to_ask:
      "Once you know the document, ask the matching office: land registry (title), Domains office (lease) or town hall (allocation).",
    what_to_look_for: [
      "A seller who cannot show any of these documents is a strong warning sign",
      "Receipts, 'attestations' or handwritten sale papers alone are not a land document",
    ],
  },
};

export function buyerProtectionSteps(landStatus = "unknown") {
  const status = BY_STATUS[landStatus] ? landStatus : "unknown";
  const s = BY_STATUS[status];
  const steps = [
    ...COMMON_BEFORE,
    {
      step: `Ask for the right documents — ${s.label}`,
      detail: `${s.what_it_is} Ask for: ${s.documents_to_request.join("; ")}.`,
    },
    {
      step: "Ask the right office to confirm them",
      detail: `${s.where_to_ask} Look for: ${s.what_to_look_for.join("; ")}.`,
    },
    ...COMMON_AFTER,
  ];
  return { land_status: status, ...s, steps };
}

export const WARNING_SIGNS = [
  {
    sign: "Double sale (\"double vente\")",
    detail: "The same plot sold to several buyers. The land registry or town hall records show who is recorded today.",
  },
  {
    sign: "Fake or altered documents",
    detail: "Titles or allocations that look perfect but do not exist in the official register. Always ask the issuing office, never only the seller.",
  },
  {
    sign: "The seller is not the person on the document",
    detail: "A relative, a broker or a 'representative' sells without a notarized power of attorney.",
  },
  {
    sign: "Undeclared family co-ownership (\"indivision\")",
    detail: "Inherited land where other heirs never agreed to the sale and can contest it later.",
  },
  {
    sign: "Land presented as vacant",
    detail: "The plot is already occupied, farmed or claimed. Ask the neighbours and visit it.",
  },
  {
    sign: "Unapproved subdivision (\"lotissement non régularisé\")",
    detail: "Plots drawn by a private seller without an approved subdivision plan.",
  },
  {
    sign: "Reserved or risk area",
    detail: "Plots in a coastal-erosion, flood-prone or public-project area. The \"Certificat d'Urbanisme\" tells you.",
  },
  {
    sign: "Pressure to pay fast, in cash",
    detail: "A seller or broker who refuses the notary, wants cash, or wants the full amount before any deed.",
  },
];

export const GLOSSARY = {
  titre_foncier: {
    term: "Titre foncier (land title)",
    meaning: "Registration of a plot in the land register (\"livre foncier\"). Strongest form of private ownership. Held at the land registry office (DGID).",
  },
  bail: {
    term: "Bail (State lease)",
    meaning: "Lease granted by the State on State land. The holder uses the land but the State remains the owner. Managed by the Domains office (DGID).",
  },
  deliberation: {
    term: "Délibération (municipal allocation)",
    meaning: "Decision of a municipal council that allocates a plot of the national domain for use (\"affectation\", Loi 64-46 and Décret 72-1288). A personal right of use, not ownership.",
  },
  nicad: {
    term: "NICAD",
    meaning: "Cadastral identification number of a plot (Décret 2012-396). Identifies the plot in the cadastre.",
  },
  etat_des_droits_reels: {
    term: "État des droits réels",
    meaning: "Statement issued by the land registry office listing the recorded owner of a titled plot and the rights or charges on it (for example a mortgage).",
  },
  certificat_urbanisme: {
    term: "Certificat d'Urbanisme",
    meaning: "Document from the urban planning service stating the planning rules that apply to a plot: zoning, what can be built, reserved areas.",
  },
  acte_notarie: {
    term: "Acte notarié (notarized deed)",
    meaning: "Sale contract drawn up and signed before a notary. For titled land the sale is then recorded at the land registry office.",
  },
  lotissement: {
    term: "Lotissement (subdivision)",
    meaning: "Division of a large piece of land into plots. An approved subdivision has a plan approved by the administration.",
  },
  procuration: {
    term: "Procuration (power of attorney)",
    meaning: "Written document allowing someone to act on your behalf. For a land purchase, prefer a notarized and limited one.",
  },
};

export function explainDocument(key) {
  const k = String(key || "").toLowerCase();
  if (GLOSSARY[k]) return GLOSSARY[k];
  const found = Object.entries(GLOSSARY).find(
    ([id, v]) => k.includes(id) || v.term.toLowerCase().includes(k)
  );
  return found ? found[1] : null;
}
