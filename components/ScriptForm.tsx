
import React, { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface ScriptFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const ScriptForm: React.FC<ScriptFormProps> = ({ onSubmit, isLoading }) => {
  const initialState = {
    mode: 'Birthday',
    personName: '',
    dob: '',
    externalCharacter: '',
    visualStyle: 'Realistic',
    tone: 'Wholesome',
    temperature: 0.8
  };

  const [form, setForm] = useState(initialState);

  const handleReset = () => setForm(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.personName) return;
    onSubmit(form);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Production Parameters</h2>
        <p className="text-gray-400 text-sm">Configure your cinematic sequence constraints</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Event Mode</label>
            <select
              value={form.mode}
              onChange={(e) => setForm({...form, mode: e.target.value})}
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
            >
              <option>Birthday</option>
              <option>Anniversary</option>
              <option>Wedding</option>
              <option>General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Subject Name</label>
            <input
              type="text"
              value={form.personName}
              onChange={(e) => setForm({...form, personName: e.target.value})}
              placeholder="e.g. Samyak"
              className="w-full bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Visual Style</label>
            <select
              value={form.visualStyle}
              onChange={(e) => setForm({...form, visualStyle: e.target.value})}
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
            >
              <option>Realistic</option>
              <option>Anime</option>
              <option>Cyberpunk</option>
              <option>Ghibli Cinematic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Narrative Tone</label>
            <select
              value={form.tone}
              onChange={(e) => setForm({...form, tone: e.target.value})}
              className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
            >
              <option>Wholesome</option>
              <option>Exciting</option>
              <option>Cinematic</option>
              <option>Dramatic</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Guest Character (Optional)</label>
          <input
            type="text"
            value={form.externalCharacter}
            onChange={(e) => setForm({...form, externalCharacter: e.target.value})}
            placeholder="e.g. Winnie the Pooh"
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading || !form.personName}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            Initialize Script
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-4 bg-[#1a1a1a] border border-white/10 hover:bg-white/5 text-gray-400 font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScriptForm;
