packages/crypto-go/
├── aes/                # 基础加解密 (Vault 逻辑移到这里)
│   ├── aes.go          # 实现 AES-GCM 加密/解密函数
├── evm/                # EVM 专有逻辑
│   ├── address.go      # 地址派生、校验
│   ├── signer.go       # 交易签名逻辑
│   └── wallet.go       # 钱包生成
├── solana/             # Solana 专有逻辑
│   ├── address.go
│   ├── signer.go
│   └── wallet.go
├── factory.go          # [核心] 自动识别与工厂模式
├── go.mod
└── go.sum