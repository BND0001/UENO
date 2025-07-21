import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeContent, generateTrendBrief } from "./services/openai";
import { initializeMockData } from "./services/mockData";
import { getChannelInfo, getLatestVideos, searchChannels } from "./services/youtube";
import { monitoringService } from "./services/monitoring";
import { insertInfluencerSchema, insertPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize mock data on startup
  await initializeMockData();
  
  // Start real-time monitoring for all active influencers
  await monitoringService.startMonitoringAll();

  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const influencers = await storage.getInfluencers();
      const postsCount = await storage.getPostsCount();
      const trendingTopics = await storage.getTrendingTopics();
      
      // Calculate engagement score (mock calculation)
      const posts = await storage.getPosts(100);
      const totalEngagement = posts.reduce((sum, post) => sum + post.likes + post.comments, 0);
      const avgEngagement = posts.length > 0 ? totalEngagement / posts.length : 0;
      const engagementScore = Math.min(100, Math.round((avgEngagement / 1000) * 100));

      res.json({
        trackedInfluencers: influencers.length,
        postsAnalyzed: postsCount,
        trendingTopics: trendingTopics.length,
        engagementScore,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Recent posts
  app.get("/api/posts/recent", async (req, res) => {
    try {
      const posts = await storage.getPosts(10);
      const influencers = await storage.getInfluencers();
      const influencerMap = new Map(influencers.map(inf => [inf.id, inf]));

      const postsWithInfluencers = posts.map(post => ({
        ...post,
        influencer: influencerMap.get(post.influencerId),
      }));

      res.json(postsWithInfluencers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent posts" });
    }
  });

  // Influencers CRUD
  app.get("/api/influencers", async (req, res) => {
    try {
      const influencers = await storage.getInfluencers();
      res.json(influencers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch influencers" });
    }
  });

  app.post("/api/influencers", async (req, res) => {
    try {
      const validatedData = insertInfluencerSchema.parse(req.body);
      const influencer = await storage.createInfluencer(validatedData);
      
      // Start monitoring for the new influencer if active
      if (influencer.isActive) {
        await monitoringService.startMonitoring(influencer.id, 30);
        console.log(`Started monitoring for new influencer: ${influencer.name}`);
      }
      
      res.status(201).json(influencer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        res.status(400).json({ message: "Invalid influencer data", errors: error.errors });
      } else {
        console.error("Server error creating influencer:", error);
        res.status(500).json({ message: "Failed to create influencer" });
      }
    }
  });

  app.delete("/api/influencers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInfluencer(id);
      if (success) {
        res.json({ message: "Influencer deleted successfully" });
      } else {
        res.status(404).json({ message: "Influencer not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete influencer" });
    }
  });

  // Trending topics
  app.get("/api/trending-topics", async (req, res) => {
    try {
      const topics = await storage.getTrendingTopics();
      res.json(topics.slice(0, 10)); // Top 10 topics
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending topics" });
    }
  });

  // Generate trend brief
  app.post("/api/trend-brief/generate", async (req, res) => {
    try {
      const posts = await storage.getPosts(100);
      const influencers = await storage.getInfluencers();
      
      const briefData = await generateTrendBrief(posts, influencers);
      
      const trendBrief = await storage.createTrendBrief({
        title: `Trend Brief - ${new Date().toLocaleDateString()}`,
        summary: briefData.summary,
        keyTrends: briefData.keyTrends,
        opportunities: briefData.opportunities,
        alerts: briefData.alerts,
        postsAnalyzed: posts.length,
      });

      // Update trending topics
      for (const topic of briefData.topTopics) {
        await storage.updateTrendingTopic(topic.name, topic.mentions, topic.growth);
      }

      res.json(trendBrief);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate trend brief" });
    }
  });

  // Get trend briefs
  app.get("/api/trend-briefs", async (req, res) => {
    try {
      const briefs = await storage.getTrendBriefs();
      res.json(briefs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trend briefs" });
    }
  });

  // AI insights
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const posts = await storage.getPosts(50);
      const topics = await storage.getTrendingTopics();
      
      // Generate AI insights based on recent data
      const positiveCount = posts.filter(p => p.sentiment === "positive").length;
      const totalMentions = topics.reduce((sum, topic) => sum + topic.mentions, 0);
      
      const insights = {
        keyTrend: `AI productivity tools are gaining massive traction among content creators, with ${Math.round((positiveCount / posts.length) * 100)}% positive sentiment.`,
        opportunity: "Smartphone camera technology discussions present partnership opportunities with tech influencers.",
        alert: `Tracked ${totalMentions} total topic mentions across all platforms this week.`,
      };

      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  // YouTube API routes
  app.get("/api/youtube/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query parameter is required" });
      }
      
      const channels = await searchChannels(query);
      res.json(channels);
    } catch (error) {
      console.error("YouTube search error:", error);
      res.status(500).json({ message: "Failed to search YouTube channels" });
    }
  });

  app.get("/api/youtube/channel/:handle", async (req, res) => {
    try {
      const { handle } = req.params;
      const channelInfo = await getChannelInfo(handle);
      
      if (!channelInfo) {
        return res.status(404).json({ message: "Channel not found" });
      }
      
      res.json(channelInfo);
    } catch (error) {
      console.error("YouTube channel fetch error:", error);
      res.status(500).json({ message: "Failed to fetch channel info" });
    }
  });

  app.get("/api/youtube/videos/:handle", async (req, res) => {
    try {
      const { handle } = req.params;
      const { limit = "10" } = req.query;
      
      const videos = await getLatestVideos(handle, parseInt(limit as string));
      res.json(videos);
    } catch (error) {
      console.error("YouTube videos fetch error:", error);
      res.status(500).json({ message: "Failed to fetch latest videos" });
    }
  });

  // Manual content refresh for influencers
  app.post("/api/influencers/:id/refresh", async (req, res) => {
    try {
      const influencerId = parseInt(req.params.id);
      if (isNaN(influencerId)) {
        return res.status(400).json({ message: "Invalid influencer ID" });
      }
      
      await monitoringService.checkForNewContent(influencerId);
      res.json({ message: "Content refresh triggered successfully" });
    } catch (error) {
      console.error("Manual refresh error:", error);
      res.status(500).json({ message: "Failed to refresh content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
