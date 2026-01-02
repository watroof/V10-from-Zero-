
import React, { useState } from 'react';
import { Script } from '../types';
import { Copy, FileJson, Camera, Music, Clapperboard, Sparkles, Check, ChevronLeft } from 'lucide-react';

interface ScriptViewerProps {
  script: Script;
  onClose?: () => void;
}

const ScriptViewer: React.FC<ScriptViewerProps> = ({ script, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAsJson = (scene: any, id: string) => {
    const jsonPrompt = JSON.stringify({
      prompt: scene.visual_description,
      negative_prompt: "text, watermark, logo, blurry, distorted anatomy, jumping background",
      style: script.visual_style,
      motion_bucket: 127,
      seed: Math.floor(Math.random() * 1000000)
    }, null, 2);
    copyText(jsonPrompt, id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-[#111] border border-white/10 p-6 rounded-2xl sticky top-20 z-40 backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-4">
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{script.title}</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{script.person_name} • {script.visual_style}</p>
          </div>
        </div>
        <button 
          onClick={() => copyText(JSON.stringify(script, null, 2), 'full')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-xs font-bold transition-all shadow-lg"
        >
          {copiedId === 'full' ? <Check size={14} /> : <FileJson size={16} />}
          {copiedId === 'full' ? 'COPIED SCRIPT' : 'EXPORT FULL JSON'}
        </button>
      </div>

      <div className="space-y-24 pt-8">
        {script.scenes.map((scene) => (
          <div key={scene.scene_number} className="relative group">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 bg-blue-600 text-white font-black rounded flex items-center justify-center text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                {scene.scene_number}
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Scene {scene.scene_number}</h2>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>

            <div className="space-y-8 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl transition-all hover:border-white/10">
              
              {/* Scene Prompt Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Scene Prompt (Main Context)</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyText(scene.visual_description, `txt-${scene.scene_number}`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded border border-white/10 text-[10px] font-bold transition-all"
                    >
                      {copiedId === `txt-${scene.scene_number}` ? <Check size={12} /> : <Copy size={12} />}
                      COPY TEXT
                    </button>
                    <button 
                      onClick={() => copyAsJson(scene, `json-${scene.scene_number}`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded border border-blue-500/20 text-[10px] font-bold transition-all"
                    >
                      {copiedId === `json-${scene.scene_number}` ? <Check size={12} /> : <Sparkles size={12} />}
                      COPY JSON PROMPT
                    </button>
                  </div>
                </div>
                <div className="bg-[#111] p-6 rounded-2xl border border-white/5 text-center">
                  <p className="text-gray-200 text-xl leading-relaxed font-medium">
                    {scene.visual_description}
                  </p>
                </div>
              </div>

              {/* Performance / Motion Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111] border border-white/5 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-orange-500 mb-2">
                    <Clapperboard size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Performance & Motion</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Camera:</span>
                      <span className="text-xs text-white bg-white/5 px-2 py-0.5 rounded font-mono">{scene.camera_motion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Atmosphere:</span>
                      <span className="text-xs text-white bg-white/5 px-2 py-0.5 rounded">{scene.mood_and_lighting}</span>
                    </div>
                  </div>
                </div>

                {scene.dialogue_or_narration && (
                  <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Music size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Dialogue / Audio</span>
                    </div>
                    <p className="text-sm text-gray-300 italic font-medium leading-relaxed">
                      "{scene.dialogue_or_narration}"
                    </p>
                  </div>
                )}
              </div>

              {/* Frame Prompts (Optimized for Whisk/Runway) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Camera size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Start Frame Prompt</span>
                    </div>
                    <button 
                      onClick={() => copyText(scene.start_frame_prompt, `sf-${scene.scene_number}`)}
                      className="text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                    >
                      {copiedId === `sf-${scene.scene_number}` ? <Check size={10} /> : <Copy size={10} />}
                      Copy Text
                    </button>
                  </div>
                  <div className="bg-black/40 border border-emerald-500/10 p-4 rounded-xl text-[11px] text-gray-400 leading-relaxed min-h-[70px]">
                    {scene.start_frame_prompt}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Camera size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">End Frame Prompt</span>
                    </div>
                    <button 
                      onClick={() => copyText(scene.end_frame_prompt, `ef-${scene.scene_number}`)}
                      className="text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                    >
                      {copiedId === `ef-${scene.scene_number}` ? <Check size={10} /> : <Copy size={10} />}
                      Copy Text
                    </button>
                  </div>
                  <div className="bg-black/40 border border-purple-500/10 p-4 rounded-xl text-[11px] text-gray-400 leading-relaxed min-h-[70px]">
                    {scene.end_frame_prompt}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {onClose && (
        <div className="flex justify-center pt-12">
          <button 
            onClick={onClose} 
            className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:bg-gray-200 transition-all text-sm shadow-xl"
          >
            Return to Core
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptViewer;
