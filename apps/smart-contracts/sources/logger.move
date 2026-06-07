module kura::logger {
    use std::string::String;
    use std::vector;
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::transfer;

    const ENotAuthorized: u64 = 0;
    const EAlreadyConfirmed: u64 = 1;
    const EReportNotConfirmed: u64 = 2;
    const EInvalidRiskLevel: u64 = 3;
    const EInvalidDigestLength: u64 = 4;

    // --- Struct: GuardianReport ---
    public struct GuardianReport has key, store {
        id: UID,
        user_address: address,
        intent_hash: vector<u8>,
        risk_level: u8,
        slippage_bps: u64,
        pool_liq_usd: u64,
        report_hash: vector<u8>,
        intent_blob_id: String,
        report_blob_id: String,
        timestamp_ms: u64,
        confirmed: bool,
    }

    // --- Struct: ExecutionLog ---
    public struct ExecutionLog has key, store {
        id: UID,
        guardian_report_id: ID,
        user_address: address,
        tx_digest: vector<u8>,
        confirmed_at_ms: u64,
        executed_at_ms: u64,
        success: bool,
    }

    // --- Events ---
    public struct GuardianReportCreatedEvent has copy, drop {
        report_id: ID,
        user_address: address,
        risk_level: u8,
        timestamp_ms: u64,
    }

    public struct UserConfirmedEvent has copy, drop {
        report_id: ID,
        user_address: address,
        timestamp_ms: u64,
    }

    public struct TransactionExecutedEvent has copy, drop {
        log_id: ID,
        tx_digest: vector<u8>,
        success: bool,
        timestamp_ms: u64,
    }

    /// Emit a new GuardianReport on-chain
    public fun emit_guardian_report(
        user_address: address,
        intent_hash: vector<u8>,
        risk_level: u8,
        slippage_bps: u64,
        pool_liq_usd: u64,
        report_hash: vector<u8>,
        intent_blob_id: String,
        report_blob_id: String,
        timestamp_ms: u64,
        ctx: &mut TxContext
    ) {
        assert!(risk_level <= 3, EInvalidRiskLevel);

        let report = GuardianReport {
            id: object::new(ctx),
            user_address,
            intent_hash,
            risk_level,
            slippage_bps,
            pool_liq_usd,
            report_hash,
            intent_blob_id,
            report_blob_id,
            timestamp_ms,
            confirmed: false,
        };

        event::emit(GuardianReportCreatedEvent {
            report_id: object::uid_to_inner(&report.id),
            user_address,
            risk_level,
            timestamp_ms,
        });

        transfer::public_share_object(report);
    }

    /// Mark a GuardianReport as confirmed
    public fun confirm_intent(
        report: &mut GuardianReport,
        timestamp_ms: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == report.user_address, ENotAuthorized);
        assert!(!report.confirmed, EAlreadyConfirmed);

        report.confirmed = true;

        event::emit(UserConfirmedEvent {
            report_id: object::uid_to_inner(&report.id),
            user_address: report.user_address,
            timestamp_ms,
        });
    }

    /// Log the final execution of a transaction
    public fun log_execution(
        report: &GuardianReport,
        tx_digest: vector<u8>,
        confirmed_at_ms: u64,
        executed_at_ms: u64,
        success: bool,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == report.user_address, ENotAuthorized);
        assert!(report.confirmed, EReportNotConfirmed);
        assert!(vector::length(&tx_digest) == 32, EInvalidDigestLength);

        let log = ExecutionLog {
            id: object::new(ctx),
            guardian_report_id: object::uid_to_inner(&report.id),
            user_address: report.user_address,
            tx_digest: tx_digest,
            confirmed_at_ms,
            executed_at_ms,
            success,
        };

        event::emit(TransactionExecutedEvent {
            log_id: object::uid_to_inner(&log.id),
            tx_digest,
            success,
            timestamp_ms: executed_at_ms,
        });

        transfer::public_share_object(log);
    }
}
