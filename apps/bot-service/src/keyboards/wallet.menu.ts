import { InlineKeyboard } from "grammy";

export const walletMenuKeyboard = new InlineKeyboard()
    .text("创建🔹 EVM (ETH/BSC/Base)钱包", "wallet:action:create:EVM")
    .text("创建🔸 Solana钱包", "wallet:action:create:SOLANA")
    .row()
    .text("💰 查询 EVM 余额", "wallet:action:check_balance:EVM")
    .text("💰 查询 Solana 余额", "wallet:action:check_balance:SOLANA")
    .row()
    .text("📥 导入私钥", "wallet:action:import")
    .text("📤 资金提取", "wallet:action:withdraw")
    .row()
    .text("🔙 返回主菜单", "menu:goto:home");


    
    