// import { JsonFragment } from "@ethersproject/abi";

export class ContractContext {
  constructor(chainid: number) {
    this.chainId = chainid;
  }

  chainId;

  /**
   * The quickswap router address
   */
  // public static routerAddress = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
  public routerAddress() {
    return "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
  }

  /**
   * The quickswap factory address
   */
  // public static factoryAddress = "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac";
  public factoryAddress() {
    return "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";
  }

  /**
   * The quickswap pair address
   */
  // public static pairAddress = "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac";
  public pairAddress() {
    return "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32";
  }

  /**
   * quickswap v2 router
   */
  public static routerAbi: any[] = require("../ABI/quickswap-router.json");

  /**
   * quickswap v2 factory
   */
  public static factoryAbi: any[] = require("../ABI/quickswap-factory.json");

  /**
   * quickswap v2 pair
   */
  public static pairAbi: any[] = require("../ABI/quickswap-pair.json");

  /**
   * ERC20 abi
   */
  public static erc20Abi: any[] = require("../ABI/erc-20-abi.json");
}
