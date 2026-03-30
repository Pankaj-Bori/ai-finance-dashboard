import { auth, logout } from '../lib/firebase';
import { Bell, Search, LogOut, User as UserIcon, Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const user = auth.currentUser;

  return (
    <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-4 md:px-8 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions, invoices..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{user?.displayName || 'User'}</p>
            <p className="text-xs text-slate-400 leading-none">{user?.email}</p>
          </div>
          <div className="relative">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-xl object-cover border-2 border-slate-100" />
            ) : (
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <UserIcon size={20} />
              </div>
            )}
            <button 
              onClick={logout}
              className="absolute -bottom-1 -right-1 bg-white border border-slate-200 p-1 rounded-lg text-slate-400 hover:text-red-600 shadow-sm transition-colors"
              title="Logout"
            >
              <LogOut size={12} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
