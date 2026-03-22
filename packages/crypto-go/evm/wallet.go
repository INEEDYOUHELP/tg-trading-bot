package evm

import (
	"crypto/ecdsa"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

type EVMWallet struct {
	Address    string
	PrivateKey string
}

func GenerateWallet() (*EVMWallet, error) {
	privateKey, err := crypto.GenerateKey()
	if err != nil {
		return nil, err
	}
	
	privateKeyBytes := crypto.FromECDSA(privateKey)
	address := crypto.PubkeyToAddress(privateKey.PublicKey).Hex()

	return &EVMWallet{
		Address:    address,
		PrivateKey: hexutil.Encode(privateKeyBytes),
	}, nil
}