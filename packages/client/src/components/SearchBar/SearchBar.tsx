export default function SearchBar() {
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
                    className="form-control border-0 border-bottom"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                />
            </div>
        </div>
    )
}
