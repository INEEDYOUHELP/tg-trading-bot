import { InlineKeyboard } from "grammy";

export const settingMenuKeyboard = new InlineKeyboard()
    // 第一行：操作日志（audit-service核心）
    .text("📜 查看操作日志", "set:audit:logs")
    .text("🔧 日志设置", "set:audit:config")
    .row()
    // 第二行：安全设置
    .text("🔐 安全验证", "set:security:2fa")
    .text("📢 通知设置", "set:notify:toggle")
    .row()
    // 第三行：账户管理
    .text("👤 账户信息", "set:profile:view")
    .text("🚪 退出登录", "set:auth:logout")
    .row()
    // 第四行：返回主菜单
    .text("🔙 返回主菜单", "menu:goto:home");
