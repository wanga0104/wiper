# 雨刮器查询系统

基于 Cloudflare Pages + D1 的雨刮器查询系统，支持欧亚18国车型库的级联查询。

## 功能特性

- 🚗 支持7级级联查询：品牌 → 车型 → 代码 → 国家 → 维基显示代码 → 年份 → 车结构
- 🔍 查询结果显示雨刮器尺寸和接头类型
- 📱 响应式设计，支持移动端
- ⚡ 基于 Cloudflare D1 数据库，查询速度快
- 🎨 现代化UI设计

## 技术架构

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **后端**: Cloudflare Pages Functions
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare Pages

## 项目结构

```
wiper-query-system/
├── public/                    # 静态文件目录
│   ├── index.html            # 主页面
│   ├── style.css             # 样式文件
│   └── script.js             # 前端逻辑
├── functions/                 # Cloudflare Functions
│   └── api/
│       ├── brands.js          # 获取品牌列表
│       ├── models.js          # 获取车型列表
│       ├── codes.js           # 获取代码列表
│       ├── countries.js       # 获取国家列表
│       ├── wiki-codes.js      # 获取维基代码列表
│       ├── years.js           # 获取年份列表
│       ├── vehicle-structures.js  # 获取车结构列表
│       └── search.js          # 搜索接口
├── scripts/                   # 工具脚本
│   ├── import-data.js         # 数据导入说明
│   └── excel-to-sql.py        # Excel转SQL脚本
├── schema.sql                 # 数据库表结构
├── wrangler.toml             # Cloudflare配置
└── package.json              # 项目配置
```

## 快速开始

### 1. 准备工作

确保已安装 Node.js 和 npm，然后安装依赖：

```bash
npm install
```

### 2. 数据准备

**✅ SQL文件已生成！**

已自动将Excel文件的3个Sheet转换为SQL格式：
- 📋 **data-import-full.sql** - 包含所有11,861条记录

如需重新生成或修改数据：

```bash
# 使用Node.js脚本（推荐，已配置好）
node scripts/convert-all-sheets.js

# 或使用Python脚本（需要安装依赖）
pip install pandas openpyxl
python scripts/convert-all-sheets.py
```

### 3. 配置Cloudflare

#### 创建D1数据库

```bash
# 创建数据库
wrangler d1 create wiper_db

# 记下输出的database_id，然后更新wrangler.toml
```

更新 `wrangler.toml` 文件中的 `database_id`。

#### 创建表结构

```bash
wrangler d1 execute wiper_db --file=schema.sql
```

#### 导入数据

```bash
wrangler d1 execute wiper_db --file=data-import-full.sql
```

⏱️ **注意：** 包含11,861条记录，导入可能需要几分钟。

📖 **详细导入指南：** 查看 [IMPORT_GUIDE.md](IMPORT_GUIDE.md)

### 4. 本地开发

```bash
npm run dev
```

访问 `http://localhost:8788` 查看效果。

### 5. 部署到Cloudflare Pages

```bash
npm run deploy
```

## 数据库表结构

```sql
CREATE TABLE wipers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,           -- 品牌
    model TEXT NOT NULL,           -- 车型
    code TEXT NOT NULL,            -- 代码
    country TEXT NOT NULL,         -- 国家
    wiki_code TEXT,                -- 维基显示代码
    year TEXT,                     -- 年份
    vehicle_structure TEXT,        -- 车结构
    wiper_size TEXT NOT NULL,      -- 雨刮器尺寸
    connector_type TEXT NOT NULL   -- 接头类型
);
```

## API接口

### 获取品牌列表
```
GET /api/brands
```

### 获取车型列表
```
GET /api/models?brand={brand}
```

### 获取代码列表
```
GET /api/codes?brand={brand}&model={model}
```

### 获取国家列表
```
GET /api/countries?brand={brand}&model={model}&code={code}
```

### 获取维基代码列表
```
GET /api/wiki-codes?brand={brand}&model={model}&code={code}&country={country}
```

### 获取年份列表
```
GET /api/years?brand={brand}&model={model}&code={code}&country={country}&wiki_code={wiki_code}
```

### 获取车结构列表
```
GET /api/vehicle-structures?brand={brand}&model={model}&code={code}&country={country}&wiki_code={wiki_code}&year={year}
```

### 搜索雨刮器
```
GET /api/search?brand={brand}&model={model}&code={code}&country={country}&wiki_code={wiki_code}&year={year}&vehicle_structure={vehicle_structure}
```

## 使用说明

1. 访问网页后，从第一个下拉框（品牌）开始选择
2. 每选择一个选项，下一个下拉框会自动加载可选项
3. 依次选择所有7个条件
4. 点击"查询雨刮器"按钮
5. 系统会显示匹配的雨刮器尺寸和接头类型

## 注意事项

- Excel文件需要包含正确的列名：品牌、车型、代码、国家、维基显示代码、年份、车结构、雨刮器尺寸、接头类型
- 如果某些数据为空，系统会显示"未设置"
- 数据导入前请确保Excel文件格式正确
- 建议定期备份数据库

## 故障排除

### 数据导入失败
- 检查Excel文件格式是否正确
- 确保列名匹配
- 查看错误日志

### 前端无法获取数据
- 检查API端点是否正确配置
- 查看浏览器控制台的错误信息
- 确认D1数据库已正确绑定

### 部署后无法访问
- 检查Cloudflare Pages配置
- 确认环境变量正确设置
- 查看部署日志

## 许可证

MIT License