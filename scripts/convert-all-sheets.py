#!/usr/bin/env python3
"""
雨刮器数据导入脚本 - 将Excel的所有Sheet转换为SQL插入语句
支持多Sheet处理
"""

import sys
import os

def check_dependencies():
    try:
        import pandas as pd
        import openpyxl
        return True
    except ImportError as e:
        print(f"❌ 缺少必要的库: {e}")
        print("\n📦 请安装必要的库:")
        print("pip install pandas openpyxl")
        return False

def clean_value(value):
    if pd.isna(value) or value is None:
        return 'NULL'
    
    value_str = str(value).strip()
    if not value_str or value_str.lower() in ['nan', 'none', '']:
        return 'NULL'
    
    value_str = value_str.replace("'", "''")
    value_str = value_str.replace("\\", "\\\\")
    return f"'{value_str}'"

def process_sheet(df, sheet_name):
    print(f"  📋 处理Sheet: {sheet_name}")
    print(f"     数据形状: {df.shape[0]} 行 x {df.shape[1]} 列")
    print(f"     列名: {', '.join(df.columns.tolist())}")
    
    sql_statements = []
    sql_statements.append(f"-- 数据来源: Sheet '{sheet_name}'")
    sql_statements.append(f"-- 记录数: {len(df)}")
    
    valid_count = 0
    
    for index, row in df.iterrows():
        brand = clean_value(row.get('品牌', ''))
        model = clean_value(row.get('车型', ''))
        code = clean_value(row.get('代码', ''))
        country = clean_value(row.get('国家', ''))
        wiki_code = clean_value(row.get('维基显示代码', ''))
        year = clean_value(row.get('年份', ''))
        vehicle_structure = clean_value(row.get('车结构', ''))
        wiper_size = clean_value(row.get('雨刮器尺寸', ''))
        connector_type = clean_value(row.get('接头类型', ''))
        
        if brand == 'NULL' or model == 'NULL':
            continue
            
        sql = f"""INSERT INTO wipers (brand, model, code, country, wiki_code, year, vehicle_structure, wiper_size, connector_type)
VALUES ({brand}, {model}, {code}, {country}, {wiki_code}, {year}, {vehicle_structure}, {wiper_size}, {connector_type});"""
        
        sql_statements.append(sql)
        valid_count += 1
    
    print(f"     ✅ 有效记录: {valid_count}")
    print()
    
    return sql_statements, valid_count

def excel_to_sql():
    excel_file = '速卖通欧亚18国车型库.xlsx'
    output_file = 'data-import-full.sql'
    
    if not os.path.exists(excel_file):
        print(f"❌ 错误: 找不到Excel文件 {excel_file}")
        print("📁 请确保Excel文件位于项目根目录")
        sys.exit(1)
    
    print("=" * 60)
    print("🚀 雨刮器数据转换工具 - 多Sheet版本")
    print("=" * 60)
    print()
    
    if not check_dependencies():
        sys.exit(1)
    
    import pandas as pd
    
    try:
        print(f"📄 正在读取Excel文件: {excel_file}")
        
        excel_file_obj = pd.ExcelFile(excel_file)
        sheet_names = excel_file_obj.sheet_names
        
        print(f"📊 发现 {len(sheet_names)} 个Sheet:")
        for i, name in enumerate(sheet_names, 1):
            print(f"   {i}. {name}")
        print()
        
        all_sql = []
        all_sql.append("-- ================================================")
        all_sql.append("-- 雨刮器数据库 - 完整数据导入")
        all_sql.append(f"-- 源文件: {excel_file}")
        all_sql.append(f"-- 处理时间: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}")
        all_sql.append(f"-- Sheet数量: {len(sheet_names)}")
        all_sql.append("-- ================================================")
        all_sql.append("")
        
        total_valid_records = 0
        
        for sheet_name in sheet_names:
            print(f"🔄 正在处理: {sheet_name}")
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
            
            sheet_sql, valid_count = process_sheet(df, sheet_name)
            all_sql.extend(sheet_sql)
            total_valid_records += valid_count
            
            all_sql.append("")
            all_sql.append(f"-- Sheet '{sheet_name}' 处理完成，共 {valid_count} 条记录")
            all_sql.append("")
        
        sql_content = '\n'.join(all_sql)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        print("=" * 60)
        print("✅ 数据转换完成！")
        print("=" * 60)
        print(f"📝 输出文件: {output_file}")
        print(f"📊 总计有效记录: {total_valid_records}")
        print(f"📋 处理的Sheet数: {len(sheet_names)}")
        print()
        print("🚀 下一步操作:")
        print(f"1. 确保数据库表已创建: wrangler d1 execute wiper_db --file=schema.sql")
        print(f"2. 导入数据: wrangler d1 execute wiper_db --file={output_file}")
        print()
        print("💡 提示:")
        print("- 如果数据量很大，导入可能需要几分钟")
        print("- 可以先测试导入几条数据确认格式正确")
        print("- 导入前建议备份数据库")
        
    except Exception as e:
        print(f"❌ 处理Excel文件时出错: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    excel_to_sql()