import { 
  users, type User, type InsertUser,
  contents, type Content, type InsertContent,
  episodes, type Episode, type InsertEpisode,
  profiles, type Profile, type InsertProfile,
  myList, type MyList, type InsertMyList
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Content methods
  getAllContents(): Promise<Content[]>;
  getContentsByCategory(category: string): Promise<Content[]>;
  getContentsByType(type: string): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  createContent(content: InsertContent): Promise<Content>;
  getFeaturedContent(): Promise<Content | undefined>;
  searchContents(query: string): Promise<Content[]>;
  
  // Episode methods
  getEpisodesByContentId(contentId: number): Promise<Episode[]>;
  getEpisodesBySeason(contentId: number, season: number): Promise<Episode[]>;
  getEpisode(id: number): Promise<Episode | undefined>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
  
  // Profile methods
  getProfilesByUserId(userId: number): Promise<Profile[]>;
  getProfile(id: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  
  // My List methods
  getMyListByProfileId(profileId: number): Promise<Content[]>;
  addToMyList(myListItem: InsertMyList): Promise<MyList>;
  removeFromMyList(profileId: number, contentId: number): Promise<void>;
  isInMyList(profileId: number, contentId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contents: Map<number, Content>;
  private episodes: Map<number, Episode>;
  private profiles: Map<number, Profile>;
  private myLists: Map<number, MyList>;
  
  private userCurrentId: number;
  private contentCurrentId: number;
  private episodeCurrentId: number;
  private profileCurrentId: number;
  private myListCurrentId: number;
  
  constructor() {
    this.users = new Map();
    this.contents = new Map();
    this.episodes = new Map();
    this.profiles = new Map();
    this.myLists = new Map();
    
    this.userCurrentId = 1;
    this.contentCurrentId = 1;
    this.episodeCurrentId = 1;
    this.profileCurrentId = 1;
    this.myListCurrentId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    const user: InsertUser = {
      username: "netflixuser",
      password: "password123",
      email: "user@example.com",
      profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    };
    this.createUser(user);

    // Sample profiles
    const profiles: InsertProfile[] = [
      {
        userId: 1,
        name: "Main Profile",
        imageUrl: "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABTw7t_oDR6Cx-CnlDfFUU_Di2NyxSCZUqZYV9xBYzoKwHvgX8uWR-9-Multiple-is-3OdGlTJaLsjUxStN-8TTQEwUZjV.png?r=a41",
        isKids: false,
      },
      {
        userId: 1,
        name: "Kids",
        imageUrl: "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABTZ2zlLgHBcEUQEWlsYqbJvzT8YwjBWoUEgCn1UHxXKSwZoIupMbOSAMQCUkYk_GQehZ8PvEg5qVN_TLCQwFYJrZBnS8.png?r=a41",
        isKids: true,
      }
    ];
    
    profiles.forEach(profile => this.createProfile(profile));

    // Sample content
    const sampleContents: InsertContent[] = [
      {
        title: "Stranger Things",
        description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2016,
        seasons: 4,
        rating: "TV-14",
        matchPercentage: 98,
        genre: "Sci-fi, Horror, Drama",
        isFeatured: true,
        category: "popular",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "The Witcher",
        description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2019,
        seasons: 2,
        rating: "TV-MA",
        matchPercentage: 92,
        genre: "Fantasy, Action, Adventure",
        isFeatured: false,
        category: "popular",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "The Queen's Gambit",
        description: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1619650277752-9b853abf815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2020,
        seasons: 1,
        rating: "TV-MA",
        matchPercentage: 89,
        genre: "Drama, Sport",
        isFeatured: false,
        category: "popular",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        type: "movie",
        imageUrl: "https://images.unsplash.com/photo-1626814026359-3e267bd90e09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2014,
        duration: "2h 49m",
        rating: "PG-13",
        matchPercentage: 96,
        genre: "Sci-fi, Adventure, Drama",
        isFeatured: false,
        category: "popular",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "Game of Thrones",
        description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1597002973885-8c90683fa6e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2011,
        seasons: 8,
        rating: "TV-MA",
        matchPercentage: 85,
        genre: "Fantasy, Drama, Adventure",
        isFeatured: false,
        category: "popular",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "Toy Story 4",
        description: "When a new toy called Forky joins Woody and the gang, a road trip alongside old and new friends reveals how big the world can be for a toy.",
        type: "movie",
        imageUrl: "https://images.unsplash.com/photo-1626814026762-fc98a6dd080f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2019,
        duration: "1h 40m",
        rating: "G",
        matchPercentage: 91,
        genre: "Animation, Adventure, Comedy",
        isFeatured: false,
        category: "popular",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      // Trending
      {
        title: "Ozark",
        description: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2017,
        seasons: 4,
        rating: "TV-MA",
        matchPercentage: 97,
        genre: "Crime, Drama, Thriller",
        isFeatured: false,
        category: "trending",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "The Haunting of Hill House",
        description: "Flashing between past and present, a fractured family confronts haunting memories of their old home and the terrifying events that drove them from it.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1512070679279-8988d32161be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2018,
        seasons: 1,
        rating: "TV-MA",
        matchPercentage: 94,
        genre: "Horror, Drama, Mystery",
        isFeatured: false,
        category: "trending",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "Sex Education",
        description: "A teenage boy with a sex therapist mother teams up with a high school classmate to set up an underground sex therapy clinic at school.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2019,
        seasons: 3,
        rating: "TV-MA",
        matchPercentage: 88,
        genre: "Comedy, Drama",
        isFeatured: false,
        category: "trending",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "John Wick",
        description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took his car.",
        type: "movie",
        imageUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2014,
        duration: "1h 41m",
        rating: "R",
        matchPercentage: 93,
        genre: "Action, Crime, Thriller",
        isFeatured: false,
        category: "trending",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "The Mandalorian",
        description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2019,
        seasons: 2,
        rating: "TV-14",
        matchPercentage: 90,
        genre: "Action, Adventure, Fantasy",
        isFeatured: false,
        category: "trending",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "Inside Out",
        description: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house, and school.",
        type: "movie",
        imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2015,
        duration: "1h 35m",
        rating: "PG",
        matchPercentage: 95,
        genre: "Animation, Adventure, Comedy",
        isFeatured: false,
        category: "trending",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      // TV Shows
      {
        title: "Breaking Bad",
        description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1626814026096-c5da06434e40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2008,
        seasons: 5,
        rating: "TV-MA",
        matchPercentage: 99,
        genre: "Crime, Drama, Thriller",
        isFeatured: false,
        category: "tvShows",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "Friends",
        description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 1994,
        seasons: 10,
        rating: "TV-14",
        matchPercentage: 86,
        genre: "Comedy, Romance",
        isFeatured: false,
        category: "tvShows",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "Black Mirror",
        description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1626518512732-5055536afb13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2011,
        seasons: 5,
        rating: "TV-MA",
        matchPercentage: 91,
        genre: "Drama, Sci-Fi, Thriller",
        isFeatured: false,
        category: "tvShows",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "The Witcher",
        description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1613565101003-79e6a6dded54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2019,
        seasons: 2,
        rating: "TV-MA",
        matchPercentage: 94,
        genre: "Action, Adventure, Fantasy",
        isFeatured: false,
        category: "tvShows",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "Better Call Saul",
        description: "The trials and tribulations of criminal lawyer Jimmy McGill before his fateful run-in with Walter White and Jesse Pinkman.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2015,
        seasons: 6,
        rating: "TV-MA",
        matchPercentage: 89,
        genre: "Crime, Drama",
        isFeatured: false,
        category: "tvShows",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        title: "The Office",
        description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
        type: "tvShow",
        imageUrl: "https://images.unsplash.com/photo-1626814026315-d8eaecdcab5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        releaseYear: 2005,
        seasons: 9,
        rating: "TV-14",
        matchPercentage: 96,
        genre: "Comedy",
        isFeatured: false,
        category: "tvShows",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      }
    ];
    
    sampleContents.forEach(content => this.createContent(content));

    // Sample episodes
    const sampleEpisodes: InsertEpisode[] = [
      {
        contentId: 1, // Stranger Things
        title: "Chapter One: The Vanishing of Will Byers",
        description: "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
        seasonNumber: 1,
        episodeNumber: 1,
        duration: "58m",
        imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        contentId: 1, // Stranger Things
        title: "Chapter Two: The Weirdo on Maple Street",
        description: "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.",
        seasonNumber: 1,
        episodeNumber: 2,
        duration: "49m",
        imageUrl: "https://images.unsplash.com/photo-1604326531570-068f162ba12d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      },
      {
        contentId: 1, // Stranger Things
        title: "Chapter Three: Holly, Jolly",
        description: "An increasingly concerned Nancy looks for Barb and finds out what Jonathan's been up to. Joyce is convinced Will is trying to talk to her.",
        seasonNumber: 1,
        episodeNumber: 3,
        duration: "51m",
        imageUrl: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      }
    ];
    
    sampleEpisodes.forEach(episode => this.createEpisode(episode));

    // Sample myList items
    this.addToMyList({ profileId: 1, contentId: 1 });
    this.addToMyList({ profileId: 1, contentId: 3 });
    this.addToMyList({ profileId: 1, contentId: 7 });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Content methods
  async getAllContents(): Promise<Content[]> {
    return Array.from(this.contents.values());
  }

  async getContentsByCategory(category: string): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(
      content => content.category === category
    );
  }

  async getContentsByType(type: string): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(
      content => content.type === type
    );
  }

  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.contentCurrentId++;
    const content: Content = { ...insertContent, id };
    this.contents.set(id, content);
    return content;
  }

  async getFeaturedContent(): Promise<Content | undefined> {
    return Array.from(this.contents.values()).find(
      content => content.isFeatured
    );
  }

  async searchContents(query: string): Promise<Content[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.contents.values()).filter(
      content => content.title.toLowerCase().includes(lowercaseQuery) ||
                 content.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Episode methods
  async getEpisodesByContentId(contentId: number): Promise<Episode[]> {
    return Array.from(this.episodes.values()).filter(
      episode => episode.contentId === contentId
    );
  }

  async getEpisodesBySeason(contentId: number, season: number): Promise<Episode[]> {
    return Array.from(this.episodes.values()).filter(
      episode => episode.contentId === contentId && episode.seasonNumber === season
    );
  }

  async getEpisode(id: number): Promise<Episode | undefined> {
    return this.episodes.get(id);
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const id = this.episodeCurrentId++;
    const episode: Episode = { ...insertEpisode, id };
    this.episodes.set(id, episode);
    return episode;
  }

  // Profile methods
  async getProfilesByUserId(userId: number): Promise<Profile[]> {
    return Array.from(this.profiles.values()).filter(
      profile => profile.userId === userId
    );
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.profileCurrentId++;
    const profile: Profile = { ...insertProfile, id };
    this.profiles.set(id, profile);
    return profile;
  }

  // My List methods
  async getMyListByProfileId(profileId: number): Promise<Content[]> {
    const myListItems = Array.from(this.myLists.values()).filter(
      item => item.profileId === profileId
    );

    const contentPromises = myListItems.map(item => this.getContent(item.contentId));
    const contents = await Promise.all(contentPromises);
    
    return contents.filter((content): content is Content => content !== undefined);
  }

  async addToMyList(myListItem: InsertMyList): Promise<MyList> {
    // Check if it already exists
    const exists = await this.isInMyList(myListItem.profileId, myListItem.contentId);
    if (exists) {
      const existingItem = Array.from(this.myLists.values()).find(
        item => item.profileId === myListItem.profileId && item.contentId === myListItem.contentId
      );
      if (existingItem) {
        return existingItem;
      }
    }

    const id = this.myListCurrentId++;
    const newItem: MyList = { ...myListItem, id };
    this.myLists.set(id, newItem);
    return newItem;
  }

  async removeFromMyList(profileId: number, contentId: number): Promise<void> {
    const itemToRemove = Array.from(this.myLists.values()).find(
      item => item.profileId === profileId && item.contentId === contentId
    );
    
    if (itemToRemove) {
      this.myLists.delete(itemToRemove.id);
    }
  }

  async isInMyList(profileId: number, contentId: number): Promise<boolean> {
    return Array.from(this.myLists.values()).some(
      item => item.profileId === profileId && item.contentId === contentId
    );
  }
}

export const storage = new MemStorage();
