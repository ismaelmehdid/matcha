import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileViews } from "@/hooks/useProfileViews";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getPhotoUrl } from "@/utils/photoUtils";
import { useNavigate } from "react-router";
import { Eye, Heart, Users } from "lucide-react";
import { formatLastSeen } from "@/utils/dateUtils";

export function Activity() {
  const { data: profileViews, isLoading } = useProfileViews();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Activity</h1>
          <p className="text-muted-foreground">
            See who viewed your profile, liked you, and matched with you
          </p>
        </div>

        <Tabs defaultValue="views" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="views">
              <Eye className="w-4 h-4 mr-2" />
              Profile Views
            </TabsTrigger>
            <TabsTrigger value="likes" disabled>
              <Heart className="w-4 h-4 mr-2" />
              Likes (Soon)
            </TabsTrigger>
            <TabsTrigger value="matches" disabled>
              <Users className="w-4 h-4 mr-2" />
              Matches (Soon)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="views" className="flex-1">
            <Card className="h-full">
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <Spinner />
                  </div>
                ) : profileViews && profileViews.length > 0 ? (
                  <div className="space-y-4">
                    {profileViews.map((view) => (
                      <div
                        key={view.id}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/profile/${view.viewer.id}`)}
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
        </Tabs>
      </div>
    </AppLayout>
  );
}
