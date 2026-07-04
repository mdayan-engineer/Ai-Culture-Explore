import { Link, Outlet, useLocation } from 'react-router-dom';
import { Compass, CalendarDays, BookOpen, Map, MessageSquare, Utensils, Briefcase, LogOut, LayoutDashboard, Gem, Music, Calculator, ShieldAlert, Languages, DownloadCloud, ShieldCheck, UsersRound, Plane, UserRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Discovery', path: '/discovery', icon: Compass },
  { name: 'Smart Itinerary', path: '/itinerary', icon: CalendarDays },
  { name: 'My Trips', path: '/trips', icon: Plane },
  { name: 'Community', path: '/community', icon: UsersRound },
  { name: 'Profile & Progress', path: '/profile', icon: UserRound },
  { name: 'Budget Planner', path: '/budget', icon: Calculator },
  { name: 'Cultural Story', path: '/culture', icon: BookOpen },
  { name: 'Hidden Gems', path: '/gems', icon: Gem },
  { name: 'Local Events', path: '/events', icon: Music },
  { name: 'Food Explorer', path: '/food', icon: Utensils },
  { name: 'Safety Advisor', path: '/safety', icon: ShieldAlert },
  { name: 'Local Guide', path: '/guide', icon: MessageSquare },
  { name: 'Translator', path: '/translator', icon: Languages },
  { name: 'Offline Kit', path: '/offline', icon: DownloadCloud },
  { name: 'Packing', path: '/packing', icon: Briefcase },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600 flex items-center gap-2">
            <Compass className="h-6 w-6" />
            AI Culture Explorer
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          
          {user?.role === 'admin' && (
            <div className="mt-8 pt-4 border-t border-gray-100">
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-indigo-50 text-indigo-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
                Admin Dashboard
              </Link>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt="User" className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.displayName}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-gray-50/50 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
