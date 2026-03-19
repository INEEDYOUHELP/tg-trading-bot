import { Context } from "grammy";
import * as keyboards from "../keyboards/index.js";

//这个文件唯一的职责就是：根据目标名称，返回对应的文案和键盘。

// 定义页面配置映射
const MENU_VIEWS: Record<string, { text: string; keyboard: any }> = {
    home: {
        text: "🤖 **主菜单**\n\n欢迎使用交易机器人，请选择功能：",
        keyboard: keyboards.homeMenuKeyboard
    },
    wallet: {
        text: "💳 **钱包管理**\n\n您可以创建、导入或查看资产详情。",
        keyboard: keyboards.walletMenuKeyboard
    },
    trading: {
        text: "📈 **交易终端**\n\n输入合约地址或选择预设操作：",
        keyboard: keyboards.tradingMenuKeyboard("standard") // 默认标准模式
    },
    sniper: {
        text: "⚡ **狙击模式**\n\n监控新池子或设置开盘抢购：",
        keyboard: keyboards.sniperMenuKeyboard
    },
    strategy: {
        text: "🤖 **自动化策略**\n\n配置跟单、止盈止损等高级功能：",
        keyboard: keyboards.strategyMenuKeyboard
    },
    setting: {
        text: "⚙️ **系统设置**\n\n配置通知、安全与审计日志：",
        keyboard: keyboards.settingMenuKeyboard
    }
};

export const handleMenuNavigation = async (ctx: Context, action: string, target: string) => {
    if (action !== "goto") return;

    const view = MENU_VIEWS[target];

    if (view) {
        try {
            await ctx.editMessageText(view.text, {
                parse_mode: "MarkdownV2",
                reply_markup: view.keyboard,
            });
        } catch (e) {
            // 如果内容没变，Telegram会报错，这里忽略它
            console.error("Navigation error:", e);
        }
    } else {
        console.warn(`未找到目标页面: ${target}`);
    }
};