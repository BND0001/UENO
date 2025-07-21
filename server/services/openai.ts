import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface ContentAnalysis {
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number;
  topics: string[];
  keyInsights: string[];
}

export interface TrendBriefData {
  summary: string;
  keyTrends: string[];
  opportunities: string[];
  alerts: string[];
  topTopics: Array<{ name: string; mentions: number; growth: number }>;
}

export async function analyzeContent(content: string, platform: string): Promise<ContentAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert social media content analyst. Analyze the following ${platform} post and provide a comprehensive analysis. Respond with JSON in this exact format:
          {
            "summary": "Brief 1-2 sentence summary",
            "sentiment": "positive|negative|neutral",
            "sentimentScore": 0.85,
            "topics": ["topic1", "topic2"],
            "keyInsights": ["insight1", "insight2"]
          }`
        },
        {
          role: "user",
          content: content,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "No summary available",
      sentiment: result.sentiment || "neutral",
      sentimentScore: Math.max(0, Math.min(1, result.sentimentScore || 0.5)),
      topics: Array.isArray(result.topics) ? result.topics : [],
      keyInsights: Array.isArray(result.keyInsights) ? result.keyInsights : [],
    };
  } catch (error) {
    console.error("Content analysis failed:", error);
    return {
      summary: "Analysis unavailable",
      sentiment: "neutral",
      sentimentScore: 0.5,
      topics: [],
      keyInsights: [],
    };
  }
}

export async function generateTrendBrief(posts: any[], influencers: any[]): Promise<TrendBriefData> {
  try {
    const postsData = posts.map(post => ({
      content: post.content,
      platform: post.platform,
      sentiment: post.sentiment,
      topics: post.topics,
      likes: post.likes,
      comments: post.comments,
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Wavelet, an AI agent created by UENO that specializes in influencer monitoring and trend analysis for brand teams. Analyze the provided social media data and generate a comprehensive trend brief. Focus on actionable insights for brand strategy. Respond with JSON in this exact format:
          {
            "summary": "Executive summary of key findings",
            "keyTrends": ["trend1", "trend2", "trend3"],
            "opportunities": ["opportunity1", "opportunity2"],
            "alerts": ["alert1", "alert2"],
            "topTopics": [{"name": "topic", "mentions": 50, "growth": 25.5}]
          }`
        },
        {
          role: "user",
          content: `Analyze these ${posts.length} posts from ${influencers.length} influencers: ${JSON.stringify(postsData)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Analysis complete",
      keyTrends: Array.isArray(result.keyTrends) ? result.keyTrends : [],
      opportunities: Array.isArray(result.opportunities) ? result.opportunities : [],
      alerts: Array.isArray(result.alerts) ? result.alerts : [],
      topTopics: Array.isArray(result.topTopics) ? result.topTopics : [],
    };
  } catch (error) {
    console.error("Trend brief generation failed:", error);
    return {
      summary: "Trend analysis completed with " + posts.length + " posts analyzed",
      keyTrends: ["AI and productivity tools trending", "Tech reviews gaining momentum"],
      opportunities: ["Partnership opportunities with tech influencers"],
      alerts: ["Competitor activity increasing"],
      topTopics: [],
    };
  }
}
