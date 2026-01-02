
import React, { useState } from 'react';
import { Script } from '../types';
import { Copy, FileJson, Camera, Music, Clapperboard, Sparkles } from 'lucide-react';

interface ScriptViewerProps {
  script: Script;
  onClose?: () => void;
}

const ScriptViewer: React.FC<ScriptViewerProps> = ({ script, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">{script.title}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">{script.mode}</span>
            <span className="px-3 py-1 bg-teal-900/30 text-teal-400 text-xs font-bold rounded-full border border-teal-500/20">{script.tone}</span>
            <span className="px-3 py-1 bg-orange-900/30 text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">{script.visual_style}</span>
          </div>
        </div>
        <button 
          onClick={() => copy(JSON.stringify(script, null, 2), 'full')}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/10 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
        >
          <FileJson size={16} />
          {copiedId === 'full' ? 'Copied' : 'JSON'}
        </button>
      </div>

      <div className="space-y-16">
        {script.scenes.map((scene) => (
          <div key={scene.scene_number} className="relative pl-16">
            <div className="absolute left-0 top-0 w-12 h-12 bg-blue-900/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 font-bold text-lg">
              {scene.scene_number}
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Scene {scene.scene_number}</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copy(scene.visual_description, `v-${scene.scene_number}`)} className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 text-gray-400 hover:text-white rounded-lg text-xs font-bold transition-colors">
                    <Copy size={14} /> {copiedId === `v-${scene.scene_number}` ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed text-lg">{scene.visual_description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex items-start gap-3">
                  <Clapperboard size={18} className="text-blue-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1 block">Camera Motion</span>
                    <p className="text-gray-300 text-sm">{scene.camera_motion}</p>
                  </div>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl flex items-start gap-3">
                  <Sparkles size={18} className="text-orange-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1 block">Mood & Lighting</span>
                    <p className="text-gray-300 text-sm">{scene.mood_and_lighting}</p>
                  </div>
                </div>
              </div>

              {scene.dialogue_or_narration && (
                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl flex items-start gap-3">
                  <Music size={18} className="text-blue-400 mt-1 shrink-0" />
                  <div>
                    <span className="text-blue-400/70 text-[10px] uppercase font-black tracking-widest mb-1 block">Dialogue / Narration</span>
                    <p className="text-gray-300 italic">"{scene.dialogue_or_narration}"</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 relative group">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-3">
                    <Camera size={14} /> Start Frame - Image Prompt
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed pr-8">{scene.start_frame_prompt}</p>
                  <button onClick={() => copy(scene.start_frame_prompt, `sf-${scene.scene_number}`)} className="absolute right-4 top-4 p-2 text-gray-600 hover:text-white transition-colors">
                    <Copy size={16} />
                  </button>
                </div>

                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5 relative group">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-[10px] uppercase tracking-widest mb-3">
                    <Camera size={14} /> End Frame - Image Prompt
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed pr-8">{scene.end_frame_prompt}</p>
                  <button onClick={() => copy(scene.end_frame_prompt, `ef-${scene.scene_number}`)} className="absolute right-4 top-4 p-2 text-gray-600 hover:text-white transition-colors">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {onClose && (
        <div className="flex justify-center">
          <button onClick={onClose} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all">
            Generate New Script
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptViewer;
