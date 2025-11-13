import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import { getPdfText, searchInPDF } from "./pdfProcessor.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("👋 Привет! Я бот ClinicRecSkin. Отправь PDF и я помогу с вопросами.");
});

bot.on("document", async (ctx) => {
  try {
    const fileId = ctx.message.document.file_id;
    const file = await ctx.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    globalThis.pdfText = await getPdfText(fileUrl);
    ctx.reply("✅ PDF обработан! Теперь задай вопрос.");
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Ошибка при обработке PDF.");
  }
});

bot.on("text", async (ctx) => {
  if (!globalThis.pdfText) return ctx.reply("📂 Сначала отправь PDF.");

  const result = await searchInPDF(ctx.message.text, globalThis.pdfText);
  ctx.reply(result || "🤔 Ничего не найдено.");
});

bot.launch();
console.log("🚀 ClinicRecSkin Bot запущен!");
