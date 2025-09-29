export function getCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('Origin') || '';
  
  const allowedOrigins = [
    'https://web3ld.org',
    'https://www.web3ld.org',
    'http://localhost:3000',
    'http://localhost:3001',
    /https:\/\/.*\.vercel\.app$/,
  ];
  
  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed instanceof RegExp) {
      return allowed.test(origin);
    }
    return allowed === origin;
  });
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleOptions(corsHeaders: HeadersInit): Response {
  return new Response(null, { 
    status: 204,
    headers: corsHeaders 
  });
}

export function createErrorResponse(
  error: string,
  status: number,
  corsHeaders: HeadersInit,
  details?: any
): Response {
  return new Response(
    JSON.stringify({ error, details }),
    { 
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
}

export function createSuccessResponse(
  data: any,
  corsHeaders: HeadersInit
): Response {
  return new Response(
    JSON.stringify(data),
    { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
}