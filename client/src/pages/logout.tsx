import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Logout() {
  const { logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [logoutAttempted, setLogoutAttempted] = useState(false);

  useEffect(() => {
    if (!logoutAttempted) {
      setLogoutAttempted(true);
      
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          // Redirect to login page after logout is complete
          setTimeout(() => setLocation("/auth"), 1000);
        },
        onError: () => {
          // If logout fails, redirect to home page
          setTimeout(() => setLocation("/"), 1000);
        }
      });
    }
  }, [logoutMutation, setLocation, logoutAttempted]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#E50914] mx-auto mb-4" />
        <h1 className="text-white text-xl font-medium">Signing out...</h1>
        <p className="text-gray-400 mt-2">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}
