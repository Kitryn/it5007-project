CREATE TABLE IF NOT EXISTS `balances` (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    ccy_id BIGINT UNSIGNED NOT NULL,
    amount BIGINT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (ccy_id) REFERENCES currencies (id),
    UNIQUE (uid, ccy_id),
    CHECK (amount >= 0)
) ENGINE=InnoDB;