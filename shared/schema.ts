import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  coverImage: text("cover_image"),
  followerCount: integer("follower_count").default(0),
  followingCount: integer("following_count").default(0),
  totalReads: integer("total_reads").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  genre: text("genre").notNull(),
  coverImage: text("cover_image"),
  authorId: integer("author_id").notNull(),
  isPublished: boolean("is_published").default(false),
  isCompleted: boolean("is_completed").default(false),
  viewCount: integer("view_count").default(0),
  rating: integer("rating").default(0), // out of 5, multiplied by 10 for decimals
  ratingCount: integer("rating_count").default(0),
  chapterCount: integer("chapter_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  chapterNumber: integer("chapter_number").notNull(),
  wordCount: integer("word_count").default(0),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  storyId: integer("story_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followingId: integer("following_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const readingProgress = pgTable("reading_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  storyId: integer("story_id").notNull(),
  chapterId: integer("chapter_id").notNull(),
  progress: integer("progress").default(0), // percentage 0-100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  followerCount: true,
  followingCount: true,
  totalReads: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  viewCount: true,
  rating: true,
  ratingCount: true,
  chapterCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
  wordCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  createdAt: true,
});

export const insertReadingProgressSchema = createInsertSchema(readingProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type ReadingProgress = typeof readingProgress.$inferSelect;
export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;

// Extended types for API responses
export type StoryWithAuthor = Story & {
  author: User;
  chapters?: Chapter[];
  isBookmarked?: boolean;
};

export type AuthorWithStats = User & {
  stories: Story[];
  isFollowing?: boolean;
};
