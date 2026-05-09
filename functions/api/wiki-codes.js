export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand');
    const model = url.searchParams.get('model');
    const code = url.searchParams.get('code');
    const country = url.searchParams.get('country');
    
    if (!brand || !model || !code || !country) {
        return new Response(JSON.stringify({ error: 'Brand, model, code, and country parameters are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
    
    try {
        const stmt = env.DB.prepare('SELECT DISTINCT wiki_code FROM wipers WHERE brand = ? AND model = ? AND code = ? AND country = ? ORDER BY wiki_code');
        const { results } = await stmt.bind(brand, model, code, country).all();
        
        const wikiCodes = results.map(row => row.wiki_code);
        
        return new Response(JSON.stringify(wikiCodes), {
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