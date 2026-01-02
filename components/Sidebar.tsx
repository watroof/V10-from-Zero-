
import React from 'react';
import { LayoutDashboard, History, Settings, Sparkles, Plus } from 'lucide-react';

interface SidebarProps {
  activeTab: 'new' | 'history';
  onTabChange: (tab: 'new' | 'history') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <span>PEAK AI</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <button
          onClick={() => onTabChange('new')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            activeTab === 'new' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plus size={20} />
          <span className="font-medium">Generate New</span>
        </button>

        <button
          onClick={() => onTabChange('history')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <History size={20} />
          <span className="font-medium">History</span>
        </button>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
