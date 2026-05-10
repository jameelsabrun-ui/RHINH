import { GoogleGenAI } from "@google/genai";
import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = Netlify.env.get("GEMINI_API_KEY");
    
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return new Response(JSON.stringify({ error: "Configuration Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9'
      }
    });

    const base64Data = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64Data) {
      return new Response(JSON.stringify({ error: "Format gambar tidak valid dari AI." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ base64Data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Gemini Image API Error in Netlify Function:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Terjadi kesalahan saat menghasilkan gambar." 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/generate-image",
};
