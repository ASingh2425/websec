import React from 'react';
import { ScanResult } from '../types';
import { Clock, Globe, Code, ArrowRight, Trash2, Calendar } from 'lucide-react';

interface HistoryProps {
  history: ScanResult[];
  onLoad: (result: ScanResult) => void;
  onDelete: (timestamp: string) => void;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onLoad, onDelete, onClear }) => {
  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-rose-400';
  };

  const getRiskBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up space-y-8 pb-20">
      {/* Header */}
      <div className="cyber-card p-8 flex flex-col md:flex-row justify-between items-end gap-6 bg-cyber-card">
        <div>
          <h2 className="text-3xl font-display font-bold text-cyber-text-main mb-2 flex items-center gap-3">
            <Clock className="text-cyber-primary" />
            Audit History
          </h2>
          <p className="text-cyber-text-secondary max-w-2xl">
            Archive of your previous security assessments.
          </p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="px-4 py-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} /> Clear Archive
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="cyber-card p-20 text-center flex flex-col items-center justify-center border-dashed border-cyber-border">
            <div className="w-16 h-16 bg-cyber-cardHighlight rounded-full flex items-center justify-center mb-6 border border-cyber-border">
                <Clock className="text-cyber-text-muted" size={32} />
            </div>
            <h3 className="text-xl font-bold text-cyber-text-main mb-2 font-display">No History Found</h3>
            <p className="text-cyber-text-muted max-w-md">
                Run a scan to build your security audit history. Reports will appear here automatically.
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((item, index) => (
            <div 
                key={index} 
                className="cyber-card p-6 flex flex-col justify-between hover:border-cyber-primary/30 bg-cyber-card"
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyber-primary/10 rounded-xl border border-cyber-primary/20 text-cyber-primary">
                            {item.scanType === 'url' ? <Globe size={20} /> : <Code size={20} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-cyber-text-main text-lg truncate max-w-[180px] font-display">
                                {item.target}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-cyber-text-muted font-mono mt-1">
                                <Calendar size={12} />
                                {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-3xl font-display font-bold ${getRiskColor(item.riskScore)}`}>
                            {item.riskScore}
                        </span>
                        <div className="text-[9px] text-cyber-text-muted uppercase tracking-widest font-bold">Health</div>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="w-full bg-cyber-bg h-1.5 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${getRiskBg(item.riskScore)}`} 
                            style={{ width: `${item.riskScore}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex gap-6 pt-2 border-t border-cyber-border">
                         <div className="flex flex-col">
                            <span className="text-lg font-bold text-cyber-text-main">{item.vulnerabilities?.length || 0}</span>
                            <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider font-bold">Issues</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-lg font-bold text-cyber-text-main">{item.techStack?.length || 0}</span>
                            <span className="text-[10px] text-cyber-text-muted uppercase tracking-wider font-bold">Tech</span>
                         </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => onDelete(item.timestamp || '')}
                        className="text-cyber-text-muted hover:text-rose-400 transition-colors p-2 -ml-2"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button 
                        onClick={() => onLoad(item)}
                        className="flex items-center gap-2 text-xs font-bold text-cyber-primary hover:text-cyber-text-main uppercase tracking-widest transition-colors group"
                    >
                        View Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};