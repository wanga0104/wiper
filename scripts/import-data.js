const fs = require('fs');
const path = require('path');

async function importExcelToSQL() {
    console.log('📋 雨刮器数据导入工具');
    console.log('================================\n');

    const excelFile = path.join(__dirname, '../速卖通欧亚18国车型库.xlsx');
    
    if (!fs.existsSync(excelFile)) {
        console.error('❌ 错误: 找不到Excel文件:', excelFile);
        console.log('📁 请确保Excel文件位于项目根目录');
        process.exit(1);
    }

    console.log('📄 找到Excel文件:', excelFile);
    console.log('⚠️  注意: 由于系统限制，需要手动将Excel转换为CSV格式\n');
    console.log('📝 建议步骤:');
    console.log('1. 使用Excel或其他工具打开Excel文件');
    console.log('2. 另存为CSV格式 (UTF-8编码)');
    console.log('3. 保存为: 速卖通欧亚18国车型库.csv');
    console.log('4. 运行: node scripts/convert-csv-to-sql.js\n');

    console.log('🔧 或者使用Python脚本转换 (如果有pandas和openpyxl):');
    console.log('pip install pandas openpyxl');
    console.log('python scripts/excel-to-sql.py\n');
}

if (require.main === module) {
    importExcelToSQL();
}

module.exports = importExcelToSQL;