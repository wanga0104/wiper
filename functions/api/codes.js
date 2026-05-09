export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand');
    const model = url.searchParams.get('model');
    
    if (!brand || !model) {
        return new Response(JSON.stringify({ error: 'Brand and model parameters are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
    
    try {
        const stmt = env.DB.prepare('SELECT DISTINCT code FROM wipers WHERE brand = ? AND model = ? ORDER BY code');
        const { results } = await stmt.bind(brand, model).all();
        
        const codes = results.map(row => row.code);
        
        return new Response(JSON.stringify(codes), {
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