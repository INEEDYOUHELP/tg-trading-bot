import {
  ChainType,
  type CreateAccountRequest,
  type CreateAccountResponse,
  type GetBalanceRequest,
  type GetBalanceResponse,
} from "@tg-trading-bot/wallet-generated-ts";

import { walletService } from "../api/grpc.client.js";
import { walletMenuKeyboard } from "../keyboards/wallet.menu.js";

/**
 * 统一的链映射：把 handler 收到的字符串（EVM/SOLANA）映射成 proto 的 ChainType
 */
const chainMap: Record<string, ChainType> = {
  EVM: ChainType.EVM,
  SOLANA: ChainType.SOLANA,
};

/**
 * 从 grammy ctx 里安全取出 telegram 用户 id
 */
function getUserId(ctx: any): number | undefined {
  return ctx.from?.id;
}

/**
 * 把 chainStr 映射成 proto ChainType；失败返回 undefined
 */
function getChainType(chainStr: string): ChainType | undefined {
  return chainMap[chainStr];
}

/**
 * 未知链类型时的统一提示
 */
async function answerUnknownChain(ctx: any) {
  return ctx.answerCallbackQuery({
    text: "未知的区块链类型",
    show_alert: true,
  });
}

/**
 * 根据链名拼接显示单位（仅用于展示，不影响请求）
 */
function getBalanceSymbol(chainStr: string): string {
  return chainStr === "EVM" ? "ETH" : "SOL";
}

export async function handleCreateWallet(ctx: any, chainStr: string) {
  const userId = getUserId(ctx);
  if (!userId) return;

  const chainType = getChainType(chainStr);
  if (chainType === undefined) {
    return await answerUnknownChain(ctx);
  }

  await ctx.answerCallbackQuery("正在初始化新钱包...");

  try {
    const request: CreateAccountRequest = {
      tgUserId: userId,
      chain: chainType,
    };

    const response: CreateAccountResponse = await walletService.createAccount(request);

    if (response.success) {
      // 方案 A：纯文本，避免 MarkdownV2 解析错误
      await ctx.reply(
        `✅ ${chainStr} 钱包创建成功\n\n` +
        `您的新地址为：\n` +
        `${response.address}\n\n` +
        `请妥善保管您的资产。`
      );
    } else {
      await ctx.reply(`❌ 创建失败: ${response.message}`);
    }
  } catch (error) {
    console.error("CreateAccount Error:", error);
    await ctx.reply("💥 钱包服务暂时不可用，请稍后再试");
  }
}

/**
 * 处理查询余额的业务逻辑
 */
export async function handleCheckBalance(ctx: any, chainStr: string) {
  const userId = getUserId(ctx);
  if (!userId) return;

  const chainType = getChainType(chainStr);
  if (chainType === undefined) {
    return await answerUnknownChain(ctx);
  }

  // 交互反馈：查询链上余额可能慢，先回应
  await ctx.answerCallbackQuery("正在调取链上余额...");

  try {
    // 1) 构造 gRPC 请求
    const request: GetBalanceRequest = {
      tgUserId: userId,
      chain: chainType,
    };

    // 2) 调用 Wallet Service
    const response: GetBalanceResponse = await walletService.getBalance(request);

    // 3) 根据业务逻辑返回结果
    if (!response.hasWallet) {
      return await ctx.reply(
        "❌ 您尚未创建钱包，请先点击下方的创建按钮。",
        { reply_markup: walletMenuKeyboard }
      );
    }

    // 4) 格式化输出
    const formattedBalance = Number(response.balance).toFixed(4);
    const symbol = getBalanceSymbol(chainStr);

    const addrResp = await walletService.getAddress({ tgUserId: userId, chain: chainType });
    const address = addrResp.hasWallet ? addrResp.address : "未绑定";
    // 方案 A：纯文本，避免 MarkdownV2 解析错误
    await ctx.reply(
      `📊 ${chainStr} 资产概览\n\n` +
      `地址: ${address}\n` +
      `余额: ${response.balance} ${symbol}\n` +
      `约为: ${formattedBalance} (仅供参考)`
    );
  } catch (error) {
    console.error("GetBalance Error:", error);
    await ctx.reply("⚠️ 无法获取余额，请确认网络连接或稍后再试。");
  }
}