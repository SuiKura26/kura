# Deployment Report: Kura Chat

**Last Updated:** 09 Juni 2026

---

## Smart Contract: KuraLogger
- **Network**: Sui Testnet
- **Package ID**: `0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064`
- **Explorer URL**: https://suiscan.xyz/testnet/object/0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064
- **Deploy Date**: 07 Juni 2026
- **Status**: ✅ Active

## Frontend: Kura Chat App
- **Platform**: Vercel
- **Branch**: `chat-apps`
- **Framework**: Next.js 16+ (App Router)
- **Status**: ✅ Deployed

## Protocol Integrations Deployed

| Protocol | SDK | Version | Status |
|----------|-----|---------|--------|
| Sui Core | `@mysten/sui` | ^2.17.0 | ✅ Active |
| Sui dApp Kit | `@mysten/dapp-kit` | ^1.0.6 | ✅ Active |
| DeepBook V3 | `@mysten/deepbook-v3` | ^1.4.1 | ✅ Active |
| Scallop | `@scallop-io/sui-scallop-sdk` | ^2.4.5 | ✅ Active |
| Cetus AMM | `@cetusprotocol/cetus-sui-clmm-sdk` | ^5.4.0 | ✅ Active |

## Supported DeFi Actions (10/10)

| # | Action | Protocol | Status |
|---|--------|----------|--------|
| 1 | Swap | DeepBook V3 | ✅ |
| 2 | Stake | Sui Native (Dynamic Validator) | ✅ |
| 3 | Unstake | Sui Native | ✅ |
| 4 | Lend | Scallop | ✅ |
| 5 | Borrow | Scallop | ✅ |
| 6 | Provide Liquidity | Cetus AMM | ✅ |
| 7 | Remove Liquidity | Cetus AMM | ✅ |
| 8 | Transfer | Sui Native | ✅ |
| 9 | Check Balance | Sui RPC | ✅ |
| 10 | Check Price | Price Oracle | ✅ |
