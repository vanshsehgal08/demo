"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, signOut } from "@/lib/actions/auth.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<null | {
    name?: string;
    email?: string;
    image?: string;
  }>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getCurrentUser();
      setUser(userData);
    }
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (!user) {
    // optionally render placeholder or spinner
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full cursor-pointer"
        >
          <Avatar className="h-8 w-8">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name ?? "User"} />
            ) : (
              <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-2xl shadow-xl p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" align="end" forceMount>
        <div className="flex flex-col items-center gap-2 pb-3">
          <Avatar className="h-14 w-14 border-2 border-primary">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name ?? "User"} />
            ) : (
              <AvatarFallback className="text-2xl">{user.name?.[0] ?? "U"}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-lg font-bold mt-1">{user.name ?? "User"}</span>
          <span className="text-xs text-muted-foreground mb-1">{user.email ?? "No email"}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2 py-3 px-2 rounded-lg hover:bg-primary/10 transition-all"
            onClick={() => router.push("/profile")}
          >
            <User className="w-4 h-4 text-primary" />
            <span>View Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 py-3 px-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span className="text-red-500">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
