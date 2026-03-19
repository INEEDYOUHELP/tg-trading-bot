import { InlineKeyboard } from "grammy";

export const homeMenuKeyboard = new InlineKeyboard()
    // 我的钱包（对应wallet-service）
    .text("💳 我的钱包", "menu:goto:wallet")
    // 交易终端（对应trading-engine）
    .text("📈 交易终端", "menu:goto:trading")
    .row()
    // 狙击 & 行情（对应sniper-service）
    .text("🎯 狙击&行情", "menu:goto:sniper")
    // 自动策略（对应strategy-service）
    .text("🤖 自动策略", "menu:goto:strategy")
    .row()
    // 个人设置（包含audit-service）
    .text("⚙️ 个人设置", "menu:goto:settings");