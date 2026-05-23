// Vercel Serverless Function - API Proxy
// This runs on Node.js environment, keeping your Google Books API Key hidden from the browser.

export default async function handler(request, response) {
  // CORS Headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { q, langRestrict, startIndex } = request.query;

  if (!q) {
    return response.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  try {
    // 1. Get API Key securely from Server-Side Environment Variable
    // In Vercel dashboard, save it as GOOGLE_BOOKS_API_KEY (without VITE_ prefix!)
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY || process.env.VITE_GOOGLE_BOOKS_API_KEY;

    let targetUrl = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=40`;
    
    if (startIndex) {
      targetUrl += `&startIndex=${startIndex}`;
    }
    if (langRestrict) {
      targetUrl += `&langRestrict=${langRestrict}`;
    }
    if (apiKey) {
      targetUrl += `&key=${apiKey}`;
    }

    const apiResponse = await fetch(targetUrl);
    
    if (!apiResponse.ok) {
      if (apiResponse.status === 429) {
        return response.status(429).json({ 
          error: 'Rate limit exceeded. Please check backend API Key configuration.' 
        });
      }
      return response.status(apiResponse.status).json({ 
        error: `Google Books API responded with status ${apiResponse.status}` 
      });
    }

    const data = await apiResponse.json();
    return response.status(200).json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
