// Helper to convert remote image URL to base64 data URL so OpenRouter vision models always receive direct bytes
export async function ensureBase64Image(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('data:image/')) return imageUrl;

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.warn(`[Image Fetch Warning] Could not fetch remote image to base64: ${err.message}`);
    return imageUrl; // Fallback to raw URL
  }
}

// Helper to extract JSON from LLM text response
export function extractJSON(text) {
  if (!text) return null;

  // Try direct parse
  try {
    return JSON.parse(text);
  } catch (e) {
    // Continue
  }

  // Look for ```json ... ``` blocks
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (markdownMatch && markdownMatch[1]) {
    try {
      return JSON.parse(markdownMatch[1]);
    } catch (e) {
      // Continue
    }
  }

  // Look for JSON array [ ... ]
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(text.substring(firstBracket, lastBracket + 1));
    } catch (e) {
      // Continue
    }
  }

  // Look for JSON object { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    } catch (e) {
      // Continue
    }
  }

  return null;
}
