'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { BarChart3, Gift, LayoutGrid, Settings, Bot } from 'lucide-react';
import { KudosForm } from './kudos-form';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import React from 'react';

const menuItems = [
  { href: '/', label: 'Kudos Feed', icon: LayoutGrid },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  return (
    <>
      <SidebarHeader className="font-headline text-2xl font-semibold flex items-center gap-2">
        {/* This is the sidebar logo. */}
        {/* You can replace the <Gift /> icon with another from lucide-react or an <img> tag. */}
        <Gift className="text-primary" />
        KudosFlow
      </SidebarHeader>
      <SidebarContent>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <div className="p-2">
              <Button size="lg" className="w-full font-semibold">
                Send Kudos
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                <Bot className="text-primary" />
                Send Recognition
              </DialogTitle>
            </DialogHeader>
            <KudosForm onFormSubmit={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* Can add user profile or other footer items here */}
      </SidebarFooter>
    </>
  );
}
