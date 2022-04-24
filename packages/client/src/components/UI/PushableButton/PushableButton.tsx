import "./style.css"

const PushableButton = ({ children }) => {
    return (
        <button type="submit" className="btn btn-outline-primary pushable ">
            <span className="front">{children}</span>
        </button>
    )
}
export default PushableButton
