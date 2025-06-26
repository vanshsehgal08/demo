"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export function LayoutProvider2({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 pt-0 px-4 pb-4 md:pt-0 md:px-6 md:pb-6 md:ml-60 transition-all duration-300 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
