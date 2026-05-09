export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand');
    const model = url.searchParams.get('model');
    const code = url.searchParams.get('code');
    
    if (!brand || !model || !code) {
        return new Response(JSON.stringify({ error: 'Brand, model, and code parameters are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
    
    try {
        const stmt = env.DB.prepare('SELECT DISTINCT country FROM wipers WHERE brand = ? AND model = ? AND code = ? ORDER BY country');
        const { results } = await stmt.bind(brand, model, code).all();
        
        const countries = results.map(row => row.country);
        
        return new Response(JSON.stringify(countries), {
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