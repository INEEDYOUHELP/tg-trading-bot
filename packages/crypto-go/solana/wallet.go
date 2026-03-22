package solana

import (
	"github.com/gagliardetto/solana-go"
)

type SolanaWallet struct {
	Address    string
	PrivateKey string
}

func GenerateWallet() (*SolanaWallet, error) {
	// Solana 使用 Ed25519 曲线
	account := solana.NewWallet()
	
	return &SolanaWallet{
		Address:    account.PublicKey().String(),
		PrivateKey: account.PrivateKey.String(),
	}, nil
}