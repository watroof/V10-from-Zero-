
import React, { useState } from 'react';
import { Script } from '../types';
import { Copy, FileJson, Camera, Music, Clapperboard, Sparkles, Check, ChevronLeft, Layout, ClipboardList, Layers } from 'lucide-react';

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

  const copyAsJson = (text: string, id: string) => {
    const json = JSON.stringify({
      prompt: text,
      style: script.visual_style,
      negative_prompt: "text, watermark, logo, blurry, distorted anatomy, jumping background",
      seed: Math.floor(Math.random() * 1000000)
    }, null, 2);
    copyText(json, id);
  };

  const globalStyleText = `VISUAL STYLE: ${script.visual_style}\nTONE: ${script.tone}\nSUBJECT: ${script.person_name}\nSEQUENCE: 3 Sequential Scenes`;

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
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{script.person_name} • TRIPLE-SCENE PRODUCTION</p>
          </div>
        </div>
        <button 
          onClick={() => copyText(JSON.stringify(script, null, 2), 'full')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-xs font-bold transition-all shadow-lg"
        >
          {copiedId === 'full' ? <Check size={14} /> : <FileJson size={16} />}
          {copiedId === 'full' ? 'COPIED FULL JSON' : 'EXPORT DATA'}
        </button>
      </div>

      {/* GLOBAL STYLE BOX */}
      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-400">
            <Layers size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Style DNA Reference</span>
          </div>
          <button 
            onClick={() => copyText(globalStyleText, 'style-dna')}
            className="text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded"
          >
            {copiedId === 'style-dna' ? <Check size={10} /> : <Copy size={10} />}
            Copy Global Style
          </button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Master Visual Lock</span>
            <div className="bg-black/40 p-5 rounded-xl border border-white/5">
              <p className="text-sm font-medium text-gray-300">Style: <span className="text-white font-bold">{script.visual_style}</span></p>
              <p className="text-sm font-medium text-gray-300">Tone: <span className="text-white font-bold">{script.tone}</span></p>
            </div>
          </div>
          <div className="space-y-4">
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Consistency Matrix</span>
            <div className="bg-black/40 p-5 rounded-xl border border-white/5">
              <p className="text-sm font-medium text-gray-300">Subject: <span className="text-white font-bold uppercase">{script.person_name}</span></p>
              <p className="text-sm font-medium text-gray-300">Continuity: <span className="text-emerald-500 font-bold italic">Sequential Handoff Enabled</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* SCENES LOOP */}
      <div className="space-y-24 pt-8">
        {script.scenes.map((scene, idx) => (
          <div key={scene.scene_number} className="relative group">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-10 h-10 bg-blue-600 text-white font-black rounded flex items-center justify-center text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                {scene.scene_number}
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Scene {scene.scene_number}</h2>
              <div className="h-px flex-1 bg-white/5"></div>
              <span className="text-[10px] text-gray-600 font-bold uppercase">Estimated Duration: 5-8s</span>
            </div>

            <div className="space-y-8 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl transition-all hover:border-white/10">
              
              {/* Scene Prompt Block */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Video Generation Script</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyText(scene.visual_description, `txt-${scene.scene_number}`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded border border-white/10 text-[10px] font-bold transition-all"
                    >
                      {copiedId === `txt-${scene.scene_number}` ? <Check size={12} /> : <Copy size={12} />}
                      COPY TEXT
                    </button>
                    <button 
                      onClick={() => copyAsJson(scene.visual_description, `json-${scene.scene_number}`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded border border-blue-500/20 text-[10px] font-bold transition-all"
                    >
                      {copiedId === `json-${scene.scene_number}` ? <Check size={12} /> : <Sparkles size={12} />}
                      COPY JSON
                    </button>
                  </div>
                </div>
                <div className="bg-[#111] p-8 rounded-2xl border border-white/5 text-center shadow-inner">
                  <p className="text-gray-200 text-2xl leading-relaxed font-medium">
                    {scene.visual_description}
                  </p>
                </div>
              </div>

              {/* Performance Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-orange-500 mb-2">
                    <Clapperboard size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Motion & Vfx</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Camera:</span>
                      <span className="text-xs text-white bg-white/5 px-2 py-0.5 rounded font-mono">{scene.camera_motion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Lighting:</span>
                      <span className="text-xs text-white bg-white/5 px-2 py-0.5 rounded">{scene.mood_and_lighting}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Music size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dialogue / Audio</span>
                  </div>
                  <p className="text-sm text-gray-300 italic font-medium leading-relaxed">
                    {scene.dialogue_or_narration || "Ambient soundscape only."}
                  </p>
                </div>
              </div>

              {/* FRAME GENERATION ENGINE BOX */}
              <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden">
                <div className="bg-emerald-500/5 px-6 py-3 border-b border-white/5 flex items-center gap-2">
                  <Camera size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Frame Generation Engine</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Start Frame Prompt */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                        {idx > 0 ? "Sequential Handoff (Start)" : "Initial Scene Start"}
                      </span>
                      <button 
                        onClick={() => copyText(scene.start_frame_prompt, `sf-${scene.scene_number}`)}
                        className="text-[9px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                      >
                        {copiedId === `sf-${scene.scene_number}` ? <Check size={10} /> : <Copy size={10} />}
                        Copy
                      </button>
                    </div>
                    <div className={`p-4 rounded-xl text-[11px] text-gray-400 leading-relaxed min-h-[80px] border ${idx > 0 ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 bg-black/40'}`}>
                      {scene.start_frame_prompt}
                    </div>
                  </div>

                  {/* End Frame Prompt */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Scene End Frame</span>
                      <button 
                        onClick={() => copyText(scene.end_frame_prompt, `ef-${scene.scene_number}`)}
                        className="text-[9px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                      >
                        {copiedId === `ef-${scene.scene_number}` ? <Check size={10} /> : <Copy size={10} />}
                        Copy
                      </button>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-[11px] text-gray-400 leading-relaxed min-h-[80px]">
                      {scene.end_frame_prompt}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {onClose && (
        <div className="flex justify-center pt-24">
          <button 
            onClick={onClose} 
            className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:bg-gray-200 transition-all text-sm shadow-xl"
          >
            Terminal Shutdown
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptViewer;
