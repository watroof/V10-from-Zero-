
import React, { useState, useEffect } from 'react';
import ScriptForm from './components/ScriptForm';
import ScriptViewer from './components/ScriptViewer';
import HistoryView from './components/HistoryView';
import { Script } from './types';
import { generateScript } from './services/geminiService';
import { Terminal, Sparkles, Settings, ChevronUp, ChevronDown, Check, Save, XCircle, AlertTriangle } from 'lucide-react';

const INITIAL_SYSTEM_PROMPT = `# PEAK PRODUCTION ENGINE — TRIPLE-SCENE CONTINUITY GENERATOR

## MANDATORY WORKFLOW

### PHASE 1: THREE-ACT MINI ARC
Generate EXACTLY 3 scenes. Each scene must represent 5 to 8 seconds of footage.
Total sequence duration must be between 15-24 seconds.

### PHASE 2: VISUAL BIBLE (LOCKS)
Before writing scenes, you MUST define these constants:
1. **Character Lock**: Define EXACT physical features (age, eyes, hair) and clothes. These CANNOT change. No age-jumping. If they are a toddler in Scene 1, they are a toddler in all 3 scenes.
2. **Environment Lock**: Define the specific lighting and setting (e.g., "Misty sunrise in a pine forest, soft volumetric lighting").

### PHASE 3: SEQUENTIAL CONTINUITY (THE HANDOFF)
- **FRAME LINKING**: The 'end_frame_prompt' of Scene 1 MUST be the 'start_frame_prompt' of Scene 2. The 'end_frame_prompt' of Scene 2 MUST be the 'start_frame_prompt' of Scene 3.
- Descriptions must match 1:1 to ensure the AI video generator treats them as the same moment in time.

### PHASE 4: STRUCTURED OUTPUT
Output the script in the requested JSON format.

---

## OUTPUT SCHEMA RULES

- **visual_description**: A stand-alone cinematic prompt for the video generation tool.
- **camera_motion**: Precise cinematic movement (e.g., "Static", "Pan Left", "Dolly In").
- **start_frame_prompt**: Detailed image prompt for the starting frame. 
- **end_frame_prompt**: Detailed image prompt for the ending frame.
- **dialogue_or_narration**: Audio components.
- **mood_and_lighting**: Atmospheric cues.

---

## CONSTRAINTS
1. **EXACTLY 3 SCENES**: No more, no less.
2. **JSON ONLY**: No markdown or meta-text.
3. **NO JUMPS**: No sudden aging, outfit changes, or background shifts unless it's a "match cut" with identical composition.
4. **STYLE**: Maintain consistent style keywords (e.g., "Cinematic photorealism", "Hyper-detailed 8k") in every prompt field.`;

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
    const saved = localStorage.getItem('peak_scripts_v13');
    const savedConfig = localStorage.getItem('peak_config_v13');
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
    localStorage.setItem('peak_scripts_v13', JSON.stringify(scripts));
  }, [scripts]);

  useEffect(() => {
    if (!config.apiKey) {
      setKeyStatus('missing');
    } else if (keyStatus === 'missing') {
      setKeyStatus('connected');
    }
  }, [config.apiKey]);

  const handleSaveConfig = () => {
    localStorage.setItem('peak_config_v13', JSON.stringify(config));
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
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-600 rounded">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">PEAK ENGINE</span>
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
                      <h3 className="font-bold text-white text-lg">AI Configuration</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-medium rounded border border-blue-500/20">
                        Temp: {config.temperature}
                      </div>
                      <button onClick={() => setIsConfigExpanded(!isConfigExpanded)}>
                        {isConfigExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">Master parameters for the generation engine</p>

                  <div className={`space-y-8 transition-all duration-300 ${isConfigExpanded ? 'block' : 'hidden'}`}>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Creativity Level (Temperature)</label>
                      <select 
                        value={config.temperature}
                        onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors appearance-none"
                      >
                        <option value={0.7}>0.7 - High Precision</option>
                        <option value={0.8}>0.8 - Standard Balanced</option>
                        <option value={1.0}>1.0 - More Creative</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                      <span className="text-sm font-medium text-gray-300">API Key Status</span>
                      {keyStatus === 'connected' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-900/20 text-green-500 rounded border border-green-500/20 text-[10px] font-bold">
                          <Check size={12} /> Connected
                        </div>
                      )}
                      {keyStatus === 'error' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-900/20 text-red-500 rounded border border-red-500/20 text-[10px] font-bold">
                          <XCircle size={12} /> Error
                        </div>
                      )}
                      {keyStatus === 'missing' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-900/10 text-yellow-500 rounded border border-yellow-500/20 text-[10px] font-bold">
                          <AlertTriangle size={12} /> Unconfigured
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Gemini API Key</label>
                      <input 
                        type="password"
                        value={config.apiKey}
                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                        placeholder="Enter API Key"
                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-white/5 pt-4">
                      <span className="text-sm font-medium text-gray-300">System Instruction Matrix</span>
                      <button 
                        onClick={() => setIsSystemPromptExpanded(!isSystemPromptExpanded)}
                        className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-black tracking-widest"
                      >
                        {isSystemPromptExpanded ? 'Collapse Engine' : 'Expand Engine'}
                      </button>
                    </div>

                    {isSystemPromptExpanded && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <textarea
                          value={config.systemPrompt}
                          onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                          className="w-full h-80 bg-[#0d0d0d] border border-white/10 rounded-lg p-4 text-[11px] font-mono text-gray-400 outline-none focus:border-blue-500 transition-all resize-y"
                        />
                      </div>
                    )}

                    <div className="pt-2">
                      <button 
                        onClick={handleSaveConfig}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg uppercase tracking-widest text-sm"
                      >
                        <Save size={18} /> Update Matrix
                      </button>
                    </div>
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
