import date from "date-and-time"

export default function DatePicker({ defaultDate, setNewDate }) {
    function onDateChangeHandler(e: any) {
        e.preventDefault()
        setNewDate(date.parse(e.target.value, "YYYY-MM-DD"))
    }
    return (
        <form className="form-floating col-4">
            <div className="input-group">
                <input
                    type="date"
                    className="form-control text-center text-primary fw-bold text-uppercase"
                    defaultValue={date.format(defaultDate, "YYYY-MM-DD")}
                    onChange={(e) => onDateChangeHandler(e)}
                />
            </div>
        </form>
    )
}
