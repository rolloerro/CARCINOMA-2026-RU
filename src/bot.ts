import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import { getPdfText, searchInPDF } from "./pdfProcessor";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Команда /start
bot.start((ctx) => {
  ctx.reply(
    "👋 Привет! Я бот *ClinicRecSkin Bot*.\nОтвечаю на вопросы по клиническим рекомендациям для базальноклеточного рака кожи.",
    { parse_mode: "Markdown" }
  );
});

// Команда /help
bot.help((ctx) => {
  ctx.reply("📄 Отправь мне PDF-документ, и я помогу найти нужный раздел.");
});

// Обработка PDF-документа
bot.on("document", async (ctx) => {
  try {
    const fileId = ctx.message.document.file_id;
    const file = await ctx.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    const text = await getPdfText(fileUrl);

    globalThis.pdfText = text;
    ctx.reply("✅ Файл обработан. Теперь можешь задать вопрос по содержимому.");
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Не удалось обработать PDF. Попробуй другой файл.");
  }
});

// Поиск по PDF
bot.on("text", async (ctx) => {
  const query = ctx.message.text;
  if (!globalThis.pdfText) {
    return ctx.reply("📂 Сначала отправь PDF для анализа.");
  }

  const result = await searchInPDF(query, globalThis.pdfText);
  ctx.reply(result || "🤔 Ничего не найдено.");
});

bot.launch();
console.log("🚀 ClinicRecSkin Bot запущен!");
