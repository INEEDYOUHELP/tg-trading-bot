import { InlineKeyboard } from "grammy";


export function tradingMenuKeyboard(gasMode: "standard" | "fast") {
  // 转换Gas模式显示文字
  const gasModeText = gasMode === "standard" ? "标准" : "极速";
  
  return new InlineKeyboard()
    // 第一行：快速买入 | 快速卖出（双列）
    .text("🛒 快速买入 (Buy)", "trade:buy:0.1")
    .text("💰 快速卖出 (Sell)", "trade:buy:0.5")
    .row()
    // 第二行：挂单管理 | 历史成交（双列）
    .text("📜 挂单管理 (Limit Orders)", "trade:manage:order")
    .text("🕒 历史成交", "trading_history")
    .row()
    // 第三行：Gas模式（单行，可切换）
    .text(`⛽ Gas 模式: [${gasModeText}]`, "trading_switch_gas")
    .row()
    // 第四行：返回主菜单（单行）
    .text("🔙 返回主菜单", "menu:goto:home");
}