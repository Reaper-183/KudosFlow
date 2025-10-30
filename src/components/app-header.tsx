import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { mockUsers } from "@/lib/data";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end">
      <SidebarTrigger className="md:hidden" />
      <UserNav user={mockUsers[0]} />
    </header>
  );
}
