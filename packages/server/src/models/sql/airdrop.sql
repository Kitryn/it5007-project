CREATE TABLE IF NOT EXISTS `airdrops` (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    airdrop_id BIGINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (uid, airdrop_id)
) ENGINE=InnoDB;
