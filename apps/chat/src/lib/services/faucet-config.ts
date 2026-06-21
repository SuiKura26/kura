export const FAUCET_PACKAGE_ID =
  process.env.NEXT_PUBLIC_FAUCET_PACKAGE_ID ||
  "0xdeb1b208f5373f4629b7fb2d646f3a728df82e9506783d62955fa2c789886aad";

export const FAUCET_ID =
  process.env.NEXT_PUBLIC_FAUCET_ID ||
  "0x60d573501df2c5df6b51ca207123871f095bfbcfa9380d0c54061211490a338e";

export const KURA_USDC_TYPE = `${FAUCET_PACKAGE_ID}::mock_usdc::MOCK_USDC` as const;

export const FAUCET_MODULE_TARGET = `${FAUCET_PACKAGE_ID}::faucet::claim_test_usdc` as const;

export function getFaucetId(): string {
  return FAUCET_ID;
}
