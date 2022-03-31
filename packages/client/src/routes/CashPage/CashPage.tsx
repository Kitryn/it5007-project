import BaseForm from "./BaseForm"
import "./tab.css"

export default function CashPage() {
    return (
        <div className="container">
            <div className="card">
                <ul
                    className="nav nav-pills d-flex flex-row justify-content-around"
                    id="cash-form"
                    role="tablist"
                >
                    <li className="nav-item p-4 fs-5 " role="presentation">
                        <button
                            className="nav-link active px-5 deposit-btn w-100 fs-1 bg-white text-muted "
                            id="deposit-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#deposit-form"
                            type="button"
                            role="tab"
                            aria-controls="deposit-form"
                            aria-selected="true"
                        >
                            Deposit
                        </button>
                    </li>
                    <li className="nav-item p-4 fs-5" role="presentation">
                        <button
                            className="nav-link px-5 withdraw-btn w-100 fs-1 bg-white text-muted"
                            id="withdraw-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#withdraw-form"
                            type="button"
                            role="tab"
                            aria-controls="withdraw-form"
                            aria-selected="false"
                        >
                            Withdraw
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div
                        className="tab-pane fade show active"
                        id="deposit-form"
                        role="tabpanel"
                        aria-labelledby="deposit-form-tab"
                    >
                        <BaseForm isDeposit />
                    </div>
                    <div
                        className="tab-pane fade"
                        id="withdraw-form"
                        role="tabpanel"
                        aria-labelledby="withdraw-form-tab"
                    >
                        <BaseForm isDeposit={false} />
                    </div>
                </div>
            </div>
        </div>
    )
}
