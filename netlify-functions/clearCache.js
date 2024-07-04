// netlify-functions/clearCache.js
exports.handler = async function(event, context) {
    // Set headers to prevent caching
    const headers = {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    };

    // Respond to the request with headers
    return {
        statusCode: 200,
        headers,
        body: "Cache cleared."
    };
};
