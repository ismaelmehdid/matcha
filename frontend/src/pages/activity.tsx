import { AppLayout } from "@/components/layouts/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Activity as ActivityIcon } from "lucide-react";

export function Activity() {
  return (
    <AppLayout>
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Activity</h1>
          <p className="text-muted-foreground">
            See who viewed your profile, liked you, and matched with you
          </p>
        </div>

        <Card className="flex-1">
          <CardContent className="h-full flex items-center justify-center">
            <div className="flex items-start gap-4">
              <ActivityIcon className="w-16 h-16 flex-shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Activity timeline is under development. You'll be able to see all your profile views, likes, and matches here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
