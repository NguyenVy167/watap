import { 
  User, InsertUser, Story, InsertStory, Chapter, InsertChapter,
  Bookmark, InsertBookmark, Follow, InsertFollow, ReadingProgress, InsertReadingProgress,
  StoryWithAuthor, AuthorWithStats
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Stories
  getStory(id: number): Promise<Story | undefined>;
  getStoryWithAuthor(id: number): Promise<StoryWithAuthor | undefined>;
  getStoriesByAuthor(authorId: number): Promise<Story[]>;
  getStories(filters?: { genre?: string; search?: string; limit?: number; offset?: number }): Promise<StoryWithAuthor[]>;
  getFeaturedStories(): Promise<StoryWithAuthor[]>;
  getTrendingStories(): Promise<StoryWithAuthor[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, story: Partial<InsertStory>): Promise<Story | undefined>;
  deleteStory(id: number): Promise<boolean>;
  
  // Chapters
  getChapter(id: number): Promise<Chapter | undefined>;
  getChaptersByStory(storyId: number): Promise<Chapter[]>;
  getChapterByStoryAndNumber(storyId: number, chapterNumber: number): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  updateChapter(id: number, chapter: Partial<InsertChapter>): Promise<Chapter | undefined>;
  deleteChapter(id: number): Promise<boolean>;
  
  // Bookmarks
  getBookmarksByUser(userId: number): Promise<StoryWithAuthor[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(userId: number, storyId: number): Promise<boolean>;
  isBookmarked(userId: number, storyId: number): Promise<boolean>;
  
  // Follows
  getFollowsByUser(userId: number): Promise<AuthorWithStats[]>;
  getFollowersByUser(userId: number): Promise<User[]>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followingId: number): Promise<boolean>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  
  // Reading Progress
  getReadingProgress(userId: number, storyId: number): Promise<ReadingProgress | undefined>;
  updateReadingProgress(progress: InsertReadingProgress): Promise<ReadingProgress>;
  
  // Search
  searchStories(query: string): Promise<StoryWithAuthor[]>;
  searchAuthors(query: string): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private stories: Map<number, Story> = new Map();
  private chapters: Map<number, Chapter> = new Map();
  private bookmarks: Map<number, Bookmark> = new Map();
  private follows: Map<number, Follow> = new Map();
  private readingProgress: Map<string, ReadingProgress> = new Map();
  
  private currentUserId = 1;
  private currentStoryId = 1;
  private currentChapterId = 1;
  private currentBookmarkId = 1;
  private currentFollowId = 1;
  private currentProgressId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const sampleUsers: InsertUser[] = [
      {
        username: "sarah_mitchell",
        email: "sarah@example.com",
        displayName: "Sarah Mitchell",
        bio: "Fantasy author and dreamer. Creating magical worlds one story at a time.",
        avatar: "https://pixabay.com/get/ga955901983b181b977c5c98b70b25c4cccf99529bcf5503538f3fa8327b655573b19381b89a7a5341c2b33ae566112878cd5d6f9e71f12062569e985fef80b29_1280.jpg"
      },
      {
        username: "emma_rose",
        email: "emma@example.com",
        displayName: "Emma Rose",
        bio: "Romance writer spreading love through stories."
      },
      {
        username: "alex_turner",
        email: "alex@example.com",
        displayName: "Alex Turner",
        bio: "Mystery and thriller enthusiast."
      },
      {
        username: "maya_chen",
        email: "maya@example.com",
        displayName: "Maya Chen",
        bio: "Sci-fi explorer of the future."
      },
      {
        username: "jake_wilson",
        email: "jake@example.com",
        displayName: "Jake Wilson",
        bio: "Adventure seeker and storyteller."
      }
    ];

    sampleUsers.forEach(user => {
      const newUser: User = {
        ...user,
        id: this.currentUserId++,
        followerCount: Math.floor(Math.random() * 50000),
        followingCount: Math.floor(Math.random() * 1000),
        totalReads: Math.floor(Math.random() * 3000000),
        createdAt: new Date()
      };
      this.users.set(newUser.id, newUser);
    });

    // Create sample stories
    const sampleStories: InsertStory[] = [
      {
        title: "The Crystal Chronicles",
        description: "A young guardian must restore the balance between light and darkness.",
        genre: "Fantasy",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        authorId: 1,
        isPublished: true,
        viewCount: 1200000,
        rating: 48,
        ratingCount: 2534
      },
      {
        title: "Love in Paris",
        description: "A romantic tale set in the city of love.",
        genre: "Romance",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        authorId: 2,
        isPublished: true,
        viewCount: 890000,
        rating: 46,
        ratingCount: 1876
      },
      {
        title: "The Missing Hour",
        description: "A psychological thriller that will keep you guessing.",
        genre: "Mystery",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        authorId: 3,
        isPublished: true,
        viewCount: 2100000,
        rating: 49,
        ratingCount: 3421
      },
      {
        title: "Stellar Dreams",
        description: "Journey through the cosmos in this epic space adventure.",
        genre: "Science Fiction",
        coverImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        authorId: 4,
        isPublished: true,
        viewCount: 756000,
        rating: 47,
        ratingCount: 1234
      },
      {
        title: "Mountain Quest",
        description: "An epic adventure through treacherous mountains.",
        genre: "Adventure",
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400",
        authorId: 5,
        isPublished: true,
        viewCount: 432000,
        rating: 45,
        ratingCount: 987
      }
    ];

    sampleStories.forEach(story => {
      const newStory: Story = {
        ...story,
        id: this.currentStoryId++,
        chapterCount: Math.floor(Math.random() * 25) + 5,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.stories.set(newStory.id, newStory);
    });

    // Create sample chapters
    this.stories.forEach(story => {
      for (let i = 1; i <= Math.min(story.chapterCount, 3); i++) {
        const chapter: Chapter = {
          id: this.currentChapterId++,
          storyId: story.id,
          title: `Chapter ${i}: ${i === 1 ? 'The Beginning' : 'Continued'}`,
          content: `This is the content of chapter ${i} of ${story.title}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
          chapterNumber: i,
          wordCount: Math.floor(Math.random() * 2000) + 800,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.chapters.set(chapter.id, chapter);
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      followerCount: 0,
      followingCount: 0,
      totalReads: 0,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Story methods
  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getStoryWithAuthor(id: number): Promise<StoryWithAuthor | undefined> {
    const story = this.stories.get(id);
    if (!story) return undefined;
    
    const author = this.users.get(story.authorId);
    if (!author) return undefined;
    
    const chapters = Array.from(this.chapters.values())
      .filter(chapter => chapter.storyId === id)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
    
    return {
      ...story,
      author,
      chapters
    };
  }

  async getStoriesByAuthor(authorId: number): Promise<Story[]> {
    return Array.from(this.stories.values())
      .filter(story => story.authorId === authorId && story.isPublished)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getStories(filters?: { genre?: string; search?: string; limit?: number; offset?: number }): Promise<StoryWithAuthor[]> {
    let stories = Array.from(this.stories.values())
      .filter(story => story.isPublished);

    if (filters?.genre) {
      stories = stories.filter(story => story.genre === filters.genre);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      stories = stories.filter(story => 
        story.title.toLowerCase().includes(searchLower) ||
        story.description?.toLowerCase().includes(searchLower)
      );
    }

    stories.sort((a, b) => b.viewCount - a.viewCount);

    if (filters?.offset) {
      stories = stories.slice(filters.offset);
    }

    if (filters?.limit) {
      stories = stories.slice(0, filters.limit);
    }

    return Promise.all(stories.map(async story => {
      const author = this.users.get(story.authorId)!;
      return { ...story, author };
    }));
  }

  async getFeaturedStories(): Promise<StoryWithAuthor[]> {
    return this.getStories({ limit: 10 });
  }

  async getTrendingStories(): Promise<StoryWithAuthor[]> {
    const stories = Array.from(this.stories.values())
      .filter(story => story.isPublished)
      .sort((a, b) => (b.rating * b.ratingCount) - (a.rating * a.ratingCount))
      .slice(0, 10);

    return Promise.all(stories.map(async story => {
      const author = this.users.get(story.authorId)!;
      return { ...story, author };
    }));
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const story: Story = {
      ...insertStory,
      id: this.currentStoryId++,
      viewCount: 0,
      rating: 0,
      ratingCount: 0,
      chapterCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.stories.set(story.id, story);
    return story;
  }

  async updateStory(id: number, updateData: Partial<InsertStory>): Promise<Story | undefined> {
    const story = this.stories.get(id);
    if (!story) return undefined;
    
    const updatedStory = { ...story, ...updateData, updatedAt: new Date() };
    this.stories.set(id, updatedStory);
    return updatedStory;
  }

  async deleteStory(id: number): Promise<boolean> {
    return this.stories.delete(id);
  }

  // Chapter methods
  async getChapter(id: number): Promise<Chapter | undefined> {
    return this.chapters.get(id);
  }

  async getChaptersByStory(storyId: number): Promise<Chapter[]> {
    return Array.from(this.chapters.values())
      .filter(chapter => chapter.storyId === storyId && chapter.isPublished)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }

  async getChapterByStoryAndNumber(storyId: number, chapterNumber: number): Promise<Chapter | undefined> {
    return Array.from(this.chapters.values())
      .find(chapter => chapter.storyId === storyId && chapter.chapterNumber === chapterNumber);
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const chapter: Chapter = {
      ...insertChapter,
      id: this.currentChapterId++,
      wordCount: insertChapter.content.split(' ').length,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.chapters.set(chapter.id, chapter);
    return chapter;
  }

  async updateChapter(id: number, updateData: Partial<InsertChapter>): Promise<Chapter | undefined> {
    const chapter = this.chapters.get(id);
    if (!chapter) return undefined;
    
    const updatedChapter = { 
      ...chapter, 
      ...updateData, 
      wordCount: updateData.content ? updateData.content.split(' ').length : chapter.wordCount,
      updatedAt: new Date() 
    };
    this.chapters.set(id, updatedChapter);
    return updatedChapter;
  }

  async deleteChapter(id: number): Promise<boolean> {
    return this.chapters.delete(id);
  }

  // Bookmark methods
  async getBookmarksByUser(userId: number): Promise<StoryWithAuthor[]> {
    const bookmarks = Array.from(this.bookmarks.values())
      .filter(bookmark => bookmark.userId === userId);
    
    const stories = await Promise.all(
      bookmarks.map(bookmark => this.getStoryWithAuthor(bookmark.storyId))
    );
    
    return stories.filter(story => story !== undefined) as StoryWithAuthor[];
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const bookmark: Bookmark = {
      ...insertBookmark,
      id: this.currentBookmarkId++,
      createdAt: new Date()
    };
    this.bookmarks.set(bookmark.id, bookmark);
    return bookmark;
  }

  async deleteBookmark(userId: number, storyId: number): Promise<boolean> {
    const bookmark = Array.from(this.bookmarks.values())
      .find(b => b.userId === userId && b.storyId === storyId);
    
    if (bookmark) {
      return this.bookmarks.delete(bookmark.id);
    }
    return false;
  }

  async isBookmarked(userId: number, storyId: number): Promise<boolean> {
    return Array.from(this.bookmarks.values())
      .some(bookmark => bookmark.userId === userId && bookmark.storyId === storyId);
  }

  // Follow methods
  async getFollowsByUser(userId: number): Promise<AuthorWithStats[]> {
    const follows = Array.from(this.follows.values())
      .filter(follow => follow.followerId === userId);
    
    const authors = await Promise.all(
      follows.map(async follow => {
        const user = this.users.get(follow.followingId);
        if (!user) return null;
        
        const stories = await this.getStoriesByAuthor(user.id);
        return { ...user, stories };
      })
    );
    
    return authors.filter(author => author !== null) as AuthorWithStats[];
  }

  async getFollowersByUser(userId: number): Promise<User[]> {
    const follows = Array.from(this.follows.values())
      .filter(follow => follow.followingId === userId);
    
    return follows.map(follow => this.users.get(follow.followerId))
      .filter(user => user !== undefined) as User[];
  }

  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    const follow: Follow = {
      ...insertFollow,
      id: this.currentFollowId++,
      createdAt: new Date()
    };
    this.follows.set(follow.id, follow);
    return follow;
  }

  async deleteFollow(followerId: number, followingId: number): Promise<boolean> {
    const follow = Array.from(this.follows.values())
      .find(f => f.followerId === followerId && f.followingId === followingId);
    
    if (follow) {
      return this.follows.delete(follow.id);
    }
    return false;
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    return Array.from(this.follows.values())
      .some(follow => follow.followerId === followerId && follow.followingId === followingId);
  }

  // Reading Progress methods
  async getReadingProgress(userId: number, storyId: number): Promise<ReadingProgress | undefined> {
    const key = `${userId}-${storyId}`;
    return this.readingProgress.get(key);
  }

  async updateReadingProgress(insertProgress: InsertReadingProgress): Promise<ReadingProgress> {
    const key = `${insertProgress.userId}-${insertProgress.storyId}`;
    const existing = this.readingProgress.get(key);
    
    const progress: ReadingProgress = {
      ...insertProgress,
      id: existing?.id || this.currentProgressId++,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    this.readingProgress.set(key, progress);
    return progress;
  }

  // Search methods
  async searchStories(query: string): Promise<StoryWithAuthor[]> {
    return this.getStories({ search: query, limit: 50 });
  }

  async searchAuthors(query: string): Promise<User[]> {
    const queryLower = query.toLowerCase();
    return Array.from(this.users.values())
      .filter(user => 
        user.displayName.toLowerCase().includes(queryLower) ||
        user.username.toLowerCase().includes(queryLower)
      )
      .slice(0, 20);
  }
}

export const storage = new MemStorage();
