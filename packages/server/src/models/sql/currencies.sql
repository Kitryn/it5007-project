CREATE TABLE IF NOT EXISTS `currencies` (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    symbol VARCHAR(255) UNIQUE NOT NULL,
    lp_pair_id BIGINT UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
) ENGINE=InnoDB;