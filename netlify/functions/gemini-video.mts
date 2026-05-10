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

    const body = await req.json();
    const { action, prompt, operationName } = body;
    
    const ai = new GoogleGenAI({ apiKey });

    if (action === "start") {
      if (!prompt) {
        return new Response(JSON.stringify({ error: "prompt is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      return new Response(JSON.stringify({ operation }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } 
    else if (action === "status") {
      if (!operationName) {
         return new Response(JSON.stringify({ error: "operationName is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const operation = await ai.operations.getVideosOperation({ operation: { name: operationName } as any });
      
      let downloadLink = null;
      if (operation.done && !operation.error) {
         downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      }

      return new Response(JSON.stringify({ operation, downloadLink }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    else {
       return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error: any) {
    console.error("Gemini Video API Error in Netlify Function:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Terjadi kesalahan saat memproses video." 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/generate-video",
};
