import { Bot, session } from "grammy";
import { HttpsProxyAgent } from "https-proxy-agent";
import dotenv from "dotenv";
import registerCommands from "./commands/index.js";
import { callbackHandler } from "./handlers/callback.handler.js";

//加载环境变量
dotenv.config()

const token = process.env.BOT_TOKEN;
const proxy = process.env.HTTP_PROXY;

//检查变量
if(!token){
    throw new Error("BOT_TOKEN is not defined in .env file");
}

// 创建 Bot 实例
export const bot = new Bot(token, {
    client: {
        baseFetchConfig: {
            // 如果环境变量里有代理则使用，没有则为 undefined
            agent: proxy ? new HttpsProxyAgent(proxy) : undefined,
        },
    },
});

bot.on("callback_query:data", async (ctx) => {
    console.log("🚀 接收到点击事件:", ctx.callbackQuery.data); // 这里的 Log 必须能看到
    await callbackHandler(ctx);
});

// 1. 挂载中间件 (如 sessions, logger)
// bot.use(session());

// 2. 注册指令
registerCommands(bot);

// 3. 错误处理
bot.catch((err) => {
  console.error(`[Bot Error]: ${err.message}`);
});

