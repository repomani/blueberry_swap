import { BigNumber, Contract } from 'ethers';

export interface ITokenData {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
}

export interface IApp {
  account: string;
  web3: any;
  weth: any;
  token1: any;
  router: any;
  exchange: any;
  factory: any;
  ethBalance: string;
  tokenBalance: string;
  loading: boolean;
  provider: any;
  signer: any;
  exchangeAddress: string;
  addLiquidity(tokenAmount: string, ethAmount: string): void;
  getTokenAAmount(tokenAmount: string): any;
  getTokenBAmount(tokenAmount: string): any;
  getTokenBOutAmount(ethAmount: string): any;
  getExchangeAddress(token1: any, token2: any): any;
  getExchange(exchange: any): any;
  fromWei(value: any): string;
  toWei(value: any): BigNumber;
  isOpen: boolean;
  toggleTokenListModal(): any;
  setMsg(value: string): any;
  tokenData: ITokenData;
  tx: any;
  msg: boolean;
  msgTxt: string;
  outputAddress: any;
  priceImpact: string;
  lpShareAccountviaInput: string;
  lpAccountShare: number;
  tokenAShare: number;
  tokenBShare: number;
}
