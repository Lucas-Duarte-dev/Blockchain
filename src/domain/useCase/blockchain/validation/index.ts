import { IBlock } from '../../../block'
import { hash } from '../../../helper/helpers'

export type ValidationHash = {
  hash: string,
  difficulty: number,
  prefix: string
}

export type Chain = {
  difficulty: number,
  prefixPow: string
}

export function hashValidation({hash, difficulty = 4, prefix = '0'}: ValidationHash) {
  const check = prefix.repeat(difficulty);
  return hash.startsWith(check);
}

export function verifyBlock(block: IBlock, lastBlockHash: string, {prefixPow, difficulty}: Chain): boolean {
  if (block.payload.previousHash !== lastBlockHash) {
    console.error(`Block ${block.payload.sequence} invalid:
        previous hash is ${lastBlockHash.slice(0, 12)} isn't ${block.payload.previousHash.slice(0, 12)}
      `);
    return false;
  }

  const hashPow = hash(hash(JSON.stringify(block.payload)) + block.header.nonce);

  if (!hashValidation({hash: hashPow, difficulty, prefix: prefixPow})) {
    console.error(`Block ${block.payload.sequence} invalid:
        Nonce ${block.header.nonce} is invalid. It can't be verified
      `);
    return false;
  }

  return true;
}
