import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import Navbar from "@/components/navbar";
import ContentRow from "@/components/content-row";
import { ContentModalProvider } from "@/components/content-modal";
import { useLocation } from "wouter";

export default function Browse() {
  const [location] = useLocation();
  const categoryPath = location.split("/")[1]; 
  const category = 
    categoryPath === "tv-shows" 
      ? "tvShows" 
      : categoryPath === "movies" 
        ? "movie" 
        : categoryPath === "new" 
          ? "new" 
          : "";

  const title = 
    categoryPath === "tv-shows" 
      ? "TV Shows" 
      : categoryPath === "movies" 
        ? "Movies" 
        : categoryPath === "new" 
          ? "New & Popular" 
          : categoryPath === "my-list"
            ? "My List"
            : "";

  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: [category === "movie" ? "/api/contents/type/movie" : `/api/contents/category/${category}`],
    enabled: !!category && category !== "my-list",
  });

  const { data: myListContents, isLoading: loadingMyList } = useQuery<Content[]>({
    queryKey: ["/api/mylist/1"], // Default profile ID is 1
    enabled: categoryPath === "my-list",
  });

  const displayContents = categoryPath === "my-list" ? myListContents : contents;
  const isLoadingContents = categoryPath === "my-list" ? loadingMyList : isLoading;

  return (
    <ContentModalProvider>
      <div className="font-netflix bg-[#141414] text-white min-h-screen">
        <Navbar transparent={false} />
        
        <main className="pt-20 px-4 md:px-12">
          <h1 className="text-3xl font-bold mb-8">{title}</h1>
          
          {isLoadingContents ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="animate-pulse w-full aspect-[2/3] bg-gray-800 rounded"></div>
              ))}
            </div>
          ) : displayContents && displayContents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayContents.map(content => (
                <div key={content.id} className="w-full aspect-[2/3] rounded overflow-hidden">
                  <img 
                    src={content.imageUrl} 
                    alt={content.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400">No content available.</p>
            </div>
          )}
          
          {/* Add spacing at the bottom */}
          <div className="h-20"></div>
        </main>
      </div>
    </ContentModalProvider>
  );
}
