import { Link } from "react-router-dom"
import AssetTable from "./AssetsTable"
import walletData from "./WalletData.json"
import { WALLET } from "./DummyWallet"
import { useEffect, useState } from "react"
import { Wallet } from "../../data"

export default function WalletPage() {
    const [wallet, setWallet] = useState<Wallet>({
        fiat: "0",
        crypto: "0",
        earning: "0",
        coin_qty: [],
    })

    // load wallet
    useEffect(() => {
        setTimeout(() => {
            setWallet(WALLET)
        }, 500)
    }, [])

    const { fiat, crypto, earning, coin_qty } = wallet

    const flatAssets = parseFloat(fiat)
    const cryptoAssets = parseFloat(crypto)
    const earnings = parseFloat(earning)
    const coins = coin_qty

    const totalAsset = flatAssets + cryptoAssets

    function onSearchSubmitHandler(searchTerm: string) {
        setWallet({
            ...WALLET,
            coin_qty: WALLET.coin_qty.filter((x) =>
                x.name.toLowerCase().includes(searchTerm)
            ),
        })
    }

    return (
        <div className="container">
            <div className="row ">
                <div className="col-5">
                    <div className="card">
                        <div className="col bg-primary p-4 text-white">
                            <div className="row">
                                <span className="fs-5 fw-bold">
                                    Total Value
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
                                        SGD {totalAsset.toFixed(2)}
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
                                    {flatAssets.toFixed(2)} SGD
                                </span>
                            </div>
                            <div className="row row-cols-5 g-1 ">
                                <div className="col">
                                    <Link
                                        type={"a"}
                                        to="/cash/deposit"
                                        className="text-decoration-none text-muted"
                                    >
                                        Deposit
                                    </Link>
                                </div>
                                <div className="col">
                                    <Link
                                        type={"a"}
                                        to="/cash/withdraw"
                                        className="text-decoration-none text-muted"
                                    >
                                        Withdraw
                                    </Link>
                                </div>
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
                                        {cryptoAssets.toFixed(2)} SGD
                                    </span>
                                </div>
                                <div className="row row-cols-6 g-1 ">
                                    <div className="col">
                                        <Link
                                            type={"a"}
                                            to="/trade/buy"
                                            className="text-decoration-none text-muted"
                                        >
                                            Buy
                                        </Link>
                                    </div>
                                    <div className="col">
                                        <Link
                                            type={"a"}
                                            to="/trade/sell"
                                            className="text-decoration-none text-muted"
                                        >
                                            Sell
                                        </Link>
                                    </div>
                                    <div className="col">
                                        <Link
                                            type={"a"}
                                            to="/trade/swap"
                                            className="text-decoration-none text-muted"
                                        >
                                            Swap
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="col">
                                <div className="col text-primary p-4">
                                    <div className="row">
                                        <span className="fs-6 fw-bold">
                                            EARNING
                                        </span>
                                    </div>
                                    <div className="row">
                                        <span
                                            className={
                                                "fs-3 fw-bold " +
                                                (earnings < 0
                                                    ? "text-danger"
                                                    : "text-success")
                                            }
                                        >
                                            {earnings < 0 ? (
                                                <i
                                                    className={
                                                        "bi bi-caret-down-fill pe-2"
                                                    }
                                                    role="img"
                                                    aria-label="Down"
                                                />
                                            ) : (
                                                <i
                                                    className={
                                                        "bi bi-caret-up-fill pe-2"
                                                    }
                                                    role="img"
                                                    aria-label="Up"
                                                />
                                            )}
                                            {earnings.toFixed(2)} SGD
                                        </span>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Link
                                                type={"a"}
                                                to="/history"
                                                className="text-decoration-none text-muted"
                                            >
                                                View History
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-7">
                    <div className="card h-100">
                        <AssetTable
                            cryptoAssets={coins}
                            onSearchSubmitHandler={onSearchSubmitHandler}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
