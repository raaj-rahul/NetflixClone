import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  profileImageUrl: text("profile_image_url"),
  name: text("name").default("User"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  profileImageUrl: true,
  name: true,
});

// Content table - for both movies and TV shows
export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // movie or tvShow
  imageUrl: text("image_url").notNull(),
  releaseYear: integer("release_year").notNull(),
  duration: text("duration"), // movie: "2h 35m", tvShow: null
  seasons: integer("seasons"), // movie: null, tvShow: number of seasons
  rating: text("rating").notNull(), // PG, PG-13, R, TV-MA, etc.
  matchPercentage: integer("match_percentage"), // recommended match %
  genre: text("genre").notNull(),
  isFeatured: boolean("is_featured").default(false),
  category: text("category").notNull(), // trending, popular, new releases, etc.
  videoUrl: text("video_url"), // optional video URL
});

export const insertContentSchema = createInsertSchema(contents).pick({
  title: true,
  description: true,
  type: true,
  imageUrl: true,
  releaseYear: true,
  duration: true,
  seasons: true,
  rating: true,
  matchPercentage: true,
  genre: true,
  isFeatured: true,
  category: true,
  videoUrl: true,
});

// Episodes table for TV shows
export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  duration: text("duration").notNull(), // "42m", "55m", etc.
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"),
});

export const insertEpisodeSchema = createInsertSchema(episodes).pick({
  contentId: true,
  title: true,
  description: true,
  seasonNumber: true,
  episodeNumber: true,
  duration: true,
  imageUrl: true,
  videoUrl: true,
});

// User profile
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  isKids: boolean("is_kids").default(false),
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  userId: true,
  name: true,
  imageUrl: true,
  isKids: true,
});

// My List - save shows to watch later
export const myList = pgTable("my_list", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  contentId: integer("content_id").notNull(),
});

export const insertMyListSchema = createInsertSchema(myList).pick({
  profileId: true,
  contentId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Content = typeof contents.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type MyList = typeof myList.$inferSelect;
export type InsertMyList = z.infer<typeof insertMyListSchema>;
