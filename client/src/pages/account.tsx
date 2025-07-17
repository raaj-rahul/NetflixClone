import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Save, Edit, CreditCard, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Account() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    
    setEditMode(false);
    toast({
      title: "Profile updated",
      description: "Your account information has been updated successfully."
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/auth");
      }
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414]">
        <div className="text-white">Loading account information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex items-center mb-10">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-gray-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Account</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full mb-8 bg-gray-800">
            <TabsTrigger value="profile" className="flex-1">
              <UserCircle className="h-5 w-5 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-1">
              <CreditCard className="h-5 w-5 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your account details and personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`bg-gray-700 border-gray-600 text-white ${!editMode && "opacity-70"}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`bg-gray-700 border-gray-600 text-white ${!editMode && "opacity-70"}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`bg-gray-700 border-gray-600 text-white ${!editMode && "opacity-70"}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="memberSince" className="text-white">Member Since</Label>
                  <Input
                    id="memberSince"
                    value="April 2023"
                    disabled
                    className="bg-gray-700 border-gray-600 text-white opacity-70"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {editMode ? (
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={handleLogout}>
                    Sign Out
                  </Button>
                )}
                {editMode ? (
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => setEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your subscription and payment methods.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-700 p-4 rounded-md">
                  <h3 className="font-medium text-lg mb-2">Current Plan</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span>Premium</span>
                    <span className="bg-gray-600 px-2 py-1 rounded text-sm">Active</span>
                  </div>
                  <p className="text-gray-400 text-sm">4K + HDR, 4 screens, ad-free</p>
                  <p className="text-gray-400 text-sm mt-2">Next billing date: May 15, 2025</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-md">
                  <h3 className="font-medium text-lg mb-2">Payment Method</h3>
                  <div className="flex items-center">
                    <CreditCard className="h-10 w-10 mr-4 text-gray-400" />
                    <div>
                      <p>Visa ending in 4242</p>
                      <p className="text-gray-400 text-sm">Expires 05/2028</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Manage Subscription
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
