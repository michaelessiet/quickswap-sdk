import {
  ChainId,
  ErrorCodes,
  QuickswapError,
  QuickswapPairFactory,
  QuickswapPairSettings,
  WETH,
} from "../..";
import { TradePath } from "../../enums/trade-path";
import { EthersProvider } from "../../ethers-provider";
import { MOCK1INCH } from "../../mocks/1inch-token.mock";
import { MOCKAAVE } from "../../mocks/aave-token.mock";
import { MockEthereumAddress } from "../../mocks/ethereum-address.mock";
import { MOCK_PROVIDER_URL } from "../../mocks/provider-url.mock";
import { QuickswapPairFactoryContext } from "./models/pair-factory-context";

describe("QuickswapPairFactory", () => {
  const ethersProvider = new EthersProvider(
    ChainId.MATIC,
    MOCK_PROVIDER_URL()
  );
  describe("erc20 > erc20", () => {
    const quickswapPairFactoryContext: QuickswapPairFactoryContext = {
      fromToken: MOCK1INCH(),
      toToken: MOCKAAVE(),
      ethereumAddress: MockEthereumAddress(),
      settings: new QuickswapPairSettings(),
      ethersProvider,
    };

    const quickswapPairFactory = new QuickswapPairFactory(
      quickswapPairFactoryContext,
      ChainId.MATIC,
      TradePath.erc20ToErc20
    );

    it("`toToken` should retun correctly", () => {
      expect(quickswapPairFactory.toToken).toEqual(
        quickswapPairFactoryContext.toToken
      );
    });

    it("`fromToken` should retun correctly", () => {
      expect(quickswapPairFactory.fromToken).toEqual(
        quickswapPairFactoryContext.fromToken
      );
    });

    describe("trade", () => {
      it("should return trade info", async () => {
        const result = await quickswapPairFactory.trade("1");
        expect(result).not.toBeUndefined();
      });
    });

    describe("findBestRoute", () => {
      it("should return the best route", async () => {
        const result = await quickswapPairFactory.findBestRoute("1");
        expect(result).not.toBeUndefined();
      });
    });

    describe("findAllPossibleRoutesWithQuote", () => {
      it("should return all possible routes with quotes", async () => {
        const result = await quickswapPairFactory.findAllPossibleRoutesWithQuote(
          "1"
        );
        expect(result).not.toBeUndefined();
      });
    });

    describe("findAllPossibleRoutes", () => {
      it("should return all possible routes", async () => {
        const result = await quickswapPairFactory.findAllPossibleRoutes();
        expect(result).not.toBeUndefined();
      });
    });

    describe("hasGotEnoughAllowance", () => {
      xit("should return true if i have enough allowance", async () => {
        const result = await quickswapPairFactory.hasGotEnoughAllowance("1");
        expect(result).toEqual(true);
      });

      it("should return false if i do not have enough allowance", async () => {
        const factory = new QuickswapPairFactory(
          {
            fromToken: MOCKAAVE(),
            toToken: MOCK1INCH(),
            ethereumAddress: MockEthereumAddress(),
            settings: new QuickswapPairSettings(),
            ethersProvider,
          },
          ChainId.MATIC,
          TradePath.erc20ToErc20
        );

        const result = await factory.hasGotEnoughAllowance("1");
        expect(result).toEqual(false);
      });
    });

    describe("getAllowanceAndBalanceOfForFromToken", () => {});

    describe("allowance", () => {
      xit("should return more then 0", async () => {
        const factory = new QuickswapPairFactory(
          {
            fromToken: MOCK1INCH(),
            toToken: MOCKAAVE(),
            ethereumAddress: "0x5ab9d116a53ef41063e3eae26a7ebe736720e9ba",
            settings: new QuickswapPairSettings(),
            ethersProvider,
          },
          ChainId.MATIC,
          TradePath.erc20ToErc20
        );

        const result = await factory.allowance();
        expect(result).not.toEqual("0x00");
      });

      it("should return 0 allowance", async () => {
        const factory = new QuickswapPairFactory(
          {
            fromToken: MOCKAAVE(),
            toToken: MOCK1INCH(),
            ethereumAddress: MockEthereumAddress(),
            settings: new QuickswapPairSettings(),
            ethersProvider,
          },
          ChainId.MATIC,
          TradePath.erc20ToErc20
        );

        const result = await factory.allowance();
        expect(result).toEqual("0x00");
      });
    });

    describe("generateApproveMaxAllowanceData", () => {
      it("should generate the approve max allowance data", async () => {
        const result = await quickswapPairFactory.generateApproveMaxAllowanceData();
        expect(result).toEqual({
          data:
            "0x095ea7b3000000000000000000000000a5e0829caced8ffdd4de3c43696c57f7d7a678ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          from: "0xB576f4Fac19eA8935A4BAA4F7AD5bc566A5845b1",
          to: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
          value: "0x00",
        });
      });
    });
  });

  describe("erc20 > eth", () => {
    const QuickswapPairFactoryContext: QuickswapPairFactoryContext = {
      fromToken: MOCK1INCH(),
      toToken: WETH.MATIC(),
      ethereumAddress: MockEthereumAddress(),
      settings: new QuickswapPairSettings(),
      ethersProvider,
    };

    const quickswapPairFactory = new QuickswapPairFactory(
      QuickswapPairFactoryContext,
      ChainId.MATIC,
      TradePath.erc20ToErc20
    );

    it("`toToken` should retun correctly", () => {
      expect(quickswapPairFactory.toToken).toEqual(
        QuickswapPairFactoryContext.toToken
      );
    });

    it("`fromToken` should retun correctly", () => {
      expect(quickswapPairFactory.fromToken).toEqual(
        QuickswapPairFactoryContext.fromToken
      );
    });

    describe("trade", () => {
      it("should return trade info", async () => {
        const result = await quickswapPairFactory.trade("1");
        expect(result).not.toBeUndefined();
      });
    });

    describe("findBestRoute", () => {
      it("should return the best route", async () => {
        const result = await quickswapPairFactory.findBestRoute("1");
        expect(result).not.toBeUndefined();
      });
    });

    describe("findAllPossibleRoutesWithQuote", () => {
      it("should return all possible routes with quotes", async () => {
        const result = await quickswapPairFactory.findAllPossibleRoutesWithQuote(
          "1"
        );
        expect(result).not.toBeUndefined();
      });
    });

    describe("findAllPossibleRoutes", () => {
      it("should return all possible routes", async () => {
        const result = await quickswapPairFactory.findAllPossibleRoutes();
        expect(result).not.toBeUndefined();
      });
    });

    describe("hasGotEnoughAllowance", () => {
      xit("should return true if i have enough allowance", async () => {
        const result = await quickswapPairFactory.hasGotEnoughAllowance("1");
        expect(result).toEqual(true);
      });

      it("should return false if i do not have enough allowance", async () => {
        const factory = new QuickswapPairFactory(
          {
            fromToken: MOCKAAVE(),
            toToken: WETH.MATIC(),
            ethereumAddress: MockEthereumAddress(),
            settings: new QuickswapPairSettings(),
            ethersProvider,
          },
          ChainId.MATIC,
          TradePath.erc20ToEth
        );

        const result = await factory.hasGotEnoughAllowance("1");
        expect(result).toEqual(false);
      });
    });

    describe("getAllowanceAndBalanceOfForFromToken", () => {});

    describe("allowance", () => {
      xit("should return more then 0", async () => {
        const factory = new QuickswapPairFactory(
          {
            fromToken: MOCK1INCH(),
            toToken: WETH.MATIC(),
            ethereumAddress: "0x5ab9d116a53ef41063e3eae26a7ebe736720e9ba",
            settings: new QuickswapPairSettings(),
            ethersProvider,
          },
          ChainId.MATIC,
          TradePath.erc20ToEth
        );

        const result = await factory.allowance();
        expect(result).not.toEqual("0x00");
      });

      it("should return 0 allowance", async () => {
        const factory = new QuickswapPairFactory(
          {
            fromToken: MOCKAAVE(),
            toToken: WETH.MATIC(),
            ethereumAddress: MockEthereumAddress(),
            settings: new QuickswapPairSettings(),
            ethersProvider,
          },
          ChainId.MATIC,
          TradePath.erc20ToEth
        );

        const result = await factory.allowance();
        expect(result).toEqual("0x00");
      });
    });

    describe("generateApproveMaxAllowanceData", () => {
      it("should generate the approve max allowance data", async () => {
        const result = await quickswapPairFactory.generateApproveMaxAllowanceData();
        expect(result).toEqual({
          data:
            "0x095ea7b3000000000000000000000000a5e0829caced8ffdd4de3c43696c57f7d7a678ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          from: "0xB576f4Fac19eA8935A4BAA4F7AD5bc566A5845b1",
          to: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
          value: "0x00",
        });
      });
    });
  });

  describe("eth > erc20", () => {
    const quickswapPairFactoryContext: QuickswapPairFactoryContext = {
      fromToken: WETH.MATIC(),
      toToken: MOCK1INCH(),
      ethereumAddress: MockEthereumAddress(),
      settings: new QuickswapPairSettings(),
      ethersProvider,
    };

    const quickswapPairFactory = new QuickswapPairFactory(
      quickswapPairFactoryContext,
      ChainId.MATIC,
      TradePath.ethToErc20
    );

    it("`toToken` should retun correctly", () => {
      expect(quickswapPairFactory.toToken).toEqual(
        quickswapPairFactoryContext.toToken
      );
    });

    it("`fromToken` should retun correctly", () => {
      expect(quickswapPairFactory.fromToken).toEqual(
        quickswapPairFactoryContext.fromToken
      );
    });

    describe("trade", () => {
      it("should return trade info", async () => {
        const result = await quickswapPairFactory.trade("1");
        expect(result).not.toBeUndefined();
      });
    });

    describe("findBestRoute", () => {
      it("should return the best route", async () => {
        const result = await quickswapPairFactory.findBestRoute("1");
        expect(result).not.toBeUndefined();
      });
    });

    describe("findAllPossibleRoutesWithQuote", () => {
      it("should return all possible routes with quotes", async () => {
        const result = await quickswapPairFactory.findAllPossibleRoutesWithQuote(
          "1"
        );
        expect(result).not.toBeUndefined();
      });
    });

    describe("findAllPossibleRoutes", () => {
      it("should return all possible routes", async () => {
        const result = await quickswapPairFactory.findAllPossibleRoutes();
        expect(result).not.toBeUndefined();
      });
    });

    describe("hasGotEnoughAllowance", () => {
      it("should always return true as not allowance needed", async () => {
        const result = await quickswapPairFactory.hasGotEnoughAllowance("1");
        expect(result).toEqual(true);
      });
    });

    describe("getAllowanceAndBalanceOfForFromToken", () => {});

    describe("allowance", () => {
      it("should always return max hex", async () => {
        const result = await quickswapPairFactory.allowance();
        expect(result).toEqual(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
      });
    });

    describe("generateApproveMaxAllowanceData", () => {
      it("should generate the approve max allowance data", async () => {
        await expect(
          quickswapPairFactory.generateApproveMaxAllowanceData()
        ).rejects.toThrowError(
          new QuickswapError(
            "You do not need to generate approve quickswap allowance when doing eth > erc20",
            ErrorCodes.generateApproveMaxAllowanceDataNotAllowed
          )
        );
      });
    });
  });
});
