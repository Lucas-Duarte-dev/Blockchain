import {BinaryLike, createHash} from 'crypto';

export type ValidationHash = {
  hash: string,
  difficulty: number,
  prefix: string
}

export function hash(data: BinaryLike) {
  return createHash('sha256').update(data).digest('hex');
}

export function hashValidation({hash, difficulty = 4, prefix = '0'}: ValidationHash) {
  const check = prefix.repeat(difficulty);
  return hash.startsWith(check);
}
