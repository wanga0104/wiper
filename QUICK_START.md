# 🚀 快速入门指南

## 系统概述

这是一个完整的雨刮器查询系统，基于 Cloudflare Pages + D1 构建，支持7级级联查询。

## 📁 项目结构

```
Wiper/
├── public/              # 前端文件
│   ├── index.html      # 主页面
│   ├── style.css       # 样式
│   └── script.js       # 前端逻辑
├── functions/          # API接口
│   └── api/            # 各种查询接口
├── scripts/            # 工具脚本
├── schema.sql          # 数据库结构
├── demo-data.sql       # 演示数据
└── wrangler.toml       # Cloudflare配置
```

## 🛠️ 部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 创建D1数据库

```bash
wrangler d1 create wiper_db
```

复制输出中的 `database_id`，更新 `wrangler.toml` 文件：

```toml
[[d1_databases]]
binding = "DB"
database_name = "wiper_db"
database_id = "你的database_id"
```

### 3. 创建数据库表

```bash
wrangler d1 execute wiper_db --file=schema.sql
```

### 4. 导入数据

#### 使用演示数据（快速测试）

```bash
wrangler d1 execute wiper_db --file=demo-data.sql
```

#### 导入真实数据

如果有Python环境：

```bash
pip install pandas openpyxl
python scripts/excel-to-sql.py
wrangler d1 execute wiper_db --file=data-import.sql
```

### 5. 本地开发

```bash
npm run dev
```

访问 http://localhost:8788

### 6. 部署到Cloudflare Pages

```bash
npm run deploy
```

## 🎯 功能特性

- ✅ 7级级联查询：品牌 → 车型 → 代码 → 国家 → 维基显示代码 → 年份 → 车结构
- ✅ 实时联动选择
- ✅ 响应式设计
- ✅ 显示雨刮器尺寸和接头类型
- ✅ 错误处理和加载状态

## 📊 数据字段

| 字段 | 说明 | 示例 |
|------|------|------|
| brand | 品牌 | Toyota |
| model | 车型 | Corolla |
| code | 代码 | E120 |
| country | 国家 | Germany |
| wiki_code | 维基代码 | DE |
| year | 年份 | 2002-2008 |
| vehicle_structure | 车结构 | Sedan |
| wiper_size | 雨刮器尺寸 | 24"/16" |
| connector_type | 接头类型 | U-hook |

## 🔧 API接口

- `GET /api/brands` - 获取品牌列表
- `GET /api/models?brand={brand}` - 获取车型列表
- `GET /api/codes?brand={brand}&model={model}` - 获取代码列表
- `GET /api/countries?brand={brand}&model={model}&code={code}` - 获取国家列表
- `GET /api/wiki-codes?...` - 获取维基代码列表
- `GET /api/years?...` - 获取年份列表
- `GET /api/vehicle-structures?...` - 获取车结构列表
- `GET /api/search?...` - 搜索雨刮器

## 📱 使用说明

1. 打开网页
2. 从"品牌"下拉框开始选择
3. 依次选择所有7个条件
4. 点击"查询雨刮器"按钮
5. 查看结果中的雨刮器尺寸和接头类型

## 🐛 故障排除

### 数据导入失败
- 检查Excel文件格式
- 确保列名正确：品牌、车型、代码、国家、维基显示代码、年份、车结构、雨刮器尺寸、接头类型

### 前端无法获取数据
- 检查D1数据库是否正确绑定
- 查看浏览器控制台错误信息
- 确认所有API文件都已创建

### 部署失败
- 检查wrangler.toml配置
- 确认已登录Cloudflare账户
- 查看部署日志

## 💡 提示

- 先使用演示数据测试系统功能
- 确认系统正常工作后再导入真实数据
- 定期备份数据库
- 监控API调用次数和性能

## 📚 更多信息

详细文档请查看 [README.md](./README.md)