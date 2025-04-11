import React, { createContext, useState, useEffect } from "react";
import { X, Play, Plus, Check, ThumbsUp, ChevronDown } from "lucide-react";
import { Content, Episode } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentModalContextType {
  isOpen: boolean;
  selectedContent: Content | null;
  openModal: (content: Content) => void;
  closeModal: () => void;
}

export const ContentModalContext = createContext<ContentModalContextType>({
  isOpen: false,
  selectedContent: null,
  openModal: () => {},
  closeModal: () => {},
});

interface ContentModalProviderProps {
  children: React.ReactNode;
}

export function ContentModalProvider({ children }: ContentModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const openModal = (content: Content) => {
    setSelectedContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ContentModalContext.Provider value={{ isOpen, selectedContent, openModal, closeModal }}>
      {children}
      {isOpen && selectedContent && <ContentModalContent content={selectedContent} onClose={closeModal} />}
    </ContentModalContext.Provider>
  );
}

interface ContentModalContentProps {
  content: Content;
  onClose: () => void;
}

function ContentModalContent({ content, onClose }: ContentModalContentProps) {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const profileId = 1; // Default profile ID
  
  const { data: isInList, isLoading: checkingList } = useQuery({
    queryKey: [`/api/mylist/${profileId}/${content.id}/check`],
    enabled: isOpen,
  });

  const { data: episodes, isLoading: loadingEpisodes } = useQuery<Episode[]>({
    queryKey: [`/api/contents/${content.id}/episodes/season/${selectedSeason}`],
    enabled: content.type === "tvShow",
  });

  const { data: similarContents, isLoading: loadingSimilar } = useQuery<Content[]>({
    queryKey: [`/api/contents/category/${content.category}`],
    enabled: isOpen,
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

  const handleMyListToggle = () => {
    if (isInList?.isInList) {
      removeFromMyList.mutate();
    } else {
      addToMyList.mutate();
    }
  };

  const handlePlayClick = () => {
    if (content.videoUrl) {
      window.open(content.videoUrl, "_blank");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 bg-[#181818] text-white rounded-md overflow-hidden max-h-[90vh]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#181818]/60 rounded-full z-10 hover:bg-[#181818]/80"
        >
          <X className="h-6 w-6 text-white" />
        </Button>
        
        <div className="relative">
          <div className="w-full h-[40vh] relative">
            <img 
              src={content.imageUrl} 
              alt={content.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-6">
            <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
            
            <div className="flex space-x-3">
              <Button 
                onClick={handlePlayClick}
                className="bg-white text-black hover:bg-white/90 px-5 py-2 rounded flex items-center"
              >
                <Play className="mr-2 h-5 w-5" />
                <span className="font-medium">Play</span>
              </Button>
              
              <Button 
                onClick={handleMyListToggle}
                variant="outline"
                className="border border-gray-400 bg-transparent text-white hover:bg-white/10 px-4 py-2 rounded flex items-center"
              >
                {checkingList ? (
                  <span className="animate-spin mr-2 h-5 w-5 border-2 border-white rounded-full border-t-transparent"/>
                ) : isInList?.isInList ? (
                  <Check className="mr-2 h-5 w-5" />
                ) : (
                  <Plus className="mr-2 h-5 w-5" />
                )}
                <span className="font-medium">My List</span>
              </Button>
              
              <Button 
                variant="outline"
                className="border border-gray-400 rounded-full w-10 h-10 flex items-center justify-center bg-transparent hover:bg-white/10"
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <ScrollArea className="max-h-[calc(90vh-40vh)]">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <span className="text-green-500 font-bold mr-3">{content.matchPercentage}% Match</span>
              <span className="text-gray-400 mr-3">{content.releaseYear}</span>
              <span className="border border-gray-400 px-1 mr-3">{content.rating}</span>
              <span className="text-gray-400 mr-3">
                {content.type === "tvShow" ? `${content.seasons} Seasons` : content.duration}
              </span>
              <span className="text-gray-400 border border-gray-400 rounded px-1">HD</span>
            </div>
            
            <p className="mb-6">{content.description}</p>
            
            <div className="mb-6">
              <h3 className="text-gray-400 mb-2">Genres:</h3>
              <p className="text-white">{content.genre}</p>
            </div>
          </div>
          
          {content.type === "tvShow" && content.seasons && content.seasons > 0 && (
            <div className="p-6 border-t border-gray-700/30">
              <h3 className="font-bold text-lg mb-4">Episodes</h3>
              
              <div className="flex items-center mb-6">
                <Select 
                  value={selectedSeason.toString()} 
                  onValueChange={(value) => setSelectedSeason(parseInt(value))}
                >
                  <SelectTrigger className="bg-black text-white border border-gray-700 rounded w-40">
                    <SelectValue placeholder="Select Season" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#181818] text-white border border-gray-700">
                    {Array.from({ length: content.seasons }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Season {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {loadingEpisodes ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex animate-pulse">
                      <div className="w-32 h-20 bg-gray-800 rounded mr-4"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-800 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-800 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : episodes && episodes.length > 0 ? (
                <div className="space-y-4">
                  {episodes.map((episode) => (
                    <div key={episode.id} className="flex border-b border-gray-700/30 pb-4">
                      <div className="w-32 flex-none mr-4 relative">
                        <img 
                          src={episode.imageUrl} 
                          alt={episode.title} 
                          className="w-full h-20 object-cover rounded" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button className="bg-black bg-opacity-60 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-80">
                            <Play className="text-white h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-bold">{episode.episodeNumber}. {episode.title}</h4>
                          <span className="text-gray-400">{episode.duration}</span>
                        </div>
                        <p className="text-sm text-gray-400">{episode.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No episodes available for this season.</p>
              )}
            </div>
          )}
          
          <div className="p-6 border-t border-gray-700/30">
            <h3 className="font-bold text-lg mb-4">More Like This</h3>
            
            {loadingSimilar ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="rounded overflow-hidden animate-pulse">
                    <div className="bg-gray-800 h-40"></div>
                    <div className="p-2 bg-[#181818]">
                      <div className="h-4 bg-gray-800 rounded mb-2"></div>
                      <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {similarContents && similarContents
                  .filter(similar => similar.id !== content.id)
                  .slice(0, 6)
                  .map(similar => (
                    <div 
                      key={similar.id} 
                      className="content-card rounded overflow-hidden cursor-pointer"
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          queryClient.setQueryData([`/api/contents/${similar.id}`], similar);
                          setSelectedContent(similar);
                          setIsOpen(true);
                        }, 100);
                      }}
                    >
                      <img 
                        src={similar.imageUrl} 
                        alt={similar.title} 
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-2 bg-[#181818]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-green-500 font-bold text-xs">{similar.matchPercentage}% Match</span>
                          <div className="flex space-x-1">
                            <span className="border px-1 text-xs">{similar.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs line-clamp-2">{similar.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
