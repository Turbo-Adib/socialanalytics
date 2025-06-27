/**
 * Utility functions for JSON serialization
 */

/**
 * Convert BigInt values to strings for JSON serialization
 * @param obj - Object containing potential BigInt values
 * @returns Object with BigInt values converted to strings
 */
export function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serializeBigInt(item));
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        serialized[key] = serializeBigInt(obj[key]);
      }
    }
    return serialized;
  }
  
  return obj;
}

/**
 * Safe JSON response that handles BigInt serialization
 * @param data - Data to serialize
 * @param init - Response init options
 * @returns NextResponse with serialized data
 */
export function jsonResponse(data: any, init?: ResponseInit) {
  try {
    const serialized = serializeBigInt(data);
    return new Response(JSON.stringify(serialized), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch (error) {
    console.error('JSON serialization error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to serialize response' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}