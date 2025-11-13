import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bot = new Telegraf(process.env.BOT_TOKEN);

// 📂 PDF файл теперь лежит в папке files/
const pdfPath = path.join(__dirname, "../files/clinical_recommendations.pdf");

// Содержание
const sections = [
  { title: "📘 1. Краткая информация", page: 11 },
  { title: "📖 1.5 Классификация", page: 14 },
  { title: "🧬 2. Диагностика", page: 25 },
  { title: "💊 3. Лечение локальных стадий", page: 33 },
  { title: "⚗️ 4.3 Химиотерапия", page: 52 },
  { title: "☢️ 4.4 Лучевая терапия", page: 53 },
  { title: "🏥 5. Профилактика", page: 56 },
  { title: "🩺 6. Организация помощи", page: 58 },
  { title: "📚 7. Доп. информация", page: 63 },
  { title: "✅ Критерии качества", page: 65 },
  { title: "📎 Приложения", page: 74 },
];

// Разбиение на страницы
const getPage = (page = 0) => {
  const start = page * 5;
  const end = start + 5;
  const items = sections.slice(start, end);

  const buttons = items.map((s) => [Markup.button.callback(s.title, `section_${s.page}`)]);
  const navButtons = [];
  if (page > 0) navButtons.push(Markup.button.callback("⬅️ Назад", `page_${page - 1}`));
  if (end < sections.length) navButtons.push(Markup.button.callback("➡️ Далее", `page_${page + 1}`));
  if (navButtons.length > 0) buttons.push(navButtons);

  return Markup.inlineKeyboard(buttons);
};

// Основная клавиатура
const mainKeyboard = Markup.keyboard([
  ["🆘 Справка — как искать", "📥 Скачать рекомендации"],
  ["📡 Контакты", "💬 Ваши вопросы"]
]).resize();

// /start
bot.start((ctx) => {
  ctx.reply(
    "👋 Привет! Это бот *ClinicRecSkin* — цифровой помощник по клиническим рекомендациям.\n\n" +
      "Выбери раздел из содержания ниже — бот покажет страницу и предложит скачать документ.",
    { parse_mode: "Markdown", ...mainKeyboard }
  );
  ctx.reply("📖 Содержание:", getPage(0));
});

// Навигация
bot.action(/page_(\d+)/, async (ctx) => {
  const page = Number(ctx.match[1]);
  await ctx.editMessageReplyMarkup(getPage(page).reply_markup);
});

// Раздел
bot.action(/section_(\d+)/, async (ctx) => {
  const page = ctx.match[1];
  await ctx.replyWithMarkdown(`📄 *Страница:* ${page}\n\nФайл доступен ниже 👇`);
  await ctx.replyWithDocument({ source: pdfPath, filename: "Клинические_рекомендации_БКРК_2020.pdf" });
});

// Кнопки
bot.hears("🆘 Справка — как искать", (ctx) => {
  ctx.reply("🔍 Просто выбери нужный раздел выше — бот покажет номер страницы и даст PDF-файл целиком.");
});

bot.hears("📥 Скачать рекомендации", (ctx) => {
  ctx.replyWithDocument({ source: pdfPath, filename: "Клинические_рекомендации_БКРК_2020.pdf" });
});

bot.hears("📡 Контакты", (ctx) => {
  ctx.replyWithMarkdown(
    "📞 *Контакты проекта ClinicRecSkin*\n\n" +
    "👤 Telegram: [@MSL72Rph](https://t.me/MSL72Rph)\n" +
    "✉️ Email: v.kopylov@radapharma.ru\n" +
    "💻 GitHub: [DWM — Digital World Medicine](https://github.com/rolloerro)\n\n" +
    "🤖 *Tars & Case: AI-core of Digital WM.*"
  );
});

bot.hears("💬 Ваши вопросы", (ctx) => {
  ctx.reply("🗣 Отправь сюда свой вопрос или контакт — специалисты свяжутся с тобой лично.");
});

bot.launch();
console.log("🚀 ClinicRecSkin Bot запущен!");
