package account

import (
	"context"

	"github.com/INEEDYOUHELP/tg-trading-bot/packages/generated/go/wallet"
)

func (s *WalletServiceHandler) GetBalance(ctx context.Context, req *wallet.GetBalanceRequest) (*wallet.GetBalanceResponse, error) {
	// 1) 枚举 -> 字符串，便于复用仓储层查询
	var chainStr string
	switch req.Chain {
	case wallet.ChainType_EVM:
		chainStr = "EVM"
	case wallet.ChainType_SOLANA:
		chainStr = "SOLANA"
	default:
		return &wallet.GetBalanceResponse{
			HasWallet: false,
			Message:   "不支持的链类型",
		}, nil
	}

	// 2) 查数据库：是否存在该用户该链钱包
	w, err := s.Repo.FindByTGID(req.TgUserId, chainStr)
	if err != nil || w == nil {
		return &wallet.GetBalanceResponse{
			Balance:   "0",
			HasWallet: false,
			Message:   "未找到钱包，请先创建",
		}, nil
	}

	// 3) 先用占位余额跑通链路（后续替换为真实链上查询）
	_ = w.Address // 后续查链上余额会用到
	balance := "0"

	// 4) 返回结果
	return &wallet.GetBalanceResponse{
		Balance:   balance,
		HasWallet: true,
		Message:   "",
	}, nil
}