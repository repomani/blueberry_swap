import { Component, useEffect } from 'react';
import styled from 'styled-components';
import Context from '../Context';
import { ethers } from 'ethers';
import { FaAngleDown } from 'react-icons/fa';
import Factory from '../../abi/src/contracts/Factory.sol/Factory.json';
import DEX from '../../abi/src/contracts/Exchange.sol/Exchange.json';

export interface ProcessEnv {
  [key: string]: string | undefined;
}

require('dotenv').config();

const {
  REACT_APP_ROUTER_ADDRESS,
  REACT_APP_FACTORY_ADDRESS,
  REACT_APP_WETH_ADDRESS,
  REACT_APP_ZERO_ADDRESS,
}: ProcessEnv = process.env;

const Container = styled.div`
  border: 0.5px solid skyblue;
  margin-bottom: 20px;
`;

const LiquidityItems = styled.div`
  margin: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TokenValue = styled.div`
  padding-left: 10px;
`;

const Title = styled.h4`
  padding: 10px;
`;
const Symbol = styled.div`
  padding: 5px;
`;
interface IProps {
  buyTokens(ethAmount: string, _minTokens: string): any;
}

interface IState {
  calc: any;
  inputAmount: any;
  inputAmountInWei: any;
  outputAmount: any;
  outputAmountInWei: any;
  token_A_LP_Balance: string;
  token_B_LP_Balance: string;
}

const Image = styled.img`
  width: 32px;
  height: 32px;
