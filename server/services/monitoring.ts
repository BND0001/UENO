import { storage } from "../storage";
import { getLatestVideos, type YouTubeVideo } from "./youtube";
import { analyzeContent } from "./openai";

// Real-time monitoring service for social media content
export class MonitoringService {
  private intervals: Map<number, NodeJS.Timeout> = new Map();

  async startMonitoring(influencerId: number, intervalMinutes = 60) {
    // Clear existing interval if any
    if (this.intervals.has(influencerId)) {
      clearInterval(this.intervals.get(influencerId)!);
    }

    const interval = setInterval(async () => {
      await this.checkForNewContent(influencerId);
    }, intervalMinutes * 60 * 1000);

    this.intervals.set(influencerId, interval);
    console.log(`Started monitoring influencer ${influencerId} every ${intervalMinutes} minutes`);
  }

  async stopMonitoring(influencerId: number) {
    if (this.intervals.has(influencerId)) {
      clearInterval(this.intervals.get(influencerId)!);
      this.intervals.delete(influencerId);
      console.log(`Stopped monitoring influencer ${influencerId}`);
    }
  }

  async checkForNewContent(influencerId: number) {
    try {
      const influencer = await storage.getInfluencer(influencerId);
      if (!influencer || !influencer.isActive) {
        return;
      }

      console.log(`Checking for new content from ${influencer.name}...`);

      let newPosts: any[] = [];

      // Fetch content based on platform
      switch (influencer.platform) {
        case "youtube":
          newPosts = await this.fetchYouTubeContent(influencer);
          break;
        case "instagram":
          // Instagram API would go here
          console.log("Instagram monitoring not yet implemented");
          break;
        case "linkedin":
          // LinkedIn API would go here
          console.log("LinkedIn monitoring not yet implemented");
          break;
        case "twitter":
          // Twitter API would go here
          console.log("Twitter monitoring not yet implemented");
          break;
      }

      // Process and save new posts
      for (const post of newPosts) {
        await this.processNewPost(influencer, post);
      }

      if (newPosts.length > 0) {
        console.log(`Found ${newPosts.length} new posts from ${influencer.name}`);
      }
    } catch (error) {
      console.error(`Error monitoring influencer ${influencerId}:`, error);
    }
  }

  private async fetchYouTubeContent(influencer: any): Promise<YouTubeVideo[]> {
    try {
      const videos = await getLatestVideos(influencer.username.replace('@', ''), 5);
      
      // Check if we already have these videos
      const existingPosts = await storage.getPosts(100);
      const existingVideoIds = existingPosts
        .filter(post => post.influencerId === influencer.id)
        .map(post => post.content.split('\n')[0]) // Use title as identifier
        .filter(Boolean);

      // Return only new videos
      return videos.filter(video => !existingVideoIds.includes(video.title));
    } catch (error) {
      console.error(`Error fetching YouTube content for ${influencer.name}:`, error);
      return [];
    }
  }

  private async processNewPost(influencer: any, content: YouTubeVideo | any) {
    try {
      let postData: any = {};

      // Convert platform-specific data to our post format
      if (influencer.platform === "youtube" && 'statistics' in content) {
        const video = content as YouTubeVideo;
        postData = {
          influencerId: influencer.id,
          content: `${video.title}\n\n${video.description}`,
          platform: influencer.platform,
          externalId: video.id,
          url: `https://youtube.com/watch?v=${video.id}`,
          likes: parseInt(video.statistics.likeCount) || 0,
          comments: parseInt(video.statistics.commentCount) || 0,
          views: parseInt(video.statistics.viewCount) || 0,
          publishedAt: new Date(video.publishedAt),
        };
      }

      // Analyze content with AI for sentiment and topics
      try {
        const analysis = await analyzeContent(postData.content);
        postData.sentiment = analysis.sentiment;
        postData.aiSummary = analysis.summary;
        postData.topics = analysis.topics;
      } catch (aiError) {
        console.error("AI analysis failed, using defaults:", aiError);
        postData.sentiment = "neutral";
        postData.aiSummary = "Content analysis unavailable";
        postData.topics = [];
        postData.confidenceScore = 0.5;
      }

      // Save the post
      const newPost = await storage.createPost({
        ...postData,
        shares: 0, // Add missing shares field
        sentimentScore: postData.sentiment === "positive" ? "0.8" : postData.sentiment === "negative" ? "0.2" : "0.5"
      });
      console.log(`Saved new post: ${postData.content.substring(0, 50)}...`);
      
    } catch (error) {
      console.error("Error processing new post:", error);
    }
  }

  async startMonitoringAll() {
    try {
      const influencers = await storage.getInfluencers();
      const activeInfluencers = influencers.filter(inf => inf.isActive);
      
      console.log(`Starting monitoring for ${activeInfluencers.length} active influencers`);
      
      for (const influencer of activeInfluencers) {
        await this.startMonitoring(influencer.id, 30); // Check every 30 minutes
      }
    } catch (error) {
      console.error("Error starting monitoring for all influencers:", error);
    }
  }

  async stopMonitoringAll() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();
    console.log("Stopped monitoring all influencers");
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService();