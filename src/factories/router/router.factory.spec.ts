import { BigNumber } from "bignumber.js";
import { ChainId, ErrorCodes, QuickswapError, WETH } from "../..";
import { TradePath } from "../../enums/trade-path";
import { EthersProvider } from "../../ethers-provider";
import { MOCK1INCH } from "../../mocks/1inch-token.mock";
import { MOCKAAVE } from "../../mocks/aave-token.mock";
import { MOCK_PROVIDER_URL } from "../../mocks/provider-url.mock";
import { QuickswapRouterFactory } from "./router.factory";

describe("QuickswapRouterFactory", () => {
  const ethersProvider = new EthersProvider(ChainId.MATIC, MOCK_PROVIDER_URL());

  describe("erc20 > erc20", () => {
    const fromToken = MOCK1INCH();
    const toToken = MOCKAAVE();

    const quickswapRouterFactory = new QuickswapRouterFactory(
      fromToken,
      toToken,
      false,
      ethersProvider,
      ChainId.MATIC,
      TradePath.erc20ToErc20
    );

    describe("getAllPossibleRoutes", () => {
      it("should get all possible routes", async () => {
        const result = await quickswapRouterFactory.getAllPossibleRoutes();
        expect(result.length > 0).toEqual(true);
        expect(result.filter((c) => c.length > 2).length > 0).toEqual(true);
      });

      it("should only return direct routes (in this case return nothing as there is no direct route)", async () => {
        const factory = new QuickswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider,
          ChainId.MATIC,
          TradePath.erc20ToErc20
        );

        const result = await factory.getAllPossibleRoutes();
        expect(result.length === 0).toEqual(true);
      });
    });

    describe("getAllPossibleRoutesWithQuotes", () => {
      it("should get all possible routes with quote", async () => {
        const factory = new QuickswapRouterFactory(
          fromToken,
          toToken,
          false,
          ethersProvider,
          ChainId.MATIC,
          TradePath.erc20ToErc20
        );

        const result = await factory.getAllPossibleRoutesWithQuotes(
          new BigNumber(100)
        );
        expect(result.length > 0).toEqual(true);
      });

      it("should only return direct routes (in this case return nothing as there is no direct route)", async () => {
        const factory = new QuickswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider,
          ChainId.MATIC,
          TradePath.erc20ToErc20
        );

        const result = await factory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(result.length === 0).toEqual(true);
      });
    });

    describe("findBestRoute", () => {
      it("should find best route", async () => {
        const factory = new QuickswapRouterFactory(
          fromToken,
          toToken,
          false,
          ethersProvider,
          ChainId.MATIC,
          TradePath.erc20ToErc20
        );

        const result = await factory.findBestRoute(new BigNumber(100));
        expect(result.bestRouteQuote.routeText).toEqual("1INCH > WETH > AAVE");
      });

      it("should throw an error as there is no best route with disableMultihops turned on", async () => {
        const factory = new QuickswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider,
          ChainId.MATIC,
          TradePath.erc20ToErc20
        );

        await expect(
          factory.findBestRoute(new BigNumber(100))
        ).rejects.toThrowError(
          new QuickswapError(
            `No routes found for ${fromToken.contractAddress} > ${toToken.contractAddress}`,
            ErrorCodes.noRoutesFound
          )
        );
      });
    });
  });

  describe("erc20 > eth", () => {
    const fromToken = MOCK1INCH();
    const toToken = WETH.MATIC();

    const quickswapRouterFactory = new QuickswapRouterFactory(
      fromToken,
      toToken,
      false,
      ethersProvider,
      ChainId.MATIC,
      TradePath.erc20ToEth
    );

    describe("getAllPossibleRoutes", () => {
      it("should get all possible routes", async () => {
        const result = await quickswapRouterFactory.getAllPossibleRoutes();
        expect(result.length > 0).toEqual(true);
        expect(result.filter((c) => c.length > 2).length > 0).toEqual(true);
      });

      it("should only return direct routes", async () => {
        const factory = new QuickswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider,
          ChainId.MATIC,
          TradePath.erc20ToEth
        );

        const result = await factory.getAllPossibleRoutes();
        expect(result.length === 1).toEqual(true);
        expect(result[0][0]).toEqual(fromToken);
        expect(result[0][1]).toEqual(toToken);
        expect(result.filter((c) => c.length > 2).length > 0).toEqual(false);
      });
    });

    describe("getAllPossibleRoutesWithQuotes", () => {
      const factory = new QuickswapRouterFactory(
        fromToken,
        toToken,
        true,
        ethersProvider,
        ChainId.MATIC,
        TradePath.erc20ToEth
      );

      it("should get all possible routes with quote", async () => {
        const result = await factory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(result.length > 0).toEqual(true);
      });

      it("should only return direct routes", async () => {
        const result = await factory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(
          result.filter((c) => c.routePathArray.length > 2).length > 0
        ).toEqual(false);
      });
    });

    describe("findBestRoute", () => {
      const factory = new QuickswapRouterFactory(
        fromToken,
        toToken,
        true,
        ethersProvider,
        ChainId.MATIC,
        TradePath.erc20ToEth
      );

      it("should find best route", async () => {
        const result = await factory.findBestRoute(new BigNumber(100));
        expect(result.bestRouteQuote.routeText).toEqual("1INCH > WETH");
      });

      it("should return best route", async () => {
        const result = await factory.findBestRoute(new BigNumber(100));

        expect(result.bestRouteQuote.routeText).toEqual("1INCH > WETH");
        expect(
          result.triedRoutesQuote.filter((c) => c.routePathArray.length > 2)
            .length > 0
        ).toEqual(false);
      });
    });
  });

  describe("eth > erc20", () => {
    const fromToken = WETH.MATIC();
    const toToken = MOCK1INCH();

    const quickswapRouterFactory = new QuickswapRouterFactory(
      fromToken,
      toToken,
      false,
      ethersProvider,
      ChainId.MATIC,
      TradePath.ethToErc20
    );

    describe("getAllPossibleRoutes", () => {
      it("should get all possible routes", async () => {
        const result = await quickswapRouterFactory.getAllPossibleRoutes();
        expect(result.length > 0).toEqual(true);
        expect(result.filter((c) => c.length > 2).length > 0).toEqual(true);
      });

      it("should only return direct routes", async () => {
        const factory = new QuickswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider,
          ChainId.MATIC,
          TradePath.ethToErc20
        );

        const result = await factory.getAllPossibleRoutes();
        expect(result.length === 1).toEqual(true);
        expect(result[0][0]).toEqual(fromToken);
        expect(result[0][1]).toEqual(toToken);
        expect(result.filter((c) => c.length > 2).length > 0).toEqual(false);
      });
    });

    describe("getAllPossibleRoutesWithQuotes", () => {
      it("should get all possible routes with quote", async () => {
        const result = await quickswapRouterFactory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(result.length > 0).toEqual(true);
      });

      it("should only return direct routes", async () => {
        const factory = new QuickswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider,
          ChainId.MATIC,
          TradePath.ethToErc20
        );

        const result = await factory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(
          result.filter((c) => c.routePathArray.length > 2).length > 0
        ).toEqual(false);
      });
    });

    describe("findBestRoute", () => {
      it("should find best route", async () => {
        const result = await quickswapRouterFactory.findBestRoute(
          new BigNumber(100)
        );
        expect(result.bestRouteQuote.routeText).toEqual("WETH > 1INCH");
      });

      it("should return best route", async () => {
        const factory = new QuickswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider,
          ChainId.MATIC,
          TradePath.ethToErc20
        );

        const result = await factory.findBestRoute(new BigNumber(100));

        expect(result.bestRouteQuote.routeText).toEqual("WETH > 1INCH");
        expect(
          result.triedRoutesQuote.filter((c) => c.routePathArray.length > 2)
            .length > 0
        ).toEqual(false);
      });
    });
  });
});
