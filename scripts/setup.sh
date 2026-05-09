#!/bin/bash

echo "🚀 雨刮器查询系统 - 快速设置脚本"
echo "================================"
echo ""

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"
echo ""

# 安装依赖
echo "📦 正在安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"
echo ""

# 检查是否安装了Wrangler
if ! command -v wrangler &> /dev/null; then
    echo "📦 正在安装Wrangler CLI..."
    npm install -g wrangler
    
    if [ $? -ne 0 ]; then
        echo "❌ Wrangler安装失败"
        exit 1
    fi
fi

echo "✅ Wrangler CLI已安装: $(wrangler --version)"
echo ""

# 检查Excel文件
if [ ! -f "速卖通欧亚18国车型库.xlsx" ]; then
    echo "⚠️  警告: 未找到Excel文件"
    echo "📁 请将Excel文件放在项目根目录"
else
    echo "✅ 找到Excel文件"
fi

echo ""
echo "🎉 设置完成！"
echo ""
echo "📝 下一步操作:"
echo "1. 如果有Python环境，运行: python scripts/excel-to-sql.py"
echo "2. 创建D1数据库: wrangler d1 create wiper_db"
echo "3. 更新wrangler.toml中的database_id"
echo "4. 创建表结构: wrangler d1 execute wiper_db --file=schema.sql"
echo "5. 导入数据: wrangler d1 execute wiper_db --file=data-import.sql"
echo "6. 本地开发: npm run dev"
echo "7. 部署: npm run deploy"
echo ""
echo "📖 更多信息请查看 README.md"