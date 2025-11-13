import { Context } from "telegraf";

export function handleFeedback(ctx: Context) {
  ctx.reply("💬 Напиши сюда свой вопрос или контакт — мы свяжемся с тобой.");
}
