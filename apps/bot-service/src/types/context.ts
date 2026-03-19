import type { Context,SessionFlavor } from "grammy";
//这个错误来自 TypeScript 的 verbatimModuleSyntax 选项。
// 启用后，只作为类型使用的符号必须用 import type 导入，
// 而 SessionFlavor 和 Context 都只被当作类型使用，所以需要改成类型导入。

// 会话数据类型（全局复用）
export interface SessionData {
    address?: string;
    lastToken?: string;
    gasMode: "standard" | "fast"; // 交易终端Gas模式
  }
  
  // 自定义上下文类型（全局复用）
  export type MyContext = Context & SessionFlavor<SessionData>;