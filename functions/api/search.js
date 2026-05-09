export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    const brand = url.searchParams.get('brand');
    const model = url.searchParams.get('model');
    const code = url.searchParams.get('code');
    const country = url.searchParams.get('country');
    const wikiCode = url.searchParams.get('wiki_code');
    const year = url.searchParams.get('year');
    const vehicleStructure = url.searchParams.get('vehicle_structure');
    
    if (!brand || !model) {
        return new Response(JSON.stringify({ error: 'Brand and model are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
    
    try {
        let query = 'SELECT * FROM wipers WHERE brand = ? AND model = ?';
        const params = [brand, model];
        
        if (code) {
            query += ' AND code = ?';
            params.push(code);
        }
        
        if (country) {
            query += ' AND country = ?';
            params.push(country);
        }
        
        if (wikiCode) {
            query += ' AND wiki_code = ?';
            params.push(wikiCode);
        }
        
        if (year) {
            query += ' AND year = ?';
            params.push(year);
        }
        
        if (vehicleStructure) {
            query += ' AND vehicle_structure = ?';
            params.push(vehicleStructure);
        }
        
        query += ' ORDER BY id LIMIT 50';
        
        const stmt = env.DB.prepare(query);
        const { results } = await stmt.bind(...params).all();
        
        return new Response(JSON.stringify(results), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}