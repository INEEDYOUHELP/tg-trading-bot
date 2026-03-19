import { InlineKeyboard } from "grammy";

export const walletMenuKeyboard = new InlineKeyboard()
    .text("➕ 创建新钱包", "wallet:action:create")
    .text("📥 导入私钥", "wallet:action:import")
    .row()
    .text("🔄 刷新余额", "wallet:action:refresh")
    .text("📤 资金提取", "wallet:action:withdraw")
    .row()
    .text("🔙 返回主菜单", "menu:goto:home");