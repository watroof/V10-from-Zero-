
import React, { useState, useEffect } from 'react';
import ScriptForm from './components/ScriptForm';
import ScriptViewer from './components/ScriptViewer';
import HistoryView from './components/HistoryView';
import { Script } from './types';
import { generateScript } from './services/geminiService';
import { Terminal, Sparkles, Settings, ChevronUp, ChevronDown, Check, Save, Key, ScrollText, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';

const INITIAL_SYSTEM_PROMPT = `# CREATIVE-FIRST VIDEO SCRIPT GENERATION PROMPT (TWO-PHASE, STRICT)

## CORE CREATIVE INSTRUCTION (HIGHEST PRIORITY)

You MUST generate the script in TWO DISTINCT PHASES.

DO NOT merge these phases.
DO NOT shortcut.
DO NOT generate directly in the output schema.

---

## PHASE 1 — PURE CREATIVE SCRIPT GENERATION (NO STRUCTURE)

In this phase, you are a:
- Wild cinematic storyteller
- Superhero movie writer
- High-energy commercial director

### RULES FOR PHASE 1

1. Generate a COMPLETELY RANDOM and CRAZY short cinematic story.
2. The story can include:
   - Superheroes
   - Time travel
   - Explosions
   - Dramatic entrances
   - Cinematic reveals
   - Over-the-top moments
   - Emotional or hype moments
3. The story MUST feel like:
   - A premium cinematic video
   - High energy
   - Visually intense
4. The story MUST be suitable for a **TOTAL VIDEO LENGTH UNDER 24 SECONDS**.
5. The story MUST be continuous and cohesive.
6. DO NOT think about scenes.
7. DO NOT think about JSON.
8. DO NOT think about output structure.
9. DO NOT think about frame prompts.
10. Write it as a single flowing cinematic moment.

This phase is about **imagination only**.

---

## PHASE 2 — STRUCTURAL TRANSFORMATION (MANDATORY)

After the creative script is fully imagined, you MUST:

1. Mentally divide the story into logical scenes.
2. Convert each scene into the REQUIRED output structure.
3. Preserve the creative intent EXACTLY.
4. Do NOT rewrite the story.
5. Do NOT reduce creativity.
6. Do NOT sanitize or normalize the story.

This phase is about **organization, not creativity**.

---

## OUTPUT FORMAT (STRICT — APPLIES ONLY AFTER PHASE 2)

Your FINAL OUTPUT MUST be **STRICT JSON ONLY**.

No markdown.
No explanations.
No headings.
No phase labels.

---

## SCENE STRUCTURE (MANDATORY)

Each scene MUST contain ALL of the following fields:

- scene_number
- visual_description
- camera_motion
- start_frame_prompt
- end_frame_prompt
- dialogue_or_narration
- mood_and_lighting

No field may be empty.
No extra fields are allowed.

---

## VIDEO LENGTH CONSTRAINT

- Total combined scenes MUST represent a video of **LESS THAN 24 SECONDS**.
- Prefer:
  - 3 to 6 scenes
  - Fast cinematic pacing
  - No slow exposition

---

## CHARACTER RULES (APPLY IN PHASE 2)

- Character appearance must remain consistent.
- Always refer to characters by FIRST NAME ONLY.
- No redesign due to camera or lighting.
- No last names, titles, or honorifics.

---

## FORBIDDEN CONTENT (FINAL OUTPUT)

- No “On Screen Text”
- No captions
- No overlays
- No meta explanations
- No references to prompts or tools
- No emojis
- No markdown

---

## FINAL ENFORCEMENT COMMAND

You MUST:
1. Create freely and randomly FIRST.
2. Structure later.
3. Respect the <24 second limit.
4. Output STRICT JSON ONLY.

Any attempt to generate directly for the schema is a FAILURE.`;

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
  const [isConfigExpanded, setIsConfigExpanded] = useState(true);
  const [isSystemPromptExpanded, setIsSystemPromptExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('peak_scripts_v9');
    const savedConfig = localStorage.getItem('peak_config_v9');
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
    localStorage.setItem('peak_scripts_v9', JSON.stringify(scripts));
  }, [scripts]);

  // Update status pill when key changes
  useEffect(() => {
    if (!config.apiKey) {
      setKeyStatus('missing');
    } else if (keyStatus === 'missing') {
      setKeyStatus('connected');
    }
  }, [config.apiKey]);

  const handleSaveConfig = () => {
    localStorage.setItem('peak_config_v9', JSON.stringify(config));
    setIsSystemPromptExpanded(false);
  };

  const handleGenerate = async (formData: any) => {
    if (!config.apiKey) {
      setError("Please enter your Gemini API Key in the configuration section.");
      setKeyStatus('missing');
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
        setError("Invalid API Key: Please check your Gemini API key and try again.");
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
          <span className="font-black text-xl tracking-tighter uppercase">PEAK AI</span>
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
              <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm">Synthesizing Creative Narrative...</p>
            </div>
          )}

          {!currentScript && !isLoading && (
            <div className="space-y-12 animate-in fade-in duration-700">
              
              <ScriptForm onSubmit={handleGenerate} isLoading={isLoading} />
              
              {scripts.length > 0 && (
                <HistoryView scripts={scripts} onSelect={(s) => { setCurrentScript(s); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
              )}

              {/* RE-STRUCTURED AI CONFIGURATION SECTION */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
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
                  <p className="text-gray-500 text-sm mb-8">Configure temperature, system prompt, and API key for Gemini AI</p>

                  <div className={`space-y-8 transition-all duration-300 ${isConfigExpanded ? 'block' : 'hidden'}`}>
                    
                    {/* Temperature Row */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Temperature (Controls Creativity)</label>
                      <select 
                        value={config.temperature}
                        onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors appearance-none"
                      >
                        <option value={0.7}>0.7 - More Focused</option>
                        <option value={0.8}>0.8 - Balanced (Default)</option>
                        <option value={0.9}>0.9 - Creative</option>
                        <option value={1.0}>1.0 - More Creative</option>
                        <option value={1.1}>1.1 - Very Creative</option>
                        <option value={1.2}>1.2 - Highly Creative</option>
                        <option value={1.5}>1.5 - Maximum Creativity</option>
                      </select>
                      <p className="text-[11px] text-gray-500 mt-2">
                        Higher values = more creative and random outputs. Lower values = more focused and deterministic.
                      </p>
                    </div>

                    {/* API Key Status Row */}
                    <div className="flex items-center justify-between">
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
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-900/10 text-yellow-500 rounded border border-yellow-500/20 text-[10px] font-bold uppercase tracking-wider">
                          <AlertTriangle size={12} /> Not Configured
                        </div>
                      )}
                    </div>

                    {/* API Key Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Gemini API Key</label>
                      <input 
                        type="password"
                        value={config.apiKey}
                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                        placeholder="Enter your Gemini API key"
                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors font-mono text-sm"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        Get your API key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>
                      </div>
                    </div>

                    {/* System Prompt Row */}
                    <div className="flex items-center justify-between py-2 border-t border-white/5 pt-4">
                      <span className="text-sm font-medium text-gray-300">System Prompt</span>
                      <button 
                        onClick={() => setIsSystemPromptExpanded(!isSystemPromptExpanded)}
                        className="text-xs text-gray-400 hover:text-white transition-colors uppercase font-bold tracking-widest"
                      >
                        {isSystemPromptExpanded ? 'Collapse' : 'Expand'}
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

                    {/* Save Button */}
                    <div className="pt-2">
                      <button 
                        onClick={handleSaveConfig}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Save size={18} /> Save Configuration
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
      
      <footer className="py-8 text-center text-[10px] text-gray-800 uppercase tracking-widest">
        Peak Engine v4.5.0
      </footer>
    </div>
  );
};

export default App;
