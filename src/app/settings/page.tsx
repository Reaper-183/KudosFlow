import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Link2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-6">
        <h1 className="text-3xl font-bold font-headline text-foreground flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and integrations.</p>
      </header>
      <main className="flex-1 overflow-y-auto p-6 pt-0">
        <div className="space-y-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about new recognitions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive an email when you get a kudos.
                  </span>
                </Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                  <span>Push Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get a push notification on your devices.
                  </span>
                </Label>
                <Switch id="push-notifications" />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="weekly-summary" className="flex flex-col space-y-1">
                  <span>Weekly Summary</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive a summary of public kudos every week.
                  </span>
                </Label>
                <Switch id="weekly-summary" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Link2 className="h-5 w-5"/> Platform Integrations</CardTitle>
              <CardDescription>
                Connect KudosFlow with your favorite communication tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="slack-integration" className="flex flex-col space-y-1">
                  <span>Slack</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Post public kudos to a designated Slack channel.
                  </span>
                </Label>
                <Switch id="slack-integration" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="teams-integration" className="flex flex-col space-y-1">
                  <span>Microsoft Teams</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Post public kudos to a designated Teams channel.
                  </span>
                </Label>
                <Switch id="teams-integration" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
