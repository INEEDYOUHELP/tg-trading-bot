import { InlineKeyboard } from "grammy";

export const strategyMenuKeyboard = new InlineKeyboard()
    // 第一行：跟单交易
    .text("👥 跟单交易 (CopyTrade)", "strat:copy:list")
    .row()
    // 第二行：自动止盈止损
    .text("📊 自动止盈止损 (SL/TP)", "strat:sltp:manage")
    .row()
    // 第三行：定时投机
    .text("⏲️ 定时投机", "strat:time:task")
    .row()
    // 第四行：返回主菜单
    .text("🔙 返回主菜单", "menu:goto:home");
