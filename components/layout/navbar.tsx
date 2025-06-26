"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/layout/user-nav";

// Sidebar menuItems moved here or imported
const sidebarMenuItems = [
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
    href: "/#take-interviews",
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

// Import icons needed here:
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  CreditCard,
  MessageSquare,
  User,
  FileText,
} from "lucide-react";

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Navbar({ isSidebarOpen, toggleSidebar }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/about";

  const isInterviewPage = pathname.startsWith("/interview");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // On Enter, close search and reset everything
    router.push("/");
    setIsSearchOpen(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  };

  // Live search as user types
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      router.replace(`/?search=${encodeURIComponent(value.trim())}`);
    } else {
      router.replace("/");
    }
  };

  const handleCloseSearch = () => {
    router.push("/");
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const AuthButtons = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-primary cursor-pointer"
        onClick={() => {
          router.push("/about");
          closeMobileMenu();
        }}
      >
        About
      </Button>
      <Button
        variant="outline"
        className="hover:bg-accent cursor-pointer"
        onClick={() => {
          router.push("/sign-in");
          closeMobileMenu();
        }}
      >
        Sign in
      </Button>
      <Button
        className="cursor-pointer"
        onClick={() => {
          router.push("/sign-up");
          closeMobileMenu();
        }}
      >
        Sign up
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="flex flex-col md:flex-row md:h-16 md:items-center px-4 relative bg-white/70 dark:bg-background/70 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-zinc-800">
        {/* Mobile Layout */}
        <div className="flex md:hidden w-full items-center justify-between h-16">
          {!isAuthPage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="h-10 w-10 -ml-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}

          <Link
            href="/"
            className={cn(
              "font-extrabold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm",
              isAuthPage ? "" : "absolute left-1/2 transform -translate-x-1/2"
            )}
            onClick={closeMobileMenu}
          >
            CogniVue
          </Link>

          {isAuthPage ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => {
                  router.push("/about");
                  closeMobileMenu();
                }}
              >
                About
              </Button>
            </div>
          ) : (
            <div className="w-10" /> // Spacer to balance the menu button
          )}
        </div>

        {/* Mobile Dropdown Sidebar Menu */}
        {isMobileMenuOpen && (
          <aside className="md:hidden fixed top-16 left-0 z-40 w-full h-[calc(100vh-64px)] bg-[#ffffff] dark:bg-[#1a1a1a] border-t shadow-xl overflow-auto">
            <nav className="flex flex-col space-y-1 p-4">
              {/* Render sidebar menu items */}
              {sidebarMenuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 rounded-xl transition-all hover:bg-primary/10 hover:text-primary text-base font-medium py-3",
                    pathname === item.href && "bg-primary/10 text-primary"
                  )}
                  asChild
                  onClick={closeMobileMenu}
                >
                  <Link href={item.href}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              ))}

              {/* Search bar for mobile */}
              {!isInterviewPage && (
                <div className="mt-4">
                  <form onSubmit={handleSearch} className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search interviews..."
                      className="pl-8 pr-4 w-full"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      disabled={isInterviewPage}
                    />
                  </form>
                </div>
              )}

              {/* User section */}
              <div className="mt-4 border-t border-white/30 dark:border-zinc-800 pt-4">
                <UserNav />
              </div>
            </nav>
          </aside>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:flex w-full items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">CogniVue</span>
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center gap-6">
            {/* Add nav links here if needed */}
          </div>
          {isAuthPage ? (
            <AuthButtons />
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                {!isInterviewPage && (
                  isSearchOpen ? (
                    <form onSubmit={handleSearch} className="relative w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer" />
                      <Input
                        type="search"
                        placeholder="Search interviews..."
                        className="pl-8 pr-4"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        autoFocus
                        disabled={isInterviewPage}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 cursor-pointer"
                        onClick={handleCloseSearch}
                        aria-label="Close search"
                        type="button"
                        disabled={isInterviewPage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 rounded-full"
                      onClick={() => setIsSearchOpen(true)}
                      aria-label="Search"
                      disabled={isInterviewPage}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  )
                )}
                <div className="h-8 border-l border-white/30 dark:border-zinc-800 mx-2" />
              </div>
              <UserNav />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
