import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStorySchema, insertChapterSchema, insertBookmarkSchema, insertFollowSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Stories routes
  app.get("/api/stories", async (req, res) => {
    try {
      const { genre, search, limit, offset } = req.query;
      const stories = await storage.getStories({
        genre: genre as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  app.get("/api/stories/featured", async (req, res) => {
    try {
      const stories = await storage.getFeaturedStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured stories" });
    }
  });

  app.get("/api/stories/trending", async (req, res) => {
    try {
      const stories = await storage.getTrendingStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending stories" });
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const story = await storage.getStoryWithAuthor(id);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch story" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(validatedData);
      res.status(201).json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid story data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create story" });
    }
  });

  app.put("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertStorySchema.partial().parse(req.body);
      const story = await storage.updateStory(id, validatedData);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid story data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update story" });
    }
  });

  app.delete("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteStory(id);
      if (!deleted) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete story" });
    }
  });

  // Chapters routes
  app.get("/api/stories/:storyId/chapters", async (req, res) => {
    try {
      const storyId = parseInt(req.params.storyId);
      const chapters = await storage.getChaptersByStory(storyId);
      res.json(chapters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chapters" });
    }
  });

  app.get("/api/stories/:storyId/chapters/:chapterNumber", async (req, res) => {
    try {
      const storyId = parseInt(req.params.storyId);
      const chapterNumber = parseInt(req.params.chapterNumber);
      const chapter = await storage.getChapterByStoryAndNumber(storyId, chapterNumber);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chapter" });
    }
  });

  app.post("/api/stories/:storyId/chapters", async (req, res) => {
    try {
      const storyId = parseInt(req.params.storyId);
      const validatedData = insertChapterSchema.parse({ ...req.body, storyId });
      const chapter = await storage.createChapter(validatedData);
      res.status(201).json(chapter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid chapter data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create chapter" });
    }
  });

  app.put("/api/chapters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertChapterSchema.partial().parse(req.body);
      const chapter = await storage.updateChapter(id, validatedData);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid chapter data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update chapter" });
    }
  });

  // Authors routes
  app.get("/api/authors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "Author not found" });
      }
      const stories = await storage.getStoriesByAuthor(id);
      res.json({ ...user, stories });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch author" });
    }
  });

  // Bookmarks routes
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const userId = 1; // Mock user ID for now
      const bookmarks = await storage.getBookmarksByUser(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const userId = 1; // Mock user ID for now
      const validatedData = insertBookmarkSchema.parse({ ...req.body, userId });
      const bookmark = await storage.createBookmark(validatedData);
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid bookmark data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create bookmark" });
    }
  });

  app.delete("/api/bookmarks/:storyId", async (req, res) => {
    try {
      const userId = 1; // Mock user ID for now
      const storyId = parseInt(req.params.storyId);
      const deleted = await storage.deleteBookmark(userId, storyId);
      if (!deleted) {
        return res.status(404).json({ error: "Bookmark not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bookmark" });
    }
  });

  // Search routes
  app.get("/api/search", async (req, res) => {
    try {
      const { q, type = "stories" } = req.query;
      if (!q) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      if (type === "stories") {
        const stories = await storage.searchStories(q as string);
        res.json(stories);
      } else if (type === "authors") {
        const authors = await storage.searchAuthors(q as string);
        res.json(authors);
      } else {
        res.status(400).json({ error: "Invalid search type" });
      }
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
