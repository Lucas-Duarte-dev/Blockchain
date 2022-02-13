import {BinaryLike, createHash} from 'crypto';

export function hash(data: BinaryLike) {
  return createHash('sha256').update(data).digest('hex');
}
