import { Bot } from "grammy";
import {startCommand} from "./start.js";

// 这里的函数专门用来注册所有指令
function registerCommands(bot: Bot) {
  bot.command("start", startCommand);
  // 以后直接在这里加：
  // bot.command("buy", buyCommand);
}

export default registerCommands;