import React from 'react';
import { TechStackItem, SecurityHeader } from '../types';
import { Database, Layout, Server, Code, Lock, ShieldCheck, AlertTriangle, Cpu, HelpCircle, AlertOctagon } from 'lucide-react';

interface Props {
  stack: TechStackItem[];
  headers: SecurityHeader[];
}

export const TechStack: React.FC<Props> = ({ stack, headers }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return <Layout size={14} />;
      case 'Backend': return <Code size={14} />;
      case 'Database': return <Database size={14} />;
      case 'Server': return <Server size={14} />;
      default: return <Cpu size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tech Stack */}
      <div className="cyber-card p-6">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-cyber-text-main font-bold flex items-center gap-2 font-display text-sm uppercase tracking-wider">
              <Cpu className="text-cyber-primary" size={16} />
              Technology
            </h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {stack.map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 text-xs font-medium text-cyber-text-main shadow-sm hover:border-cyber-primary/40 transition-colors">
               <span className="text-cyber-primary">{getIcon(item.category)}</span>
               <span>{item.name}</span>
               {item.version && <span className="text-cyber-text-muted border-l border-cyber-primary/20 pl-2 ml-1 text-[10px] font-mono">{item.version}</span>}
            </div>
          ))}
          {stack.length === 0 && <span className="text-cyber-text-muted text-sm italic">No specific technologies identified.</span>}
        </div>
      </div>

      {/* Headers */}
      <div className="cyber-card p-6">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-cyber-text-main font-bold flex items-center gap-2 font-display text-sm uppercase tracking-wider">
              <Lock className="text-cyber-primary" size={16} />
              Headers
            </h3>
        </div>

        <div className="space-y-1">
          {headers.map((header, i) => (
             <div key={i} className="flex items-center justify-between text-xs p-3 hover:bg-cyber-cardHighlight rounded-lg transition-colors border border-transparent hover:border-cyber-border">
                <span className="text-cyber-text-secondary font-mono truncate mr-2" title={header.name}>{header.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                   {header.status === 'secure' && <ShieldCheck size={14} className="text-emerald-400" />}
                   {header.status === 'warning' && <AlertTriangle size={14} className="text-amber-400" />}
                   {header.status === 'missing' && <AlertOctagon size={14} className="text-rose-400" />}
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};