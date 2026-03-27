# TG 交易机器人 — 项目文档

> 本文档基于项目架构蓝图与当前代码库，用于说明架构、实施顺序与**当前实现进度**。内容自《开发文档》同步并随仓库更新。

---

## 一、项目概述

本项目是一个基于 Telegram 的区块链交易机器人系统，采用 **Monorepo + 微服务** 架构，面向 DEX（去中心化交易所）链上交易场景。用户通过 Telegram Bot 交互，完成钱包导入、行情查询、下单交易及自动化策略管理。

**技术栈概览：**

| 层级 | 技术 | 用途 |
|------|------|------|
| 前端交互 | Node.js + Grammy + TypeScript | Telegram Bot 对话与菜单 |
| 核心引擎 | Go | 高并发交易执行、钱包签名、行情聚合 |
| 管理后台 | Next.js | 运营与风控管理 |
| 基础设施 | Docker、K8s、Redis、PostgreSQL | 部署与数据持久化 |

---

## 二、目录结构与文件作用分析

### 2.1 根目录文件

| 文件/目录 | 当前状态 | 作用 |
|-----------|----------|------|
| `README.md` | **本文件** | 项目主文档：架构、进度、开发阶段 |
| `开发文档.md` | 已存在 | 可与本 README 对齐保留，或以后以 README 为准单一维护 |
| `go.work` | 已配置 | Go Workspace：`wallet-service`、`packages/crypto-go`、`packages/generated` |
| `pnpm-workspace.yaml` | 未在根目录 | Monorepo 工作区（规划中） |
| `turbo.json` | 未配置 | Turborepo 构建与缓存（规划中） |
| 根目录 `.env.example` | 暂无 | 全仓库环境变量模板（规划中）；`apps/bot-service/.env.example` 已存在 |
| `.gitignore` | 已存在 | Git 忽略规则 |

### 2.2 `apps/` — 应用服务

| 服务 | 当前状态 | 作用 |
|------|----------|------|
| **bot-service** | **已扩展** | Telegram 交互：菜单/键盘、回调路由、`/start` 等；已接入 **wallet** 的 gRPC 客户端骨架 |
| **wallet-service** | **已创建（进行中）** | Go 服务：PostgreSQL 连接、账户创建、gRPC 服务（`packages/proto/wallet.proto` 对应实现） |
| **trading-engine** | 未创建 | 交易执行引擎：订单、DEX 交互、Gas、风控 |
| **market-service** | 未创建 | 行情聚合、池子监听、代币分析 |
| **strategy-service** | 未创建 | 跟单、限价单、狙击、止盈止损 |
| **audit-service** | 未创建 | 审计与合规日志 |

**bot-service 当前实现（摘要）：**

- `src/bot.ts` / `src/index.ts`：Grammy 启动与路由
- `src/keyboards/`：首页、钱包、交易、策略等菜单
- `src/handlers/`：菜单与回调分发（如 `menu.router.ts`、`callback.handler.ts`）
- `src/api/grpc.client.ts`：gRPC 客户端（对接 wallet 等）
- `src/commands/`：`/start` 等

**wallet-service 当前实现（摘要）：**

- `cmd/main.go`：服务入口
- `api/grpc/`：gRPC 服务端
- `internal/account/`：账户创建等
- `internal/repository/`：PostgreSQL（`sqlx`）、钱包相关持久化

### 2.3 `packages/` — 共享包与协议

| 包 | 当前状态 | 作用 |
|-----|----------|------|
| `proto/` | **wallet.proto 已存在** | 其余 `trading` / `market` / `strategy` 等 proto 待补充 |
| `generated/go/`、`generated/ts/` | **wallet 存根已生成** | 由 proto 生成的 Go / TS 代码 |
| `crypto-go/` | **已创建** | EVM / Solana 钱包相关能力、AES、`factory` 等 |
| `common-ts/`、`common-go/`、`bus-schema/` | 未创建 | 通用库与消息格式（规划中） |

### 2.4 `infra/` — 基础设施

| 目录/文件 | 当前状态 | 作用 |
|-----------|----------|------|
| `docker/`、`k8s/`、`migrations/` 等 | **尚未落地** | Docker Compose、K8s、SQL 迁移脚本（规划中） |

### 2.5 `docs/` — 文档

| 文件 | 当前状态 | 作用 |
|------|----------|------|
| `目录结构.md` | 已存在 | 目录树说明 |
| `database-design.md`、`api-specs.md` | 待编写 | 库表设计与接口规范 |

### 2.6 `frontend/` — 管理后台

| 用途 | 技术 |
|------|------|
| 运营与风控 | Next.js（规划中） |

更完整的**目标**目录树可参考仓库内 `docs/目录结构.md` 或下列架构图。

---

