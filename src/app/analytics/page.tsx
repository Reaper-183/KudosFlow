import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EngagementOverTimeChart, RecognitionsByTeamChart, TopKeywordsChart } from "@/components/charts";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
       <header className="p-6">
        <h1 className="text-3xl font-bold font-headline text-foreground flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Insights into your organization's recognition culture.</p>
      </header>
      <main className="flex-1 overflow-y-auto p-6 pt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <EngagementOverTimeChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Recognitions by Team</CardTitle>
            </CardHeader>
            <CardContent>
              <RecognitionsByTeamChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline">Top Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <TopKeywordsChart />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
