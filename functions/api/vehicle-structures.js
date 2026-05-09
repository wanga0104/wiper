export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand');
    const model = url.searchParams.get('model');
    const code = url.searchParams.get('code');
    const country = url.searchParams.get('country');
    const wikiCode = url.searchParams.get('wiki_code');
    const year = url.searchParams.get('year');
    
    if (!brand || !model || !code || !country || !wikiCode || !year) {
        return new Response(JSON.stringify({ error: 'All parameters are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
    
    try {
        const stmt = env.DB.prepare('SELECT DISTINCT vehicle_structure FROM wipers WHERE brand = ? AND model = ? AND code = ? AND country = ? AND wiki_code = ? AND year = ? ORDER BY vehicle_structure');
        const { results } = await stmt.bind(brand, model, code, country, wikiCode, year).all();
        
        const structures = results.map(row => row.vehicle_structure);
        
        return new Response(JSON.stringify(structures), {
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