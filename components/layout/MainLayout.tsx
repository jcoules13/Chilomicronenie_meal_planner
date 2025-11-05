"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 ml-64">
        <Header title={title} />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
