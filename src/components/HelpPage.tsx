
import React, { useState } from 'react';
import { ExternalLink, Search, ChevronDown, Zap, ShieldAlert, Code, Activity, CheckCircle, MessageCircle, Send, BookOpen, FileText, Terminal, Info } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const faqs = [
    { q: "How does the AI engine identify logic-based vulnerabilities?", a: "Unlike regex scanners, WebSec-AI uses semantic reasoning. It identifies data flows and permission structures to find Broken Object Level Authorization (BOLA/IDOR) by simulating valid vs. invalid user contexts in its reasoning engine." },
    { q: "Are scans completely non-invasive?", a: "By default, 'Stealth' and 'Deep' modes use non-destructive payloads. 'Invasive' mode (Aggressive) may attempt active exploitation to verify a flaw, which generates PoC evidence but should be used on staging environments." },
    { q: "What is the 'Maturity Grade' in the report?", a: "It's an enterprise-grade metric. 'Hardened' means the target uses modern security headers, CSP, and minimal exposure. 'Vulnerable' indicates high-severity findings and lack of basic hygiene like HTTPS or secure cookies." },
    { q: "Can I use WebSec-AI for bug bounties?", a: "Absolutely. Our 'Proof-of-Concept' generation provides the exact payloads and HTTP snippets needed for high-quality bug reports on platforms like HackerOne or Bugcrowd." }
  ];

  const toolbox = [
    { cmd: "nmap -sV --script=vuln [target]", desc: "Scan services and verify basic CVEs manually." },
    { cmd: "curl -I -X OPTIONS [url]", desc: "Check enabled HTTP methods (look for PUT/DELETE)." },
    { cmd: "sqlmap -u \"[url]\" --batch --risk=3", desc: "Automate confirmed SQLi vectors for deep DB access." },
    { cmd: "openssl s_client -connect [host]:443", desc: "Manually verify SSL handshake and cipher suites." }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!supportMessage.trim()) return;
      setMessageSent(true);
      setTimeout(() => {
          setMessageSent(false);
          setSupportMessage('');
      }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up space-y-8 pb-20">
      
      {/* Search & Hero */}
      <div className="text-center py-12 relative overflow-hidden bg-cyber-card border border-cyber-border rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-primary via-emerald-500 to-cyber-accent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <h2 className="text-4xl font-display font-extrabold text-cyber-text-main mb-4 relative z-10">Knowledge Uplink</h2>
          <p className="text-cyber-text-secondary max-w-2xl mx-auto text-lg relative z-10 font-light">Deep documentation for ethical hackers and security engineers.</p>
          
          <div className="mt-10 max-w-2xl mx-auto relative group z-10 px-6">
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-cyber-text-muted group-focus-within:text-cyber-primary" size={22} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search exploit classes, remediation steps, or FAQ..." 
                className="w-full bg-cyber-bg border border-cyber-border rounded-2xl py-5 pl-14 pr-6 text-cyber-text-main focus:border-cyber-primary focus:outline-none shadow-2xl placeholder:text-cyber-text-muted/50 transition-all" />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Initial Recon", desc: "Configuring stealth vs. aggressive scans.", icon: Zap, color: "text-cyber-primary" },
            { title: "Risk Scoring", desc: "How we calculate CVSS and Maturity.", icon: ShieldAlert, color: "text-amber-400" },
            { title: "API Vault", desc: "Managing integrations and webhook sinks.", icon: Code, color: "text-emerald-400" },
            { title: "PoC Guide", desc: "Interpreting AI exploit verification.", icon: FileText, color: "text-purple-400" }
          ].map((card, i) => (
            <div key={i} className="cyber-card p-6 hover:bg-cyber-cardHighlight group cursor-pointer border border-cyber-border transition-all">
                <div className={`w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center mb-5 ${card.color} group-hover:scale-110 transition-transform shadow-glow`}>
                    <card.icon size={24} />
                </div>
                <h3 className="text-base font-bold text-cyber-text-main mb-2 font-display">{card.title}</h3>
                <p className="text-xs text-cyber-text-secondary leading-relaxed mb-4">{card.desc}</p>
                <div className={`text-[10px] font-bold ${card.color} flex items-center gap-1 group-hover:underline uppercase tracking-widest`}>Access Docs <ExternalLink size={10}/></div>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main FAQ & Knowledge */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-2 px-2">
                 <BookOpen size={20} className="text-cyber-primary" />
                 <h3 className="text-xl font-display font-bold text-cyber-text-main">Frequently Asked Questions</h3>
              </div>
              
              <div className="space-y-3">
                {faqs.map((item, idx) => (
                    <div key={idx} className="cyber-card bg-cyber-card border-cyber-border overflow-hidden">
                        <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-5 text-left hover:bg-cyber-cardHighlight transition-colors group">
                            <span className="font-bold text-cyber-text-main text-sm md:text-base pr-4 group-hover:text-cyber-primary transition-colors">{item.q}</span>
                            <ChevronDown size={18} className={`text-cyber-text-muted transition-transform shrink-0 ${openFaq === idx ? 'rotate-180 text-cyber-primary' : ''}`} />
                        </button>
                        {openFaq === idx && (
                            <div className="px-5 pb-6 text-sm text-cyber-text-secondary leading-relaxed border-t border-cyber-border/50 bg-cyber-bg/20 animate-fade-in">
                                <p className="pt-4 font-medium">{item.a}</p>
                            </div>
                        )}
                    </div>
                ))}
              </div>

              {/* Auditor Toolbox Section */}
              <div className="cyber-card p-8 border-l-4 border-l-emerald-500 bg-[#0c1220]">
                  <div className="flex items-center gap-3 mb-6">
                      <Terminal size={22} className="text-emerald-400" />
                      <h3 className="text-lg font-display font-bold text-cyber-text-main">Auditor's Manual Toolbox</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {toolbox.map((tool, i) => (
                          <div key={i} className="p-4 bg-cyber-bg border border-cyber-border rounded-xl group hover:border-emerald-500/30 transition-all">
                              <div className="bg-slate-900 rounded p-2 mb-2 font-mono text-[10px] text-emerald-300 flex items-center justify-between">
                                  <span>{tool.cmd}</span>
                                  <Code size={12} className="opacity-50" />
                              </div>
                              <p className="text-[10px] text-cyber-text-muted font-bold uppercase tracking-wider">{tool.desc}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Support & Side Stats */}
          <div className="lg:col-span-1 space-y-6">
              
              {/* System Integrity Widget */}
              <div className="cyber-card p-6">
                  <h3 className="text-xs font-bold text-cyber-text-main mb-6 flex items-center gap-2 uppercase tracking-widest"><Activity size={16} className="text-cyber-primary" /> Intelligence Health</h3>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-cyber-text-muted">Node Cluster 01</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={10}/> NOMINAL</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-cyber-text-muted">PoC Generator</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={10}/> NOMINAL</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-cyber-text-muted">WAF Bypass Index</span>
                          <span className="text-amber-400 font-bold flex items-center gap-1"><Info size={10}/> BUSY</span>
                      </div>
                  </div>
              </div>

              {/* Support Module */}
              <div className="cyber-card p-6 bg-gradient-to-br from-cyber-card to-cyber-bg">
                  <h3 className="text-sm font-bold text-cyber-text-main mb-6 flex items-center gap-2 font-display uppercase tracking-wider"><MessageCircle size={18} className="text-cyber-primary" /> Direct Liaison</h3>
                  <p className="text-xs text-cyber-text-secondary mb-6 leading-relaxed">Submit technical queries regarding vulnerability verification or platform integration.</p>
                  
                  <form onSubmit={handleSendMessage} className="space-y-4">
                      <textarea 
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Describe your technical inquiry..."
                        className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-4 text-xs text-cyber-text-main outline-none focus:border-cyber-primary h-32 resize-none transition-all"
                      ></textarea>
                      <button 
                        type="submit"
                        disabled={messageSent}
                        className={`w-full py-3 rounded-xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 ${
                          messageSent 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-cyber-primary hover:bg-cyber-primaryEnd text-white shadow-glow'
                        }`}
                      >
                          {messageSent ? (
                              <>
                                <CheckCircle size={14} /> Ticket Created #4092
                              </>
                          ) : (
                              <>
                                <Send size={14} /> Initialize Uplink
                              </>
                          )}
                      </button>
                  </form>
                  <p className="mt-4 text-[10px] text-cyber-text-muted text-center font-mono">Average Response: 1.2 hours (Enterprise)</p>
              </div>

              {/* Compliance Footer */}
              <div className="p-6 bg-cyber-cardHighlight/30 rounded-2xl border border-cyber-border">
                  <h4 className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-[0.2em] mb-3">Compliance Reference</h4>
                  <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-cyber-bg border border-cyber-border rounded text-center text-[9px] font-bold text-cyber-text-secondary">OWASP TOP 10</div>
                      <div className="p-2 bg-cyber-bg border border-cyber-border rounded text-center text-[9px] font-bold text-cyber-text-secondary">NIST SP 800-115</div>
                      <div className="p-2 bg-cyber-bg border border-cyber-border rounded text-center text-[9px] font-bold text-cyber-text-secondary">PCI DSS v4.0</div>
                      <div className="p-2 bg-cyber-bg border border-cyber-border rounded text-center text-[9px] font-bold text-cyber-text-secondary">SOC 2 Type II</div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
