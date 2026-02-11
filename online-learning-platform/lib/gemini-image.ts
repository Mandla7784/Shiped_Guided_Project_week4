/**
 * Generate a banner image using Gemini's image generation capabilities.
 * Uses the same GEMINI_API_KEY as the rest of the project.
 * Returns a data URL so the image can be stored in courseJson and displayed without file storage.
 *
 * Note: If image generation is not available, this will return null gracefully.
 */
// Use stable image generation model
const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export async function generateBannerImage(
  prompt: string,
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set; skipping banner image generation");
    return null;
  }

  if (!prompt || prompt.trim().length === 0) {
    console.warn("Empty prompt provided for image generation");
    return null;
  }

  try {
    // Try with image generation model first
    const url = `${API_BASE}/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`;
    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
        temperature: 0.7,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(
        `Gemini image API error (${res.status}):`,
        errText.substring(0, 200),
      );

      return await tryFallbackImageGeneration(apiKey, prompt);
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            inlineData?: { mimeType?: string; data?: string };
            text?: string;
          }>;
        };
      }>;
    };

    const parts = data.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || "image/png";
        return `data:${mime};base64,${part.inlineData.data}`;
      }
    }

    // If no image found, try fallback
    return await tryFallbackImageGeneration(apiKey, prompt);
  } catch (err) {
    console.error(
      "Banner image generation failed:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

/**
 * Fallback method: Try generating image with standard Gemini model
 */
async function tryFallbackImageGeneration(
  apiKey: string,
  prompt: string,
): Promise<string | null> {
  try {
    // Alternative: Use text-to-image via Gemini's multimodal capabilities
    // This is a placeholder - actual implementation depends on Gemini API capabilities
    console.warn("Primary image generation method failed, skipping fallback");
    return null;
  } catch (err) {
    console.error("Fallback image generation failed:", err);
    return null;
  }
}
