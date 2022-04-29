CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    request_type VARCHAR(255) NOT NULL,
    request_status VARCHAR(255) NOT NULL,
    ccy_id BIGINT UNSIGNED NOT NULL,
    amount BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (ccy_id) REFERENCES currencies (id)
) ENGINE=InnoDB;
