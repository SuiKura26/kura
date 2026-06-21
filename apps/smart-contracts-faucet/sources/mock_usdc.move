#[allow(lint(self_transfer))]
module kura_faucet::mock_usdc {
    use sui::coin::{Self, TreasuryCap};
    use sui::coin_registry;
    use sui::event;

    public struct MOCK_USDC has drop {}

    public struct FaucetMinted has copy, drop {
        recipient: address,
        amount: u64,
    }

    fun init(otw: MOCK_USDC, ctx: &mut TxContext) {
        let (currency_initializer, treasury_cap) = coin_registry::new_currency_with_otw(
            otw,
            6,
            b"USDC".to_string(),
            b"USD Coin".to_string(),
            b"Mock USDC for Kura testing".to_string(),
            b"https://chat.kura.ai/logo.png".to_string(),
            ctx,
        );

        coin_registry::finalize_and_delete_metadata_cap(currency_initializer, ctx);
        transfer::public_transfer(treasury_cap, ctx.sender());
    }

    public fun mint(
        cap: &mut TreasuryCap<MOCK_USDC>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        let coin = coin::mint(cap, amount, ctx);
        event::emit(FaucetMinted { recipient, amount });
        transfer::public_transfer(coin, recipient);
    }
}
