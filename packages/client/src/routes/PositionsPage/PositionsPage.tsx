import { Link } from "react-router-dom"
import PositionTable from "./PositionTable"
import { useEffect, useState } from "react"
import { StakedToken, StakedTokenValue, Wallet } from "../../data"
import {
    getWallet,
    claimAirdrop,
    getStaked,
    getLiquidityValue,
} from "../../api"
import Modal from "react-modal"

Modal.setAppElement("#modal")

export default function PositionsPage() {
    const [stakedTokens, setStakedTokens] = useState<
        StakedTokenValue[] | undefined
    >(undefined)

    // load staked tokens
    const refreshStakedTokens = async () => {
        const _staked = await getStaked()
        if (_staked == null) {
            return
        }

        const _value = await Promise.all(
            _staked.map((_s) => getLiquidityValue(_s.symbol))
        )
        const _stakedTokens: StakedTokenValue[] = _value
            .filter((v): v is StakedTokenValue => v != null)
            .filter((v) => parseFloat(v.baseValue) > 0)
        setStakedTokens(_stakedTokens)
    }

    useEffect(() => {
        refreshStakedTokens()
    }, [])

    const totalEarningValue: number =
        stakedTokens
            ?.map((t) => parseFloat(t.baseValue) + parseFloat(t.quoteValue))
            .reduce((a, b) => a + b, 0) ?? 0

    const totalFiatValue: number =
        stakedTokens
            ?.map((t) => parseFloat(t.quoteValue))
            .reduce((a, b) => a + b, 0) ?? 0

    const totalCryptoValue: number =
        stakedTokens
            ?.map((t) => parseFloat(t.baseValue))
            .reduce((a, b) => a + b, 0) ?? 0

    return (
        <div className="container">
            <div className="row ">
                <div className="col-lg-4 col-md-12 mb-3">
                    <div className="card">
                        <div className="col bg-primary p-4 text-white">
                            <div className="row">
                                <span className="fs-5 fw-bold">
                                    Total Staked Value
                                </span>
                            </div>
                            <div className="row  ">
                                <span className="">
                                    <span
                                        style={{
                                            lineHeight: "50px",
                                            verticalAlign: "top",
                                        }}
                                    >
                                        =
                                    </span>
                                    <span className="fw-bold fs-2 ps-2">
                                        SGD {totalEarningValue.toFixed(2)}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="col text-primary p-4">
                            <div className="row">
                                <span className="fs-6 fw-bold">
                                    FIAT ASSETS
                                </span>
                            </div>
                            <div className="row">
                                <span className="fs-3 fw-bold">
                                    {totalFiatValue.toFixed(2)} SGD
                                </span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="col text-primary p-4">
                                <div className="row">
                                    <span className="fs-6 fw-bold">
                                        CRYPTO ASSETS
                                    </span>
                                </div>
                                <div className="row">
                                    <span className="fs-3 fw-bold">
                                        {totalCryptoValue.toFixed(2)} SGD
                                    </span>
                                </div>
                                <div className="row row-cols-6 g-1 ">
                                    <div className="col">
                                        <Link
                                            type={"a"}
                                            to="/trade"
                                            className="text-decoration-none text-muted"
                                        >
                                            Swap
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8 col-md-12 mb-3">
                    <div className="card h-100">
                        <PositionTable
                            cryptoAssets={stakedTokens ?? []}
                            updateAssetsCallback={() => refreshStakedTokens()}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
