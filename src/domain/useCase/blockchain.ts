import { IBlock } from '../block';
import { hash, hashValidation } from '../helper/helpers';

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


  verifyBlock(block: IBlock): boolean {
    if (block.payload.previousHash !== this.lastBlockHash()) {
      console.error(`Block ${block.payload.sequence} invalid:
        previous hash is ${this.lastBlockHash().slice(0, 12)} isn't ${block.payload.previousHash.slice(0, 12)}
      `);
      return false;
    }

    const hashPow = hash(hash(JSON.stringify(block.payload)) + block.header.nonce);

    if (!hashValidation({hash: hashPow, difficulty: this.difficulty, prefix: this.prefixPow})) {
      console.error(`Block ${block.payload.sequence} invalid:
        Nonce ${block.header.nonce} is invalid. It can't be verified
      `);
      return false;
    }

    return true;
  }

  sendBlock(block: IBlock): IBlock[] {
    if(this.verifyBlock(block)) {
      this.#chain.push(block);

      console.log(`Block #${block.payload.sequence} has been added on blockchain: ${JSON.stringify(block, null, 2)}`)
    }

    return this.#chain
  }

}

export {Blockchain}
