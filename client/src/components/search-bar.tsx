import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface SearchBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function SearchBar({ isOpen, setIsOpen }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 flex items-center bg-black bg-opacity-90 rounded-sm">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="flex items-center border-b border-gray-700 px-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Titles, people, genres"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-white w-full md:w-64"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")}>
              <X className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="ml-2 p-2 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
