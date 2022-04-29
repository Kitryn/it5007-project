import "./form.css"
import React, { useRef } from "react"
import PushableButton from "../../components/UI/PushableButton"

interface BaseFormProps {
    isDeposit: boolean
}

interface BaseFormState {
    formLabel: string
    secondaryText: string
    subscript: string
    isDeposit: boolean
}

export default class BaseForm extends React.Component<
    BaseFormProps,
    BaseFormState
> {
    private inputElRef: React.RefObject<HTMLInputElement>
    constructor(props: BaseFormProps) {
        super(props)

        this.inputElRef = React.createRef()
    }

    componentDidUpdate() {
        const node = this.inputElRef.current

        if (node) {
            node.focus()
        }
    }

    render() {
        const { isDeposit } = this.props
        const formLabel = isDeposit ? "Deposit" : "Withdraw"
        const secondaryText = isDeposit
            ? "Deposit money into your account"
            : "Withdraw money from your account"
        const subscript = isDeposit
            ? "*Please keep sufficient funds in your bank account to avoid rejection or overdraft"
            : "*Cash withdrawn may process up to 7 working days"

        // Missing maximum withdraw limit check
        return (
            <form name="depositForm" autoComplete="off">
                <div className="cash-display bg-primary ">
                    <div className="row mx-5 pt-5">
                        <div className="span fs-4 text-white">
                            {formLabel} Amount (SGD)
                        </div>
                    </div>
                    <div className="row mx-5 my-4">
                        <div className="col-1"></div>
                        <div className="col-8">
                            <div className="input-group">
                                <span className="topup-font fw-bold input-group-text bg-primary text-white border-0">
                                    $
                                </span>
                                <input
                                    ref={this.inputElRef}
                                    type="text"
                                    className="topup-input form-control-lg border-0 bg-primary fw-bold text-white p-0 m-0"
                                    aria-label="Top Up Amount"
                                    autoComplete="false"
                                    style={{
                                        width: "9em",
                                        fontSize: "4em",
                                    }}
                                    placeholder="0.00"
                                    maxLength={9}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="col-3">
                            <span className="topup-font fw-bold text-white h-100 d-md-block pt-3">
                                SGD
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row text-center p-1 ">
                    <span className="text-secondary ">
                        <em>{subscript}</em>
                    </span>
                </div>
                <div className="row p-5">
                    <div className="d-grid gap-2 col-6 mx-auto ">
                        <PushableButton>{formLabel}</PushableButton>
                    </div>
                </div>
            </form>
        )
    }
}
