import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import fetch from "node-fetch";

export async function getPdfText(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const data = await pdfParse(Buffer.from(buffer));
  return data.text;
}

export async function searchInPDF(query, pdfText) {
  const regex = new RegExp(query, "gi");
  const matches = pdfText.match(regex);
  if (!matches) return "🤔 Ничего не найдено.";
  return `🔍 Найдено ${matches.length} совпадений для "${query}".`;
}
