import "./style.css"

const PushableButton = ({ children, onClickHandler }) => {
    return (
        <button
            type="submit"
            className="btn btn-outline-primary pushable "
            onClick={(e) => onClickHandler(e)}
        >
            <span className="front">{children}</span>
        </button>
    )
}
export default PushableButton
