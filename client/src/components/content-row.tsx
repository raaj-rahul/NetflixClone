import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Content } from "@shared/schema";
import ContentCard from "./content-card";
import { Button } from "@/components/ui/button";

interface ContentRowProps {
  title: string;
  contents: Content[];
  profileId?: number;
}

export default function ContentRow({ title, contents, profileId = 1 }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!rowRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    };

    const rowElement = rowRef.current;
    if (rowElement) {
      rowElement.addEventListener('scroll', handleScroll);
      // Check initially
      handleScroll();
    }

    return () => {
      if (rowElement) {
        rowElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [contents]);

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    
    const { clientWidth } = rowRef.current;
    const scrollAmount = clientWidth * 0.8;
    
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !rowRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    rowRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="px-4 md:px-12 mt-6 relative group">
      <h2 className="text-xl md:text-2xl font-bold mb-2">{title}</h2>
      
      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 p-2 rounded-full hidden md:flex md:group-hover:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </Button>
        )}
        
        <div 
          ref={rowRef}
          className="row-container flex space-x-2 pb-8 overflow-x-auto scrollbar-hide"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {contents.map(content => (
            <ContentCard key={content.id} content={content} profileId={profileId} />
          ))}
        </div>
        
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 p-2 rounded-full hidden md:flex md:group-hover:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>
    </section>
  );
}
