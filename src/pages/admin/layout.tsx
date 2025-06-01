import { NavLink, Outlet } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const navItems = [
    { path: '/admin/journeys', label: 'Journeys' },
    { path: '/admin/areas', label: 'Areas' },
    { path: '/admin/chat-scripts', label: 'Chat Scripts' },
    { path: '/admin/flashcards', label: 'Flashcards' },
    { path: '/admin/users', label: 'Users' },
  ];

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-background">
        <ScrollArea className="h-full py-6">
          <div className="px-3 py-2">
            <h2 className="mb-6 px-4 text-lg font-semibold">Admin Panel</h2>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </aside>
      <main className="flex-1 overflow-auto bg-background">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 