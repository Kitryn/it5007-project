export default function AssetTable({ cryptoAssets }) {
    // missing state control for filter and search
    // missing table sorting
    // missing win lose coloring

    interface Crypto {
        name: any
        quantityOwned: string
        currentPrice: string
        purchasedPrice: string
        currency: string
    }

    return (
        <div className="p-2">
            <table className="table">
                <thead>
                    <tr>
                        <th className="align-middle">Name</th>
                        <th className="align-middle">Qty</th>

                        <th className="align-middle">Balance</th>
                        <th className="align-middle">Earning</th>
                        <th>
                            <form className="d-flex ">
                                <button className="btn " type="submit">
                                    <i className="bi bi-search"></i>
                                </button>
                                <input
                                    className="form-control me-2 border-0 border-bottom"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                ></input>
                            </form>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {cryptoAssets.map((crypto: Crypto) => (
                        <tr key={crypto.name}>
                            <td>{crypto.name}</td>
                            <td>{crypto.quantityOwned}</td>
                            <td>
                                {(
                                    parseFloat(crypto.quantityOwned) *
                                    parseFloat(crypto.currentPrice)
                                ).toFixed(2)}
                            </td>
                            <td>
                                {(
                                    parseFloat(crypto.quantityOwned) *
                                        parseFloat(crypto.currentPrice) -
                                    parseFloat(crypto.quantityOwned) *
                                        parseFloat(crypto.purchasedPrice)
                                ).toFixed(2)}
                            </td>
                            <td>
                                <div className="row ms-auto">
                                    <div className="col-5 d-grid">
                                        <button className="btn btn-outline-primary">
                                            Send
                                        </button>
                                    </div>
                                    <div className="col-5 d-grid">
                                        <button className="btn btn-outline-primary">
                                            Receive
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
