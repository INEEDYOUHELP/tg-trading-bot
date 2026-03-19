import { Context } from "grammy";
import { homeMenuKeyboard } from "../keyboards/home.menu.js";

export const startCommand = async (ctx:Context) =>{    
    await ctx.reply(
        `✨ *欢迎使用 Trading Bot*\n\n` +
        `您的专业链上交易助手。支持高速买入、自动止盈止损及多钱包管理`+
        `当前地址: \`未绑定\`\n` +
        `请选择下方功能开始交易:`,
        {
          parse_mode: "MarkdownV2",
          reply_markup: homeMenuKeyboard,
        }
      );    
}

