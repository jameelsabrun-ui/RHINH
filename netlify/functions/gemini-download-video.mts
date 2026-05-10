import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const downloadLink = url.searchParams.get("url");

  if (!downloadLink) {
    return new Response("Missing url parameter", { status: 400 });
  }

  const apiKey = Netlify.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response("Configuration Error", { status: 500 });
  }

  try {
    const response = await fetch(downloadLink, {
      method: "GET",
      headers: {
        "x-goog-api-key": apiKey,
      },
    });

    if (!response.ok) {
      return new Response("Failed to fetch video from Google", { status: response.status });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "video/mp4",
      },
    });
  } catch (error: any) {
    console.error("Video Download Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const config: Config = {
  path: "/api/download-video",
};
