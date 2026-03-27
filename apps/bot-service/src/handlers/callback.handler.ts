import { Context } from "grammy";

import { handleMenuNavigation } from "./menu.router.js";
import { handleCreateWallet, handleCheckBalance } from "./wallet.handler.js";


export const callbackHandler = async (ctx: Context) => {
    // 1. 获取并确保是字符串
    const data = ctx.callbackQuery?.data ?? "";


    // 2. 基础检查
    if (!data || data === "") {
        return await ctx.answerCallbackQuery().catch(() => { });
    }



    // 2. 解析命名空间 (例如 menu:goto:wallet)
    const [namespace, action, payload] = data.split(":");
    // 目前专门处理第四个参数 (例如 // parts: ["wallet", "action", "create", "EVM"])
    const parts = data.split(":");

    // 3. 根据命名空间分发
    switch (namespace) {
        case "menu":
            // 专门处理界面跳转
            await handleMenuNavigation(ctx, action || "", payload || "");
            break;

        case "wallet":
            const op = parts[2];       // create / import / withdraw / refresh ...
            const arg = parts[3];      // create 时 arg 才是链名（EVM/SOLANA）
            if (parts[1] === "action" && op === "create") {
                await handleCreateWallet(ctx, arg ?? "");
            } else if (parts[1] === "action" && op === "check_balance") {
                await handleCheckBalance(ctx, arg ?? "");
            }


            // 专门处理钱包业务逻辑 (调用 wallet-service)
            // await handleWalletActions(ctx, action, payload);
            break;

        case "trade":
            // 专门处理交易逻辑 (调用 trading-engine)
            // await handleTradeActions(ctx, action, payload);
            break;

        case "sinper":
            break;

        case "strategy":
            break;



        default:
            // 兼容你旧的硬编码格式 (临时)
            if (data.startsWith("goto_")) {
                await handleMenuNavigation(ctx, "goto", data.replace("goto_", ""));
            }
            break;
    }


}