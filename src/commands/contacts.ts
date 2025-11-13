import { Context } from "telegraf";

export function showContacts(ctx: Context) {
  ctx.reply(
    "📞 Контакты проекта FDT:\n" +
      "🌐 https://fdt.digital\n" +
      "✉️ support@fdt.digital\n" +
      "📍 Россия, Москва"
  );
}
