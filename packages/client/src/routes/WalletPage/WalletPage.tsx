import { Link } from "react-router-dom"
import AssetTable from "./AssetsTable"
import { useEffect, useState } from "react"
import { Wallet } from "../../data"
import { debug_funds, debug_initialise, getWallet } from "../../api"
import Modal from "react-modal"

Modal.setAppElement("#modal")

export default function WalletPage() {
    const [wallet, setWallet] = useState<Wallet>({
        fiat: "0",
        crypto: "0",
        earning: "0",
        coin_qty: [],
    })
    const [walletImage, setWalletImage] = useState<Wallet>({
        fiat: "0",
        crypto: "0",
        earning: "0",
        coin_qty: [],
    })

    // load wallet
    useEffect(() => {
        getWallet().then((wallet) => {
            if (wallet) {
                setWallet(wallet)
                setWalletImage(wallet)
            }
        })
    }, [])

    const { fiat, crypto, earning, coin_qty } = wallet

    const flatAssets = parseFloat(fiat)
    const cryptoAssets = parseFloat(crypto)
    const earnings = parseFloat(earning)

    const totalAsset = flatAssets + cryptoAssets

    function onSearchSubmitHandler(searchTerm: string) {
        if (searchTerm) {
            setWalletImage({
                ...wallet,
                coin_qty: wallet.coin_qty.filter((x) =>
                    x.symbol.toLowerCase().includes(searchTerm)
                ),
            })
        } else {
            setWalletImage(wallet)
        }
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
                                            to="/trade"
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
                            cryptoAssets={walletImage.coin_qty}
                            onSearchSubmitHandler={onSearchSubmitHandler}
                        />
                    </div>
                </div>
            </div>
            <button onClick={() => debug_initialise()}>init</button>
            <button onClick={() => debug_funds()}>fund</button>
        </div>
    )
}
