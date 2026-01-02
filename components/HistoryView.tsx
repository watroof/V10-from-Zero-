
import React from 'react';
import { Script } from '../types';
import { Clock, ChevronRight } from 'lucide-react';

interface HistoryViewProps {
  scripts: Script[];
  onSelect: (script: Script) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ scripts, onSelect }) => {
  if (scripts.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pt-12 border-t border-white/5">
      <h2 className="text-xl font-black uppercase tracking-[0.2em] text-gray-500 text-center">Past Productions</h2>
      
      <div className="grid grid-cols-1 gap-3">
        {scripts.map((script) => (
          <button 
            key={script.id}
            onClick={() => onSelect(script)}
            className="group w-full bg-[#111] border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-indigo-500/30 transition-all text-left"
          >
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">{script.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">{new Date(script.created_at).toLocaleDateString()}</span>
                  <span className="text-[9px] text-indigo-600 font-black uppercase tracking-widest">• {script.tone}</span>
                  <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">• {script.scenes.length} Scenes</span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-gray-800 group-hover:text-indigo-500 transition-colors" size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
