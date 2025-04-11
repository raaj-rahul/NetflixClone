import { useState, useContext } from "react";
import { Plus, Play, ChevronDown, Check } from "lucide-react";
import { Content } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ContentModalContext } from "@/components/content-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ContentCardProps {
  content: Content;
  profileId?: number;
}

export default function ContentCard({ content, profileId = 1 }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { openModal } = useContext(ContentModalContext);
  const queryClient = useQueryClient();

  const { data: isInList, isLoading: checkingList } = useQuery({
    queryKey: [`/api/mylist/${profileId}/${content.id}/check`],
    enabled: !!profileId,
  });

  const addToMyList = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/mylist", { profileId, contentId: content.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/mylist/${profileId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/mylist/${profileId}/${content.id}/check`] });
    },
  });

  const removeFromMyList = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/mylist/${profileId}/${content.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/mylist/${profileId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/mylist/${profileId}/${content.id}/check`] });
    },
  });

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInList?.isInList) {
      removeFromMyList.mutate();
    } else {
      addToMyList.mutate();
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (content.videoUrl) {
      window.open(content.videoUrl, "_blank");
    }
  };

  const handleMoreInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal(content);
  };

  return (
    <div 
      className="content-card relative flex-none w-32 md:w-48 h-44 md:h-64 rounded overflow-hidden transition-transform duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openModal(content)}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        zIndex: isHovered ? 10 : 1
      }}
    >
      <img 
        src={content.imageUrl} 
        alt={content.title} 
        className="w-full h-full object-cover"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="p-2 w-full">
            <div className="flex justify-between items-center mb-1">
              <div className="flex space-x-1">
                <button 
                  onClick={handlePlayClick}
                  className="bg-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition"
                >
                  <Play className="text-black h-4 w-4" />
                </button>
                
                <button 
                  onClick={handleMyListToggle}
                  className="border border-gray-400 rounded-full w-8 h-8 flex items-center justify-center hover:border-white transition"
                >
                  {checkingList ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"/>
                  ) : isInList?.isInList ? (
                    <Check className="text-white h-4 w-4" />
                  ) : (
                    <Plus className="text-white h-4 w-4" />
                  )}
                </button>
              </div>
              
              <button 
                onClick={handleMoreInfoClick}
                className="border border-gray-400 rounded-full w-8 h-8 flex items-center justify-center hover:border-white transition"
              >
                <ChevronDown className="text-white h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center text-xs">
              <span className="text-green-500 font-bold mr-2">{content.matchPercentage}% Match</span>
              <span className="border px-1 mr-2">{content.rating}</span>
              <span>{content.seasons ? `${content.seasons} Seasons` : content.duration}</span>
            </div>
            
            <div className="text-xs mt-1">
              <span>{content.genre}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
