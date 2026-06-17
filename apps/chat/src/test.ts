import { Scallop, ScallopBuilder } from '@scallop-io/sui-scallop-sdk';
import { CetusClmmSDK } from '@cetusprotocol/cetus-sui-clmm-sdk';

async function main() {
  console.log("Scallop:", typeof Scallop);
  console.log("CetusClmmSDK:", typeof CetusClmmSDK);
}
main();
