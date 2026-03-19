export interface walletInfo{
    address:string;
    balance:string;
    symbol:string;
}


//模拟 Wallet Service 接口
export const WalletApi = {
    async getBalance(userId:number) : Promise<walletInfo>{
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 500));
            return {
                address: "0x71C...3a5E",
                balance: "1.527",
                symbol: "SOL"
            };
    }
}

//模拟 Trading Engine 接口
export const tradeApi = {
    async buyToken (userId:number,amount:number,tokenAddress:string){
        console.log(`[Mock] Buying ${amount} of ${tokenAddress} for user ${userId}`);
        return { txHash: "0xabcdef123456789...", status: "pending" };
    }
}