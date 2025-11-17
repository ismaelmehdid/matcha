import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileViews } from "@/hooks/useProfileViews";
import { useLikes } from "@/hooks/useLikes";
import { useAllMatches } from "@/hooks/useAllMatches";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getPhotoUrl } from "@/utils/photoUtils";
import { useNavigate } from "react-router";
import { Eye, Heart, Users } from "lucide-react";
import { formatLastSeen } from "@/utils/dateUtils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function Activity() {
  const { data: profileViews, isLoading: isViewsLoading } = useProfileViews();
  const { data: likes, isLoading: isLikesLoading } = useLikes();
  const { data: matches, isLoading: isMatchesLoading } = useAllMatches();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("views");

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-5xl mx-auto gap-6">
        <div className="flex flex-col gap-2 flex-shrink-0">
          <h1 className="text-3xl font-bold">Activity</h1>
          <p className="text-muted-foreground">
            See who viewed your profile, who liked you, and all your matches
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between flex-shrink-0">
            <Label htmlFor="activity-selector" className="sr-only">
              Activity View
            </Label>
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger
                className="flex w-fit md:hidden"
                size="sm"
                id="activity-selector"
              >
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">
                  <Eye className="w-4 h-4 mr-2 inline" />
                  Profile Views
                </SelectItem>
                <SelectItem value="likes">
                  <Heart className="w-4 h-4 mr-2 inline" />
                  Likes
                </SelectItem>
                <SelectItem value="matches">
                  <Users className="w-4 h-4 mr-2 inline" />
                  Matches
                </SelectItem>
              </SelectContent>
            </Select>
            <TabsList className="hidden md:grid w-full grid-cols-3 flex-shrink-0">
              <TabsTrigger value="views">
                <Eye className="w-4 h-4 mr-2" />
                Profile Views
              </TabsTrigger>
              <TabsTrigger value="likes">
                <Heart className="w-4 h-4 mr-2" />
                Likes
              </TabsTrigger>
              <TabsTrigger value="matches">
                <Users className="w-4 h-4 mr-2" />
                Matches
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="views" className="flex-1 flex flex-col min-h-0 mt-2">
            <Card className="flex-1 flex flex-col min-h-0">
              <CardContent className="flex-1 overflow-auto p-4">
                {isViewsLoading ? (
                  <div className="flex justify-center p-8">
                    <Spinner />
                  </div>
                ) : profileViews && profileViews.length > 0 ? (
                  <div className="space-y-4">
                    {profileViews.map((view) => (
                      <div
                        key={view.id}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/profile/${view.viewer.username}`)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={view.viewer.profilePicture ? getPhotoUrl(view.viewer.profilePicture) : undefined}
                          />
                          <AvatarFallback>
                            {view.viewer.firstName[0]}{view.viewer.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">
                            {view.viewer.firstName} {view.viewer.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Viewed {formatLastSeen(new Date(view.viewedAt))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground p-8">
                    No one has viewed your profile yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="likes" className="flex-1 flex flex-col min-h-0 mt-2">
            <Card className="flex-1 flex flex-col min-h-0">
              <CardContent className="flex-1 overflow-auto p-4">
                {isLikesLoading ? (
                  <div className="flex justify-center p-8">
                    <Spinner />
                  </div>
                ) : likes && likes.length > 0 ? (
                  <div className="space-y-4">
                    {likes.map((like) => (
                      <div
                        key={like.id}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/profile/${like.liker.username}`)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={like.liker.profilePicture ? getPhotoUrl(like.liker.profilePicture) : undefined}
                          />
                          <AvatarFallback>
                            {like.liker.firstName[0]}{like.liker.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">
                            {like.liker.firstName} {like.liker.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Liked you {formatLastSeen(new Date(like.likedAt))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground p-8">
                    No one has liked you yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches" className="flex-1 flex flex-col min-h-0 mt-2">
            <Card className="flex-1 flex flex-col min-h-0">
              <CardContent className="flex-1 overflow-auto p-4">
                {isMatchesLoading ? (
                  <div className="flex justify-center p-8">
                    <Spinner />
                  </div>
                ) : matches && matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/profile/${match.username}`)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={match.photos.find(p => p.isProfilePic)?.url ? getPhotoUrl(match.photos.find(p => p.isProfilePic)?.url) : undefined}
                          />
                          <AvatarFallback>
                            {match.firstName[0]}{match.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">
                            {match.firstName} {match.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {match.cityName && match.countryName ? `${match.cityName}, ${match.countryName}` : 'Location not set'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground p-8">
                    No matches yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
