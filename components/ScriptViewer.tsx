
import React, { useState } from 'react';
import { Script, Scene } from '../types';
import { Copy, FileJson, Camera, Music, Clapperboard, Sparkles, Check, ChevronLeft, Layout, ClipboardList, Layers, Monitor, Wand2 } from 'lucide-react';

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

  const copyAsWhiskJson = (scene: Scene, id: string) => {
    const jsonPrompt = JSON.stringify({
      prompt: scene.visual_description,
      start_frame: scene.start_frame_prompt,
      end_frame: scene.end_frame_prompt,
      style: script.master_style_prompt || script.visual_style,
      action: scene.camera_motion,
      dialogue: scene.dialogue_or_narration,
      negative_prompt: "text, watermark, logo, blurry, distorted anatomy, jumping background",
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
          {copiedId === 'full' ? 'COPIED FULL SCRIPT' : 'EXPORT JSON'}
        </button>
      </div>

      {/* MASTER STYLE PANEL */}
      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600/10 to-transparent px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 block">Master Aesthetic Hub</span>
              <h2 className="text-lg font-bold text-white tracking-tight">Global Style DNA</h2>
            </div>
          </div>
          <button 
            onClick={() => copyText(script.master_style_prompt || script.visual_style, 'master-style')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95"
          >
            {copiedId === 'master-style' ? <Check size={16} /> : <Wand2 size={16} />}
            {copiedId === 'master-style' ? 'STYLE COPIED' : 'COPY MASTER STYLE'}
          </button>
        </div>
        <div className="p-8 space-y-8">
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5 shadow-inner">
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-3 block">Global Aesthetic Script (Apply to all clips for consistency)</span>
            <p className="text-sm text-gray-300 leading-relaxed italic font-medium">
              {script.master_style_prompt || "Defining universal visual parameters..."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[8px] text-gray-600 uppercase font-black mb-1 block">Style</span>
              <p className="text-xs font-bold text-white">{script.visual_style}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[8px] text-gray-600 uppercase font-black mb-1 block">Tone</span>
              <p className="text-xs font-bold text-white">{script.tone}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[8px] text-gray-600 uppercase font-black mb-1 block">Logic</span>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Consistency Locked</p>
            </div>
          </div>
        </div>
      </div>

      {/* SCENES */}
      <div className="space-y-32 pt-8">
        {script.scenes.map((scene, idx) => (
          <div key={scene.scene_number} className="relative">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-blue-600 text-white font-black rounded-lg flex items-center justify-center text-lg shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                {scene.scene_number}
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">Act {scene.scene_number}</h2>
              <div className="h-px flex-1 bg-white/5"></div>
              <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                5-8 SECONDS
              </div>
            </div>

            <div className="space-y-12 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl transition-all hover:border-white/10">
              
              {/* Scene Script */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-blue-500" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500">Video Generator Prompt</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyText(scene.visual_description, `txt-${scene.scene_number}`)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg border border-white/10 text-[10px] font-bold transition-all"
                    >
                      {copiedId === `txt-${scene.scene_number}` ? 'COPIED' : 'COPY PROMPT'}
                    </button>
                    <button 
                      onClick={() => copyAsWhiskJson(scene, `json-${scene.scene_number}`)}
                      className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-500/20 text-[10px] font-bold transition-all flex items-center gap-2"
                    >
                      <Sparkles size={12} />
                      WHISK JSON
                    </button>
                  </div>
                </div>
                <div className="bg-[#111] p-10 rounded-3xl border border-white/5 text-center shadow-inner relative overflow-hidden group">
                  <p className="text-gray-100 text-2xl leading-relaxed font-semibold relative z-10 italic">
                    {scene.visual_description}
                  </p>
                </div>
              </div>

              {/* Performance Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#111] border border-white/5 p-8 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-orange-500 mb-2">
                    <Clapperboard size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Motion & Context</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-gray-500 uppercase font-black">Camera:</span>
                      <span className="text-xs text-white bg-white/5 px-3 py-1 rounded-full font-mono">{scene.camera_motion}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-gray-500 uppercase font-black">Lighting:</span>
                      <span className="text-xs text-white bg-white/5 px-3 py-1 rounded-full">{scene.mood_and_lighting}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-3xl flex flex-col justify-center text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-400 mb-4">
                    <Music size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Audio Element</span>
                  </div>
                  <p className="text-lg text-gray-300 italic font-medium">
                    {scene.dialogue_or_narration || "Ambient soundscape."}
                  </p>
                </div>
              </div>

              {/* FRAME ENGINE - DUAL PROMPT VIEW */}
              <div className="space-y-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-emerald-500">
                  <Camera size={18} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Frame Generation Engine</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Start Frame */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        {idx > 0 ? "Sequence Handoff (Start)" : "Initial Scene Start"}
                      </span>
                    </div>
                    
                    <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 relative group transition-all hover:border-emerald-500/30">
                      <span className="text-[8px] text-gray-600 font-black uppercase absolute top-4 left-6">STARTING IMAGE PROMPT</span>
                      <p className="text-xs text-gray-300 leading-relaxed mt-4 line-clamp-4">{scene.start_frame_prompt}</p>
                      <button 
                        onClick={() => copyText(scene.start_frame_prompt, `sf-${scene.scene_number}`)}
                        className="absolute bottom-4 right-6 text-[10px] font-black uppercase text-emerald-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                      >
                        {copiedId === `sf-${scene.scene_number}` ? <Check size={12} /> : <Copy size={12} />}
                        COPY
                      </button>
                    </div>
                  </div>

                  {/* End Frame */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">Ending Sequence Frame</span>
                    </div>
                    
                    <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 relative group transition-all hover:border-purple-500/30">
                      <span className="text-[8px] text-gray-600 font-black uppercase absolute top-4 left-6">ENDING IMAGE PROMPT</span>
                      <p className="text-xs text-gray-300 leading-relaxed mt-4 line-clamp-4">{scene.end_frame_prompt}</p>
                      <button 
                        onClick={() => copyText(scene.end_frame_prompt, `ef-${scene.scene_number}`)}
                        className="absolute bottom-4 right-6 text-[10px] font-black uppercase text-purple-500 hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                      >
                        {copiedId === `ef-${scene.scene_number}` ? <Check size={12} /> : <Copy size={12} />}
                        COPY
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {onClose && (
        <div className="flex justify-center pt-32 pb-64">
          <button 
            onClick={onClose} 
            className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full hover:bg-gray-200 transition-all text-sm shadow-2xl"
          >
            End Production
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptViewer;
