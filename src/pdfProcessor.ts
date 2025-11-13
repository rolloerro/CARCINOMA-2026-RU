import * as fs from "fs";
import * as pdfParse from "pdf-parse";

/**
 * Считывает текст из PDF-файла
 */
export async function getPdfText(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

/**
 * Находит страницу по ключевому слову (условно)
 */
export async function searchInPDF(keyword: string): Promise<number> {
  const text = await getPdfText("./003.Клинические рекомендации БКРК 2020.pdf");
  const index = text.indexOf(keyword);
  if (index === -1) return -1;
  // Примерная логика страницы (каждые 2000 символов = 1 страница)
  return Math.floor(index / 2000) + 1;
}
