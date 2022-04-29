CREATE TABLE IF NOT EXISTS reserves (
    id SERIAL PRIMARY KEY,
    pair_id BIGINT UNSIGNED NOT NULL,
    ccy_id BIGINT UNSIGNED NOT NULL,
    reserve BIGINT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT `reserves_ibfk_1` FOREIGN KEY (`pair_id`) REFERENCES pairs (`id`),
    CONSTRAINT `reserves_ibfk_2` FOREIGN KEY (`ccy_id`) REFERENCES currencies (`id`),
    UNIQUE (pair_id, ccy_id),
    CHECK (reserve >= 0)
) ENGINE=InnoDB;
