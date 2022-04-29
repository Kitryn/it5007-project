CREATE TABLE IF NOT EXISTS `pairs` (
    id SERIAL PRIMARY KEY,
    ccy1_id BIGINT UNSIGNED NOT NULL,
    ccy2_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT `pairs_ibfk_1` FOREIGN KEY (`ccy1_id`) REFERENCES currencies (`id`),
    CONSTRAINT `pairs_ibfk_2` FOREIGN KEY (`ccy2_id`) REFERENCES currencies (`id`),
    UNIQUE (ccy1_id, ccy2_id)
) ENGINE=InnoDB;
