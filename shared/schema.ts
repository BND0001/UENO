import { pgTable, text, serial, integer, boolean, timestamp, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const influencers = pgTable("influencers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  platform: text("platform").notNull(), // "youtube", "instagram", "linkedin", "twitter"
  followers: integer("followers").notNull().default(0),
  avatar: text("avatar"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  influencerId: integer("influencer_id").notNull(),
  content: text("content").notNull(),
  platform: text("platform").notNull(),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  sentiment: text("sentiment"), // "positive", "negative", "neutral"
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }),
  topics: json("topics").$type<string[]>().default([]),
  aiSummary: text("ai_summary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const trendBriefs = pgTable("trend_briefs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  keyTrends: json("key_trends").$type<string[]>().default([]),
  opportunities: json("opportunities").$type<string[]>().default([]),
  alerts: json("alerts").$type<string[]>().default([]),
  postsAnalyzed: integer("posts_analyzed").notNull().default(0),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
});

export const trendingTopics = pgTable("trending_topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  mentions: integer("mentions").notNull().default(0),
  growth: decimal("growth", { precision: 5, scale: 2 }).notNull().default("0"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertInfluencerSchema = createInsertSchema(influencers).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
});

export const insertTrendBriefSchema = createInsertSchema(trendBriefs).omit({
  id: true,
  generatedAt: true,
});

export const insertTrendingTopicSchema = createInsertSchema(trendingTopics).omit({
  id: true,
  lastUpdated: true,
});

export type Influencer = typeof influencers.$inferSelect;
export type InsertInfluencer = z.infer<typeof insertInfluencerSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type TrendBrief = typeof trendBriefs.$inferSelect;
export type InsertTrendBrief = z.infer<typeof insertTrendBriefSchema>;
export type TrendingTopic = typeof trendingTopics.$inferSelect;
export type InsertTrendingTopic = z.infer<typeof insertTrendingTopicSchema>;

// Keep existing users table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
