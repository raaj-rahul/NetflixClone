import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, SkipForward, ArrowLeft, Maximize } from "lucide-react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ isOpen, onClose, videoUrl, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case " ":
        case "k":
          setPlaying(prev => !prev);
          e.preventDefault();
          break;
        case "ArrowRight":
          playerRef.current?.seekTo(played * duration + 10);
          e.preventDefault();
          break;
        case "ArrowLeft":
          playerRef.current?.seekTo(played * duration - 10);
          e.preventDefault();
          break;
        case "m":
          setMuted(prev => !prev);
          e.preventDefault();
          break;
        case "f":
          toggleFullscreen();
          e.preventDefault();
          break;
        case "Escape":
          if (isFullscreen) {
            document.exitFullscreen().catch(err => console.log(err));
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, played, duration, isFullscreen, onClose]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setMuted(false);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    playerRef.current?.seekTo(parseFloat((e.target as HTMLInputElement).value));
  };

  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full p-0 m-0 h-screen w-screen bg-black border-0 rounded-none">
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
          <div className="absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-black to-transparent">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-black/20"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span>{title}</span>
            </Button>
          </div>
          
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            onDuration={handleDuration}
            style={{ backgroundColor: 'black' }}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload'
                }
              }
            }}
          />
          
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
            <div className="w-full bg-gray-600 h-1 rounded-full mb-4 cursor-pointer">
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
              />
              <div 
                className="bg-[#E50914] h-full rounded-full"
                style={{ width: `${played * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/10"
                >
                  {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10"
                >
                  <SkipForward className="h-6 w-6" />
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleToggleMute}
                    className="text-white hover:bg-white/10"
                  >
                    {muted || volume === 0 ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>
                  
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-white"
                  />
                </div>
              </div>
              
              <div className="text-white text-sm">
                <span>{formatTime(played * duration)}</span> / <span>{formatTime(duration)}</span>
              </div>
              
              <div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/10"
                >
                  <Maximize className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
