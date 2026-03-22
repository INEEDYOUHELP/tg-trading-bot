package main

import (
	"log"
	"net"
	"os"

	// 1. 引用你的业务 Handler
	"github.com/INEEDYOUHELP/tg-trading-bot/apps/wallet-service/internal/account"
	"github.com/INEEDYOUHELP/tg-trading-bot/apps/wallet-service/internal/repository"
	"github.com/INEEDYOUHELP/tg-trading-bot/packages/generated/go/wallet"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {
	// --- 加载阶段 ---
	// 加载 .env 文件（确保文件在 wallet-service 根目录）
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// 检查关键环境变量是否存在
	if os.Getenv("AES_MASTER_KEY") == "" {
		log.Fatal("FATAL: AES_MASTER_KEY is not set in environment")
	}

	// --- 基础设施初始化 ---
	// 初始化数据库连接
	db, err := repository.NewPostgresDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// 初始化 Repository
	repo := repository.NewWalletRepository(db)

	// --- gRPC 服务启动 ---
	// 监听端口
	port := ":50051"
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	// 创建 gRPC 服务器实例
	s := grpc.NewServer()

	// 注册业务逻辑 Handler
	// 注意：这里的 WalletServiceHandler 就是你刚才写的那个结构体
	walletHandler := &account.WalletServiceHandler{
		Repo: repo,
	}
	wallet.RegisterWalletServiceServer(s, walletHandler)

	// 开启反射服务（可选，方便使用 Postman 或 Evans 调试）
	reflection.Register(s)

	log.Printf("🚀 Wallet Service is running on %s", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}