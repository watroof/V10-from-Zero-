
import React, { useState } from 'react';
import { Script } from '../types';
import { Copy, FileJson, Camera, Music, Clapperboard, Sparkles, Check, ChevronLeft, Layout, ClipboardList, Layers, Monitor } from 'lucide-react';

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

  const copyAsWhiskJson = (scene: any, id: string) => {
    const jsonPrompt = JSON.stringify({
      prompt: scene.visual_description,
      start_frame: scene.start_frame_scene,
      end_frame: scene.end_frame_scene,
      style: scene.start_frame_style,
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
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{script.person_name} • {script.visual_style} • {script.tone} Tone</p>
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

      {/* STYLE DNA PANEL */}
      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-400">
            <Layers size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Visual Identity</span>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1 block">Style</span>
            <p className="text-sm font-bold text-white">{script.visual_style}</p>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1 block">Tone</span>
            <p className="text-sm font-bold text-white">{script.tone}</p>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1 block">Logic</span>
            <p className="text-sm font-bold text-emerald-500 italic">3 Scenes (5-8s each)</p>
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
                Duration: 5-8s
              </div>
            </div>

            <div className="space-y-12 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
              
              {/* Scene Script */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-blue-500" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500">Main Video Generation Prompt</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyText(scene.visual_description, `txt-${scene.scene_number}`)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg border border-white/10 text-[10px] font-bold transition-all"
                    >
                      {copiedId === `txt-${scene.scene_number}` ? 'COPIED' : 'COPY TEXT'}
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
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Monitor size={100} />
                  </div>
                </div>
              </div>

              {/* Performance Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#111] border border-white/5 p-8 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 text-orange-500 mb-2">
                    <Clapperboard size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Camera & Atmos</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-gray-500 uppercase font-black">Motion:</span>
                      <span className="text-xs text-white bg-white/5 px-3 py-1 rounded-full font-mono">{scene.camera_motion}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-gray-500 uppercase font-black">Mood:</span>
                      <span className="text-xs text-white bg-white/5 px-3 py-1 rounded-full">{scene.mood_and_lighting}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-3xl flex flex-col justify-center text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-400 mb-4">
                    <Music size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Audio Track</span>
                  </div>
                  <p className="text-lg text-gray-300 italic font-medium">
                    {scene.dialogue_or_narration || "Ambient soundscape."}
                  </p>
                </div>
              </div>

              {/* FRAME ENGINE - SEPARATE BOXES */}
              <div className="space-y-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-emerald-500">
                  <Camera size={18} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Frame Generation Engine</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Start Frame Group */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        {idx > 0 ? "Sequential Handoff (Start)" : "Initial Scene Start"}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 relative group">
                        <span className="text-[8px] text-gray-600 font-black uppercase absolute top-4 left-4">SCENE DETAIL</span>
                        <p className="text-xs text-gray-300 leading-relaxed mt-4">{scene.start_frame_scene}</p>
                        <button 
                          onClick={() => copyText(scene.start_frame_scene, `sfs-${scene.scene_number}`)}
                          className="absolute bottom-4 right-4 text-[9px] font-bold text-gray-700 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        >
                          <Copy size={10} /> Copy Scene
                        </button>
                      </div>
                      <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-5 relative group">
                        <span className="text-[8px] text-blue-500/50 font-black uppercase absolute top-4 left-4">STYLE DETAIL</span>
                        <p className="text-xs text-blue-200/80 leading-relaxed mt-4 italic">{scene.start_frame_style}</p>
                        <button 
                          onClick={() => copyText(scene.start_frame_style, `sfs-style-${scene.scene_number}`)}
                          className="absolute bottom-4 right-4 text-[9px] font-bold text-blue-500/50 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        >
                          <Copy size={10} /> Copy Style
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* End Frame Group */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">Scene Ending Frame</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 relative group">
                        <span className="text-[8px] text-gray-600 font-black uppercase absolute top-4 left-4">SCENE DETAIL</span>
                        <p className="text-xs text-gray-300 leading-relaxed mt-4">{scene.end_frame_scene}</p>
                        <button 
                          onClick={() => copyText(scene.end_frame_scene, `efs-${scene.scene_number}`)}
                          className="absolute bottom-4 right-4 text-[9px] font-bold text-gray-700 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        >
                          <Copy size={10} /> Copy Scene
                        </button>
                      </div>
                      <div className="bg-purple-600/5 border border-purple-500/10 rounded-2xl p-5 relative group">
                        <span className="text-[8px] text-purple-500/50 font-black uppercase absolute top-4 left-4">STYLE DETAIL</span>
                        <p className="text-xs text-purple-200/80 leading-relaxed mt-4 italic">{scene.end_frame_style}</p>
                        <button 
                          onClick={() => copyText(scene.end_frame_style, `efs-style-${scene.scene_number}`)}
                          className="absolute bottom-4 right-4 text-[9px] font-bold text-purple-500/50 hover:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        >
                          <Copy size={10} /> Copy Style
                        </button>
                      </div>
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
            className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full hover:bg-gray-200 transition-all text-sm shadow-2xl shadow-white/5"
          >
            Exit Production
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptViewer;
