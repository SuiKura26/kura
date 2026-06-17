# KuraLogger Smart Contract

> 📜 On-chain audit trail for Kura's Guardian AI risk analysis system

## Overview

KuraLogger is a Sui Move smart contract that provides an **immutable audit trail** for every DeFi transaction processed through Kura. It records Guardian AI risk reports, user confirmations, and transaction execution results on-chain.

## Deployment

| Network | Package ID | Status |
|---------|-----------|--------|
| **Mainnet** | `0xff9158af19df647bd9f6ab7a6b239d97465dfcfe2341ac2f6a87fff0861c1a20` | ✅ Live |
| Testnet | `0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064` | ✅ Live |

**Explorer**: [SuiScan Mainnet](https://suiscan.xyz/mainnet/object/0xff9158af19df647bd9f6ab7a6b239d97465dfcfe2341ac2f6a87fff0861c1a20)

## Module: `kura::logger`

### Structs

| Struct | Type | Description |
|--------|------|-------------|
| `GuardianReport` | Shared Object | Stores risk analysis data: intent hash, risk level, slippage, pool liquidity, Walrus blob references |
| `ExecutionLog` | Shared Object | Links a confirmed report to its final transaction digest and execution result |

### Entry Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `emit_guardian_report()` | user_address, intent_hash, risk_level (0-3), slippage_bps, pool_liq_usd, report_hash, intent_blob_id, report_blob_id, timestamp_ms | Creates a new `GuardianReport` shared object with risk analysis data |
| `confirm_intent()` | report (mut), timestamp_ms | Marks a `GuardianReport` as confirmed by the original user (access-controlled) |
| `log_execution()` | report (ref), tx_digest (32 bytes), confirmed_at_ms, executed_at_ms, success | Creates an `ExecutionLog` linking to the confirmed report (requires prior confirmation) |

### Events

| Event | Emitted When |
|-------|-------------|
| `GuardianReportCreatedEvent` | A new risk report is created |
| `UserConfirmedEvent` | User explicitly confirms a transaction |
| `TransactionExecutedEvent` | Transaction execution is logged |

### Error Codes

| Code | Constant | Meaning |
|------|----------|---------|
| 0 | `ENotAuthorized` | Caller is not the report owner |
| 1 | `EAlreadyConfirmed` | Report was already confirmed |
| 2 | `EReportNotConfirmed` | Cannot log execution for unconfirmed report |
| 3 | `EInvalidRiskLevel` | Risk level must be 0-3 |
| 4 | `EInvalidDigestLength` | Transaction digest must be 32 bytes |

### Data Flow

```
User Intent  ──→  GuardianReport (shared object)
                          │
                    User Confirms (access-controlled)
                          │
                          ▼
                   ExecutionLog (shared object, linked to report)
```

## Security

- **Access Control**: `confirm_intent()` and `log_execution()` verify `tx_context::sender() == report.user_address`
- **State Machine**: Reports must be confirmed before execution can be logged
- **Input Validation**: Risk level capped at 0-3, tx digest must be exactly 32 bytes
- **Immutability**: Objects are shared (not owned), providing transparent public audit trail

## Testing

The contract includes a comprehensive security test suite (`sources/security_test.move`) with **17 test cases** covering:

- Access control enforcement
- State integrity (confirm → execute flow)
- Input validation (risk levels, digest length)
- Object ownership verification
- Event emission correctness
- Walrus blob ID integrity

All 17/17 tests pass.

## Build & Deploy

```bash
# Build
sui move build

# Test
sui move test

# Publish (mainnet)
sui client publish --gas-budget 100000000
```

## License

[MIT](../../LICENSE)
