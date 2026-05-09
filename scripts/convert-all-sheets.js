const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function cleanValue(value) {
    if (value === null || value === undefined || value === '') {
        return 'NULL';
    }
    
    const strValue = String(value).trim();
    if (strValue === '' || strValue.toLowerCase() === 'nan' || strValue.toLowerCase() === 'undefined') {
        return 'NULL';
    }
    
    const escaped = strValue.replace(/'/g, "''").replace(/\\/g, '\\\\');
    return `'${escaped}'`;
}

function processSheet(sheetName, worksheet) {
    console.log(`  📋 处理Sheet: ${sheetName}`);
    
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(`     数据行数: ${data.length}`);
    
    if (data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log(`     列名: ${columns.join(', ')}`);
    }
    
    const sqlStatements = [];
    sqlStatements.push(`-- 数据来源: Sheet '${sheetName}'`);
    sqlStatements.push(`-- 记录数: ${data.length}`);
    
    let validCount = 0;
    
    data.forEach((row, index) => {
        const brand = cleanValue(row['品牌']);
        const model = cleanValue(row['车型']);
        const code = cleanValue(row['代码']);
        const country = cleanValue(row['国家']);
        const wikiCode = cleanValue(row['维基显示代码']);
        const year = cleanValue(row['年份']);
        const vehicleStructure = cleanValue(row['车结构']);
        const wiperSize = cleanValue(row['雨刮器尺寸']);
        const connectorType = cleanValue(row['接头类型']);
        
        if (brand === 'NULL' || model === 'NULL') {
            return;
        }
        
        const sql = `INSERT INTO wipers (brand, model, code, country, wiki_code, year, vehicle_structure, wiper_size, connector_type)
VALUES (${brand}, ${model}, ${code}, ${country}, ${wikiCode}, ${year}, ${vehicleStructure}, ${wiperSize}, ${connectorType});`;
        
        sqlStatements.push(sql);
        validCount++;
    });
    
    console.log(`     ✅ 有效记录: ${validCount}`);
    console.log();
    
    return { statements: sqlStatements, validCount };
}

function convertExcelToSQL() {
    const excelFile = '速卖通欧亚18国车型库.xlsx';
    const outputFile = 'data-import-full.sql';
    
    console.log('='.repeat(60));
    console.log('🚀 雨刮器数据转换工具 - 多Sheet版本 (Node.js)');
    console.log('='.repeat(60));
    console.log();
    
    if (!fs.existsSync(excelFile)) {
        console.error(`❌ 错误: 找不到Excel文件 ${excelFile}`);
        console.log('📁 请确保Excel文件位于项目根目录');
        process.exit(1);
    }
    
    try {
        console.log(`📄 正在读取Excel文件: ${excelFile}`);
        
        const workbook = XLSX.readFile(excelFile);
        const sheetNames = workbook.SheetNames;
        
        console.log(`📊 发现 ${sheetNames.length} 个Sheet:`);
        sheetNames.forEach((name, index) => {
            console.log(`   ${index + 1}. ${name}`);
        });
        console.log();
        
        const allSQL = [];
        allSQL.push('-- ================================================');
        allSQL.push('-- 雨刮器数据库 - 完整数据导入');
        allSQL.push(`-- 源文件: ${excelFile}`);
        allSQL.push(`-- 处理时间: ${new Date().toLocaleString('zh-CN')}`);
        allSQL.push(`-- Sheet数量: ${sheetNames.length}`);
        allSQL.push('-- ================================================');
        allSQL.push('');
        
        let totalValidRecords = 0;
        
        sheetNames.forEach(sheetName => {
            console.log(`🔄 正在处理: ${sheetName}`);
            const worksheet = workbook.Sheets[sheetName];
            const { statements, validCount } = processSheet(sheetName, worksheet);
            
            allSQL.push(...statements);
            totalValidRecords += validCount;
            
            allSQL.push('');
            allSQL.push(`-- Sheet '${sheetName}' 处理完成，共 ${validCount} 条记录`);
            allSQL.push('');
        });
        
        const sqlContent = allSQL.join('\n');
        
        fs.writeFileSync(outputFile, sqlContent, 'utf8');
        
        console.log('='.repeat(60));
        console.log('✅ 数据转换完成！');
        console.log('='.repeat(60));
        console.log(`📝 输出文件: ${outputFile}`);
        console.log(`📊 总计有效记录: ${totalValidRecords}`);
        console.log(`📋 处理的Sheet数: ${sheetNames.length}`);
        console.log();
        console.log('🚀 下一步操作:');
        console.log(`1. 确保数据库表已创建: wrangler d1 execute wiper_db --file=schema.sql`);
        console.log(`2. 导入数据: wrangler d1 execute wiper_db --file=${outputFile}`);
        console.log();
        console.log('💡 提示:');
        console.log('- 如果数据量很大，导入可能需要几分钟');
        console.log('- 可以先测试导入几条数据确认格式正确');
        console.log('- 导入前建议备份数据库');
        
    } catch (error) {
        console.error('❌ 处理Excel文件时出错:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

if (require.main === module) {
    convertExcelToSQL();
}

module.exports = convertExcelToSQL;