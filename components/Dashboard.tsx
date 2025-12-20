
import React, { useState } from 'react';
import { ScanResult } from '../types';
import { Lock as LockIcon, Database, Globe, Layers, Clock, ArrowUpRight, Download, Server, AlertTriangle, HelpCircle, Briefcase, ShieldCheck, Map, Network, Microscope, Shield, Zap } from 'lucide-react';
import { VulnerabilityList } from './VulnerabilityList';
import { ProbableVulnerabilityList } from './ProbableVulnerabilityList';
import ReactMarkdown from 'react-markdown';
import { TechStack } from './TechStack';
import { securityService } from '../services/securityService';

interface DashboardProps {
  data: ScanResult;
  history?: ScanResult[];
  onOpenPricing: () => void;
}

const MetricCard = ({ title, score, icon: Icon, color, tip }: any) => (
    <div className="cyber-card p-6 flex flex-col justify-between h-full group bg-cyber-card hover:bg-cyber-cardHighlight transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h4 className="text-cyber-text-muted text-[10px] font-bold uppercase tracking-widest font-display flex items-center gap-1.5 mb-1">
                  {title}
                  <div className="group/tooltip relative cursor-help">
                    <HelpCircle size={12} className="text-slate-500 hover:text-cyber-primary transition-colors" />
                    <div className="absolute left-0 bottom-full mb-2 w-48 p-3 bg-cyber-card border border-cyber-border text-cyber-text-main text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50 font-sans leading-relaxed">
                      {tip}
                    </div>
                  </div>
                </h4>
            </div>
            <div 
              className="p-2 rounded-xl transition-transform group-hover:scale-110 duration-300"
              style={{ backgroundColor: `${color}15`, color: color }}
            >
                <Icon size={20} />
            </div>
        </div>
        
        <div className="flex items-end gap-3">
             <div className="text-4xl font-display font-bold text-cyber-text-main">{score}</div>
             <div className="flex-1 pb-2">
                 <div className="w-full bg-cyber-bg h-2 rounded-full overflow-hidden">
                     <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                        style={{ width: `${score}%`, backgroundColor: color }}
                     >
                       <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                     </div>
                 </div>
             </div>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ data, onOpenPricing }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'heuristic' | 'assets' | 'ports'>('overview');
  const plan = securityService.getCurrentPlan();

  const totalVulns = data.vulnerabilities.length;
  const probableVulns = data.probableVulnerabilities?.length || 0;
  const openPorts = data.ports || [];
  const sitemap = data.sitemap || [];
  const apis = data.apiEndpoints || [];
  
  const getMaturityColor = (level: string) => {
      switch(level) {
          case 'Hardened': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
          case 'Enterprise': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
          case 'Vulnerable': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
          default: return 'text-cyber-text-secondary bg-cyber-cardHighlight border-cyber-border';
      }
  };

  const handleDownload = () => {
     if (!plan.allowDownload) {
         onOpenPricing();
         return;
     }
     // Mock download functionality
     alert("Downloading Report PDF...");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in-up">
      
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-cyber-border pb-1 mb-8 overflow-x-auto">
        {['overview', 'vulnerabilities', 'heuristic', 'assets', 'ports'].map((tab) => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-sm font-bold transition-all relative font-display tracking-wide capitalize whitespace-nowrap ${
                    activeTab === tab 
                    ? 'text-cyber-primary' 
                    : 'text-cyber-text-secondary hover:text-cyber-text-main'
                }`}
            >
                {tab === 'assets' ? 'Discovered Assets' : tab === 'heuristic' ? 'Heuristic Analysis (Deep)' : tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyber-primary to-cyber-primaryEnd shadow-[0_0_10px_rgba(129,140,248,0.4)]"></div>}
            </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Score Card */}
              <div className="cyber-card p-8 flex flex-col justify-center items-center relative overflow-hidden bg-cyber-card">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyber-primary/10 rounded-full blur-3xl animate-blob"></div>
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyber-accent/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                 
                 <div className="relative z-10 text-center">
                    <h4 className="text-cyber-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-90">Overall Health</h4>
                    <div className="text-8xl font-display font-extrabold mb-2 tracking-tighter text-cyber-text-main drop-shadow-sm">{data.riskScore}</div>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold backdrop-blur-md shadow-sm ${
                        data.riskScore > 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                        data.riskScore > 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                        'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                        {data.riskScore > 80 ? 'Excellent Standing' : data.riskScore > 50 ? 'Moderate Risk' : 'Critical Risk'}
                    </div>
                 </div>
              </div>

              {/* Target Details */}
              <div className="cyber-card p-8 lg:col-span-2 flex flex-col justify-between bg-gradient-to-r from-cyber-card to-cyber-cardHighlight/50">
                 <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-2xl font-display font-bold text-cyber-text-main truncate max-w-md">{data.target}</h1>
                             {data.maturityLevel && (
                                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border flex items-center gap-1 ${getMaturityColor(data.maturityLevel)}`}>
                                    <Shield size={10} fill="currentColor" /> {data.maturityLevel}
                                 </span>
                             )}
                        </div>
                        <div className="flex gap-4 text-sm text-cyber-text-secondary font-medium">
                            <span className="flex items-center gap-1.5"><Globe size={14} className="text-cyber-primary"/> {data.scanType === 'url' ? 'External Scan' : 'Source Code'}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-cyber-primary"/> Just now</span>
                            <span className="flex items-center gap-1.5"><Zap size={14} className="text-cyber-primary"/> {data.modelUsed || 'Gemini Engine'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleDownload}
                        className={`p-2.5 rounded-xl transition-all border shadow-md flex items-center gap-2 ${
                            plan.allowDownload 
                            ? 'bg-cyber-card text-cyber-primary hover:text-cyber-primaryEnd border-cyber-border'
                            : 'bg-cyber-card text-cyber-text-muted border-cyber-border cursor-not-allowed opacity-50'
                        }`}
                    >
                        {plan.allowDownload ? <Download size={20} /> : <LockIcon size={20} />}
                        {!plan.allowDownload && <span className="text-xs font-bold uppercase">Pro</span>}
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-8 mt-8 pt-8 border-t border-cyber-border/60">
                     <div className="group">
                        <div className="text-3xl font-bold text-cyber-text-main group-hover:text-cyber-primary transition-colors">{totalVulns}</div>
                        <div className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-wider mt-1">Confirmed</div>
                     </div>
                     <div className="group">
                        <div className="text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">{probableVulns}</div>
                        <div className="text-[10px] font-bold text-amber-500/80 uppercase tracking-wider mt-1">Heuristic</div>
                     </div>
                     <div className="group">
                        <div className="text-3xl font-bold text-cyber-text-main group-hover:text-cyber-primary transition-colors">{openPorts.length}</div>
                        <div className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-wider mt-1">Open Ports</div>
                     </div>
                     <div className="group">
                        <div className="text-3xl font-bold text-cyber-text-main group-hover:text-cyber-primary transition-colors">{data.techStack.length}</div>
                        <div className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-wider mt-1">Tech Stack</div>
                     </div>
                 </div>
              </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Authentication" score={data.securityMetrics.authScore} icon={LockIcon} color="#A78BFA" tip="How strong your login & session management is." />
              <MetricCard title="Database" score={data.securityMetrics.dbScore} icon={Database} color="#FBBF24" tip="Resistance to SQL Injection and data leaks." />
              <MetricCard title="Network" score={data.securityMetrics.networkScore} icon={Globe} color="#818CF8" tip="SSL/TLS configuration and port exposure." />
              <MetricCard title="Client Side" score={data.securityMetrics.clientScore} icon={Layers} color="#2DD4BF" tip="Protection against XSS and malicious scripts." />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Tech Stack */}
             <div className="lg:col-span-1">
                 <TechStack stack={data.techStack} headers={data.headers} />
             </div>

             {/* Executive Summary */}
             <div className="lg:col-span-2 cyber-card p-8 border-l-4 border-l-cyber-primary bg-cyber-card">
                 <div className="flex justify-between items-center mb-6 border-b border-cyber-border pb-4">
                     <h3 className="font-display font-bold text-cyber-text-main text-lg flex items-center gap-3">
                        <Briefcase size={20} className="text-cyber-primary" />
                        Executive Summary
                     </h3>
                 </div>
                 <div className="prose prose-sm prose-invert max-w-none text-cyber-text-secondary leading-relaxed font-sans bg-cyber-cardHighlight/50 p-6 rounded-xl border border-cyber-border">
                    <ReactMarkdown>{data.executiveSummary}</ReactMarkdown>
                 </div>
                 <div className="mt-6 flex justify-end gap-3">
                    {probableVulns > 0 && (
                        <button 
                            onClick={() => plan.showProbableVulns ? setActiveTab('heuristic') : onOpenPricing()}
                            className={`flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest group bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg ${!plan.showProbableVulns && 'opacity-70 grayscale'}`}
                        >
                           {plan.showProbableVulns ? <Microscope size={14} /> : <LockIcon size={14} />} 
                           {plan.showProbableVulns ? 'Review Deep Heuristics' : 'Unlock Heuristics'}
                        </button>
                    )}
                    <button 
                        onClick={() => setActiveTab('vulnerabilities')}
                        className="flex items-center gap-2 text-xs font-bold text-cyber-primary hover:text-cyber-text-main transition-colors uppercase tracking-widest group bg-cyber-primary/10 border border-cyber-primary/20 px-4 py-2 rounded-lg"
                    >
                       View Remediation Plan <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                 </div>
             </div>
          </div>
        </div>
      )}
      
      {activeTab === 'vulnerabilities' && (
        <div className="animate-fade-in">
           <VulnerabilityList vulnerabilities={data.vulnerabilities} />
        </div>
      )}

      {activeTab === 'heuristic' && (
        <div className="animate-fade-in">
            {plan.showProbableVulns ? (
                <ProbableVulnerabilityList vulnerabilities={data.probableVulnerabilities || []} />
            ) : (
                <div className="cyber-card p-12 text-center flex flex-col items-center bg-cyber-card border-dashed border-cyber-border">
                    <div className="w-16 h-16 bg-cyber-cardHighlight rounded-full flex items-center justify-center mb-6 text-cyber-text-muted">
                        <LockIcon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-cyber-text-main mb-2">Deep Heuristics Locked</h3>
                    <p className="text-cyber-text-secondary max-w-md mb-6">
                        Unlock Probable Vulnerability analysis (Blind SQLi, IDOR, Logic Flaws) by upgrading your plan.
                    </p>
                    <button onClick={onOpenPricing} className="px-6 py-3 bg-cyber-primary text-white rounded-lg font-bold shadow-glow hover:bg-cyber-primaryEnd transition-all">
                        Upgrade Now
                    </button>
                </div>
            )}
        </div>
      )}

      {activeTab === 'assets' && (
         <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Sitemap */}
             <div className="cyber-card p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                    <Map className="text-cyber-primary" size={20} />
                    <div>
                        <h3 className="font-display font-bold text-cyber-text-main text-lg">Crawl Map</h3>
                        <p className="text-sm text-cyber-text-muted">Discovered URLs & Directories</p>
                    </div>
                </div>
                {sitemap.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-cyber-text-muted bg-cyber-cardHighlight rounded-xl border border-dashed border-cyber-border">
                        <Globe size={24} className="mb-2 opacity-50"/>
                        <p className="text-sm">No assets crawled.</p>
                    </div>
                ) : (
                    <div className="flex-1 bg-slate-950 rounded-xl p-4 overflow-y-auto max-h-[500px] custom-scrollbar border border-slate-800 font-mono text-xs">
                        <ul className="space-y-2">
                            {sitemap.map((url, i) => (
                                <li key={i} className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-start gap-2">
                                    <span className="text-slate-600">├─</span>
                                    <span className="break-all">{url}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
             </div>

             {/* API Endpoints */}
             <div className="cyber-card p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                    <Network className="text-cyber-primary" size={20} />
                    <div>
                        <h3 className="font-display font-bold text-cyber-text-main text-lg">API Surface</h3>
                        <p className="text-sm text-cyber-text-muted">Detected REST/GraphQL/WebSocket Points</p>
                    </div>
                </div>
                {apis.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-cyber-text-muted bg-cyber-cardHighlight rounded-xl border border-dashed border-cyber-border">
                        <Network size={24} className="mb-2 opacity-50"/>
                        <p className="text-sm">No API endpoints detected.</p>
                    </div>
                ) : (
                    <div className="flex-1 bg-slate-950 rounded-xl p-4 overflow-y-auto max-h-[500px] custom-scrollbar border border-slate-800 font-mono text-xs">
                         <ul className="space-y-2">
                            {apis.map((api, i) => (
                                <li key={i} className="text-amber-400 hover:text-amber-300 transition-colors flex items-start gap-2">
                                    <span className="text-slate-600">⚡</span>
                                    <span className="break-all">{api}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
             </div>
         </div>
      )}

      {activeTab === 'ports' && (
        <div className="animate-fade-in space-y-6">
             <div className="cyber-card p-8">
                <div className="flex items-center gap-3 mb-8">
                    <Server className="text-cyber-primary" size={24} />
                    <div>
                        <h3 className="font-display font-bold text-cyber-text-main text-lg">Network Surface</h3>
                        <p className="text-sm text-cyber-text-muted">External facing ports and services.</p>
                    </div>
                </div>
                
                {openPorts.length === 0 ? (
                    <div className="text-center py-16 bg-cyber-cardHighlight rounded-xl border border-dashed border-cyber-border">
                        <ShieldCheck size={48} className="mx-auto mb-4 text-emerald-500" />
                        <p className="text-cyber-text-muted font-medium">No open ports detected.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {openPorts.map((port, idx) => (
                            <div key={idx} className={`p-5 rounded-xl border transition-all hover:shadow-glow bg-cyber-card ${
                                port.risk === 'Critical' || port.risk === 'High' 
                                    ? 'border-rose-500/30 bg-rose-500/5' 
                                    : 'border-cyber-border'
                            }`}>
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-mono text-xs font-bold text-cyber-text-muted bg-cyber-cardHighlight px-2 py-1 rounded">{port.port}/{port.protocol}</span>
                                    {port.risk !== 'Safe' && port.risk !== 'Low' && (
                                        <AlertTriangle size={16} className={
                                            port.risk === 'Critical' || port.risk === 'High' ? 'text-rose-500' : 'text-amber-500'
                                        } />
                                    )}
                                </div>
                                <div className="font-bold text-cyber-text-main text-base mb-1">{port.service}</div>
                                <div className="text-xs text-cyber-text-muted truncate font-mono" title={port.version}>{port.version || 'Version Unknown'}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
