'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const engagementData = [
  { month: 'January', kudos: 186 },
  { month: 'February', kudos: 305 },
  { month: 'March', kudos: 237 },
  { month: 'April', kudos: 273 },
  { month: 'May', kudos: 209 },
  { month: 'June', kudos: 250 },
];

const engagementChartConfig = {
  kudos: {
    label: 'Kudos Sent',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function EngagementOverTimeChart() {
  return (
    <ChartContainer config={engagementChartConfig} className="h-[250px] w-full">
      <ResponsiveContainer>
        <LineChart data={engagementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <Tooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="kudos" stroke="var(--color-kudos)" strokeWidth={2} dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

const teamData = [
  { team: 'Engineering', count: 98 },
  { team: 'Marketing', count: 72 },
  { team: 'Sales', count: 65 },
  { team: 'HR', count: 41 },
  { team: 'Design', count: 35 },
];

const teamChartConfig = {
  count: {
    label: 'Count',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export function RecognitionsByTeamChart() {
  return (
    <ChartContainer config={teamChartConfig} className="h-[250px] w-full">
      <ResponsiveContainer>
        <BarChart data={teamData} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid horizontal={false} />
          <YAxis dataKey="team" type="category" tickLine={false} axisLine={false} tickMargin={8} width={80}/>
          <XAxis type="number" hide />
          <Tooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="count" radius={5} fill="var(--color-count)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

const keywordData = [
  { keyword: 'teamwork', count: 52 },
  { keyword: 'launch', count: 48 },
  { keyword: 'client', count: 41 },
  { keyword: 'feature', count: 35 },
  { keyword: 'support', count: 32 },
  { keyword: 'design', count: 28 },
  { keyword: 'presentation', count: 25 },
];

const keywordChartConfig = {
    count: {
      label: 'Count',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

export function TopKeywordsChart() {
    return (
        <ChartContainer config={keywordChartConfig} className="h-[250px] w-full">
            <ResponsiveContainer>
                <BarChart data={keywordData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="keyword" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={5} fill="var(--color-count)" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
