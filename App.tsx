import React, { useState, useCallback } from 'react';
import { OptimizationMode } from './types';
import { MODES } from './constants';
import { optimizePrompt } from './services/geminiService';
import { ModeCard } from './components/ModeCard';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedMode, setSelectedMode] = useState<OptimizationMode>(OptimizationMode.DIRECTIVE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleOptimize = useCallback(async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setOutput(''); // Clear previous output to show "processing" state clearly

    try {
      const result = await optimizePrompt(input, selectedMode);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during processing.');
    } finally {
      setIsLoading(false);
    }
  }, [input, selectedMode]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleDownload = (extension: 'txt' | 'md') => {
    if (!output) return;
    const mimeType = extension === 'txt' ? 'text/plain' : 'text/markdown';
    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PROMPT_ARCHITECT_${selectedMode}_${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="border-b-2 border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 flex items-center justify-center font-bold text-black font-mono">
              PA
            </div>
            <h1 className="text-xl font-bold tracking-tighter uppercase text-white">
              Prompt<span className="text-zinc-600">_</span>Architect<span className="text-orange-600 text-xs align-top ml-1">V1</span>
            </h1>
          </div>
          <div className="font-mono text-xs text-zinc-500 hidden md:block">
            SYSTEM_STATUS: <span className="text-green-500">ONLINE</span> // API: <span className="text-blue-400">GEMINI_2.5</span>
          </div>
        </div>
      </header>

      {/* Main Content Area - Grid Layout */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input & Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Input Panel */}
          <div className="flex-1 flex flex-col min-h-[300px] border-2 border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center justify-between bg-zinc-900 border-b-2 border-zinc-800 p-2 px-3">
              <span className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Icon name="Terminal" size={14} /> Input_Source
              </span>
              <span className="font-mono text-xs text-zinc-600">{input.length} CHARS</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your raw prompt here for refactoring..."
              className="flex-1 w-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none focus:bg-zinc-900/80 transition-colors placeholder-zinc-700"
              spellCheck={false}
            />
          </div>

          {/* Mode Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MODES.map((mode) => (
              <ModeCard
                key={mode.id}
                config={mode}
                isSelected={selectedMode === mode.id}
                onClick={setSelectedMode}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleOptimize}
            disabled={isLoading || !input.trim()}
            className={`
              relative w-full h-16 uppercase font-bold tracking-widest text-lg font-mono border-2 transition-all
              ${isLoading 
                ? 'bg-zinc-800 border-zinc-800 text-zinc-500 cursor-wait' 
                : !input.trim()
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed'
                  : 'bg-orange-600 border-orange-600 text-black hover:bg-orange-500 hover:border-orange-500 active:translate-y-1'
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2 animate-pulse">
                <Icon name="Loader2" className="animate-spin" /> Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon name="Zap" /> Initiate_Refactor
              </span>
            )}
          </button>
        </div>

        {/* Right Column: Output (7 cols) */}
        <div className="lg:col-span-7 flex flex-col min-h-[500px] lg:min-h-0 relative">
          {/* Aesthetic connectors */}
          <div className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2">
             <Icon name="ArrowRight" className="text-zinc-700" />
          </div>

          <div className="flex-1 flex flex-col border-2 border-zinc-700 bg-black relative overflow-hidden">
             {/* Decorative stripe */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-600 to-transparent opacity-50" />
            
            <div className="flex items-center justify-between bg-zinc-900 border-b-2 border-zinc-700 p-2 px-3">
              <span className="font-mono text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                <Icon name="Cpu" size={14} /> Refactored_Output
              </span>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                {output && <span>TOKENS: {Math.ceil(output.length / 4)}</span>}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto relative">
              {error ? (
                <div className="h-full flex flex-col items-center justify-center text-red-500 font-mono text-center p-4 border border-red-900/30 bg-red-950/10">
                  <Icon name="AlertTriangle" size={48} className="mb-4 opacity-80" />
                  <h3 className="text-lg font-bold mb-2">SYSTEM_ERROR</h3>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              ) : output ? (
                <div className="prose prose-invert prose-p:font-mono prose-headings:font-sans max-w-none">
                  {/* We render raw text but style it to handle markdown-like structures gracefully if Gemini sends them */}
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-300 font-light">
                    {output}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 select-none">
                  <Icon name="BoxSelect" size={64} className="mb-4 opacity-20" />
                  <p className="font-mono text-xs tracking-widest uppercase">Waiting for input stream...</p>
                </div>
              )}
              
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <div className="w-64 h-1 bg-zinc-800 overflow-hidden relative mb-4">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-orange-600 animate-loading-bar"></div>
                  </div>
                  <div className="font-mono text-xs text-orange-500 animate-pulse">
                    OPTIMIZING_TOKENS :: MODE_{selectedMode}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer / Action Bar */}
            <div className="border-t-2 border-zinc-800 bg-zinc-900 p-4">
               <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleCopy}
                    disabled={!output}
                    className={`
                      flex-1 py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all
                      ${!output 
                        ? 'border-zinc-800 text-zinc-700 cursor-not-allowed' 
                        : copyStatus === 'copied'
                          ? 'bg-green-600/20 border-green-500 text-green-500'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-white hover:bg-zinc-700'
                      }
                    `}
                  >
                    {copyStatus === 'copied' ? <Icon name="Check" size={16} /> : <Icon name="Copy" size={16} />}
                    {copyStatus === 'copied' ? 'COPIED' : 'COPY_TEXT'}
                  </button>
                  
                  <div className="flex gap-3 flex-1">
                    <button 
                      onClick={() => handleDownload('txt')}
                      disabled={!output}
                      className="flex-1 py-3 px-4 bg-zinc-950 border-2 border-zinc-800 text-zinc-500 font-mono text-xs font-bold uppercase tracking-wider hover:border-zinc-600 hover:text-zinc-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Icon name="FileText" size={16} /> .TXT
                    </button>
                    <button 
                      onClick={() => handleDownload('md')}
                      disabled={!output}
                      className="flex-1 py-3 px-4 bg-zinc-950 border-2 border-zinc-800 text-zinc-500 font-mono text-xs font-bold uppercase tracking-wider hover:border-zinc-600 hover:text-zinc-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Icon name="FileCode" size={16} /> .MD
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        @keyframes loading-bar {
          0% { left: -33%; }
          100% { left: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default App;