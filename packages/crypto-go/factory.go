package crypto

import (
	"errors"
	"github.com/INEEDYOUHELP/tg-trading-bot/packages/crypto-go/evm"
    "github.com/INEEDYOUHELP/tg-trading-bot/packages/crypto-go/solana"
)

type GeneratedWallet struct {
	Address    string
	PrivateKey string
}

// CreateWallet 根据链类型路由到不同的生成逻辑
func CreateWallet(chainType string) (*GeneratedWallet, error) {
	switch chainType {
	case "EVM":
		w, err := evm.GenerateWallet()
		if err != nil {
			return nil, err
		}
		return &GeneratedWallet{Address: w.Address, PrivateKey: w.PrivateKey}, nil
	case "SOLANA":
		w, err := solana.GenerateWallet()
		if err != nil {
			return nil, err
		}
		return &GeneratedWallet{Address: w.Address, PrivateKey: w.PrivateKey}, nil
	default:
		return nil, errors.New("unsupported chain type")
	}
}