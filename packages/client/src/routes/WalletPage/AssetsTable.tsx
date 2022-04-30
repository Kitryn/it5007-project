import { useState, useRef } from "react"
import { CoinBalance } from "../../data"
import Modal from "react-modal"
import { getDepositAddress, postWithdrawRequest } from "../../api"

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

interface ModelInfo extends CoinBalance {
    operation: string
    address: string
}

export default function AssetTable({ cryptoAssets, onSearchSubmitHandler }) {
    function onSubmit(e: any) {
        e.preventDefault()
        const form = document.forms.namedItem("searchForm")
        const searchTerm = form?.searchTerm.value

        onSearchSubmitHandler(searchTerm.toLowerCase())
    }

    const [modalIsOpen, setIsOpen] = useState(false)
    const [modalInfo, setModelInfo] = useState<ModelInfo>()

    const htmlRef1 = useRef<HTMLInputElement>(null)
    const htmlRef2 = useRef<HTMLInputElement>(null)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal(modalInfo: ModelInfo) {
        let address: string | undefined
        getDepositAddress(modalInfo.symbol).then((res) => {
            address = res?.address
            modalInfo.address = address || ""
            console.log(modalInfo)

            setModelInfo(modalInfo)
            setIsOpen(true)
        })
    }

    function onSubmitHandler(e: any) {
        e.preventDefault()
        const qty = htmlRef1.current
        const address = htmlRef2.current

        if (qty && address) {
            if (Number(qty.value) === parseFloat(qty.value) && address.value) {
                const currQty = modalInfo ? modalInfo.qty : 0
                const ccy = modalInfo ? modalInfo.symbol : ""
                if (parseFloat(qty.value) > currQty) {
                    alert(
                        `You do not have enough ${modalInfo?.name} to fulfill this request`
                    )
                } else {
                    postWithdrawRequest(
                        ccy,
                        parseFloat(qty.value),
                        address.value
                    )
                }

                closeModal()
                alert("Request submited")
            } else {
                alert("Please check your inputs")
            }
        }
    }

    return (
        <div className="p-2">
            <table className="table">
                <thead>
                    <tr>
                        <th className="text-end">Name</th>
                        <th className="text-end">Qty</th>

                        <th className="text-end">Balance</th>
                        <th className="text-end">Earning</th>
                        <th>
                            <form
                                className="d-flex"
                                onSubmit={onSubmit}
                                id="searchForm"
                            >
                                <button className="btn " type="submit">
                                    <i className="bi bi-search"></i>
                                </button>
                                <input
                                    className="form-control me-2 border-0 border-bottom"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    name="searchTerm"
                                    autoComplete="off"
                                ></input>
                            </form>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {cryptoAssets.map((crypto: CoinBalance) => (
                        <tr key={crypto.symbol}>
                            <td className="text-end">
                                {crypto.symbol.toUpperCase()}
                            </td>
                            <td className="text-end">
                                {parseFloat(crypto.qty).toFixed(2)}
                            </td>
                            <td className="text-end">
                                {parseFloat(crypto.value).toFixed(2)}
                            </td>
                            <td
                                className={`text-end ${
                                    parseFloat(crypto.earning) >= 0
                                        ? "text-success"
                                        : "text-danger"
                                }`}
                            >
                                {parseFloat(crypto.earningValue).toFixed(2)}
                            </td>
                            <td className="">
                                <div className="row ps-5">
                                    <div className="col-6 d-grid ">
                                        <button
                                            className="btn btn-outline-primary"
                                            style={{ width: "80px" }}
                                            onClick={() =>
                                                openModal({
                                                    ...crypto,
                                                    operation: "send",
                                                    address: "",
                                                })
                                            }
                                        >
                                            Send
                                        </button>
                                    </div>
                                    <div className="col-6 d-grid ">
                                        <button
                                            className="btn btn-outline-primary"
                                            style={{ width: "80px" }}
                                            onClick={() =>
                                                openModal({
                                                    ...crypto,
                                                    operation: "receive",
                                                    address: "",
                                                })
                                            }
                                        >
                                            Receive
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
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
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
                    {modalInfo?.operation === "send" ? (
                        <>
                            <div className="row">
                                <form className="p-3">
                                    <div className="row text-center">
                                        <i className="bi bi-cloud-haze2 fs-1 text-dark"></i>
                                    </div>
                                    <div className="row fs-5 text-muted">
                                        <p>
                                            You are about to send{" "}
                                            <span className="text-primary">
                                                {modalInfo.name}
                                            </span>{" "}
                                            away from this platform <br /> This
                                            request will take up to 7 working
                                            days to process.
                                        </p>
                                    </div>
                                    <div className="row mb-3">
                                        <label
                                            htmlFor="transferQuantity"
                                            className="form-label"
                                        >
                                            Transfer Quantity
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={
                                                "You have " + modalInfo?.qty
                                            }
                                            id="transferQuantity"
                                            aria-describedby="addressHelp"
                                            ref={htmlRef1}
                                            maxLength={5}
                                            autoFocus
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="row mb-4">
                                        <label
                                            htmlFor="walletAddress"
                                            className="form-label"
                                        >
                                            Target Address
                                        </label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            placeholder="wallet address"
                                            id="walletAddress"
                                            aria-describedby="addressHelp"
                                            ref={htmlRef2}
                                            maxLength={50}
                                        />
                                    </div>
                                    <div className="row mb-3 d-grid">
                                        <button
                                            className="btn btn-primary text-capitalize"
                                            onClick={(e) => onSubmitHandler(e)}
                                        >
                                            {modalInfo?.operation}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="row text-center text-primary">
                            <i className="bi bi-send-check fs-1 text-dark"></i>
                            <p className="text-muted fs-4 mb-1">
                                Please send your {modalInfo?.symbol} to this
                                address
                            </p>
                            <h3>{modalInfo?.address}</h3>
                            <p className="text-muted fs-6 mb-1">
                                It'll be credited to your account within 7
                                working days
                            </p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}
