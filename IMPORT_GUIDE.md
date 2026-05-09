# 📊 数据导入指南

## ✅ SQL文件已生成完成

已成功将Excel文件的3个Sheet转换为SQL格式：

**数据统计：**
- 📋 Sheet0: 9,052 条记录
- 📋 全新欧洲车型库: 1,957 条记录  
- 📋 Ozon 俄罗斯: 852 条记录
- **总计: 11,861 条有效记录**

**输出文件：** `data-import-full.sql`

## 🚀 手动导入步骤

### 1. 创建D1数据库（如果还没有）

```bash
wrangler d1 create wiper_db
```

记下输出的 `database_id`，更新 `wrangler.toml` 文件。

### 2. 更新 wrangler.toml

打开 `wrangler.toml` 文件，将 `database_id` 替换为你刚才创建的ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "wiper_db"
database_id = "your-database-id-here"  # 替换为实际的ID
```

### 3. 创建数据库表结构

```bash
wrangler d1 execute wiper_db --file=schema.sql
```

### 4. 导入完整数据

```bash
wrangler d1 execute wiper_db --file=data-import-full.sql
```

⏱️ **注意：** 由于包含11,861条记录，导入可能需要几分钟时间，请耐心等待。

## 📋 数据导入说明

### Excel文件结构

原始Excel文件包含3个Sheet：

1. **Sheet0** (9,052条记录)
   - 列：来源, 品牌, 车型, 雨刮器尺寸, 接头类型
   - 主要数据源

2. **全新欧洲车型库** (1,957条记录)
   - 列：来源, 品牌, 车型, 年份, 车结构, 雨刮器尺寸, 接头类型, 速卖通上传
   - 欧洲市场专用数据

3. **Ozon 俄罗斯** (852条记录)
   - 列：品牌, 车型, 年份, 车结构, 雨刮器尺寸, 接头类型
   - 俄罗斯市场数据

### 数据映射

所有数据已统一映射到以下字段：
- `brand` - 品牌
- `model` - 车型
- `code` - 代码（如果Excel中有）
- `country` - 国家（如果Excel中有）
- `wiki_code` - 维基显示代码（如果Excel中有）
- `year` - 年份（如果Excel中有）
- `vehicle_structure` - 车结构（如果Excel中有）
- `wiper_size` - 雨刮器尺寸
- `connector_type` - 接头类型

### NULL值处理

- Excel中空白的单元格会被转换为SQL的NULL值
- 系统会自动过滤掉品牌和车型都为空的记录

## 🧪 测试导入（可选）

如果你想先测试几条数据：

1. 创建一个测试文件 `test-data.sql`，只包含前几条INSERT语句：

```sql
-- 从 data-import-full.sql 复制前5-10条INSERT语句到这里
```

2. 导入测试数据：

```bash
wrangler d1 execute wiper_db --file=test-data.sql
```

3. 查询测试数据：

```bash
wrangler d1 execute wiper_db --command="SELECT * FROM wipers LIMIT 5"
```

4. 如果测试成功，再导入完整数据。

## 🔍 验证导入

导入完成后，可以验证数据：

```bash
# 查看总记录数
wrangler d1 execute wiper_db --command="SELECT COUNT(*) as total FROM wipers"

# 查看品牌数量
wrangler d1 execute wiper_db --command="SELECT COUNT(DISTINCT brand) as brands FROM wipers"

# 查看样本数据
wrangler d1 execute wiper_db --command="SELECT * FROM wipers LIMIT 10"
```

## 🐛 常见问题

### 导入失败或超时

**解决方案：**
1. 检查网络连接
2. 将大文件拆分成小批次导入
3. 增加超时时间（如果支持）

### 数据格式错误

**解决方案：**
1. 检查 `schema.sql` 是否已正确执行
2. 确认字段类型匹配
3. 查看错误日志定位问题记录

### 重复导入

**解决方案：**
```bash
# 清空现有数据（谨慎使用！）
wrangler d1 execute wiper_db --command="DELETE FROM wipers"

# 然后重新导入
wrangler d1 execute wiper_db --file=data-import-full.sql
```

## 📝 备份建议

在导入前，建议先备份数据库：

```bash
# 导出当前数据（如果有）
wrangler d1 export wiper_db --output=backup.sql
```

## 🎯 下一步

数据导入成功后：

1. **本地测试：**
   ```bash
   npm run dev
   ```
   访问 http://localhost:8788 测试功能

2. **部署到生产环境：**
   ```bash
   npm run deploy
   ```

3. **配置自定义域名**（可选）
   在Cloudflare Pages设置中添加自定义域名

## 📞 需要帮助？

- 查看完整文档：[README.md](README.md)
- 查看快速入门：[QUICK_START.md](QUICK_START.md)
- Cloudflare D1文档：https://developers.cloudflare.com/d1/

---

**祝你导入顺利！** 🎉