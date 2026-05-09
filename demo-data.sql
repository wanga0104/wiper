-- 演示数据 - 雨刮器查询系统
-- 这是一个小型数据集，用于测试系统功能

-- 清空现有数据（谨慎使用）
-- DELETE FROM wipers;

-- 插入演示数据
INSERT INTO wipers (brand, model, code, country, wiki_code, year, vehicle_structure, wiper_size, connector_type) VALUES
('Toyota', 'Corolla', 'E120', 'Germany', 'DE', '2002-2008', 'Sedan', '24"/16"', 'U-hook'),
('Toyota', 'Corolla', 'E120', 'France', 'FR', '2002-2008', 'Hatchback', '24"/16"', 'U-hook'),
('Toyota', 'Camry', 'XV50', 'Russia', 'RU', '2011-2014', 'Sedan', '26"/19"', 'Push-button'),
('Toyota', 'Camry', 'XV50', 'Poland', 'PL', '2011-2014', 'Sedan', '26"/19"', 'Push-button'),
('Volkswagen', 'Golf', 'MK7', 'Germany', 'DE', '2012-2019', 'Hatchback', '28"/20"', 'Pin-lock'),
('Volkswagen', 'Passat', 'B8', 'Czech Republic', 'CZ', '2014-2020', 'Wagon', '28"/22"', 'Pin-lock'),
('BMW', '3 Series', 'F30', 'Germany', 'DE', '2011-2019', 'Sedan', '24"/22"', 'Push-button'),
('BMW', '5 Series', 'G30', 'Austria', 'AT', '2016-2023', 'Sedan', '26"/22"', 'Push-button'),
('Mercedes-Benz', 'C-Class', 'W205', 'Germany', 'DE', '2014-2021', 'Sedan', '26"/22"', 'Pin-lock'),
('Mercedes-Benz', 'E-Class', 'W213', 'Hungary', 'HU', '2016-2023', 'Sedan', '26"/22"', 'Pin-lock'),
('Audi', 'A4', 'B9', 'Germany', 'DE', '2015-2023', 'Sedan', '28"/22"', 'Push-button'),
('Audi', 'A6', 'C8', 'Germany', 'DE', '2018-2024', 'Sedan', '28"/22"', 'Push-button'),
('Hyundai', 'Elantra', 'AD', 'South Korea', 'KR', '2015-2020', 'Sedan', '26"/18"', 'U-hook'),
('Hyundai', 'Sonata', 'LF', 'South Korea', 'KR', '2014-2020', 'Sedan', '26"/19"', 'U-hook'),
('Kia', 'Optima', 'JF', 'South Korea', 'KR', '2015-2020', 'Sedan', '26"/19"', 'U-hook'),
('Kia', 'Sorento', 'UM', 'South Korea', 'KR', '2014-2020', 'SUV', '26"/16"', 'U-hook'),
('Ford', 'Focus', 'MK4', 'Germany', 'DE', '2018-2023', 'Hatchback', '28"/18"', 'Push-button'),
('Ford', 'Mondeo', 'MK5', 'Spain', 'ES', '2014-2022', 'Sedan', '26"/22"', 'Push-button'),
('Honda', 'Civic', 'FC', 'Japan', 'JP', '2015-2021', 'Hatchback', '26"/16"', 'U-hook'),
('Honda', 'Accord', 'CY', 'Japan', 'JP', '2017-2022', 'Sedan', '26"/19"', 'U-hook'),
('Nissan', 'Qashqai', 'J11', 'UK', 'GB', '2013-2020', 'SUV', '26"/16"', 'Push-button'),
('Nissan', 'X-Trail', 'T32', 'Japan', 'JP', '2013-2020', 'SUV', '26"/18"', 'Push-button'),
('Mazda', '3', 'BP', 'Japan', 'JP', '2018-2023', 'Hatchback', '26"/16"', 'Push-button'),
('Mazda', '6', 'GJ', 'Japan', 'JP', '2012-2021', 'Sedan', '26"/19"', 'Push-button'),
('Skoda', 'Octavia', 'MK4', 'Czech Republic', 'CZ', '2019-2024', 'Combi', '28"/20"', 'Pin-lock'),
('Skoda', 'Superb', 'MK3', 'Czech Republic', 'CZ', '2015-2023', 'Combi', '28"/22"', 'Pin-lock'),
('Peugeot', '308', 'T9', 'France', 'FR', '2021-2024', 'Hatchback', '28"/20"', 'Push-button'),
('Peugeot', '508', 'R2', 'France', 'FR', '2018-2024', 'Sedan', '26"/22"', 'Push-button'),
('Renault', 'Megane', 'MK4', 'France', 'FR', '2016-2023', 'Hatchback', '26"/20"', 'Push-button'),
('Renault', 'Talisman', 'L0', 'France', 'FR', '2015-2022', 'Sedan', '26"/22"', 'Push-button');