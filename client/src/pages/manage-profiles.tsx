import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Profile, InsertProfile } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { PenLine, Plus, Trash, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ManageProfiles() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);

  const { data: profiles, isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles", user?.id],
    enabled: !!user,
  });

  const createProfile = useMutation({
    mutationFn: async (profile: InsertProfile) => {
      const res = await apiRequest("POST", "/api/profiles", profile);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles", user?.id] });
      toast({
        title: "Profile created",
        description: "Your new profile has been created successfully."
      });
    }
  });

  const deleteProfile = useMutation({
    mutationFn: async (profileId: number) => {
      await apiRequest("DELETE", `/api/profiles/${profileId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles", user?.id] });
      toast({
        title: "Profile deleted",
        description: "The profile has been removed successfully."
      });
    }
  });

  const handleCreateProfile = () => {
    if (!user) return;
    
    // Default profile images for Netflix
    const profileImages = [
      "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABTw7t_oDR6Cx-CnlDfFUU_Di2NyxSCZUqZYV9xBYzoKwHvgX8uWR-9-Multiple-is-3OdGlTJaLsjUxStN-8TTQEwUZjV.png?r=a41",
      "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABeffvLwxKLmjgm5xTNh7N5r_qvPa_ezk0DKQ7R7ira5r8Qwq4RTche1G1RV3Tc4uTBR9hVQrYZCWgsprXrNEZlK5r1AC.png?r=ad6",
      "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABYgA_-BJfeuVEiQMHpIK5V5KNmIwbRbSWPK0MBXZ_H5VD3KBNQ4oZJscYIlVMgiJF17STIr5rlwCmTUFzO6qAKjRwTdB.png?r=e6e",
      "https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/0RO1pLmU93-gdXvuxd_iYjzPqkc/AAAABTZ2zlLgHBcEUQEWlsYqbJvzT8YwjBWoUEgCn1UHxXKSwZoIupMbOSAMQCUkYk_GQehZ8PvEg5qVN_TLCQwFYJrZBnS8.png?r=a41",
    ];
    
    const randomImageIndex = Math.floor(Math.random() * profileImages.length);
    createProfile.mutate({
      userId: user.id,
      name: "New Profile",
      imageUrl: profileImages[randomImageIndex],
      isKids: false
    });
  };

  const handleDeleteProfile = (profileId: number) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      deleteProfile.mutate(profileId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414]">
        <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center mb-10">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">{editMode ? "Edit Profiles" : "Manage Profiles"}</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {profiles?.map(profile => (
            <div key={profile.id} className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  className="w-32 h-32 rounded-md mb-3 border-2 border-transparent group-hover:border-white"
                />
                {editMode && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteProfile(profile.id)}
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                    <Link href={`/profile-edit/${profile.id}`}>
                      <Button variant="secondary" size="icon" className="ml-2">
                        <PenLine className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              <span className="text-gray-300 text-center">{profile.name}</span>
              {profile.isKids && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1">Kids</span>
              )}
            </div>
          ))}

          {profiles && profiles.length < 5 && (
            <div className="flex flex-col items-center">
              <button
                onClick={handleCreateProfile}
                className="w-32 h-32 rounded-md bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
              >
                <Plus className="h-12 w-12 text-gray-400" />
              </button>
              <span className="text-gray-300 mt-3">Add Profile</span>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            variant={editMode ? "default" : "outline"}
            className="px-8 py-2 mr-4"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Done" : "Edit"}
          </Button>
        </div>
      </div>
    </div>
  );
}