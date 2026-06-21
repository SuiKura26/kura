#[allow(lint(self_transfer))]
module kura_faucet::faucet {
    use sui::table::{Self, Table};
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, TreasuryCap};
    use sui::event;
    use kura_faucet::mock_usdc::MOCK_USDC;

    const E_COOLDOWN_ACTIVE: u64 = 1;

    const COOLDOWN_MS: u64 = 86_400_000;

    const USDC_AMOUNT: u64 = 1_000_000_000;

    public struct Faucet has key {
        id: UID,
        usdc_cap: TreasuryCap<MOCK_USDC>,
        last_claims: Table<address, u64>,
    }

    public struct Claimed has copy, drop {
        claimant: address,
        amount: u64,
        timestamp_ms: u64,
    }

    public fun init_faucet(usdc_cap: TreasuryCap<MOCK_USDC>, ctx: &mut TxContext) {
        let faucet = Faucet {
            id: object::new(ctx),
            usdc_cap,
            last_claims: table::new(ctx),
        };
        transfer::share_object(faucet);
    }

    public fun claim_test_usdc(
        faucet: &mut Faucet,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let sender = ctx.sender();
        let now = clock::timestamp_ms(clock);

        if (table::contains(&faucet.last_claims, sender)) {
            let last = *table::borrow(&faucet.last_claims, sender);
            assert!(now >= last + COOLDOWN_MS, E_COOLDOWN_ACTIVE);
        };

        if (table::contains(&faucet.last_claims, sender)) {
            *table::borrow_mut(&mut faucet.last_claims, sender) = now;
        } else {
            table::add(&mut faucet.last_claims, sender, now);
        };

        let coin = coin::mint(&mut faucet.usdc_cap, USDC_AMOUNT, ctx);
        transfer::public_transfer(coin, sender);

        event::emit(Claimed {
            claimant: sender,
            amount: USDC_AMOUNT,
            timestamp_ms: now,
        });
    }

    public fun cooldown_remaining(faucet: &Faucet, addr: address, clock: &Clock): u64 {
        if (!table::contains(&faucet.last_claims, addr)) {
            return 0
        };
        let last = *table::borrow(&faucet.last_claims, addr);
        let now = clock::timestamp_ms(clock);
        let elapsed = if (now > last) { now - last } else { 0 };
        if (elapsed >= COOLDOWN_MS) { 0 } else { COOLDOWN_MS - elapsed }
    }
}
