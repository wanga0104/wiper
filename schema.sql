-- 雨刮器数据库表结构
-- 创建主表
CREATE TABLE IF NOT EXISTS wipers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    code TEXT,
    country TEXT,
    wiki_code TEXT,
    year TEXT,
    vehicle_structure TEXT,
    wiper_size TEXT,
    connector_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_brand ON wipers(brand);
CREATE INDEX IF NOT EXISTS idx_model ON wipers(model);
CREATE INDEX IF NOT EXISTS idx_code ON wipers(code);
CREATE INDEX IF NOT EXISTS idx_country ON wipers(country);
CREATE INDEX IF NOT EXISTS idx_wiki_code ON wipers(wiki_code);
CREATE INDEX IF NOT EXISTS idx_year ON wipers(year);
CREATE INDEX IF NOT EXISTS idx_vehicle_structure ON wipers(vehicle_structure);
CREATE INDEX IF NOT EXISTS idx_connector_type ON wipers(connector_type);

-- 创建复合索引用于常见的查询组合
CREATE INDEX IF NOT EXISTS idx_brand_model ON wipers(brand, model);
CREATE INDEX IF NOT EXISTS idx_country_wiki_code ON wipers(country, wiki_code);
CREATE INDEX IF NOT EXISTS idx_brand_country_year ON wipers(brand, country, year);