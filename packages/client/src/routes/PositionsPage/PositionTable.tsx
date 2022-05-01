import { useState, useRef } from "react"
import { StakedTokenValue } from "../../data"
import "./style.css"
import Modal from "react-modal"
import { postRemoveLiquidity } from "../../api"

const modalStyle = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
}

export default function PositionTable({
    cryptoAssets,
    updateAssetsCallback,
}: {
    cryptoAssets: StakedTokenValue[]
    updateAssetsCallback: () => Promise<void>
}) {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [selectedAsset, setSelectedAsset] = useState<StakedTokenValue | null>(
        null
    )

    const closeModal = () => {
        setModalIsOpen(false)
        setSelectedAsset(null)
    }

    const handleUnstake = async () => {
        closeModal()
        const symbol = `LP_${selectedAsset!.base}_${selectedAsset!.quote}`
        const success = await postRemoveLiquidity(symbol, 0)
        if (!success) {
            alert("Failed to unstake")
        }
        await updateAssetsCallback()
    }

    return (
        <div className="p-2">
            <table className="table">
                <thead>
                    <tr>
                        <th className="text-end">Pair</th>
                        <th className="text-end">Base Value</th>
                        <th className="text-end">Quote Value</th>

                        <th className="text-end">Unstake</th>
                    </tr>
                </thead>
                <tbody>
                    {cryptoAssets.map((crypto: StakedTokenValue) => (
                        <tr key={crypto.base}>
                            <td className="text-end">
                                {`${crypto.base.toUpperCase()} / ${crypto.quote.toUpperCase()}`}
                            </td>
                            <td className="text-end">
                                {`${crypto.baseAmount} ($${parseFloat(
                                    crypto.baseValue
                                ).toFixed(2)})`}
                            </td>
                            <td className="text-end">
                                {`${crypto.quoteAmount} ($${parseFloat(
                                    crypto.quoteValue
                                ).toFixed(2)})`}
                            </td>
                            <td className="">
                                <div className="row ms-xl-5">
                                    <div className="col-lg-5 col-md-12 d-grid py-1">
                                        <button
                                            className="btn btn-outline-primary w-md-300 unstake-btn"
                                            style={{ width: "80px" }}
                                            onClick={() => {
                                                setSelectedAsset(crypto)
                                                setModalIsOpen(true)
                                            }}
                                        >
                                            Unstake
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={modalIsOpen}
                style={modalStyle}
                onRequestClose={closeModal}
            >
                <div className="container">
                    <div className="row mb-1">
                        <div className="col">
                            <p className="text-start text-primary fs-5 fw-bold">
                                MazeSoba
                            </p>
                        </div>
                        <div className="col">
                            <p className="text-end">
                                <button
                                    type="button"
                                    className="btn-close btn-primary"
                                    aria-label="Close"
                                    onClick={closeModal}
                                ></button>
                            </p>
                        </div>
                    </div>
                    <div className="row text-center text-primary">
                        <i className="bi bi-bank2 fs-1 text-dark"></i>
                        <h3>
                            Unstake
                            {selectedAsset
                                ? ` ${selectedAsset.base} / ${selectedAsset.quote}`
                                : ""}
                        </h3>
                        <p className="text-muted fs-6 mb-1">
                            You currently hold {selectedAsset?.baseValue} worth
                            of {selectedAsset?.base} and{" "}
                            {selectedAsset?.quoteValue} worth of{" "}
                            {selectedAsset?.quote} in this pool. Would you like
                            to unstake everything?
                        </p>
                    </div>
                    <div className="row mb-3 d-grid m-3">
                        <button
                            className="btn btn-primary text-capitalize"
                            onClick={() => handleUnstake()}
                        >
                            Yes please!
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
