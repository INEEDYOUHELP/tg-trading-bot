package account

import (
    "context"
    //"fmt"
    "os"   
    "github.com/INEEDYOUHELP/tg-trading-bot/packages/crypto-go"      // 你的工厂模式库
    "github.com/INEEDYOUHELP/tg-trading-bot/packages/crypto-go/aes"  // 你的加密库
    "github.com/INEEDYOUHELP/tg-trading-bot/apps/wallet-service/internal/repository" // 你的 DB 库
    "github.com/INEEDYOUHELP/tg-trading-bot/packages/generated/go/wallet" // Proto 生成的代码
)

type WalletServiceHandler struct {
    wallet.UnimplementedWalletServiceServer
    Repo *repository.WalletRepository
}

func (s *WalletServiceHandler) CreateAccount(ctx context.Context, req *wallet.CreateAccountRequest) (*wallet.CreateAccountResponse, error) {
    // 1. 转换请求中的链类型 (Enum -> String)
    var chainStr string
    if req.Chain == wallet.ChainType_EVM {
        chainStr = "EVM"
    } else if req.Chain == wallet.ChainType_SOLANA {
        chainStr = "SOLANA"
    } else {
        return &wallet.CreateAccountResponse{Success: false, Message: "不支持的链类型"}, nil
    }

    // 2. 调用 crypto-go 工厂生成明文钱包
    newWallet, err := crypto.CreateWallet(chainStr)
    if err != nil {
        return &wallet.CreateAccountResponse{Success: false, Message: "生成失败: " + err.Error()}, nil
    }

    // 3. 使用 AES 加密私钥 (Key 从环境变量拿)
    masterKey := []byte(os.Getenv("AES_MASTER_KEY")) 
    encryptedPriv, err := aes.Encrypt([]byte(newWallet.PrivateKey), masterKey)
    if err != nil {
        return &wallet.CreateAccountResponse{Success: false, Message: "加密失败"}, nil
    }

    // 4. 持久化到数据库
    err = s.Repo.Save(&repository.WalletModel{
        TGUserID:            req.TgUserId,
        Chain:               chainStr,
        Address:             newWallet.Address,
        EncryptedPrivateKey: encryptedPriv,
    })
    if err != nil {
        return &wallet.CreateAccountResponse{Success: false, Message: "入库失败"}, nil
    }

    // 5. 返回成功信息
    return &wallet.CreateAccountResponse{
        Address: newWallet.Address,
        Success: true,
    }, nil
}

// GetAddress
// GetAddress
func (s *WalletServiceHandler) GetAddress(ctx context.Context, req *wallet.GetAddressRequest) (*wallet.GetAddressResponse, error) {
    // 1) 枚举 -> 字符串（与 GetBalance 保持一致）
    var chainStr string
    if req.Chain == wallet.ChainType_EVM {
        chainStr = "EVM"
    } else if req.Chain == wallet.ChainType_SOLANA {
        chainStr = "SOLANA"
    } else {
        return &wallet.GetAddressResponse{
            Address:   "",
            HasWallet: false,
        }, nil
    }

    // 2) 按 tg_user_id + chain 查数据库
    w, err := s.Repo.FindByTGID(req.TgUserId, chainStr)
    if err != nil || w == nil {
        return &wallet.GetAddressResponse{
            Address:   "",
            HasWallet: false,
        }, nil
    }

    // 3) 返回地址
    return &wallet.GetAddressResponse{
        Address:   w.Address,
        HasWallet: true,
    }, nil
}