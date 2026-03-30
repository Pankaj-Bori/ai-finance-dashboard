import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  FileText, 
  CreditCard, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/wallet', icon: Wallet, label: 'My Wallet' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/invoices', icon: FileText, label: 'Invoice' },
  { path: '/cards', icon: CreditCard, label: 'Cards' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, toggle }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="bg-white border-r border-slate-200 flex flex-col h-full transition-all duration-300 ease-in-out relative z-30"
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="text-white w-6 h-6" />
          </div>
          {isOpen && (
            <span className="font-bold text-xl text-slate-800 whitespace-nowrap">FinPulse</span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggle}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-blue-600 shadow-sm hidden md:block"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="p-4 mt-auto">
        {isOpen ? (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pro Plan</p>
            <p className="text-sm text-slate-600 mb-3">Get unlimited transactions and AI insights.</p>
            <button className="w-full py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors">
              Upgrade
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
              <Zap size={20} />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
