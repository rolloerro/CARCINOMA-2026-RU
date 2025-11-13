import { Context } from "telegraf";

export function showDownload(ctx: Context) {
  ctx.replyWithDocument({
    source: "/Users/vladimirkopylov/Desktop/003.Клинические рекомендации БКРК 2020.pdf",
    filename: "Basal_Cell_Cancer_Guidelines_2020.pdf",
  });
}
