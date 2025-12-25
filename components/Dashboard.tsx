import React, { useState, useRef } from 'react';
import { ScanResult } from '../types';
import { 
  Lock as LockIcon, Database, Globe, Layers, Clock, ArrowUpRight, 
  Download, Server, AlertTriangle, HelpCircle, Briefcase, ShieldCheck, 
  Map, Network, Microscope, Shield, Zap, Activity, ExternalLink, Search, BookOpen 
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
        <div className="cyber-card p-6 flex flex-col justify-between h-full group bg-cyber-card hover:bg-cyber-cardHighlight transition-all duration-300 relative overflow-visible">
            <div className="flex justify-between items-start mb-4">
                <div className="relative">
                    <h4 className="text-cyber-text-muted text-[10px] font-bold uppercase tracking-widest font-display flex items-center gap-1.5 mb-1">
                      {title}
                      <button onClick={(e) => { e.stopPropagation(); setIsPinned(!isPinned); }} className="cursor-help focus:outline-none">
                        <HelpCircle size={12} className={`${isPinned ? 'text-cyber-primary' : 'text-slate-500'} hover:text-cyber-primary transition-colors`} />
                      </button>
                    </h4>
                    <div className={`absolute left-0 bottom-full mb-3 w-72 p-4 bg-cyber-cardHighlight border border-cyber-primary/40 text-cyber-text-main text-xs rounded-xl shadow-2xl transition-all transform pointer-events-none z-[100] backdrop-blur-md ${isPinned || 'group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-2'} ${isPinned ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`}>
                        <div className="font-bold text-cyber-primary mb-2 uppercase tracking-tighter flex items-center gap-1.5"><Activity size={12} /> Scoring Methodology</div>
                        <div className="text-cyber-text-secondary border-l-2 border-cyber-primary/20 pl-3">{tip}</div>
                    </div>
                </div>
                <div className="p-2 rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}15`, color: color }}><Icon size={20} /></div>
            </div>
            <div className="flex items-end gap-3">
                 <div className="text-4xl font-display font-bold text-cyber-text-main">{score}</div>
                 <div className="flex-1 pb-2">
                     <div className="w-full bg-cyber-bg h-2 rounded-full overflow-hidden">
                         <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${score}%`, backgroundColor: color }}></div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'heuristic' | 'assets' | 'ports'>('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
     if (!dashboardRef.current || isDownloading) return;
     setIsDownloading(true);
     try {
         const element = dashboardRef.current;
         const opt = {
           margin: 10,
           filename: `WebSec_Audit_${data.target.replace(/[^a-z0-9]/gi, '_')}.pdf`,
           image: { type: 'jpeg', quality: 0.98 },
           html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0B0F19' },
           jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
         };
         // @ts-ignore
         await window.html2pdf().set(opt).from(element).save();
     } catch (err) {
         alert("PDF Generation Failed.");
     } finally {
         setIsDownloading(false);
     }
  };

  const getMaturityColor = (level: string) => {
      switch(level) {
          case 'Hardened': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
          case 'Enterprise': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
          case 'Vulnerable': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
          default: return 'text-cyber-text-secondary bg-cyber-cardHighlight border-cyber-border';
      }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in-up">
      <div className="flex items-center gap-2 border-b border-cyber-border pb-1 mb-8 overflow-x-auto no-print">
        {['overview', 'vulnerabilities', 'heuristic', 'assets', 'ports'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-3 text-sm font-bold transition-all relative font-display tracking-wide capitalize whitespace-nowrap ${activeTab === tab ? 'text-cyber-primary' : 'text-cyber-text-secondary hover:text-cyber-text-main'}`}>
                {tab === 'assets' ? 'Discovered Assets' : tab === 'heuristic' ? 'Heuristic Analysis' : tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyber-primary to-cyber-primaryEnd"></div>}
            </button>
        ))}
      </div>

      <div ref={dashboardRef} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="cyber-card p-8 flex flex-col justify-center items-center relative overflow-hidden bg-cyber-card group/score">
                 <div className="absolute top-4 right-4 z-20 no-print">
                    <div className="relative group">
                        <HelpCircle size={14} className="text-cyber-text-muted hover:text-cyber-primary cursor-help transition-colors" />
                        <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-cyber-card border border-cyber-border rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[10px] text-cyber-text-secondary backdrop-blur-lg">
                           <div className="font-bold text-cyber-primary uppercase mb-1">Scoring Algorithm</div>
                           Score starts at 100. Deductions:<br/>
                           - Critical: <span className="text-rose-400 font-bold">-25</span><br/>
                           - High: <span className="text-orange-400 font-bold">-15</span><br/>
                           - Medium: <span className="text-amber-400 font-bold">-8</span><br/>
                           - Low: <span className="text-emerald-400 font-bold">-3</span>
                        </div>
                    </div>
                 </div>
                 <div className="relative z-10 text-center">
                    <h4 className="text-cyber-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-90">Overall Health</h4>
                    <div className="text-8xl font-display font-extrabold mb-2 tracking-tighter text-cyber-text-main">{data.riskScore}</div>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold backdrop-blur-md ${data.riskScore > 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : data.riskScore > 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {data.riskScore > 80 ? 'Excellent Standing' : data.riskScore > 50 ? 'Moderate Risk' : 'Critical Risk'}
                    </div>
                 </div>
              </div>

              <div className="cyber-card p-8 lg:col-span-2 flex flex-col justify-between bg-gradient-to-r from-cyber-card to-cyber-cardHighlight/50">
                 <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-2xl font-display font-bold text-cyber-text-main truncate max-w-md">{data.target}</h1>
                             {data.maturityLevel && <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border flex items-center gap-1 ${getMaturityColor(data.maturityLevel)}`}><Shield size={10} fill="currentColor" /> {data.maturityLevel}</span>}
                        </div>
                        <div className="flex gap-4 text-sm text-cyber-text-secondary font-medium">
                            <span className="flex items-center gap-1.5"><Globe size={14} className="text-cyber-primary"/> {data.scanType === 'url' ? 'External Scan' : 'Source Code'}</span>
                            <span className="flex items-center gap-1.5"><Zap size={14} className="text-cyber-primary"/> {data.modelUsed || 'Gemini Engine'}</span>
                        </div>
                    </div>
                    <button onClick={handleDownload} disabled={isDownloading} className={`p-2.5 rounded-xl transition-all border shadow-md flex items-center gap-2 no-print ${isDownloading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyber-card text-cyber-primary hover:text-cyber-primaryEnd border-cyber-border'}`}>
                        {isDownloading ? <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div> : <Download size={20} />}
                    </button>
                 </div>
                 <div className="grid grid-cols-4 gap-8 mt-8 pt-8 border-t border-cyber-border/60">
                     <div className="group">
                        <div className="text-3xl font-bold text-cyber-text-main group-hover:text-cyber-primary transition-colors">{data.vulnerabilities.length}</div>
                        <div className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-wider">Confirmed</div>
                     </div>
                     <div className="group">
                        <div className="text-3xl font-bold text-amber-400 group-hover:text-amber-300">{data.probableVulnerabilities?.length || 0}</div>
                        <div className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-wider">Heuristic</div>
                     </div>
                     <div className="group">
                        <div className="text-3xl font-bold text-cyber-text-main group-hover:text-cyber-primary">{data.ports?.length || 0}</div>
                        <div className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-wider">Open Ports</div>
                     </div>
                     <div className="group">
                        <div className="text-3xl font-bold text-cyber-text-main group-hover:text-cyber-primary">{data.techStack.length}</div>
                        <div className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-wider">Stack</div>
                     </div>
                 </div>
              </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard title="Authentication" score={data.securityMetrics.authScore} icon={LockIcon} color="#A78BFA" tip="Analyzes session entropy, hashing, and MFA implementation." />
                  <MetricCard title="Database" score={data.securityMetrics.dbScore} icon={Database} color="#FBBF24" tip="Evaluates SQLi resistance and parameterized query enforcement." />
                  <MetricCard title="Network" score={data.securityMetrics.networkScore} icon={Globe} color="#818CF8" tip="Checks SSL/TLS strength, HSTS, and infrastructure exposure." />
                  <MetricCard title="Client Side" score={data.securityMetrics.clientScore} icon={Layers} color="#2DD4BF" tip="Evaluates XSS prevention, CSP depth, and CSRF protection." />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 space-y-6">
                     <TechStack stack={data.techStack} headers={data.headers} />
                     {data.groundingLinks && data.groundingLinks.length > 0 && (
                        <div className="cyber-card p-6 bg-cyber-card">
                             <h3 className="text-cyber-text-main font-bold flex items-center gap-2 font-display text-xs uppercase tracking-widest mb-4"><Search className="text-cyber-primary" size={14} /> Research Evidence</h3>
                             <div className="space-y-3">
                                 {data.groundingLinks.map((link, i) => (
                                     <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 p-2.5 rounded-lg bg-cyber-bg border border-cyber-border hover:border-cyber-primary transition-all group no-print">
                                        <ExternalLink size={12} className="shrink-0 mt-0.5 text-cyber-text-muted group-hover:text-cyber-primary" />
                                        <span className="text-[10px] text-cyber-text-secondary leading-tight line-clamp-2">{link.title}</span>
                                     </a>
                                 ))}
                             </div>
                        </div>
                     )}
                 </div>
                 <div className="lg:col-span-2 cyber-card p-8 border-l-4 border-l-cyber-primary bg-cyber-card h-fit">
                     <h3 className="font-display font-bold text-cyber-text-main text-lg flex items-center gap-3 mb-6 border-b border-cyber-border pb-4"><Briefcase size={20} className="text-cyber-primary" /> Executive Summary</h3>
                     <div className="prose prose-sm prose-invert max-w-none text-cyber-text-secondary leading-relaxed font-sans bg-cyber-cardHighlight/50 p-6 rounded-xl border border-cyber-border">
                        <ReactMarkdown>{data.executiveSummary}</ReactMarkdown>
                     </div>
                 </div>
              </div>
            </div>
          )}
          {activeTab === 'vulnerabilities' && <div className="animate-fade-in"><VulnerabilityList vulnerabilities={data.vulnerabilities} /></div>}
          {activeTab === 'heuristic' && <div className="animate-fade-in"><ProbableVulnerabilityList vulnerabilities={data.probableVulnerabilities || []} /></div>}
          {activeTab === 'assets' && (
             <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="cyber-card p-6">
                    <h3 className="font-display font-bold text-cyber-text-main text-lg mb-6 flex items-center gap-3"><Map className="text-cyber-primary" size={20} /> Crawl Map</h3>
                    <div className="bg-slate-950 rounded-xl p-4 overflow-y-auto max-h-[500px] font-mono text-xs text-emerald-400">
                        {data.sitemap.map((url, i) => <div key={i} className="mb-2">├─ {url}</div>)}
                    </div>
                 </div>
                 <div className="cyber-card p-6">
                    <h3 className="font-display font-bold text-cyber-text-main text-lg mb-6 flex items-center gap-3"><Network className="text-cyber-primary" size={20} /> API Surface</h3>
                    <div className="bg-slate-950 rounded-xl p-4 overflow-y-auto max-h-[500px] font-mono text-xs text-amber-400">
                        {data.apiEndpoints.map((api, i) => <div key={i} className="mb-2">⚡ {api}</div>)}
                    </div>
                 </div>
             </div>
          )}
          {activeTab === 'ports' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.ports.map((port, idx) => (
                    <div key={idx} className={`p-5 rounded-xl border bg-cyber-card ${port.risk === 'Critical' || port.risk === 'High' ? 'border-rose-500/30' : 'border-cyber-border'}`}>
                        <div className="flex justify-between mb-3"><span className="font-mono text-xs text-cyber-text-muted">{port.port}/{port.protocol}</span></div>
                        <div className="font-bold text-cyber-text-main">{port.service}</div>
                        <div className="text-[10px] text-cyber-text-muted mt-1 uppercase tracking-widest">{port.risk} Risk</div>
                    </div>
                ))}
            </div>
          )}
      </div>
      <style>{`@media print { .no-print { display: none !important; } .cyber-card { border: 1px solid #333 !important; background: #0B0F19 !important; color: #F8FAFC !important; } }`}</style>
    </div>
  );
};
