import { 
  influencers, 
  posts, 
  trendBriefs, 
  trendingTopics,
  users,
  type Influencer, 
  type InsertInfluencer,
  type Post,
  type InsertPost,
  type TrendBrief,
  type InsertTrendBrief,
  type TrendingTopic,
  type InsertTrendingTopic,
  type User, 
  type InsertUser 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Influencers
  getInfluencers(): Promise<Influencer[]>;
  getInfluencer(id: number): Promise<Influencer | undefined>;
  createInfluencer(influencer: InsertInfluencer): Promise<Influencer>;
  updateInfluencer(id: number, influencer: Partial<InsertInfluencer>): Promise<Influencer | undefined>;
  deleteInfluencer(id: number): Promise<boolean>;

  // Posts
  getPosts(limit?: number): Promise<Post[]>;
  getPostsByInfluencer(influencerId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  getPostsCount(): Promise<number>;

  // Trend Briefs
  getTrendBriefs(): Promise<TrendBrief[]>;
  getLatestTrendBrief(): Promise<TrendBrief | undefined>;
  createTrendBrief(brief: InsertTrendBrief): Promise<TrendBrief>;

  // Trending Topics
  getTrendingTopics(): Promise<TrendingTopic[]>;
  updateTrendingTopic(name: string, mentions: number, growth: number): Promise<TrendingTopic>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private influencers: Map<number, Influencer>;
  private posts: Map<number, Post>;
  private trendBriefs: Map<number, TrendBrief>;
  private trendingTopics: Map<number, TrendingTopic>;
  private currentUserId: number;
  private currentInfluencerId: number;
  private currentPostId: number;
  private currentBriefId: number;
  private currentTopicId: number;

  constructor() {
    this.users = new Map();
    this.influencers = new Map();
    this.posts = new Map();
    this.trendBriefs = new Map();
    this.trendingTopics = new Map();
    this.currentUserId = 1;
    this.currentInfluencerId = 1;
    this.currentPostId = 1;
    this.currentBriefId = 1;
    this.currentTopicId = 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Influencers
  async getInfluencers(): Promise<Influencer[]> {
    return Array.from(this.influencers.values()).filter(inf => inf.isActive);
  }

  async getInfluencer(id: number): Promise<Influencer | undefined> {
    return this.influencers.get(id);
  }

  async createInfluencer(insertInfluencer: InsertInfluencer): Promise<Influencer> {
    const id = this.currentInfluencerId++;
    const influencer: Influencer = {
      id,
      name: insertInfluencer.name,
      username: insertInfluencer.username,
      platform: insertInfluencer.platform,
      followers: insertInfluencer.followers ?? 0,
      avatar: insertInfluencer.avatar ?? null,
      isActive: insertInfluencer.isActive ?? true,
      createdAt: new Date(),
    };
    this.influencers.set(id, influencer);
    return influencer;
  }

  async updateInfluencer(id: number, updateData: Partial<InsertInfluencer>): Promise<Influencer | undefined> {
    const existing = this.influencers.get(id);
    if (!existing) return undefined;

    const updated: Influencer = { ...existing, ...updateData };
    this.influencers.set(id, updated);
    return updated;
  }

  async deleteInfluencer(id: number): Promise<boolean> {
    return this.influencers.delete(id);
  }

  // Posts
  async getPosts(limit = 50): Promise<Post[]> {
    const allPosts = Array.from(this.posts.values());
    return allPosts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getPostsByInfluencer(influencerId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.influencerId === influencerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = {
      id,
      influencerId: insertPost.influencerId,
      content: insertPost.content,
      platform: insertPost.platform,
      likes: insertPost.likes ?? 0,
      comments: insertPost.comments ?? 0,
      shares: insertPost.shares ?? 0,
      sentiment: insertPost.sentiment ?? null,
      sentimentScore: insertPost.sentimentScore ?? null,
      topics: insertPost.topics ?? null,
      aiSummary: insertPost.aiSummary ?? null,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async getPostsCount(): Promise<number> {
    return this.posts.size;
  }

  // Trend Briefs
  async getTrendBriefs(): Promise<TrendBrief[]> {
    return Array.from(this.trendBriefs.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  async getLatestTrendBrief(): Promise<TrendBrief | undefined> {
    const briefs = await this.getTrendBriefs();
    return briefs[0];
  }

  async createTrendBrief(insertBrief: InsertTrendBrief): Promise<TrendBrief> {
    const id = this.currentBriefId++;
    const brief: TrendBrief = {
      id,
      title: insertBrief.title,
      summary: insertBrief.summary,
      keyTrends: insertBrief.keyTrends ?? null,
      opportunities: insertBrief.opportunities ?? null,
      alerts: insertBrief.alerts ?? null,
      postsAnalyzed: insertBrief.postsAnalyzed ?? 0,
      generatedAt: new Date(),
    };
    this.trendBriefs.set(id, brief);
    return brief;
  }

  // Trending Topics
  async getTrendingTopics(): Promise<TrendingTopic[]> {
    return Array.from(this.trendingTopics.values())
      .sort((a, b) => parseFloat(b.growth) - parseFloat(a.growth));
  }

  async updateTrendingTopic(name: string, mentions: number, growth: number): Promise<TrendingTopic> {
    const existing = Array.from(this.trendingTopics.values()).find(t => t.name === name);
    
    if (existing) {
      const updated: TrendingTopic = {
        ...existing,
        mentions,
        growth: growth.toString(),
        lastUpdated: new Date(),
      };
      this.trendingTopics.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentTopicId++;
      const topic: TrendingTopic = {
        id,
        name,
        mentions,
        growth: growth.toString(),
        lastUpdated: new Date(),
      };
      this.trendingTopics.set(id, topic);
      return topic;
    }
  }
}

export const storage = new MemStorage();
