import React from 'react';
import { AlertTriangle, Globe, ShieldAlert, Database } from 'lucide-react';

const THREATS = [
  {
    id: 'CVE-2024-3094',
    title: 'XZ Utils Backdoor (Supply Chain)',
    severity: 'CRITICAL',
    score: 10.0,
    date: '2024-03-29',
    category: 'Supply Chain',
    description: 'Malicious code was discovered in the upstream tarballs of xz (5.6.0+). The build process extracts a prebuilt object file from a disguised test file, allowing unauthorized SSH access.',
    tags: ['Linux', 'SSH', 'RCE']
  },
  {
    id: 'CVE-2024-21413',
    title: 'Microsoft Outlook RCE (Moniker Link)',
    severity: 'HIGH',
    score: 9.8,
    date: '2024-02-14',
    category: 'Application',
    description: 'An attacker who successfully exploited this vulnerability could bypass the Office Protected View and open "editing mode", leading to RCE via the preview pane.',
    tags: ['Windows', 'Office', 'Moniker Link']
  },
  {
    id: 'CVE-2023-4863',
    title: 'WebP Heap Buffer Overflow',
    severity: 'CRITICAL',
    score: 8.8,
    date: '2023-09-12',
    category: 'Browser',
    description: 'Heap buffer overflow in libwebp in Google Chrome allowed a remote attacker to perform an out of bounds memory write via a crafted HTML page.',
    tags: ['Chrome', 'WebP', 'Overflow']
  }
];

export const Intelligence: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up space-y-8 pb-20">
      
      {/* Header */}
      <div className="cyber-card p-8 flex flex-col md:flex-row justify-between items-end gap-6 bg-cyber-card">
        <div>
           <h2 className="text-3xl font-display font-bold text-cyber-text-main mb-2 flex items-center gap-3">
             <Globe className="text-cyber-primary" />
             Global Intelligence
           </h2>
           <p className="text-cyber-text-secondary max-w-2xl">
             Live feed of Critical Vulnerabilities and Exposures (CVEs) currently active in the wild.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-xs font-bold text-cyber-text-muted uppercase tracking-widest flex items-center gap-2">
               <ShieldAlert size={14} className="text-cyber-primary"/> Priority Advisories
            </h3>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-bold border border-emerald-500/30 px-2 py-1 rounded-full bg-emerald-500/10">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               VERIFIED SOURCE
            </span>
          </div>

          {THREATS.map((threat) => (
            <div key={threat.id} className="cyber-card p-6 group cursor-default hover:bg-cyber-cardHighlight transition-all border-cyber-border">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                           {threat.severity}
                        </span>
                        <span className="text-xs font-mono text-cyber-primary font-medium">{threat.id}</span>
                        <span className="text-xs text-cyber-text-muted">{threat.date}</span>
                    </div>
                    <h4 className="text-lg font-bold text-cyber-text-main group-hover:text-cyber-primary transition-colors font-display">{threat.title}</h4>
                  </div>
                  <div className="text-right">
                     <div className="text-2xl font-bold text-cyber-text-main">{threat.score}</div>
                     <div className="text-[9px] text-cyber-text-muted uppercase tracking-widest">CVSS</div>
                  </div>
               </div>
               <p className="text-cyber-text-secondary text-sm leading-relaxed mb-4">
                 {threat.description}
               </p>
               <div className="flex gap-2">
                  {threat.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-cyber-bg rounded text-[10px] text-cyber-text-secondary font-mono border border-cyber-border">
                      #{tag}
                    </span>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
           <div className="cyber-card p-6">
              <h3 className="text-sm font-bold text-cyber-text-main mb-6 flex items-center gap-2 font-display uppercase tracking-wider">
                 <AlertTriangle size={16} className="text-cyber-primary"/> Threat Level
              </h3>
              <div className="flex items-center justify-center p-8 bg-cyber-cardHighlight rounded-xl border border-cyber-border shadow-inner">
                 <div className="text-center">
                    <div className="text-4xl font-display font-bold text-cyber-text-main">SEVERE</div>
                    <div className="text-xs text-rose-400 mt-2 font-bold uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full inline-block border border-rose-500/20">Global Alert</div>
                 </div>
              </div>
           </div>

           <div className="cyber-card p-6">
              <h3 className="text-sm font-bold text-cyber-text-main mb-6 flex items-center gap-2 font-display uppercase tracking-wider">
                 <Database size={16} className="text-cyber-primary"/> Active Campaigns
              </h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-cyber-text-muted">
                        <span>Ransomware</span>
                        <span>85%</span>
                    </div>
                    <div className="w-full bg-cyber-bg h-1.5 rounded-full overflow-hidden">
                       <div className="bg-cyber-text-main h-full w-[85%]"></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-cyber-text-muted">
                        <span>Supply Chain</span>
                        <span>72%</span>
                    </div>
                    <div className="w-full bg-cyber-bg h-1.5 rounded-full overflow-hidden">
                       <div className="bg-cyber-primary h-full w-[72%]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};