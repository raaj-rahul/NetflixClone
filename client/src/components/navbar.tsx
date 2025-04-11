import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, Search, BellRing, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./search-bar";
import ProfileMenu from "./profile-menu";

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = true }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = transparent
    ? isScrolled
      ? "bg-[#141414]"
      : "bg-gradient-to-b from-black/70 to-transparent"
    : "bg-[#141414]";

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${navClass}`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <a className="cursor-pointer">
              <svg viewBox="0 0 111 30" className="h-6 md:h-8 fill-current text-[#E50914]">
                <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2499766 C43.7810479,26.2499766 42.1876465,26.2499766 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"></path>
              </svg>
            </a>
          </Link>
          
          <div className="hidden md:flex space-x-6 text-sm">
            <Link href="/">
              <a className="text-white font-medium hover:text-gray-300 transition">Home</a>
            </Link>
            <Link href="/tv-shows">
              <a className="text-gray-400 hover:text-white transition">TV Shows</a>
            </Link>
            <Link href="/movies">
              <a className="text-gray-400 hover:text-white transition">Movies</a>
            </Link>
            <Link href="/new">
              <a className="text-gray-400 hover:text-white transition">New & Popular</a>
            </Link>
            <Link href="/my-list">
              <a className="text-gray-400 hover:text-white transition">My List</a>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="relative">
            <SearchBar isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
            
            {!isSearchOpen && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-gray-300"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <Link href="/kids">
            <a className="hidden md:block text-gray-400 hover:text-white text-sm transition">
              Kids
            </a>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-gray-300"
          >
            <BellRing className="h-5 w-5" />
          </Button>
          
          <div className="relative">
            <Button 
              variant="ghost" 
              className="flex items-center space-x-1 p-0"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <img 
                src="https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABTw7t_oDR6Cx-CnlDfFUU_Di2NyxSCZUqZYV9xBYzoKwHvgX8uWR-9-Multiple-is-3OdGlTJaLsjUxStN-8TTQEwUZjV.png?r=a41" 
                alt="Profile" 
                className="h-8 w-8 rounded" 
              />
              <ChevronDown className={`h-4 w-4 text-white transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            <ProfileMenu isOpen={isProfileMenuOpen} setIsOpen={setIsProfileMenuOpen} />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#141414] px-4 py-2">
          <div className="flex flex-col space-y-3">
            <Link href="/">
              <a className="text-white py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            </Link>
            <Link href="/tv-shows">
              <a className="text-gray-400 py-2" onClick={() => setIsMobileMenuOpen(false)}>TV Shows</a>
            </Link>
            <Link href="/movies">
              <a className="text-gray-400 py-2" onClick={() => setIsMobileMenuOpen(false)}>Movies</a>
            </Link>
            <Link href="/new">
              <a className="text-gray-400 py-2" onClick={() => setIsMobileMenuOpen(false)}>New & Popular</a>
            </Link>
            <Link href="/my-list">
              <a className="text-gray-400 py-2" onClick={() => setIsMobileMenuOpen(false)}>My List</a>
            </Link>
            <Link href="/kids">
              <a className="text-gray-400 py-2" onClick={() => setIsMobileMenuOpen(false)}>Kids</a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
