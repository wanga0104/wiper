#!/usr/bin/env python3
"""
雨刮器数据导入脚本 - 将Excel转换为SQL插入语句
"""

try:
    import pandas as pd
    import sys
    import os
except ImportError as e:
    print(f"❌ 缺少必要的库: {e}")
    print("📦 请安装: pip install pandas openpyxl")
    sys.exit(1)

def excel_to_sql():
    excel_file = '速卖通欧亚18国车型库.xlsx'
    output_file = 'data-import.sql'
    
    if not os.path.exists(excel_file):
        print(f"❌ 错误: 找不到Excel文件 {excel_file}")
        print("📁 请确保Excel文件位于项目根目录")
        sys.exit(1)
    
    print("📋 正在读取Excel文件...")
    
    try:
        df = pd.read_excel(excel_file)
        
        print(f"✅ 成功读取Excel文件")
        print(f"📊 数据形状: {df.shape[0]} 行 x {df.shape[1]} 列")
        print(f"📝 列名: {', '.join(df.columns.tolist())}\n")
        
        print("🔄 正在生成SQL插入语句...")
        
        sql_statements = []
        sql_statements.append("-- 雨刮器数据导入")
        sql_statements.append("-- 生成时间: " + pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"))
        sql_statements.append("")
        
        for index, row in df.iterrows():
            brand = str(row.get('品牌', '')).replace("'", "''") if pd.notna(row.get('品牌')) else 'NULL'
            model = str(row.get('车型', '')).replace("'", "''") if pd.notna(row.get('车型')) else 'NULL'
            code = str(row.get('代码', '')).replace("'", "''") if pd.notna(row.get('代码')) else 'NULL'
            country = str(row.get('国家', '')).replace("'", "''") if pd.notna(row.get('国家')) else 'NULL'
            wiki_code = str(row.get('维基显示代码', '')).replace("'", "''") if pd.notna(row.get('维基显示代码')) else 'NULL'
            year = str(row.get('年份', '')).replace("'", "''") if pd.notna(row.get('年份')) else 'NULL'
            vehicle_structure = str(row.get('车结构', '')).replace("'", "''") if pd.notna(row.get('车结构')) else 'NULL'
            wiper_size = str(row.get('雨刮器尺寸', '')).replace("'", "''") if pd.notna(row.get('雨刮器尺寸')) else 'NULL'
            connector_type = str(row.get('接头类型', '')).replace("'", "''") if pd.notna(row.get('接头类型')) else 'NULL'
            
            if brand == 'NULL' or model == 'NULL':
                continue
                
            sql = f"""INSERT INTO wipers (brand, model, code, country, wiki_code, year, vehicle_structure, wiper_size, connector_type)
VALUES (
    {brand if brand != 'NULL' else 'NULL'},
    {model if model != 'NULL' else 'NULL'},
    {code if code != 'NULL' else 'NULL'},
    {country if country != 'NULL' else 'NULL'},
    {wiki_code if wiki_code != 'NULL' else 'NULL'},
    {year if year != 'NULL' else 'NULL'},
    {vehicle_structure if vehicle_structure != 'NULL' else 'NULL'},
    {wiper_size if wiper_size != 'NULL' else 'NULL'},
    {connector_type if connector_type != 'NULL' else 'NULL'}
);"""
            
            sql_statements.append(sql)
        
        sql_content = '\n'.join(sql_statements)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        print(f"✅ SQL文件生成成功: {output_file}")
        print(f"📊 共生成 {len(sql_statements) - 2} 条插入语句")
        print(f"\n🚀 下一步:")
        print(f"1. 在Cloudflare控制台创建D1数据库")
        print(f"2. 运行 schema.sql 创建表结构")
        print(f"3. 运行 data-import.sql 导入数据")
        print(f"\n📝 或者使用wrangler命令:")
        print(f"   wrangler d1 execute wiper_db --file=schema.sql")
        print(f"   wrangler d1 execute wiper_db --file=data-import.sql")
        
    except Exception as e:
        print(f"❌ 处理Excel文件时出错: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    excel_to_sql()