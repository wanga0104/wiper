export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand');
    
    if (!brand) {
        return new Response(JSON.stringify({ error: 'Brand parameter is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
    
    try {
        const stmt = env.DB.prepare('SELECT DISTINCT model FROM wipers WHERE brand = ? ORDER BY model');
        const { results } = await stmt.bind(brand).all();
        
        const models = results.map(row => row.model);
        
        return new Response(JSON.stringify(models), {
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