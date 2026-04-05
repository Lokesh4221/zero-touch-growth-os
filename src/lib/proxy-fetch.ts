import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

/**
 * Proxy-aware fetch utility for scraping public social data.
 * Uses Webshare proxy if configured in .env.local
 */
export async function proxyFetch(url: string, options: any = {}) {
  const proxyUrl = process.env.WEBSHARE_PROXY_URL; // e.g., http://user:pass@proxy.webshare.io:80
  
  const config: any = {
    url,
    method: options.method || "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ...options.headers,
    },
    timeout: 10000,
  };

  if (proxyUrl) {
    const agent = new HttpsProxyAgent(proxyUrl);
    config.httpsAgent = agent;
    config.proxy = false; // Disable axios's internal proxy handling to use the agent
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error("Proxy Fetch Error:", error.message);
    throw error;
  }
}

/**
 * Example: Fetch public Instagram hashtag data (Scraping Simulation)
 */
export async function fetchPublicInstagramHashtag(hashtag: string) {
  // In a real scenario, this would hit a public IG page or a scraping API
  // For this demo, we simulate the scraping logic through the proxy
  const searchUrl = `https://www.instagram.com/explore/tags/${hashtag}/?__a=1&__d=dis`;
  
  try {
    return await proxyFetch(searchUrl);
  } catch (e) {
    // Fallback to mock data if scraping fails or proxy is missing
    return {
      graphql: {
        hashtag: {
          name: hashtag,
          edge_hashtag_to_media: {
            count: 125400,
            edges: [
              { node: { display_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", edge_media_to_comment: { count: 45 }, edge_liked_by: { count: 1240 } } }
            ]
          }
        }
      }
    };
  }
}
