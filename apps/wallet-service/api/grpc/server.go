package grpc

import (
    "google.golang.org/grpc"
    "github.com/INEEDYOUHELP/tg-trading-bot/packages/generated/go/wallet"
    "github.com/INEEDYOUHELP/tg-trading-bot/apps/wallet-service/internal/account" // 引用你的 internal 代码
    "github.com/INEEDYOUHELP/tg-trading-bot/apps/wallet-service/internal/repository"
)

// RegisterServices 负责将所有的 Handler 注册到 gRPC Server 上
func RegisterServices(s *grpc.Server, repo *repository.WalletRepository) {
    // 实例化你在 internal/account 中定义的 Handler
    handler := &account.WalletServiceHandler{
        Repo: repo,
    }

    // 调用 proto 生成的注册函数
    wallet.RegisterWalletServiceServer(s, handler)
}