import { storage } from "../storage";
import { analyzeContent } from "./openai";

const SAMPLE_INFLUENCERS = [
  {
    name: "Ali Abdaal",
    username: "@aliabdaal",
    platform: "youtube",
    followers: 3200000,
    avatar: "AA",
    isActive: true,
  },
  {
    name: "MKBHD",
    username: "@mkbhd",
    platform: "instagram",
    followers: 17800000,
    avatar: "MK",
    isActive: true,
  },
  {
    name: "PUMA",
    username: "@puma",
    platform: "linkedin",
    followers: 12400000,
    avatar: "P",
    isActive: true,
  },
  {
    name: "Mr. Beast",
    username: "@mrbeast",
    platform: "youtube",
    followers: 178000000,
    avatar: "MF",
    isActive: true,
  },
];

const SAMPLE_POSTS = [
  {
    content: "New video: How I use AI to optimize my productivity workflow. Game-changing tools that save me 10+ hours per week.",
    platform: "youtube",
    likes: 2300,
    comments: 145,
    shares: 89,
  },
  {
    content: "First impressions of the new AI-powered smartphone camera. The computational photography is insane! 📱✨",
    platform: "instagram",
    likes: 45200,
    comments: 892,
    shares: 234,
  },
  {
    content: "Exciting partnership announcement! Collaborating with AI startups to revolutionize athletic performance tracking.",
    platform: "linkedin",
    likes: 1800,
    comments: 234,
    shares: 156,
  },
  {
    content: "Just released the most expensive video ever made. The production value is next level! What do you think?",
    platform: "youtube",
    likes: 125000,
    comments: 5670,
    shares: 2340,
  },
];

export async function initializeMockData() {
  try {
    // Create sample influencers
    const createdInfluencers = [];
    for (const influencerData of SAMPLE_INFLUENCERS) {
      const influencer = await storage.createInfluencer(influencerData);
      createdInfluencers.push(influencer);
    }

    // Create sample posts with AI analysis
    for (let i = 0; i < SAMPLE_POSTS.length; i++) {
      const postData = SAMPLE_POSTS[i];
      const influencer = createdInfluencers[i];
      
      // Analyze content with AI
      const analysis = await analyzeContent(postData.content, postData.platform);
      
      await storage.createPost({
        influencerId: influencer.id,
        content: postData.content,
        platform: postData.platform,
        likes: postData.likes,
        comments: postData.comments,
        shares: postData.shares,
        sentiment: analysis.sentiment,
        sentimentScore: analysis.sentimentScore.toString(),
        topics: analysis.topics,
        aiSummary: analysis.summary,
      });
    }

    // Initialize trending topics
    const trendingTopics = [
      { name: "#AIProductivity", mentions: 340, growth: 24 },
      { name: "#TechReviews", mentions: 256, growth: 18 },
      { name: "#SmartphoneCamera", mentions: 189, growth: 15 },
      { name: "#SportsInnovation", mentions: 145, growth: 12 },
      { name: "#ContentCreation", mentions: 123, growth: 8 },
    ];

    for (const topic of trendingTopics) {
      await storage.updateTrendingTopic(topic.name, topic.mentions, topic.growth);
    }

    console.log("Mock data initialized successfully");
  } catch (error) {
    console.error("Failed to initialize mock data:", error);
  }
}