`;

export class AddLiquidity extends Component<IProps, IState> {
  static contextType = Context;

  constructor(props: IProps) {
    super(props);
    this.state = {
      calc: 0,
      inputAmount: '',
      inputAmountInWei: '',
      outputAmount: '',
      outputAmountInWei: '',
      token_A_LP_Balance: '',
      token_B_LP_Balance: '',
    };
  }

  componentDidUpdate() {
    if (Object.keys(this.context.tokenData).length > 0) {
      console.log(this.context.tokenData.address);
      this.getLiquidityOwner(this.context.tokenData);
    }
  }

  handleSubmit = async (event: any) => {
    console.log('submit..');
    // console.log(this.state.inputAmountInWei, this.state.outputAmountInWei);
    if (event.target.value !== '') {
      const inputAmountInWei = this.state.inputAmountInWei;
      const outputAmountInWei = this.state.outputAmountInWei;
      if (inputAmountInWei && outputAmountInWei) {
        console.log(inputAmountInWei, outputAmountInWei);
        // first param is token and second eth
        this.context.addLiquidity(inputAmountInWei, outputAmountInWei);
      }
    }
  };

  handleOnChangeTokenAAmount = async (e: any) => {
    console.log('changing');
    let inputAmount: any;
    let inputAmountInWei: any;
    let outputAmount: any;
    let outputAmountInWei: any;

    if (e.target.value !== '') {
      outputAmount = e.target.value;
      outputAmountInWei = this.context.toWei(outputAmount).toString();

      if (outputAmountInWei > 0 && outputAmountInWei !== '') {
        inputAmountInWei = await this.context.getTokenAAmount(
          outputAmountInWei
        );
        if (inputAmountInWei) {
          console.log(
            inputAmountInWei[0].toString(),
            inputAmountInWei[1].toString()
          );

          inputAmount = this.context.fromWei(inputAmountInWei[1]);
          inputAmountInWei = inputAmountInWei[1].toString();

          this.setState({
            calc: inputAmount / outputAmount,
            inputAmount,
            inputAmountInWei,
            outputAmount,
            outputAmountInWei,
          });
        } else {
          this.setState({
            outputAmount,
            outputAmountInWei,
          });
        }
      }
    } else {
      this.setState({
        inputAmount: '',
        outputAmount: '',
      });
    }
  };

  handleOnChangeTokenBAmount = async (e: any) => {
    console.log('changing');
    let inputAmount: any;
    let inputAmountInWei: any;
    let outputAmount: any;
    let outputAmountInWei: any;

    if (e.target.value !== '') {
      inputAmount = e.target.value;
      inputAmountInWei = this.context.toWei(inputAmount).toString();
      if (inputAmountInWei > 0 && inputAmountInWei !== '') {
        outputAmountInWei = await this.context.getTokenBAmount(
          inputAmountInWei
        );
        if (outputAmountInWei) {
          console.log(
            outputAmountInWei[0].toString(),
            outputAmountInWei[1].toString()
          );

          outputAmount = this.context.fromWei(outputAmountInWei[1]);
          outputAmountInWei = outputAmountInWei[1].toString();

          this.setState({
            calc: inputAmount / outputAmount,
            inputAmount,
            inputAmountInWei,
            outputAmount,
            outputAmountInWei,
          });
        } else {
          this.setState({
            inputAmount,
            inputAmountInWei,
          });
        }
      }
    } else {
      this.setState({
        inputAmount: '',
        outputAmount: '',
      });
    }
  };

  toggleModal = () => {
    this.context.toggleTokenListModal();
  };

  resetForms = () => {
    this.setState({
      inputAmount: null,
      outputAmount: null,
    });
  };

  getLiquidityOwner = async (token1: any) => {
    const factory = new ethers.Contract(
      REACT_APP_FACTORY_ADDRESS,
      Factory.abi,
      this.context.signer
    );
    const pairAddress = await factory.getPair(
      token1.address,
      REACT_APP_WETH_ADDRESS
    );

    const Pair = new ethers.Contract(
      pairAddress,
      DEX.abi,
      this.context.provider
    );
    if (Pair.address !== REACT_APP_ZERO_ADDRESS) {
      const pairBalance = await Pair.balanceOf(this.context.account).toString();
      const token_A_LP_Balance = await this.context.token1.balanceOf(
        Pair.address
      );

      //WETH
      const token_B_LP_Balance = await this.context.weth.balanceOf(
        Pair.address
      );

      const lpPairBalance = pairBalance.toString();
      const tokenA = token_A_LP_Balance.toString();
      const tokenB = token_B_LP_Balance.toString();

      console.log(`LP ${lpPairBalance}`);
      console.log(`LP Token Balance ${tokenA}`);
      console.log(`LP WETH Balance ${tokenB}`);
      this.setState({
        token_A_LP_Balance: tokenA,
        token_B_LP_Balance: tokenB,
      });
    }
  };

  main = () => (
    <div id="content">
      <div className="card mb-4">
        <div className="card-body">
          <form
            autoComplete="off"
            className="mb-3"
            onSubmit={async (event: any) => {
              event.preventDefault();
              this.handleSubmit(event);
            }}
          >
            <div>
              <label className="float-left">
                <b>Input</b>
              </label>
              <span className="float-right text-muted">
                Balance:
                {this.context.ethBalance}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                id="tokenA"
                type="number"
                step="0.000000000000000001"
                autoComplete="off"
                placeholder="0.0"
                defaultValue={this.state.inputAmount}
                onChange={(event: any) => {
                  this.handleOnChangeTokenBAmount(event);
                }}
                className="form-control form-control-lg"
                required
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img
                    src={
                      'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
                    }
                    height="32"
                    alt=""
                  />
                  &nbsp;&nbsp;&nbsp; BNB
                </div>
              </div>
            </div>
            <div>
              <label className="float-left">
                <b>Output</b>
              </label>
              <span className="float-right text-muted">
                Balance:
                {this.context.tokenBalance}
              </span>
            </div>
            <div className="input-group mb-2">
              <input
                id="tokenB"
                type="number"
                step="0.000000000000000001"
                autoComplete="off"
                placeholder="0.0"
                value={this.state.outputAmount}
                className="form-control form-control-lg"
                onChange={(event: any) => {
                  this.handleOnChangeTokenAAmount(event);
                }}
                required
              />

              <div className="input-group-append" onClick={this.toggleModal}>
                {this.context.tokenData?.symbol ? (
                  <div className="input-group-text">
                    <Image src={this.context.tokenData.logoURI}></Image>
                    &nbsp; {this.context.tokenData.symbol} <FaAngleDown />
                  </div>
                ) : (
                  <div className="input-group-text">
                    Select
                    <FaAngleDown />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-5">
              {this.state.calc > 0 ? (
                <>
                  <span className="float-left text-muted">Exchange Rate</span>
                  <br />
                  <span className="float-right text-muted">
                    <i style={{ margin: '3px' }}>1</i>
                    {this.context.tokenData.symbol} =
                    <i style={{ margin: '3px' }}>{this.state.calc}</i>
                    BNB
                  </span>
                </>
              ) : null}
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">
              AddLiquidity
            </button>
          </form>
        </div>
      </div>

      {this.state.token_A_LP_Balance ? (
        <Container>
          <Title>Provided Liquidity</Title>
          <LiquidityItems>
            <Image src={this.context.tokenData.logoURI}></Image>
            <Symbol>{this.context.tokenData.symbol}</Symbol>
            <TokenValue>{this.state.token_A_LP_Balance}</TokenValue>
          </LiquidityItems>
          <LiquidityItems>
            <Image
              src={
                'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
              }
            ></Image>
            <Symbol>BNB</Symbol>
            <TokenValue>{this.state.token_B_LP_Balance}</TokenValue>
          </LiquidityItems>
        </Container>
      ) : null}
    </div>
  );

  render() {
    return this.main();
  }
}
export default AddLiquidity;
