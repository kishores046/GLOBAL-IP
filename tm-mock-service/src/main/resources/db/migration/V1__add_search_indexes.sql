
DELIMITER $$

CREATE PROCEDURE CreateIndexIfNotExists(
    IN indexName VARCHAR(128),
    IN tableName VARCHAR(128),
    IN indexDefinition TEXT
)
BEGIN
    DECLARE indexExists INT DEFAULT 0;

    -- Check if index exists
    SELECT COUNT(1) INTO indexExists
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = tableName
      AND index_name = indexName;

    -- Create index if it doesn't exist
    IF indexExists = 0 THEN
        SET @sql = CONCAT('CREATE INDEX ', indexName, ' ON ', tableName, ' ', indexDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DELIMITER ;

-- Create indexes using the helper procedure
CALL CreateIndexIfNotExists('idx_trademark_mark_name', 'trademark', '(mark_name)');
CALL CreateIndexIfNotExists('idx_trademark_status', 'trademark', '(status_code)');

CALL CreateIndexIfNotExists('idx_owner_country', 'owner_entity', '(owner_country)');
CALL CreateIndexIfNotExists('idx_owner_state', 'owner_entity', '(owner_state)');

CALL CreateIndexIfNotExists('idx_goods_description', 'goods_and_service_entity', '(description(255))');

CALL CreateIndexIfNotExists('idx_international_class_code', 'international_class_entity', '(class_code)');

CALL CreateIndexIfNotExists('idx_trademark_owner_trademark', 'trademark_owner', '(trademark_id)');
CALL CreateIndexIfNotExists('idx_trademark_owner_owner', 'trademark_owner', '(owner_id)');

-- Clean up the helper procedure
DROP PROCEDURE IF EXISTS CreateIndexIfNotExists;