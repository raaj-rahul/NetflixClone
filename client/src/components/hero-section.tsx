import { useQuery } from "@tanstack/react-query";
import { Info, Play } from "lucide-react";
import { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ContentModalContext } from "@/components/content-modal";

export default function HeroSection() {
  const { data: featuredContent, isLoading } = useQuery<Content>({
    queryKey: ["/api/featured"],
  });

  const { openModal } = useContext(ContentModalContext);

  const handlePlayClick = () => {
    if (featuredContent?.videoUrl) {
      window.open(featuredContent.videoUrl, "_blank");
    }
  };

  const handleMoreInfoClick = () => {
    if (featuredContent) {
      openModal(featuredContent);
    }
  };

  if (isLoading || !featuredContent) {
    return (
      <div className="relative h-[70vh] md:h-screen bg-[#141414] animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent"></div>
      </div>
    );
  }

  return (
    <section className="relative h-[70vh] md:h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={featuredContent.imageUrl} 
          alt={featuredContent.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 pb-20 md:pb-32">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{featuredContent.title}</h1>
          
          <p className="text-sm md:text-base mb-6 text-white max-w-xl">
            {featuredContent.description}
          </p>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handlePlayClick}
              className="bg-white text-black hover:bg-white/90 px-5 py-2 rounded flex items-center"
            >
              <Play className="mr-2 h-5 w-5" />
              <span className="font-medium">Play</span>
            </Button>
            
            <Button 
              onClick={handleMoreInfoClick}
              className="bg-gray-500/60 text-white hover:bg-gray-500/40 px-5 py-2 rounded flex items-center"
            >
              <Info className="mr-2 h-5 w-5" />
              <span className="font-medium">More Info</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
