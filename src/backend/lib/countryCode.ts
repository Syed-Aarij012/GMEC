const COUNTRY_CODES: Record<string, string> = {
  "united kingdom": "GBR",
  uk: "GBR",
  "great britain": "GBR",
  england: "GBR",
  scotland: "GBR",
  wales: "GBR",
  "northern ireland": "GBR",
  ireland: "IRL",
  "united states": "USA",
  usa: "USA",
  france: "FRA",
  germany: "DEU",
  spain: "ESP",
};

// This shop only trades in the UK today, so an unrecognised value safely defaults
// to GBR rather than failing a Royal Mail shipment over a free-text mismatch.
export function toIsoAlpha3(countryName: string): string {
  return COUNTRY_CODES[countryName.trim().toLowerCase()] ?? "GBR";
}
