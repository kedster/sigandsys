/**
 * SigAndSys API Worker
 * 
 * This Cloudflare Worker provides API endpoints for the SigAndSys blog.
 * Includes newsletter subscription management with SendGrid integration.
 */

/**
 * Handle newsletter subscription
 */
async function handleNewsletterSubscription(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({
        error: 'Invalid email address',
        message: 'Please provide a valid email address'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Add contact to SendGrid
    const sendGridResult = await addContactToSendGrid(email, env);
    
    if (sendGridResult.success) {
      return new Response(JSON.stringify({
        message: 'Successfully subscribed to newsletter!',
        email: email
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      // Provide different messages based on the error type
      let statusCode = 500;
      let userMessage = 'Unable to subscribe at this time. Please try again later.';
      
      if (sendGridResult.error === 'SendGrid not configured') {
        // For developers - more detailed error
        if (env.ENVIRONMENT === 'development') {
          userMessage = 'Newsletter service not configured. Please set up SendGrid API key.';
        }
        statusCode = 503; // Service Unavailable
      } else if (sendGridResult.error === 'Invalid SendGrid API key') {
        statusCode = 503;
        userMessage = 'Newsletter service temporarily unavailable. Please try again later.';
      } else if (sendGridResult.error === 'Insufficient SendGrid permissions') {
        statusCode = 503;
        userMessage = 'Newsletter service temporarily unavailable. Please try again later.';
      }
      
      return new Response(JSON.stringify({
        error: 'Subscription failed',
        message: userMessage
      }), {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(JSON.stringify({
      error: 'Server error',
      message: 'Internal server error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Add contact to SendGrid mailing list
 */
async function addContactToSendGrid(email, env) {
  const sendGridApiKey = env.SENDGRID_API_KEY;
  
  if (!sendGridApiKey) {
    console.error('SendGrid API key not configured');
    console.error('To configure: set SENDGRID_API_KEY environment variable');
    console.error('For local dev: create .dev.vars file or use "wrangler secret put SENDGRID_API_KEY"');
    console.error('Get API key at: https://app.sendgrid.com/settings/api_keys');
    return { 
      success: false, 
      error: 'SendGrid not configured',
      details: 'Newsletter functionality requires SendGrid API key configuration'
    };
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contacts: [{
          email: email,
          custom_fields: {
            source: 'sigandsys-website'
          }
        }]
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Contact added to SendGrid:', result);
      return { success: true, result };
    } else {
      const errorBody = await response.text();
      console.error('SendGrid API error:', response.status, errorBody);
      
      if (response.status === 401) {
        return { 
          success: false, 
          error: 'Invalid SendGrid API key',
          details: 'Please check your API key configuration and permissions'
        };
      } else if (response.status === 403) {
        return { 
          success: false, 
          error: 'Insufficient SendGrid permissions',
          details: 'API key needs Marketing permissions to add contacts'
        };
      }
      
      return { success: false, error: errorBody };
    }

  } catch (error) {
    console.error('SendGrid request failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Validate email address format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
            'POST /newsletter/subscribe - Subscribe to newsletter',
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

      case '/newsletter/subscribe':
        if (request.method === 'POST') {
          return await handleNewsletterSubscription(request, env, corsHeaders);
        }
        return new Response(JSON.stringify({
          error: 'Method Not Allowed',
          message: 'Use POST to subscribe to newsletter'
        }), {
          status: 405,
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