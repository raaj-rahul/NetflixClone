import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertMyListSchema, insertProfileSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API routes
  app.get("/api/contents", async (req: Request, res: Response) => {
    const contents = await storage.getAllContents();
    res.json(contents);
  });

  app.get("/api/contents/category/:category", async (req: Request, res: Response) => {
    const category = req.params.category;
    const contents = await storage.getContentsByCategory(category);
    res.json(contents);
  });

  app.get("/api/contents/type/:type", async (req: Request, res: Response) => {
    const type = req.params.type;
    const contents = await storage.getContentsByType(type);
    res.json(contents);
  });

  app.get("/api/contents/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const content = await storage.getContent(id);
    
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    
    res.json(content);
  });

  app.get("/api/featured", async (_req: Request, res: Response) => {
    const featured = await storage.getFeaturedContent();
    
    if (!featured) {
      return res.status(404).json({ message: "No featured content found" });
    }
    
    res.json(featured);
  });

  app.get("/api/search", async (req: Request, res: Response) => {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const results = await storage.searchContents(query);
    res.json(results);
  });

  app.get("/api/contents/:id/episodes", async (req: Request, res: Response) => {
    const contentId = parseInt(req.params.id);
    
    if (isNaN(contentId)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }
    
    const episodes = await storage.getEpisodesByContentId(contentId);
    res.json(episodes);
  });

  app.get("/api/contents/:id/episodes/season/:season", async (req: Request, res: Response) => {
    const contentId = parseInt(req.params.id);
    const season = parseInt(req.params.season);
    
    if (isNaN(contentId) || isNaN(season)) {
      return res.status(400).json({ message: "Invalid content ID or season number" });
    }
    
    const episodes = await storage.getEpisodesBySeason(contentId, season);
    res.json(episodes);
  });

  app.get("/api/episodes/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid episode ID" });
    }
    
    const episode = await storage.getEpisode(id);
    
    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }
    
    res.json(episode);
  });

  app.get("/api/profiles/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const profiles = await storage.getProfilesByUserId(userId);
    res.json(profiles);
  });

  app.get("/api/profile/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }
    
    const profile = await storage.getProfile(id);
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.json(profile);
  });

  app.get("/api/mylist/:profileId", async (req: Request, res: Response) => {
    const profileId = parseInt(req.params.profileId);
    
    if (isNaN(profileId)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }
    
    const myList = await storage.getMyListByProfileId(profileId);
    res.json(myList);
  });

  app.post("/api/mylist", async (req: Request, res: Response) => {
    try {
      const myListData = insertMyListSchema.parse(req.body);
      const myListItem = await storage.addToMyList(myListData);
      res.status(201).json(myListItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/mylist/:profileId/:contentId", async (req: Request, res: Response) => {
    const profileId = parseInt(req.params.profileId);
    const contentId = parseInt(req.params.contentId);
    
    if (isNaN(profileId) || isNaN(contentId)) {
      return res.status(400).json({ message: "Invalid profile ID or content ID" });
    }
    
    await storage.removeFromMyList(profileId, contentId);
    res.status(204).send();
  });

  app.get("/api/mylist/:profileId/:contentId/check", async (req: Request, res: Response) => {
    const profileId = parseInt(req.params.profileId);
    const contentId = parseInt(req.params.contentId);
    
    if (isNaN(profileId) || isNaN(contentId)) {
      return res.status(400).json({ message: "Invalid profile ID or content ID" });
    }
    
    const isInList = await storage.isInMyList(profileId, contentId);
    res.json({ isInList });
  });
  
  // Profile management endpoints
  app.post("/api/profiles", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/profiles/:id", async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const profileId = parseInt(req.params.id);
      if (isNaN(profileId)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      // In a real implementation, we'd check if the profile belongs to the authenticated user
      await storage.deleteProfile(profileId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
