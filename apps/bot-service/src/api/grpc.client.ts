import { credentials } from "@grpc/grpc-js";
import {
  WalletServiceClient,
  type CreateAccountRequest,
  type CreateAccountResponse,
  type GetAddressRequest,
  type GetAddressResponse,
  type GetBalanceRequest,
  type GetBalanceResponse
} from "@tg-trading-bot/wallet-generated-ts";

const WALLET_GRPC_ADDR = process.env.WALLET_GRPC_ADDR ?? "localhost:50051";

const client = new WalletServiceClient(
  WALLET_GRPC_ADDR,
  credentials.createInsecure()
);

export const walletService = {
  createAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
    return new Promise((resolve, reject) => {
      client.createAccount(request, (err, resp) => {
        if (err) return reject(err);
        resolve(resp);
      });
    });
  },

  getAddress(request: GetAddressRequest): Promise<GetAddressResponse> {
    return new Promise((resolve, reject) => {
      client.getAddress(request, (err, resp) => {
        if (err) return reject(err);
        resolve(resp);
      });
    });
  },
  getBalance(request: GetBalanceRequest): Promise<GetBalanceResponse> {
    return new Promise((resolve, reject) => {
      client.getBalance(request, (err, resp) => {
        if (err) return reject(err);
        resolve(resp);
      });
    });
  },
};