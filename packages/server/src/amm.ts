import BigNumber from "bignumber.js";
import { BASIS_POINTS_PERCENT, DECIMALS, LP_FEES_BASIS_POINTS } from "./constants";

BigNumber.config({
  DECIMAL_PLACES: Number(DECIMALS),
});

export function getAmountOut(amtIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint {
  if (amtIn <= 0n) {
    throw new Error("amtIn must be greater than 0");
  }
  if (reserveIn <= 0n || reserveOut <= 0n) {
    throw new Error("reserveIn and reserveOut must be greater than 0");
  }

  const amtInWithFee = amtIn * (BASIS_POINTS_PERCENT - LP_FEES_BASIS_POINTS);
  const numerator = amtInWithFee * reserveOut;
  const denominator = reserveIn * BASIS_POINTS_PERCENT + amtInWithFee;
  return numerator / denominator;
}

export function getAmountIn(amtOut: bigint, reserveIn: bigint, reserveOut: bigint): bigint {
  if (amtOut <= 0n) {
    throw new Error("amtOut must be greater than 0");
  }
  if (reserveIn <= 0n || reserveOut <= 0n) {
    throw new Error("reserveIn and reserveOut must be greater than 0");
  }

  const numerator = amtOut * reserveIn * BASIS_POINTS_PERCENT;
  const denominator = (reserveOut - amtOut) * (BASIS_POINTS_PERCENT - LP_FEES_BASIS_POINTS);
  return numerator / denominator + 1n;
}

export function getRatio(reserveIn: bigint, reserveOut: bigint): number {
  if (reserveIn <= 0n || reserveOut <= 0n) {
    throw new Error("reserveIn and reserveOut must be greater than 0");
  }

  const [rIn, rOut] = [new BigNumber(reserveIn.toString()), new BigNumber(reserveOut.toString())];
  return rOut.dividedBy(rIn).toNumber();
}
