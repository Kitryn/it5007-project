export default function SearchBar({ setSearchState }) {
    function onChangeHandler(e: any) {
        setSearchState(e.target.value.toUpperCase())
    }

    return (
        <div className="form-group">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span
                        className="input-group-text bg-white border-0"
                        id="inputGroup-sizing-default"
                    >
                        <i className="bi bi-search" />
                    </span>
                </div>
                <input
                    type="search"
                    className="form-control border-0 border-bottom text-uppercase"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    placeholder="ETH"
                    onChange={(e) => onChangeHandler(e)}
                    maxLength={5}
                />
            </div>
        </div>
    )
}
