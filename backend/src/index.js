/**
 * SigAndSys API Worker
 * 
 * This Cloudflare Worker provides API endpoints for the SigAndSys blog.
 * Currently serves as a placeholder for future backend functionality.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers for frontend communication
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    switch (url.pathname) {
      case '/':
        return new Response(JSON.stringify({
          message: 'SigAndSys API',
          version: '1.0.0',
          status: 'active',
          endpoints: [
            'GET /health - Health check',
            'GET /articles - List articles (future)',
            'POST /articles - Create article (future)',
            'GET /analytics - Get analytics (future)'
          ]
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case '/health':
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          environment: env.ENVIRONMENT || 'development'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case '/articles':
        // Future: Implement article management
        return new Response(JSON.stringify({
          message: 'Article management not yet implemented',
          note: 'Articles are currently served statically from the frontend'
        }), {
          status: 501,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({
          error: 'Not Found',
          message: `Endpoint ${url.pathname} not found`
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  }
};