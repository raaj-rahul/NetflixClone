import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ContentRow from "@/components/content-row";
import VideoPlayer from "@/components/ui/video-player";
import { ContentModalProvider } from "@/components/content-modal";

export default function Home() {
  const [videoPlayerState, setVideoPlayerState] = useState({
    isOpen: false,
    videoUrl: "",
    title: ""
  });

  const { data: popularContents, isLoading: loadingPopular } = useQuery<Content[]>({
    queryKey: ["/api/contents/category/popular"],
  });

  const { data: trendingContents, isLoading: loadingTrending } = useQuery<Content[]>({
    queryKey: ["/api/contents/category/trending"],
  });

  const { data: tvShows, isLoading: loadingTvShows } = useQuery<Content[]>({
    queryKey: ["/api/contents/category/tvShows"],
  });

  const closeVideoPlayer = () => {
    setVideoPlayerState({
      isOpen: false,
      videoUrl: "",
      title: ""
    });
  };

  return (
    <ContentModalProvider>
      <div className="font-netflix bg-[#141414] text-white min-h-screen">
        <Navbar />
        
        <main>
          <HeroSection />
          
          {loadingPopular ? (
            <div className="animate-pulse px-4 md:px-12 mt-6">
              <div className="h-8 w-48 bg-gray-800 rounded mb-4"></div>
              <div className="flex space-x-4 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-32 md:w-48 h-44 md:h-64 bg-gray-800 rounded flex-none"></div>
                ))}
              </div>
            </div>
          ) : popularContents && popularContents.length > 0 ? (
            <ContentRow 
              title="Popular on Netflix" 
              contents={popularContents} 
            />
          ) : null}
          
          {loadingTrending ? (
            <div className="animate-pulse px-4 md:px-12 mt-6">
              <div className="h-8 w-48 bg-gray-800 rounded mb-4"></div>
              <div className="flex space-x-4 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-32 md:w-48 h-44 md:h-64 bg-gray-800 rounded flex-none"></div>
                ))}
              </div>
            </div>
          ) : trendingContents && trendingContents.length > 0 ? (
            <ContentRow 
              title="Trending Now" 
              contents={trendingContents} 
            />
          ) : null}
          
          {loadingTvShows ? (
            <div className="animate-pulse px-4 md:px-12 mt-6">
              <div className="h-8 w-48 bg-gray-800 rounded mb-4"></div>
              <div className="flex space-x-4 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="w-32 md:w-48 h-44 md:h-64 bg-gray-800 rounded flex-none"></div>
                ))}
              </div>
            </div>
          ) : tvShows && tvShows.length > 0 ? (
            <ContentRow 
              title="TV Shows" 
              contents={tvShows} 
            />
          ) : null}
          
          {/* Add spacing at the bottom */}
          <div className="h-20"></div>
        </main>
        
        <VideoPlayer 
          isOpen={videoPlayerState.isOpen}
          onClose={closeVideoPlayer}
          videoUrl={videoPlayerState.videoUrl}
          title={videoPlayerState.title}
        />
      </div>
    </ContentModalProvider>
  );
}
