import { getAuth } from "firebase/auth"
import {
    Price,
    StakedToken,
    StakedTokenValue,
    Wallet,
    History,
    Quote,
    ServerResponse,
    SwapResponse,
    AirdropResponse,
} from "./data"

export async function debug_initialise(): Promise<void> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return
    }

    const res = await fetch("/api/debug/initialise", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(res)
}

export async function debug_funds(): Promise<void> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return
    }

    const res = await fetch("/api/debug/funds", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(res)
}

export async function getWallet(): Promise<Wallet | null> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const res = await fetch("/api/wallet", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(res)
    return await res.json()
}

export async function getStaked(): Promise<StakedToken[] | null> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const res = await fetch("/api/getStaked", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(res)
    return await res.json()
}

export async function getLiquidityValue(
    ccy: string
): Promise<StakedTokenValue | null> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const res = await fetch(
        "/api/getLiquidityValue?" + new URLSearchParams({ ccy: ccy }),
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )
    console.log(res)
    return await res.json()
}

export async function getPrices(ccys: string[]): Promise<Price[] | null> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const res = await fetch("/api/prices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ccys: ccys }),
    })
    console.log(res)
    return await res.json()
}

export async function postSwap(
    base: string,
    quote: string,
    amount: number,
    isBuy: boolean
): Promise<ServerResponse<SwapResponse> | null> {
    // for now we only support SGD
    if (quote !== "SGD") {
        console.error("Only support SGD")
        return {
            error: {
                type: "INVALID_ARGUMENTS",
                message: "Only support SGD",
            },
        }
    }

    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const res = await fetch("/api/swap", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            base,
            quote,
            amount,
            isBuy,
        }),
    })
    console.log(res)
    return await res.json()
}

export async function getHistory(): Promise<History[] | null> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const res = await fetch("/api/history", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(res)
    return await res.json()
}

export async function postWithdrawRequest(
    ccy: string,
    amount: number,
    address: string
): Promise<boolean> {
    if (amount <= 0) {
        console.error("Invalid amount")
        return false
    }

    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return false
    }

    const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            ccy,
            amount,
            address,
        }),
    })
    console.log(res)
    return true
}

export async function getDepositAddress(
    ccy: string
): Promise<{ ccy: string; address: string } | null> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const res = await fetch("/api/deposit?" + new URLSearchParams({ ccy }), {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(res)
    return await res.json()
}

export async function postAddLiquidity(
    base: string,
    quote: string,
    amountBase: number,
    amountQuote: number
): Promise<boolean> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return false
    }

    if (amountBase <= 0 || amountQuote <= 0) {
        console.error("Invalid amount")
        return false
    }

    const res = await fetch("/api/stake", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            base,
            quote,
            amountBase,
            amountQuote,
        }),
    })
    console.log(res)
    return true
}

/**
 * Unstake LP tokens to stop earning
 *
 * @param ccy Symbol of LP token e.g. LP_BTC_SGD
 * @param amount Amount of LP tokens to burn. Note: if passed 0, will withdraw all LP tokens
 * @returns boolean success
 */
export async function postRemoveLiquidity(
    ccy: string,
    amount: number
): Promise<boolean> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return false
    }

    if (amount < 0) {
        console.error("Invalid amount")
        return false
    }

    const res = await fetch("/api/unstake", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            ccy,
            amount,
        }),
    })
    console.log(res)
    return true
}

export async function getQuote(
    base: string,
    quote: string,
    isBuy: boolean,
    amountBase?: number,
    amountQuote?: number
): Promise<ServerResponse<Quote> | null> {
    if (amountBase == null && amountQuote == null) {
        throw new Error(
            "Exactly one of amountBase or amountQuote must be passed"
        )
    }
    if (amountBase != null && amountQuote != null) {
        throw new Error("Only one of amountBase or amountQuote can be passed")
    }

    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const _params = new URLSearchParams({
        base,
        quote,
        ...(isBuy ? { isBuy: "true" } : { isBuy: "false" }),
        ...(amountBase != null ? { amountBase: amountBase.toString() } : {}),
        ...(amountQuote != null ? { amountQuote: amountQuote.toString() } : {}),
    })

    const res = await fetch("/api/quote?" + _params, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(res)
    return await res.json()
}

export async function getPairs(): Promise<
    { base: string; quote: string }[] | null
> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const res = await fetch("/api/pairs", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(res)
    return await res.json()
}

export async function claimAirdrop(): Promise<ServerResponse<AirdropResponse> | null> {
    const accessToken = await getAuth().currentUser?.getIdToken(true)
    if (accessToken == null) {
        return null
    }

    const res = await fetch("/api/airdrop", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(res)
    return await res.json()
}
