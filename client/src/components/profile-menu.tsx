import { useState } from "react";
import { Link } from "wouter";
import { Edit, User, LogOut } from "lucide-react";

interface ProfileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ProfileOption {
  id: number;
  name: string;
  imageUrl: string;
  isKids?: boolean;
}

export default function ProfileMenu({ isOpen, setIsOpen }: ProfileMenuProps) {
  const [profiles] = useState<ProfileOption[]>([
    {
      id: 1,
      name: "Main Profile",
      imageUrl: "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABTw7t_oDR6Cx-CnlDfFUU_Di2NyxSCZUqZYV9xBYzoKwHvgX8uWR-9-Multiple-is-3OdGlTJaLsjUxStN-8TTQEwUZjV.png?r=a41",
    },
    {
      id: 2,
      name: "Kids",
      imageUrl: "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABTZ2zlLgHBcEUQEWlsYqbJvzT8YwjBWoUEgCn1UHxXKSwZoIupMbOSAMQCUkYk_GQehZ8PvEg5qVN_TLCQwFYJrZBnS8.png?r=a41",
      isKids: true,
    },
  ]);

  if (!isOpen) return null;

  return (
    <div 
      className="absolute right-0 top-full mt-2 py-2 w-48 bg-black bg-opacity-90 border border-gray-800 rounded shadow-lg z-50"
      onMouseLeave={() => setIsOpen(false)}
    >
      {profiles.map((profile) => (
        <Link 
          key={profile.id}
          href={profile.isKids ? "/kids" : "/"}
          onClick={() => setIsOpen(false)}
        >
          <a className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-800">
            <img 
              src={profile.imageUrl} 
              alt={profile.name} 
              className="w-7 h-7 rounded mr-3" 
            />
            <span className="text-sm">{profile.name}</span>
          </a>
        </Link>
      ))}
      
      <div className="border-t border-gray-800 my-1 pt-1">
        <Link href="/manage-profiles">
          <a className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-800">
            <Edit className="w-5 h-5 mr-3" />
            <span className="text-sm">Manage Profiles</span>
          </a>
        </Link>
        
        <Link href="/account">
          <a className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-800">
            <User className="w-5 h-5 mr-3" />
            <span className="text-sm">Account</span>
          </a>
        </Link>
        
        <Link href="/logout">
          <a className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-800">
            <LogOut className="w-5 h-5 mr-3" />
            <span className="text-sm">Sign out of Netflix</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
