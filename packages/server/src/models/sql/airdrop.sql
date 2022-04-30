CREATE TABLE IF NOT EXISTS `airdrops` (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    airdrop_id VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (uid, airdrop_id)
) ENGINE=InnoDB;
