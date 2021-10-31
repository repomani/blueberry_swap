import { Component } from 'react';
import styled from 'styled-components';
import Context from '../Context';
import { FaAngleDown } from 'react-icons/fa';

require('dotenv').config();

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
  inputAmount: any;
  inputAmountInWei: any;
  outputAmount: any;
  outputAmountInWei: any;
  token_A: string;
  token_B: string;
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
      inputAmount: '',
      inputAmountInWei: '',
      outputAmount: '',
      outputAmountInWei: '',
      token_A: '',
      token_B: '',
    };
  }

  handleSubmit = async (event: any) => {
    console.log('submit..');
    console.log(this.state.inputAmountInWei, this.state.outputAmountInWei);
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

    console.log(e.target.value);
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

    console.log(e.target.value);
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

  main = () => (
    <div id="content">
      <div className="card mb-4">
        <div className="card-body">
          <form
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
                placeholder="0.0"
                value={this.state.inputAmount}
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
                      'https://image.flaticon.com/icons/png/512/1777/1777889.png'
                    }
                    height="32"
                    alt=""
                  />
                  &nbsp;&nbsp;&nbsp; ETH
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
              {/* {this.state.inputActive ? (
                  <>
                    <span className="float-left text-muted">Exchange Rate</span>
                    <br />
                    <span className="float-right text-muted">
                      <i style={{ margin: '3px' }}>1</i>
                      Melone =<i style={{ margin: '3px' }}>{this.state.calc}</i>
                      ETH
                    </span>
                  </>
                ) : null} */}
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">
              AddLiquidity
            </button>
          </form>
        </div>
      </div>

      {this.state.token_A ? (
        <Container>
          <Title>Rewards</Title>
          <LiquidityItems>
            <Image src={this.context.tokenData.logoURI}></Image>
            <Symbol>{this.context.tokenData.symbol}</Symbol>
            <TokenValue>{this.state.token_A}</TokenValue>
          </LiquidityItems>
          <LiquidityItems>
            <Symbol>
              <Image
                src={
                  'https://image.flaticon.com/icons/png/512/1777/1777889.png'
                }
              ></Image>
            </Symbol>
            ETH
            <TokenValue>{this.state.token_B}</TokenValue>
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
