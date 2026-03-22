@echo off
:: 解决中文乱码（可选）
chcp 65001 > nul  
:: 设置路径
set PROTO_DIR=./packages/proto
set GO_OUT_DIR=./packages/generated/go
set TS_OUT_DIR=./packages/generated/ts
:: 新增：指定 wallet 子目录（和 go_package 最后一级对应）
set GO_WALLET_DIR=%GO_OUT_DIR%/wallet

:: 确保目录存在（包含 wallet 子目录）
if not exist %GO_OUT_DIR% mkdir %GO_OUT_DIR%
if not exist %GO_WALLET_DIR% mkdir %GO_WALLET_DIR%  :: 新增：创建 wallet 子目录
if not exist %TS_OUT_DIR% mkdir %TS_OUT_DIR%

echo  Generating Go code...
protoc --proto_path=%PROTO_DIR% ^
       --go_out=%GO_OUT_DIR% --go_opt=module=github.com/INEEDYOUHELP/tg-trading-bot/packages/generated/go ^
       --go-grpc_out=%GO_OUT_DIR% --go-grpc_opt=module=github.com/INEEDYOUHELP/tg-trading-bot/packages/generated/go ^
       %PROTO_DIR%/wallet.proto

echo  Generating TypeScript code...
:: 注意：这里指向你刚刚在 bot-service 安装的 ts-proto 路径
protoc --proto_path=%PROTO_DIR% ^
       --plugin=protoc-gen-ts_proto=.\apps\bot-service\node_modules\.bin\protoc-gen-ts_proto.cmd ^
       --ts_proto_out=%TS_OUT_DIR% ^
       --ts_proto_opt=outputServices=grpc-js,esModuleInterop=true ^
       %PROTO_DIR%/wallet.proto

echo  Done!