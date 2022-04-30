import { Link } from "react-router-dom"
import AssetTable from "./AssetsTable"
import { useEffect, useState } from "react"
import { Wallet } from "../../data"
import {
    debug_funds,
    debug_initialise,
    getWallet,
    claimAirdrop,
} from "../../api"
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

    const [newUser, setNewUser] = useState<boolean>(false)
    const [modalIsOpen, setIsOpen] = useState(false)
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    }
    function closeModal() {
        setIsOpen(false)
    }

    function loadData() {
        setTimeout(() => {
            getWallet().then((wallet) => {
                if (wallet) {
                    setWallet(wallet)
                    setWalletImage(wallet)
                    if (!wallet.claimed) {
                        // not claim == new user
                        setNewUser(true)
                        setIsOpen(true)
                    }
                }
            })
        }, 500)
    }

    // load wallet
    useEffect(() => {
        loadData()
    }, [])

    const { fiat, crypto, earning } = wallet

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
                <div className="col-lg-5 col-md-12">
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
                <div className="col-lg-7 col-md-12">
                    <div className="card h-100">
                        <AssetTable
                            cryptoAssets={walletImage.coin_qty}
                            onSearchSubmitHandler={onSearchSubmitHandler}
                        />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div className="container" style={{ width: "50%" }}>
                    <div className="my-5">
                        <div className="row text-center">
                            <h3 className="text-primary fw-bold ">
                                Welcome to MazeSoba
                            </h3>
                            <p>
                                As part of our newly launched promotion, all new
                                users will receive funds of random amount.
                            </p>
                            <div className="row mb-3">
                                <div className="col">
                                    <i className="bi bi-gift-fill fs-1 text-success"></i>
                                </div>
                                <div className="col">
                                    <i className="bi bi-gift-fill fs-1 text-primary"></i>
                                </div>
                                <div className="col">
                                    <i className="bi bi-gift-fill fs-1 text-danger"></i>
                                </div>
                            </div>
                            <div className="row mb-3 text-center">
                                <h3>Click Here to receive your fund</h3>
                                <i
                                    className="bi bi-caret-down-fill text-primary"
                                    style={{ fontSize: 70 }}
                                ></i>
                            </div>
                            <div className="row">
                                <div className="col-4"></div>
                                <div className="col-4">
                                    <button
                                        className="btn btn-primary fs-4 w-100"
                                        onClick={() => {
                                            claimAirdrop().then(() =>
                                                closeModal()
                                            )
                                        }}
                                    >
                                        Claim Now
                                    </button>
                                </div>
                                <div className="col-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
