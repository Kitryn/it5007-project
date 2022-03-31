export default function SearchBar() {
    return (
        <div className="form-group">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span
                        className="input-group-text"
                        id="inputGroup-sizing-default"
                    >
                        <i className="bi bi-search" />
                    </span>
                </div>
                <input
                    type="search"
                    className="form-control"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                />
            </div>
        </div>
    )
}
