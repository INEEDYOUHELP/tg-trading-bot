import { InlineKeyboard } from "grammy";

export const sniperMenuKeyboard = new InlineKeyboard()
    // 第一行：搜索代币
    .text("🔍 搜索代币 (输入合约地址)", "sniper:search:init")
    .row()
    // 第二行：安全检测
    .text("🛡️ 安全检测 (Honeypot/Tax 检查)", "sniper:check:security")
    .row()
    // 第三行：开盘狙击
    .text("⚡ 开盘狙击 (Sniper) (设置抢购参数)", "sniper:snipe:config")
    .row()
    // 第四行：返回主菜单
    .text("🔙 返回主菜单", "menu:goto:home");
