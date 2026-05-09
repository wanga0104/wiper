export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand');
    const model = url.searchParams.get('model');
    const code = url.searchParams.get('code');
    const country = url.searchParams.get('country');
    const wikiCode = url.searchParams.get('wiki_code');
    
    if (!brand || !model || !code || !country || !wikiCode) {
        return new Response(JSON.stringify({ error: 'Brand, model, code, country, and wiki_code parameters are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
    
    try {
        const stmt = env.DB.prepare('SELECT DISTINCT year FROM wipers WHERE brand = ? AND model = ? AND code = ? AND country = ? AND wiki_code = ? ORDER BY year');
        const { results } = await stmt.bind(brand, model, code, country, wikiCode).all();
        
        const years = results.map(row => row.year);
        
        return new Response(JSON.stringify(years), {
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