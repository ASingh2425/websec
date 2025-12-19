
import React, { useState, useEffect } from 'react';
import { Search, Globe, Code, Play, Zap, Shield, Settings2, Cpu, BrainCircuit, Lock, Flashlight } from 'lucide-react';
import { ScanModule, ScanAggressiveness, ScanSensitivity, ScanConfig } from '../types';
import { securityService } from '../services/securityService';
import { PricingModal } from './PricingModal';

interface ScanFormProps {
  onScan: (target: string, type: 'url' | 'code', modules: ScanModule[], config: ScanConfig) => void;
  isScanning: boolean;
}

const TOOLS = [
  { id: 'burp', name: 'Burp Suite Pro' },
  { id: 'acunetix', name: 'Acunetix Premium' },
  { id: 'nessus', name: 'Nessus' },
  { id: 'zap', name: 'OWASP ZAP' },
  { id: 'nmap', name: 'Nmap' },
  { id: 'sqlmap', name: 'SQLmap' },
  { id: 'nikto', name: 'Nikto' },
  { id: 'xsstrike', name: 'XSStrike' },
  { id: 'nuclei', name: 'Nuclei' },
  { id: 'metasploit', name: 'Metasploit' },
];

export const ScanForm: React.FC<ScanFormProps> = ({ onScan, isScanning }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'url' | 'code'>('url');
  const [error, setError] = useState('');
  
  // Plan & State
  const [plan, setPlan] = useState(securityService.getCurrentPlan());
  const [credits, setCredits] = useState(securityService.getCredits());
  const [showPricing, setShowPricing] = useState(false);

  // Config State
  const [activeTools, setActiveTools] = useState<Record<string, boolean>>({});
  const [aggressiveness, setAggressiveness] = useState<ScanAggressiveness>('stealth');
  const [model, setModel] = useState<'flash' | 'pro' | 'lite'>('flash');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
     refreshPlan();
  }, []);

  // Sync credits when scanning state changes
  useEffect(() => {
     refreshPlan();
  }, [isScanning]);

  const refreshPlan = () => {
      const p = securityService.getCurrentPlan();
      setPlan(p);
      setCredits(securityService.getCredits());

      // Auto-select defaults based on plan.
      if (!p.allowedModels.includes(model)) {
          if (p.allowedModels.includes('lite')) setModel('lite');
          else setModel('flash');
      }
      
      // Smart Validation: Default to Stealth
      if (!p.allowedModes.includes(aggressiveness)) {
          if (p.allowedModes.includes('stealth')) {
              setAggressiveness('stealth');
          } else if (p.allowedModes.includes('deep')) {
              setAggressiveness('deep');
          }
      }
      
      // Reset tools if needed
      const initialTools: Record<string, boolean> = {};
      TOOLS.slice(0, p.maxTools).forEach(t => initialTools[t.id] = true);
      setActiveTools(initialTools);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credits <= 0 && plan.maxScans !== -1) {
        setShowPricing(true);
        return;
    }

    const validationError = securityService.validateTarget(input, mode);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    
    const modules: ScanModule[] = TOOLS.map(t => ({
      name: t.name,
      enabled: !!activeTools[t.id]
    }));

    onScan(input, mode, modules, { aggressiveness, sensitivity: 'all-findings', model });
  };

  const handleToolToggle = (id: string) => {
      if (activeTools[id]) {
          setActiveTools(prev => ({...prev, [id]: false}));
      } else {
          const currentCount = Object.values(activeTools).filter(Boolean).length;
          if (currentCount >= plan.maxTools) {
              if (plan.id === 'free') setShowPricing(true);
              return;
          }
          setActiveTools(prev => ({...prev, [id]: true}));
      }
  };

  return (
    <>
    <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} onPlanUpdated={refreshPlan} />

    <div className="w-full max-w-3xl mx-auto mt-12 animate-fade-in-up">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-cyber-primary text-xs font-bold uppercase tracking-widest mb-6 shadow-glow">
            <Zap size={12} className="text-cyber-primary" /> Elite Enterprise Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-cyber-text-main mb-6 tracking-tight">
          WebSec<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-primaryEnd"> Ultra</span>
        </h1>
        <p className="text-cyber-text-secondary text-lg font-light max-w-lg mx-auto leading-relaxed mb-4">
          Enterprise-grade penetration testing powered by AI. 
        </p>

        {/* Credit Display */}
        <div className="inline-block bg-cyber-cardHighlight rounded-full px-4 py-1 border border-cyber-border">
            <span className="text-xs font-bold text-cyber-text-muted uppercase tracking-wider mr-2">Plan: <span className="text-cyber-primary">{plan.name}</span></span>
            <span className="text-xs font-bold text-cyber-text-main">
                {plan.maxScans === -1 ? 'Unlimited Scans' : `${credits} Scan${credits !== 1 ? 's' : ''} Remaining`}
            </span>
            {credits <= 0 && plan.maxScans !== -1 && (
                <button onClick={() => setShowPricing(true)} className="ml-3 text-xs font-bold text-emerald-400 hover:underline">Get More</button>
            )}
        </div>
      </div>

      <div className="cyber-card relative z-10 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-primary via-cyber-primaryEnd to-cyber-accent opacity-100"></div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 bg-cyber-card">
            
            <div className="space-y-4">
                <div className="flex justify-center gap-4 mb-6">
                     <button
                        type="button"
                        onClick={() => { setMode('url'); setError(''); }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                            mode === 'url' 
                            ? 'bg-cyber-primary text-white border-cyber-primary shadow-lg shadow-indigo-900/50' 
                            : 'bg-cyber-cardHighlight text-cyber-text-secondary border-cyber-border hover:border-cyber-primary/50 hover:text-cyber-primary'
                        }`}
                    >
                        <Globe size={16} /> Website URL
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode('code'); setError(''); }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                            mode === 'code' 
                            ? 'bg-cyber-primary text-white border-cyber-primary shadow-lg shadow-indigo-900/50' 
                            : 'bg-cyber-cardHighlight text-cyber-text-secondary border-cyber-border hover:border-cyber-primary/50 hover:text-cyber-primary'
                        }`}
                    >
                        <Code size={16} /> Source Code
                    </button>
                </div>

                <div className="relative group">
                    <div className="absolute top-1/2 -translate-y-1/2 left-5 text-cyber-text-muted group-focus-within:text-cyber-primary transition-colors">
                        {mode === 'url' ? <Search size={22} /> : <Code size={22} />}
                    </div>
                    {mode === 'url' ? (
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. https://staging.example.com"
                        className="w-full bg-cyber-bg border border-cyber-border hover:border-cyber-primary/50 focus:border-cyber-primary focus:bg-cyber-bg focus:ring-4 focus:ring-cyber-primary/10 rounded-xl pl-14 pr-4 py-5 text-lg text-cyber-text-main placeholder-cyber-text-muted outline-none transition-all font-mono shadow-inner"
                        disabled={isScanning}
                        maxLength={2048}
                      />
                    ) : (
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste code snippet..."
                        className="w-full bg-cyber-bg border border-cyber-border hover:border-cyber-primary/50 focus:border-cyber-primary focus:bg-cyber-bg focus:ring-4 focus:ring-cyber-primary/10 rounded-xl pl-14 pr-4 py-5 text-sm text-cyber-text-main placeholder-cyber-text-muted outline-none transition-all font-mono h-32 resize-none shadow-inner"
                        disabled={isScanning}
                        maxLength={50000}
                      />
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div 
                    className="flex items-center justify-center gap-2 text-xs font-bold text-cyber-primary uppercase tracking-widest cursor-pointer hover:text-cyber-primaryEnd transition-colors"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    <Settings2 size={14} /> {showAdvanced ? 'Hide Config' : 'Configure Scan'}
                </div>

                {showAdvanced && (
                    <div className="bg-cyber-cardHighlight rounded-xl p-6 border border-cyber-border animate-fade-in space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-3">
                              <label className="text-xs font-bold text-cyber-text-secondary uppercase flex items-center gap-2">
                                <Cpu size={14} /> Intelligence Model
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                  <button
                                      type="button"
                                      onClick={() => setModel('lite')}
                                      className={`p-2 rounded-lg border text-left transition-all ${
                                          model === 'lite'
                                          ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                                          : 'bg-cyber-bg border-cyber-border text-cyber-text-muted hover:border-blue-500/30'
                                      }`}
                                  >
                                      <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                                         <Flashlight size={10} /> 2.5 Lite
                                      </div>
                                      <div className="text-[9px] opacity-80">Lowest Latency</div>
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => setModel('flash')}
                                      className={`p-2 rounded-lg border text-left transition-all ${
                                          model === 'flash'
                                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                          : 'bg-cyber-bg border-cyber-border text-cyber-text-muted hover:border-emerald-500/30'
                                      }`}
                                  >
                                      <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                                         <Zap size={10} /> 2.5 Flash
                                      </div>
                                      <div className="text-[9px] opacity-80">Balanced Speed</div>
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => {
                                          if (plan.allowedModels.includes('pro')) setModel('pro');
                                          else setShowPricing(true);
                                      }}
                                      className={`p-2 rounded-lg border text-left transition-all relative overflow-hidden ${
                                          model === 'pro'
                                          ? 'bg-cyber-primary/10 border-cyber-primary text-cyber-primary'
                                          : 'bg-cyber-bg border-cyber-border text-cyber-text-muted hover:border-cyber-primary/30'
                                      }`}
                                  >
                                      {!plan.allowedModels.includes('pro') && (
                                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                              <Lock size={16} className="text-cyber-text-muted" />
                                          </div>
                                      )}
                                      <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                                         <BrainCircuit size={10} /> 3 Pro
                                      </div>
                                      <div className="text-[9px] opacity-80">Deep Reasoning</div>
                                  </button>
                              </div>
                           </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-cyber-text-secondary uppercase">Intensity Mode</label>
                                <div className="flex gap-2">
                                    {['stealth', 'deep', 'aggressive'].map((opt) => {
                                        const isDisabled = !plan.allowedModes.includes(opt as any);
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => {
                                                    if (isDisabled) setShowPricing(true);
                                                    else setAggressiveness(opt as any);
                                                }}
                                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase border transition-all h-full relative overflow-hidden ${
                                                    aggressiveness === opt 
                                                    ? 'bg-cyber-primary text-white border-cyber-primary shadow-sm' 
                                                    : 'bg-cyber-card text-cyber-text-muted border-cyber-border hover:border-cyber-primary/50'
                                                }`}
                                            >
                                                {isDisabled && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                                        <Lock size={12} className="text-white/50" />
                                                    </div>
                                                )}
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-cyber-text-secondary uppercase flex justify-between">
                                <span>Simulated Engines</span>
                                <span className={`${Object.values(activeTools).filter(Boolean).length >= plan.maxTools ? 'text-amber-400' : 'text-cyber-primary'}`}>
                                    {Object.values(activeTools).filter(Boolean).length} / {plan.maxTools} Allowed
                                </span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {TOOLS.map((tool) => (
                                    <button
                                        key={tool.id}
                                        type="button"
                                        onClick={() => handleToolToggle(tool.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                            activeTools[tool.id]
                                            ? 'bg-cyber-primary/20 text-cyber-primary border-cyber-primary'
                                            : 'bg-cyber-card text-cyber-text-muted border-cyber-border'
                                        }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${activeTools[tool.id] ? 'bg-cyber-primary' : 'bg-slate-600'}`}></div>
                                        {tool.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={isScanning}
                className={`w-full py-5 rounded-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 relative overflow-hidden group ${
                    isScanning 
                    ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-cyber-primary to-cyber-primaryEnd hover:opacity-90'
                }`}
            >
                {isScanning ? (
                    <>
                        <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                        <span className="font-mono text-sm tracking-widest text-white/80">ANALYZING TARGET...</span>
                    </>
                ) : (
                    <>
                        <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                        <Play size={20} fill="currentColor" />
                        <span className="tracking-widest text-sm font-display uppercase relative z-10">Start Security Audit</span>
                    </>
                )}
            </button>

             {error && (
                <div className="text-center text-rose-400 text-sm font-medium animate-pulse flex items-center justify-center gap-2">
                    <Shield size={14} /> {error}
                </div>
            )}
        </form>
      </div>
    </div>
    </>
  );
};
