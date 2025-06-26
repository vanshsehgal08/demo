"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  CreditCard,
  MessageSquare,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: <PlusCircle className="h-5 w-5" />,
      label: "Create Interview",
      href: "/interview",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Resume Q&A",
      href: "/resume-qa",
    },
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Interviews",
      href: "/#interview-tabs",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Billing",
      href: "/billing",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      href: "/profile",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed top-16 left-0 z-30 h-[calc(100vh-64px)] w-64 bg-[#ffffff] dark:bg-[#09090b] md:bg-white/70 md:dark:bg-background/70 md:backdrop-blur-lg shadow-xl rounded-r-2xl border-r border-[#e5e7eb] dark:border-[#27272a] transition-all duration-300 ease-in-out flex flex-col justify-between",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex flex-col p-4">
        <div className="flex items-center gap-2 mb-4 md:mb-6 block md:hidden">
          <span className="font-extrabold text-lg md:text-xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">CogniVue</span>
        </div>
        <nav className="space-y-1 md:space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 md:gap-3 rounded-xl transition-all hover:bg-primary/10 hover:text-primary text-sm md:text-base font-medium py-2 md:py-3",
                pathname === item.href && "bg-primary/10 text-primary"
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="flex flex-col items-center gap-2 pb-4 md:pb-6 px-3 md:px-4">
        {/* You can import and use UserNav or Avatar here for a profile section */}
        {/* <UserNav /> */}
      </div>
    </aside>
  );
}