## 三、架构与数据流

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Telegram User  │────▶│   bot-service    │────▶│ wallet-service  │
│                 │     │   (Grammy/TS)    │     │  (Go, gRPC)     │
└─────────────────┘     └────────┬─────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
           ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐
           │trading-engine│ │market-service│ │strategy-service │
           │ (Go, 订单)   │ │ (行情聚合)   │ │ (跟单/SLTP)     │
           └──────────────┘ └──────────────┘ └─────────────────┘
                    │            │            │
                    └────────────┼────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │  Redis / PostgreSQL      │
                    │  (缓存、Session、订单)   │
                    └──────────────────────────┘
```

- **bot-service**：用户入口，解析命令与回调，通过 gRPC/HTTP 调用后端（wallet 已对接中）。
- **wallet-service**：私钥安全存储、余额、签名（持续完善中）。
- **trading-engine / market-service / strategy-service**：规划中。

---

## 四、当前实现进度

| 模块 | 进度 | 说明 |
|------|------|------|
| 架构与文档 | ✅ | README 与架构说明已对齐当前仓库 |
| bot-service | 🔄 | 菜单、回调、gRPC 客户端骨架已具备，业务与后端联动待完善 |
| wallet-service | 🔄 | 工程已建立，PostgreSQL、gRPC、账户流已在开发；需完成库表迁移与联调 |
| `wallet.proto` + 生成代码 | ✅ | wallet 方向 proto 与 Go/TS 存根已存在 |
| `crypto-go` | ✅ | 共享加密与链上钱包工具包已加入 Workspace |
| Go Workspace (`go.work`) | ✅ | 多模块本地协作已配置 |
| 其余 proto、trading/market 等 | ❌ | 待定义 |
| 数据库迁移与表结构 | ❌ | `infra/migrations` 等尚未提交 |
| trading-engine 等 Go 服务 | ❌ | 未创建 |
| Docker / K8s / 根目录 Monorepo 配置 | ❌ | 未配置 |
| 管理后台 frontend | ❌ | 未创建 |

---

## 五、开发流程与阶段划分

### 阶段 0：环境与 Monorepo 搭建

1. 根目录 **pnpm-workspace** / **turbo**（若仍采用 Node 多包管理）
2. 根目录 **`.env.example`** 聚合各服务变量
3. 与现有 **`go.work`** 并存，明确 Node 与 Go 的边界

### 阶段 1：协议与数据层

1. 补全 **proto**（trading、market、strategy 等）并生成 **Go / TS**
2. **数据库设计**与 **迁移脚本**（用户、钱包、订单、审计等）
3. **bus-schema**（Redis 等消息格式）

### 阶段 2：核心后端服务（按依赖顺序）

1. **wallet-service**（进行中）：vault、签名、余额；开发期 mock，生产 KMS
2. **market-service** → **trading-engine** → **strategy-service** → **audit-service**

### 阶段 3：Bot 服务完善

命令全集、多步对话、Session（Redis）、事件监听等（见原开发文档细项）。

### 阶段 4：基础设施与部署

Docker Compose、Webhook 反向代理、可选 K8s。

### 阶段 5：管理后台与扩展

Next.js 后台、监控告警等。

---

## 六、开发优先级建议

| 优先级 | 任务 | 备注 |
|--------|------|------|
| P0 | 数据库迁移 + `wallet-service` 与 PostgreSQL 联调 | 与当前进度直接相关 |
| P0 | 补全 proto 与生成代码 | 除 wallet 外仍缺 |
| P0 | bot-service 与 wallet gRPC 端到端验证 | 余额/创建账户等 |
| P1 | market-service、trading-engine 最小闭环 | |
| P2 | strategy、audit、Docker | |

---

## 七、安全与风控要点

- **私钥**：仅以密文存储，KMS 或强 AES；生产禁用不安全的 mock
- **签名**：即用即焚，避免明文私钥落盘
- **风控**：滑点、黑名单、限额、夹子检测等
- **审计**：敏感操作与资金流水可追溯

---

## 八、下一步行动清单

1. [ ] 根目录 `pnpm-workspace.yaml` / `turbo.json`（若需要）
2. [ ] 根目录 `.env.example` 与各服务变量说明
3. [ ] 补全 `packages/proto`（trading、market、strategy 等）并重新生成代码
4. [ ] 编写 `docs/database-design.md` 与 `infra/migrations` 下 SQL
5. [x] `wallet-service` 工程骨架与 gRPC（**已起步，需持续完成表结构与联调**）
6. [ ] bot-service 与 wallet-service 端到端联调（创建账户 / 查询等）
7. [ ] market-service、trading-engine 逐步实现

---

*文档版本：v1.1 | 同步自《开发文档》v1.0 | 最后更新：2026-03-22*
