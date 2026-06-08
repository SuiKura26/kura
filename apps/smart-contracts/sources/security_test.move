#[test_only]
module kura::security_tests {
    use sui::test_scenario::{Self, Scenario};
    use sui::object::{Self, ID};
    use std::string::{Self, String};
    use kura::logger::{Self, GuardianReport, ExecutionLog};

    const USER_A: address = @0xA1;
    const USER_B: address = @0xB2;

    // Helper to create a dummy 32-byte digest
    fun dummy_digest(): vector<u8> {
        let mut v = vector::empty<u8>();
        let mut i = 0u64;
        while (i < 32) {
            vector::push_back(&mut v, (i as u8));
            i = i + 1;
        };
        v
    }

    #[test]
    fun test_blob_ids_stored_correctly() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let report = test_scenario::take_shared<GuardianReport>(&scenario);
            assert!(logger::get_report_intent_blob_id(&report) == &string::utf8(b"intent_blob_123"), 100);
            assert!(logger::get_report_report_blob_id(&report) == &string::utf8(b"report_blob_456"), 101);
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_confirm_by_owner_succeeds() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            assert!(!logger::get_report_confirmed(&report), 102);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            assert!(logger::get_report_confirmed(&report), 103);
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 1, location = kura::logger)]
    fun test_double_confirmation_blocked() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            // Second confirmation should abort
            logger::confirm_intent(&mut report, 1717800002000, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_empty_blob_id_accepted() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"",
            1,
            0,
            0,
            b"",
            string::utf8(b""),
            string::utf8(b""),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let report = test_scenario::take_shared<GuardianReport>(&scenario);
            assert!(logger::get_report_intent_blob_id(&report) == &string::utf8(b""), 104);
            assert!(logger::get_report_report_blob_id(&report) == &string::utf8(b""), 105);
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_events_emitted_on_confirm() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_events_emitted_on_emit_guardian_report() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );
        test_scenario::end(scenario);
    }

    #[test]
    fun test_events_emitted_on_log_execution() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            logger::log_execution(&report, dummy_digest(), 1717800001000, 1717800002000, true, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_execution_log_created_correctly() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        let report_id = {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            let rid = object::id(&report);
            logger::log_execution(&report, dummy_digest(), 1717800001000, 1717800002000, true, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
            rid
        };

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let log = test_scenario::take_shared<ExecutionLog>(&scenario);
            assert!(logger::get_log_guardian_report_id(&log) == report_id, 106);
            assert!(logger::get_log_user_address(&log) == USER_A, 107);
            assert!(logger::get_log_tx_digest(&log) == &dummy_digest(), 108);
            assert!(logger::get_log_success(&log), 109);
            test_scenario::return_shared(log);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_full_flow_correct_order() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            logger::log_execution(&report, dummy_digest(), 1717800001000, 1717800002000, true, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_guardian_report_is_shared() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let report = test_scenario::take_shared<GuardianReport>(&scenario);
            assert!(logger::get_report_user_address(&report) == USER_A, 110);
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 3, location = kura::logger)]
    fun test_invalid_risk_level_rejected() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent",
            4, // Invalid risk level (> 3)
            150,
            1000000,
            b"report",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 4, location = kura::logger)]
    fun test_invalid_tx_digest_length() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            
            // Non-32 byte digest (only 16 bytes)
            let mut invalid_digest = vector::empty<u8>();
            let mut i = 0u64;
            while (i < 16) {
                vector::push_back(&mut invalid_digest, 0);
                i = i + 1;
            };
            
            logger::log_execution(&report, invalid_digest, 1717800001000, 1717800002000, true, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 2, location = kura::logger)]
    fun test_log_execution_requires_confirmation() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let report = test_scenario::take_shared<GuardianReport>(&scenario);
            // Logging execution without confirming first should abort
            logger::log_execution(&report, dummy_digest(), 1717800001000, 1717800002000, true, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 0, location = kura::logger)]
    fun test_unauthorized_confirm_intent() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        // USER_B tries to confirm USER_A's report
        test_scenario::next_tx(&mut scenario, USER_B);
        {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = 0, location = kura::logger)]
    fun test_unauthorized_log_execution() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };

        // USER_B tries to log execution of USER_A's confirmed report
        test_scenario::next_tx(&mut scenario, USER_B);
        {
            let report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::log_execution(&report, dummy_digest(), 1717800001000, 1717800002000, true, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_valid_boundary_risk_levels() {
        let mut scenario = test_scenario::begin(USER_A);
        
        // Test risk levels 0, 1, 2, 3
        let mut r = 0;
        while (r <= 3) {
            test_scenario::next_tx(&mut scenario, USER_A);
            logger::emit_guardian_report(
                USER_A,
                b"intent",
                (r as u8),
                150,
                1000000,
                b"report",
                string::utf8(b"intent_blob_123"),
                string::utf8(b"report_blob_456"),
                1717800000000,
                test_scenario::ctx(&mut scenario)
            );
            r = r + 1;
        };

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let report = test_scenario::take_shared<GuardianReport>(&scenario);
            assert!(logger::get_report_risk_level(&report) == 3, 111);
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }

    #[test]
    fun test_valid_tx_digest_exact_32_bytes() {
        let mut scenario = test_scenario::begin(USER_A);
        
        test_scenario::next_tx(&mut scenario, USER_A);
        logger::emit_guardian_report(
            USER_A,
            b"intent_hash_value",
            1,
            150,
            1000000,
            b"report_hash_value",
            string::utf8(b"intent_blob_123"),
            string::utf8(b"report_blob_456"),
            1717800000000,
            test_scenario::ctx(&mut scenario)
        );

        test_scenario::next_tx(&mut scenario, USER_A);
        {
            let mut report = test_scenario::take_shared<GuardianReport>(&scenario);
            logger::confirm_intent(&mut report, 1717800001000, test_scenario::ctx(&mut scenario));
            logger::log_execution(&report, dummy_digest(), 1717800001000, 1717800002000, true, test_scenario::ctx(&mut scenario));
            test_scenario::return_shared(report);
        };
        test_scenario::end(scenario);
    }
}
