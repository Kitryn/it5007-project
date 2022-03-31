import AssetTable from "./AssetsTable"
import walletData from "./WalletData.json"

export default function WalletPage() {
    const flatAssets = parseFloat(walletData.flatAssets.SGD)
    const cryptoAssetPaid = walletData.cryptoAssets.reduce(
        (prev, curr) =>
            prev +
            parseFloat(curr.quantityOwned) * parseFloat(curr.purchasedPrice),
        0.0
    )
    const cryptoAssetOwned = walletData.cryptoAssets.reduce(
        (prev, curr) =>
            prev +
            parseFloat(curr.quantityOwned) * parseFloat(curr.currentPrice),
        0.0
    )

    const cryptoEarning = cryptoAssetPaid - cryptoAssetOwned
    const totalAsset = flatAssets + cryptoEarning
    const cryptoAssets = walletData.cryptoAssets

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
                                    <a
                                        href="#"
                                        className="text-decoration-none text-muted"
                                    >
                                        Deposit
                                    </a>
                                </div>
                                <div className="col">
                                    <a
                                        href="#"
                                        className="text-decoration-none text-muted"
                                    >
                                        Withdraw
                                    </a>
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
                                        {cryptoAssetOwned.toFixed(2)} SGD
                                    </span>
                                </div>
                                <div className="row row-cols-6 g-1 ">
                                    <div className="col">
                                        <a
                                            href="#"
                                            className="text-decoration-none text-muted"
                                        >
                                            Buy
                                        </a>
                                    </div>
                                    <div className="col">
                                        <a
                                            href="#"
                                            className="text-decoration-none text-muted"
                                        >
                                            Sell
                                        </a>
                                    </div>
                                    <div className="col">
                                        <a
                                            href="#"
                                            className="text-decoration-none text-muted"
                                        >
                                            Swap
                                        </a>
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
                                                (cryptoEarning < 0
                                                    ? "text-danger"
                                                    : "text-success")
                                            }
                                        >
                                            {cryptoEarning < 0 ? (
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
                                            {cryptoEarning.toFixed(2)} SGD
                                        </span>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <a
                                                href="#"
                                                className="text-decoration-none text-muted"
                                            >
                                                View Portfolio
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-7">
                    <div className="card h-100">
                        <AssetTable cryptoAssets={cryptoAssets} />
                    </div>
                </div>
            </div>
        </div>
    )
}
