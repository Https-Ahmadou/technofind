import { NavBar } from './NavBar';
import { Sidebar } from './Sidebar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <NavBar />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-20 pb-12 flex gap-6">
        <Sidebar className="hidden lg:flex w-56 shrink-0 flex-col gap-2
          sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide" />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
