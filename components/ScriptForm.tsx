
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
        <h2 className="text-2xl font-bold text-white mb-1">Create Script</h2>
        <p className="text-gray-400 text-sm">Fill in the details to generate creative video script ideas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mode <span className="text-red-500">*</span></label>
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
          <label className="block text-sm font-medium text-gray-300 mb-2">Person's Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.personName}
            onChange={(e) => setForm({...form, personName: e.target.value})}
            placeholder="e.g. Mayur"
            className="w-full bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth <span className="text-gray-500 font-normal">(Optional)</span></label>
          <input
            type="date"
            value={form.dob}
            onChange={(e) => setForm({...form, dob: e.target.value})}
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Guest / External Character <span className="text-gray-500 font-normal">(Optional)</span></label>
          <input
            type="text"
            value={form.externalCharacter}
            onChange={(e) => setForm({...form, externalCharacter: e.target.value})}
            placeholder="e.g. Pooh"
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Visual Style</label>
          <select
            value={form.visualStyle}
            onChange={(e) => setForm({...form, visualStyle: e.target.value})}
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
          >
            <option>Realistic</option>
            <option>Anime</option>
            <option>Cyberpunk</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
          <select
            value={form.tone}
            onChange={(e) => setForm({...form, tone: e.target.value})}
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors"
          >
            <option>Wholesome</option>
            <option>Exciting</option>
            <option>Cinematic</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading || !form.personName}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            Generate Scripts
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-[#1a1a1a] border border-white/10 hover:bg-white/5 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScriptForm;
