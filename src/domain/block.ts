export interface IBlock {
  header: IBlock.Header
  payload: IBlock.Payload
}

// eslint-disable-next-line no-redeclare
namespace IBlock {
  export type Header = {
    nonce: number;
    hash: string
  }
  export type Payload = {
    sequence: number;
    timestamp: number;
    data: any;
    previousHash: string;
  }
}
