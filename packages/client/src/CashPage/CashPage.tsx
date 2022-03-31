import BaseForm from "./BaseForm"

export default function CashPage() {
    return (
        <div className="container">
            <div className="card">
                {/** Bootstrap tabbed pane for displaying deposit form and withdraw form on this page*/}
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <a
                                className="nav-link active"
                                href="#deposit"
                                data-toggle="tab"
                            >
                                Deposit
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#withdraw"
                                data-toggle="tab"
                            >
                                Withdraw
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    <div className="tab-content">
                        <div className="tab-pane active" id="deposit">
                            <BaseForm isDeposit={true} />
                        </div>
                        <div className="tab-pane" id="withdraw">
                            <BaseForm isDeposit={false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
