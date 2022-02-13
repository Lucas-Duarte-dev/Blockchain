import { IBlock } from '../../block';
import { hash } from '../../helper/helpers';
import { verifyBlock, hashValidation } from './validation';

class Blockchain {
  #chain: IBlock[] = [];
  private prefixPow = '0';

  constructor(private readonly difficulty: number = 4) {
    this.#chain.push(this.createGenesisBlock())
  }

  private createGenesisBlock() {
    const payload: IBlock['payload'] = {
      sequence: 0,
      timestamp: +Date(),
      data: 'inicial block',
      previousHash: ''
    }

    return {
      header: {
        nonce: 0,
        hash: hash(JSON.stringify(payload)),
      },
      payload
    }
  }

  get chain(): IBlock[] {
    return this.#chain;
  }

  private get lastBlock(): IBlock {
    return this.#chain.at(-1) as IBlock;
  }

  lastBlockHash(): string {
    return this.lastBlock.header.hash;
  }

  createBlock(data: any): IBlock['payload'] {
    const newBlock: IBlock['payload'] = {
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp:+new Date(),
      data,
      previousHash: this.lastBlockHash()
    }

    return newBlock;
  }

  mineBlock(block: IBlock['payload']) {
    let nonce = 0;
    const initial = +new Date();

    while (true) {
      const blockHash = hash(JSON.stringify(block));
      const hashPow = hash(blockHash + nonce);

      if (hashValidation({
        hash: hashPow,
        difficulty: this.difficulty,
        prefix: this.prefixPow
      })) {
        const final = +new Date();
        const reduceHash = blockHash.slice(0, 12);
        const menerationTime = (final - initial) / 1000;

        console.log(`Block #${block.sequence} mined in ${menerationTime}s - hash ${reduceHash} (${nonce} trying)`)

        return {
          minedBlock: {
            payload: {...block},
            header: {
              nonce,
              hash: blockHash
            }
          }
        }
      }
      nonce++
    }

  }

  sendBlock(block: IBlock): IBlock[] {
    if(verifyBlock(
      block,
      this.lastBlockHash(),
      {prefixPow: this.prefixPow, difficulty: this.difficulty}
    )) {
      this.#chain.push(block);

      console.log(`Block #${block.payload.sequence} has been added on blockchain: ${JSON.stringify(block, null, 2)}`)
    }

    return this.#chain
  }

}

export {Blockchain}
