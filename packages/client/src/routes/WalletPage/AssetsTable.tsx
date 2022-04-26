import { CoinBalance } from "../../data"

export default function AssetTable({ cryptoAssets, onSearchSubmitHandler }) {
    // missing state control for filter and search
    // missing table sorting
    // missing win lose coloring
    function onSubmit(e: any) {
        e.preventDefault()
        const form = document.forms.namedItem("searchForm")
        const searchTerm = form?.searchTerm.value

        onSearchSubmitHandler(searchTerm.toLowerCase())
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
                                ></input>
                            </form>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {cryptoAssets.map((crypto: CoinBalance) => (
                        <tr key={crypto.name}>
                            <td className="text-end">
                                {crypto.name.toUpperCase()}
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
                                {parseFloat(crypto.earning).toFixed(2)}
                            </td>
                            <td className="">
                                <div className="row ps-5">
                                    <div className="col-6 d-grid ">
                                        <button
                                            className="btn btn-outline-primary"
                                            style={{ width: "80px" }}
                                        >
                                            Send
                                        </button>
                                    </div>
                                    <div className="col-6 d-grid ">
                                        <button
                                            className="btn btn-outline-primary"
                                            style={{ width: "80px" }}
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
        </div>
    )
}
