export async function onRequest(context) {
    const { env } = context;
    
    try {
        const stmt = env.DB.prepare('SELECT DISTINCT brand FROM wipers ORDER BY brand');
        const { results } = await stmt.all();
        
        const brands = results.map(row => row.brand);
        
        return new Response(JSON.stringify(brands), {
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