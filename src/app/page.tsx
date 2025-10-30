
import { KudosCard } from '@/components/kudos-card';
import { getKudos } from '@/lib/data-access';
import type { Kudos } from '@/lib/types';

export default async function KudosFeedPage() {
  const kudos: Kudos[] | null = await getKudos();

  return (
    <div className="flex flex-col h-full">
      <header className="p-6">
        <h1 className="text-3xl font-bold font-headline text-foreground">Kudos Feed</h1>
        <p className="text-muted-foreground mt-1">See what amazing things your colleagues are up to!</p>
      </header>
      <main className="flex-1 overflow-y-auto p-6 pt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {kudos && kudos.map((kudo) => (
            <KudosCard key={kudo.id} kudo={kudo} />
          ))}
        </div>
      </main>
    </div>
  );
}
