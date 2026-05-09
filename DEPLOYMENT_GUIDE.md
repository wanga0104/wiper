# 🚀 部署指南 - Cloudflare Pages

## ✅ 当前状态

- ✅ 数据导入完成 (11,861条记录)
- ✅ wrangler.toml 配置完成
- ✅ 本地开发服务器运行中: http://localhost:8788
- ✅ 数据库已绑定: wiper_db

## 📋 部署步骤

### 方式一：通过 Cloudflare Pages 控制台部署（推荐）

#### 1. 登录 Cloudflare

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)

#### 2. 创建 Pages 项目

1. 在左侧菜单选择 **Workers & Pages**
2. 点击 **Create application**
3. 选择 **Pages** 标签
4. 点击 **Upload assets** 或 **Connect to Git**

#### 3. 上传项目文件

**如果选择 "Upload assets":**

1. 将整个项目文件夹压缩为 ZIP 文件（排除 `node_modules` 和 `.wrangler`）
2. 上传 ZIP 文件
3. 项目名称：`wiper-query-system`
4. 点击 **Deploy Site**

**如果选择 "Connect to Git":**

1. 将项目推送到 GitHub/GitLab
2. 授权 Cloudflare 访问你的仓库
3. 选择仓库和分支
4. 配置构建设置：
   - 构建命令：`npm install`
   - 输出目录：`public`

#### 4. 绑定 D1 数据库

1. 部署完成后，进入项目设置
2. 选择 **Settings** → **Functions**
3. 找到 **D1 database bindings**
4. 点击 **Add binding**
5. 配置：
   - Variable name: `DB`
   - D1 database: 选择你创建的 `wiper_db`

#### 5. 配置环境变量（如果需要）

在 **Settings** → **Environment variables** 中添加必要的环境变量。

### 方式二：通过 Wrangler CLI 部署

#### 1. 登录 Cloudflare

```bash
npx wrangler login
```

这会打开浏览器进行授权。

#### 2. 创建 Pages 项目

```bash
npx wrangler pages project create wiper-query-system
```

#### 3. 部署项目

```bash
npx wrangler pages deploy public --project-name=wiper-query-system
```

#### 4. 绑定 D1 数据库

在 Cloudflare 控制台中手动绑定数据库（参考方式一的步骤4）。

### 方式三：通过 Git 自动部署（推荐用于生产环境）

#### 1. 推送代码到 Git

```bash
git init
git add .
git commit -m "Initial commit: Wiper query system"
git remote add origin https://github.com/your-username/wiper-query-system.git
git push -u origin main
```

#### 2. 在 Cloudflare Pages 中连接 Git

1. 按照方式一的步骤操作
2. 选择 "Connect to Git"
3. 配置自动部署

#### 3. 配置构建设置

在项目设置中配置：

```yaml
Build command: npm install
Build output directory: public
```

## 🔧 部署后配置

### 1. 验证数据库绑定

在 Cloudflare 控制台中确认：
- D1 数据库已正确绑定
- Variable name 为 `DB`

### 2. 测试 API 接口

访问你的部署域名，测试以下接口：

```bash
# 获取品牌列表
https://your-domain.pages.dev/api/brands

# 获取车型列表
https://your-domain.pages.dev/api/models?brand=Toyota

# 搜索雨刮器
https://your-domain.pages.dev/api/search?brand=Toyota&model=Corolla
```

### 3. 配置自定义域名（可选）

1. 在项目设置中选择 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名
4. 按照提示配置 DNS 记录

## 🧪 部署验证

### 1. 检查前端界面

访问你的部署域名，确认：
- 页面正常加载
- 品牌下拉框有数据
- 界面样式正确

### 2. 测试查询功能

1. 选择一个品牌（如 Toyota）
2. 选择一个车型（如 Corolla）
3. 点击"查询雨刮器"按钮
4. 确认结果显示正确

### 3. 检查 API 响应

打开浏览器开发者工具，检查：
- Network 中的 API 请求
- 响应状态码为 200
- 返回的数据格式正确

## 🔄 更新部署

### 更新代码后重新部署

```bash
# 如果使用 CLI 部署
npx wrangler pages deploy public --project-name=wiper-query-system

# 如果使用 Git 部署
git add .
git commit -m "Update features"
git push
```

### 更新数据库数据

```bash
# 重新生成 SQL 文件
npm run convert-data

# 导入到远程数据库
npx wrangler d1 execute wiper_db --remote --file=data-import-full.sql
```

## 📊 监控和日志

### 查看 Pages 日志

1. 进入 Cloudflare Pages 项目
2. 选择 **Logs** 标签
3. 可以查看实时日志和历史日志

### 查看 Worker 日志

如果你的 Functions 有错误，可以在 **Workers Logs** 中查看详细信息。

### 监控数据库查询

在 D1 数据库控制台中可以查看：
- 查询统计
- 性能指标
- 存储使用情况

## 🆘 常见问题

### Q: 部署后 API 返回 404

**A:** 检查以下几点：
1. 确认 `functions/` 目录结构正确
2. 确认 D1 数据库已正确绑定
3. 检查 API 文件路径和命名

### Q: 前端可以访问，但 API 不工作

**A:** 可能原因：
1. D1 数据库未绑定或绑定错误
2. Variable name 不是 `DB`
3. 数据库中没有数据

### Q: 如何更新数据库结构？

**A:** 谨慎操作！建议：
1. 备份现有数据
2. 使用 SQL 迁移脚本
3. 先在测试环境验证

### Q: 部署速度很慢怎么办？

**A:** 优化建议：
1. 压缩静态资源
2. 使用 Cloudflare 缓存
3. 优化数据库查询
4. 考虑使用 Cloudflare KV 缓存热点数据

## 📈 性能优化建议

### 1. 启用缓存

在 Functions 中添加缓存头：

```javascript
headers.set('Cache-Control', 'public, max-age=3600');
```

### 2. 优化数据库查询

- 使用已创建的索引
- 避免 SELECT *
- 限制返回结果数量

### 3. 使用 Cloudflare CDN

静态资源会自动通过 CDN 分发，无需额外配置。

### 4. 监控和分析

使用 Cloudflare Analytics 监控：
- 页面访问量
- API 调用次数
- 错误率
- 性能指标

## 🎯 部署检查清单

- [ ] 代码已推送到 Git 或准备好上传
- [ ] wrangler.toml 配置正确
- [ ] D1 数据库已创建并导入数据
- [ ] 本地测试通过
- [ ] 已登录 Cloudflare 账户
- [ ] Pages 项目已创建
- [ ] D1 数据库已绑定到 Pages 项目
- [ ] 自定义域名已配置（如需要）
- [ ] API 接口测试通过
- [ ] 前端功能测试通过
- [ ] 监控和日志已配置

## 📞 需要帮助？

- Cloudflare Pages 文档：https://developers.cloudflare.com/pages/
- Cloudflare D1 文档：https://developers.cloudflare.com/d1/
- Wrangler CLI 文档：https://developers.cloudflare.com/workers/wrangler/

---

**祝你部署顺利！** 🎉