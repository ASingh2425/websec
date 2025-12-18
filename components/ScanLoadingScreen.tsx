import React, { useEffect, useRef } from 'react';
import { Scan, Shield, Radar, Wifi, Cpu, Terminal } from 'lucide-react';

interface ScanLoadingScreenProps {
  logs: string[];
}

export const ScanLoadingScreen: React.FC<ScanLoadingScreenProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050910] flex flex-col items-center justify-center font-mono p-6">
        {/* Background Grid Animation */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none animate-pulse-slow"></div>
        
        <div className="w-full max-w-4xl relative z-10 space-y-8">
            
            {/* Top Status Bar */}
            <div className="flex justify-between items-center border-b border-cyber-primary/30 pb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping absolute inset-0"></div>
                        <div className="w-3 h-3 bg-rose-500 rounded-full relative z-10"></div>
                    </div>
                    <span className="text-rose-500 font-bold tracking-widest uppercase text-sm animate-pulse">Scanning Target in Progress</span>
                </div>
                <div className="flex gap-4 text-xs font-bold text-cyber-primary">
                    <span className="flex items-center gap-1"><Wifi size={14}/> UPLINK ESTABLISHED</span>
                    <span className="flex items-center gap-1"><Cpu size={14}/> HEURISTICS ACTIVE</span>
                </div>
            </div>

            {/* Main Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[400px]">
                
                {/* Center: Radar / Animation */}
                <div className="md:col-span-1 border border-cyber-primary/30 bg-cyber-primary/5 rounded-xl relative overflow-hidden flex items-center justify-center">
                     {/* Radar Rings */}
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[300px] h-[300px] border border-cyber-primary/20 rounded-full absolute animate-[ping_3s_linear_infinite]"></div>
                        <div className="w-[200px] h-[200px] border border-cyber-primary/30 rounded-full absolute animate-[ping_3s_linear_infinite_1s]"></div>
                        <div className="w-[100px] h-[100px] border border-cyber-primary/40 rounded-full absolute animate-[ping_3s_linear_infinite_2s]"></div>
                     </div>
                     <Shield size={64} className="text-cyber-primary relative z-10 animate-pulse" />
                     
                     <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="text-xs text-cyber-primary font-bold bg-cyber-bg/80 px-2 py-1 rounded">SCANNING MODULES...</span>
                     </div>
                </div>

                {/* Right: Terminal Output */}
                <div className="md:col-span-2 border border-cyber-border bg-[#0B0F19] rounded-xl overflow-hidden flex flex-col shadow-2xl">
                    <div className="bg-cyber-cardHighlight px-4 py-2 border-b border-cyber-border flex items-center gap-2">
                        <Terminal size={14} className="text-emerald-400" />
                        <span className="text-xs text-cyber-text-secondary uppercase tracking-wider">System Log /var/log/websec</span>
                    </div>
                    <div 
                        ref={scrollRef}
                        className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5 custom-scrollbar"
                    >
                        {logs.length === 0 && <span className="text-cyber-text-muted animate-pulse">Initializing socket connection...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="text-cyber-text-muted opacity-50">{log.split(']')[0]}]</span>
                                <span className={log.includes('CRITICAL') ? 'text-rose-400 font-bold' : log.includes('SUCCESS') ? 'text-emerald-400' : 'text-cyber-primary'}>
                                    {log.split(']')[1]}
                                </span>
                            </div>
                        ))}
                        <div className="w-2 h-4 bg-emerald-500 animate-pulse mt-1"></div>
                    </div>
                </div>
            </div>

            {/* Bottom: Progress Mock */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-cyber-text-secondary uppercase tracking-widest">
                    <span>Analysis Completion</span>
                    <span>Processing...</span>
                </div>
                <div className="h-1.5 w-full bg-cyber-cardHighlight rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyber-primary to-cyber-accent animate-[loading_2s_ease-in-out_infinite] w-full origin-left transform -translate-x-full"></div>
                </div>
                <style>{`
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        50% { transform: translateX(0%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>

        </div>
    </div>
  );
};