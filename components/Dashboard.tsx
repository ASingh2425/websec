
import React, { useState, useRef } from 'react';
import { ScanResult } from '../types';
import { 
  Lock as LockIcon, 
  Database, 
  Globe, 
  Layers, 
  Clock, 
  ArrowUpRight, 
  Download, 
  Server, 
  AlertTriangle, 
  HelpCircle, 
  Briefcase, 
  ShieldCheck, 
  Map, 
  Network, 
  Microscope, 
  Shield, 
  Zap, 
  Activity,
  ExternalLink,
  BookOpen,
  CheckCircle,
  Terminal,
  FileText,
  // Added missing icons for PDF report generation
  Info,
  ShieldAlert
} from 'lucide-react';
import { VulnerabilityList } from './VulnerabilityList';
import { ProbableVulnerabilityList } from './ProbableVulnerabilityList';
import ReactMarkdown from 'react-markdown';
import { TechStack } from './TechStack';

interface DashboardProps {
  data: ScanResult;
  history?: ScanResult[];
}

const MetricCard = ({ title, score, icon: Icon, color, tip }: any) => {
    const [isPinned, setIsPinned] = useState(false);

    return (
        <div 
            className="cyber-card p-6 flex flex-col justify-between h-full group bg-cyber-card hover:bg-cyber-cardHighlight transition-all duration-300 relative"
            style={{ overflow: 'visible' }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="relative">
                    <h4 className="text-cyber-text-muted text-[10px] font-bold uppercase tracking-widest font-display flex items-center gap-1.5 mb-1">
                      {title}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsPinned(!isPinned); }}
                        className="cursor-help focus:outline-none"
                        aria-label="View scoring details"
                      >
                        <HelpCircle size={12} className={`${isPinned ? 'text-cyber-primary' : 'text-slate-500'} hover:text-cyber-primary transition-colors`} />
                      </button>
                    </h4>
                    
                    <div className={`
                        absolute left-0 bottom-full mb-3 w-72 p-4 
                        bg-cyber-cardHighlight border border-cyber-primary/40 
                        text-cyber-text-main text-xs rounded-xl 
                        shadow-[0_20px_50px_rgba(0,0,0,0.8)] 
                        transition-all transform pointer-events-none z-[100] font-sans leading-relaxed backdrop-blur-md
                        ${isPinned || 'group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-2'}
                        ${isPinned ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}
                    `}>
                        <div className="font-bold text-cyber-primary mb-2 uppercase tracking-tighter flex items-center gap-1.5">
                            <Activity size={12} /> Scoring Methodology
                        </div>
                        <div className="text-cyber-text-secondary border-l-2 border-cyber-primary/20 pl-3">
                            {tip}
                        </div>
                        <div className="absolute left-4 top-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-cyber-primary/40"></div>
                    </div>
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
};

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'heuristic' | 'assets' | 'ports'>('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = async () => {
    if (isDownloading || !reportRef.current) return;
    
    setIsDownloading(true);
    const element = reportRef.current;
    
    const opt = {
      margin: 10,
      filename: `Security_Audit_Report_${data.target.replace(/[^a-z0-9]/gi, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#0B0F19',
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
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
                {tab === 'assets' ? 'Discovered Assets' : tab === 'heuristic' ? 'Heuristic Analysis' : tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyber-primary to-cyber-primaryEnd shadow-[0_0_10px_rgba(129,140_248,0.4)]"></div>}
            </button>
        ))}
      </div>

      {/* Main Viewport */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="cyber-card p-8 flex flex-col justify-center items-center relative overflow-hidden bg-cyber-card">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyber-primary/10 rounded-full blur-3xl animate-pulse"></div>
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
                    {/* DOWNLOAD BUTTON: ONLY ON OVERVIEW */}
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        title="Download Complete Audit PDF"
                        className={`p-2.5 rounded-xl transition-all border shadow-md flex items-center gap-2 ${isDownloading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyber-card text-cyber-primary hover:text-cyber-primaryEnd border-cyber-border active:scale-95'}`}
                    >
                        {isDownloading ? (
                          <div className="w-5 h-5 border-2 border-t-transparent border-cyber-primary rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Export Full Report</span>
                            <Download size={20} />
                          </>
                        )}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Authentication" 
                score={data.securityMetrics.authScore} 
                icon={LockIcon} 
                color="#A78BFA" 
                tip="Analyzes session management entropy, credential storage hashing algorithms, cookie security attributes (HttpOnly, Secure, SameSite), and Multi-Factor Authentication (MFA) implementation robustness." 
              />
              <MetricCard 
                title="Database" 
                score={data.securityMetrics.dbScore} 
                icon={Database} 
                color="#FBBF24" 
                tip="Derived from resistance to SQL/NoSQL injection vectors, enforcement of parameterized queries, database error handling to prevent metadata leakage, and proper encryption of PII data at rest." 
              />
              <MetricCard 
                title="Network" 
                score={data.securityMetrics.networkScore} 
                icon={Globe} 
                color="#818CF8" 
                tip="Calculated based on SSL/TLS certificate validity and cipher suite strength, HSTS implementation, service surface area reduction, and exposure of internal infrastructure via unnecessary open ports." 
              />
              <MetricCard 
                title="Client Side" 
                score={data.securityMetrics.clientScore} 
                icon={Layers} 
                color="#2DD4BF" 
                tip="Evaluates Cross-Site Scripting (XSS) prevention, Content Security Policy (CSP) depth, DOM-based vulnerability mitigation, and protection against CSRF and UI redressing (Clickjacking) attacks." 
              />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-1 space-y-6">
                 <TechStack stack={data.techStack} headers={data.headers} />
                 
                 {data.groundingLinks && data.groundingLinks.length > 0 && (
                    <div className="cyber-card p-6 bg-cyber-card">
                         <h3 className="text-cyber-text-main font-bold flex items-center gap-2 font-display text-sm uppercase tracking-wider mb-4">
                            <BookOpen className="text-cyber-primary" size={16} />
                            Research Sources
                         </h3>
                         <ul className="space-y-3">
                            {data.groundingLinks.map((link, i) => (
                                <li key={i}>
                                    <a 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-cyber-text-secondary hover:text-cyber-primary flex items-start gap-2 transition-colors group"
                                    >
                                        <ExternalLink size={12} className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span className="underline decoration-cyber-primary/20 underline-offset-2">{link.title}</span>
                                    </a>
                                </li>
                            ))}
                         </ul>
                    </div>
                 )}
             </div>

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
                            onClick={() => setActiveTab('heuristic')}
                            className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest group bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg"
                        >
                           <Microscope size={14} /> Review Heuristics
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
            <ProbableVulnerabilityList vulnerabilities={data.probableVulnerabilities || []} />
        </div>
      )}

      {activeTab === 'assets' && (
         <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            port.risk === 'Critical' || port.risk === 'High' ? 'text-rose-400' : 'text-amber-400'
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

      {/* HIDDEN PRINTABLE FULL REPORT */}
      <div className="hidden">
        <div ref={reportRef} className="p-10 bg-cyber-bg text-cyber-text-main font-sans space-y-12">
            {/* Report Header */}
            <div className="border-b border-cyber-border pb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-display font-extrabold text-white mb-2">Security Audit Report</h1>
                    <p className="text-cyber-primary font-mono text-sm tracking-widest uppercase">Target: {data.target}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-cyber-text-muted uppercase tracking-widest mb-1">Audit Score</p>
                    <p className={`text-6xl font-display font-black ${data.riskScore > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>{data.riskScore}</p>
                </div>
            </div>

            {/* Introduction for Beginners */}
            <div className="bg-cyber-cardHighlight/30 p-6 rounded-2xl border border-cyber-border">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
                    <Info size={18} className="text-cyber-primary" /> How to Read This Report
                </h2>
                <p className="text-sm text-cyber-text-secondary leading-relaxed">
                    This document provides a comprehensive security assessment of your digital asset. 
                    We've categorized findings into <strong>Confirmed Vulnerabilities</strong> (immediate risks that need fixing) 
                    and <strong>Heuristic Findings</strong> (areas where the structure looks suspicious but requires manual verification). 
                    A higher score indicates better security hygiene.
                </p>
            </div>

            {/* Executive Summary */}
            <section className="space-y-4">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2 border-l-4 border-cyber-primary pl-4">
                    <FileText size={20} className="text-cyber-primary" /> Executive Summary
                </h2>
                <div className="prose prose-invert max-w-none text-sm leading-relaxed text-cyber-text-secondary bg-cyber-cardHighlight p-6 rounded-xl border border-cyber-border">
                    <ReactMarkdown>{data.executiveSummary}</ReactMarkdown>
                </div>
            </section>

            {/* Metrics Breakdown */}
            <section className="space-y-6">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2 border-l-4 border-cyber-primary pl-4">
                    <Activity size={20} className="text-cyber-primary" /> Security Health Index
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "Authentication", val: data.securityMetrics.authScore, desc: "Account security and login protocols." },
                        { label: "Client Side", val: data.securityMetrics.clientScore, desc: "Protection against browser-based attacks." },
                        { label: "Network", val: data.securityMetrics.networkScore, desc: "Server communication and encryption." },
                        { label: "Database", val: data.securityMetrics.dbScore, desc: "Data storage and retrieval security." }
                    ].map(m => (
                        <div key={m.label} className="p-4 border border-cyber-border rounded-xl bg-cyber-card">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-white uppercase">{m.label}</span>
                                <span className="text-lg font-display font-bold text-cyber-primary">{m.val}</span>
                            </div>
                            <div className="h-1 bg-cyber-bg rounded-full overflow-hidden">
                                <div className="h-full bg-cyber-primary" style={{ width: `${m.val}%` }}></div>
                            </div>
                            <p className="text-[10px] text-cyber-text-muted mt-2">{m.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Confirmed Vulnerabilities */}
            <section className="space-y-6">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2 border-l-4 border-rose-500 pl-4">
                    <ShieldAlert size={20} className="text-rose-400" /> Confirmed Vulnerabilities ({data.vulnerabilities.length})
                </h2>
                <div className="space-y-4">
                    {data.vulnerabilities.length === 0 ? (
                        <p className="text-sm text-emerald-400 font-bold bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">No high-confidence vulnerabilities were automatically detected.</p>
                    ) : (
                        data.vulnerabilities.map(v => (
                            <div key={v.id} className="p-6 border border-cyber-border rounded-xl bg-cyber-card space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white text-base">{v.title}</h3>
                                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase border border-rose-500/20 rounded">{v.severity}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-6 text-xs leading-relaxed">
                                    <div>
                                        <h4 className="text-cyber-primary font-bold uppercase text-[9px] mb-1">Impact Analysis</h4>
                                        <p className="text-cyber-text-secondary">{v.impact}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-cyber-primary font-bold uppercase text-[9px] mb-1">Remediation Steps</h4>
                                        <p className="text-cyber-text-secondary">{v.fixExplanation}</p>
                                    </div>
                                </div>
                                {v.fixCode && (
                                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-[10px] text-emerald-300 border border-slate-800">
                                        <pre>{v.fixCode}</pre>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Heuristic Findings */}
            <section className="space-y-6">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2 border-l-4 border-amber-500 pl-4">
                    <Microscope size={20} className="text-amber-400" /> Suspicious Behavior Analysis
                </h2>
                <div className="space-y-4">
                    {data.probableVulnerabilities?.map((v, i) => (
                        <div key={i} className="p-5 border border-cyber-border rounded-xl bg-cyber-cardHighlight/20 flex gap-4">
                            <AlertTriangle size={24} className="text-amber-400 shrink-0" />
                            <div>
                                <h3 className="text-white font-bold text-sm mb-1">{v.title}</h3>
                                <p className="text-xs text-cyber-text-secondary mb-3">{v.reasoning}</p>
                                <div className="flex items-center gap-2 text-[10px] text-cyber-primary font-bold uppercase">
                                    <CheckCircle size={10} /> Verification: {v.verificationSteps}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Technical Surface */}
            <section className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Network Ports</h2>
                    <div className="bg-cyber-card p-4 rounded-xl border border-cyber-border space-y-2">
                        {data.ports.map(p => (
                            <div key={p.port} className="flex justify-between text-[10px] font-mono border-b border-cyber-border pb-1">
                                <span className="text-cyber-text-secondary">{p.port}/{p.protocol}</span>
                                <span className="text-white font-bold">{p.service} ({p.risk})</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Tech Stack</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.techStack.map(t => (
                            <span key={t.name} className="px-2 py-1 bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary text-[9px] font-bold rounded uppercase">{t.name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="pt-10 border-t border-cyber-border text-center">
                <p className="text-[10px] text-cyber-text-muted uppercase tracking-[0.3em]">Confidential • WebSec Ultra AI Generated Report</p>
                <p className="text-[9px] text-cyber-text-muted mt-2">© 2025 WebSec Ultra. Verified through Elite Intelligence Core.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
