
import React, { useState, useEffect } from 'react';
import ScriptForm from './components/ScriptForm';
import ScriptViewer from './components/ScriptViewer';
import HistoryView from './components/HistoryView';
import { Script } from './types';
import { generateScript } from './services/geminiService';
import { Terminal, Sparkles, Settings, ChevronUp, ChevronDown, Check, Save, XCircle, AlertTriangle } from 'lucide-react';

const INITIAL_SYSTEM_PROMPT = `# PEAK PRODUCTION ENGINE — TRIPLE-SCENE CONTINUITY GENERATOR

## MANDATORY WORKFLOW

### PHASE 1: THREE-ACT MINI ARC (5-8s per scene)
Generate EXACTLY 3 scenes. Each scene represents 5 to 8 seconds of footage.
Total sequence must be a cohesive, high-impact short narrative.

### PHASE 2: VISUAL BIBLE (LOCKS)
Define these constants first:
1. **Character Lock**: Precise age, features, and clothing. No jumping. 
2. **Environment Lock**: Detailed lighting and setting consistency.

### PHASE 3: MASTER STYLE PROMPT (CONSISTENCY HUB)
- You MUST generate a 'master_style_prompt'. This is a detailed string containing all stylistic keywords (art style, camera lens type, lighting mood, color palette, texture details). 
- This prompt is the foundation for ALL visual prompts in the video.

### PHASE 4: SEQUENTIAL CONTINUITY (THE HANDOFF)
- **FRAME LINKING**: Scene N 'end_frame_prompt' MUST match Scene N+1 'start_frame_prompt' exactly in content.
- Continuity is non-negotiable. Backgrounds and characters must persist 1:1.

### PHASE 5: FRAME ENGINE OUTPUT
For every scene, you MUST provide exactly two frame prompts:
- **start_frame_prompt**: The visual description for the beginning of the clip, including the master style keywords.
- **end_frame_prompt**: The visual description for the end of the clip, including the master style keywords.

---

## OUTPUT SCHEMA RULES
- **master_style_prompt**: The core style prompt for the whole video.
- **visual_description**: The stand-alone masterpiece prompt for the video tool.
- **camera_motion**: Precise cinematic movement.
- **start_frame_prompt**: Full description for clip start.
- **end_frame_prompt**: Full description for clip end.
- **dialogue_or_narration**: Audio components.
- **mood_and_lighting**: Atmospheric cues.

---

## CONSTRAINTS
1. **EXACTLY 3 SCENES**.
2. **JSON ONLY**.
3. **STYLE ADHERENCE**: The style MUST be consistent across all 3 clips.`;

type KeyStatus = 'missing' | 'connected' | 'error';

const App: React.FC = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentScript, setCurrentScript] = useState<Script | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [keyStatus, setKeyStatus] = useState<KeyStatus>('missing');
  const [config, setConfig] = useState({ 
    temperature: 0.8,
    systemPrompt: INITIAL_SYSTEM_PROMPT,
    apiKey: ''
  });
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [isSystemPromptExpanded, setIsSystemPromptExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('peak_scripts_v16');
    const savedConfig = localStorage.getItem('peak_config_v16');
    if (saved) {
      try { setScripts(JSON.parse(saved)); } catch (e) { console.error("History fail"); }
    }
    if (savedConfig) {
      try { 
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        if (parsed.apiKey) setKeyStatus('connected');
      } catch (e) { console.error("Config fail"); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('peak_scripts_v16', JSON.stringify(scripts));
  }, [scripts]);

  useEffect(() => {
    if (!config.apiKey) {
      setKeyStatus('missing');
    } else if (keyStatus === 'missing') {
      setKeyStatus('connected');
    }
  }, [config.apiKey]);

  const handleSaveConfig = () => {
    localStorage.setItem('peak_config_v16', JSON.stringify(config));
    setIsSystemPromptExpanded(false);
    setIsConfigExpanded(false);
  };

  const handleGenerate = async (formData: any) => {
    if (!config.apiKey) {
      setError("API Key Required.");
      setIsConfigExpanded(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateScript({ 
        ...formData, 
        temperature: config.temperature,
        customSystemPrompt: config.systemPrompt,
        apiKey: config.apiKey
      });
      const newScript: Script = {
        ...result as Script,
        id: crypto.randomUUID(),
      };
      setScripts(prev => [newScript, ...prev]);
      setCurrentScript(newScript);
      setKeyStatus('connected');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const errorMessage = err.message || "";
      if (errorMessage.includes("API key not valid") || errorMessage.includes("401") || errorMessage.includes("403")) {
        setError("Invalid API Key.");
        setKeyStatus('error');
      } else {
        setError(errorMessage || 'Generation failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col font-sans">
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] border-b border-white/10 flex items-center px-8 z-50">
        <div className="flex items-center gap-2 text-blue-500">
          <Sparkles size={20} fill="currentColor" />
          <span className="font-black text-xl tracking-tighter uppercase text-white">PEAK ENGINE</span>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-24 px-6 md:px-12 flex flex-col items-center">
        <div className="w-full max-w-5xl space-y-12">
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
              <Terminal size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center space-y-8">
              <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm">Locking Sequential Frame Continuity...</p>
            </div>
          )}

          {!currentScript && !isLoading && (
            <div className="space-y-12 animate-in fade-in duration-700">
              
              <ScriptForm onSubmit={handleGenerate} isLoading={isLoading} />
              
              {scripts.length > 0 && (
                <HistoryView scripts={scripts} onSelect={(s) => { setCurrentScript(s); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
              )}

              <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 text-blue-500">
                      <Settings size={20} />
                      <h3 className="font-bold text-white text-lg tracking-tight">AI Engine Config</h3>
                    </div>
                    <button onClick={() => setIsConfigExpanded(!isConfigExpanded)}>
                      {isConfigExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 italic">Calibration parameters for sequential generation</p>

                  <div className={`space-y-8 transition-all duration-300 ${isConfigExpanded ? 'block' : 'hidden'}`}>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Creativity Level</label>
                      <select 
                        value={config.temperature}
                        onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors appearance-none"
                      >
                        <option value={0.7}>0.7 - High Continuity</option>
                        <option value={0.8}>0.8 - Standard Balanced</option>
                        <option value={1.0}>1.0 - Artistic Flux</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Gemini API Key</label>
                      <input 
                        type="password"
                        value={config.apiKey}
                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                        placeholder="Paste Gemini Key"
                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-white/5 pt-4">
                      <span className="text-xs font-bold text-gray-400">System Instruction Matrix</span>
                      <button 
                        onClick={() => setIsSystemPromptExpanded(!isSystemPromptExpanded)}
                        className="text-[10px] text-blue-500 hover:text-blue-400 transition-colors uppercase font-black tracking-widest"
                      >
                        {isSystemPromptExpanded ? 'Collapse' : 'Modify Logic'}
                      </button>
                    </div>

                    {isSystemPromptExpanded && (
                      <textarea
                        value={config.systemPrompt}
                        onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                        className="w-full h-80 bg-[#0d0d0d] border border-white/10 rounded-lg p-4 text-[11px] font-mono text-gray-400 outline-none focus:border-blue-500 transition-all resize-y"
                      />
                    )}

                    <button 
                      onClick={handleSaveConfig}
                      className="w-full bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 border border-white/10 text-xs"
                    >
                      <Save size={14} /> Update Calibration
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {currentScript && !isLoading && (
            <ScriptViewer script={currentScript} onClose={() => setCurrentScript(null)} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
