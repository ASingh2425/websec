import React, { useState } from 'react';
import { Search, ChevronDown, Zap, ShieldAlert, Code, CheckCircle, MessageCircle, Send, BookOpen, Terminal } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [supportSent, setSupportSent] = useState(false);

  const faqs = [
    { q: "What is Stealth Mode?", a: "Passive scanning that mimics standard user behavior to avoid triggering WAF blocks." },
    { q: "How are CVSS scores calculated?", a: "Based on exploitability, impact, and AI-driven assessment of the local architecture." },
    { q: "Can I automate these scans?", a: "Yes, our CLI tools (coming soon) allow integration with CI/CD pipelines." }
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up space-y-8 pb-20">
      <div className="text-center py-12 bg-cyber-card border border-cyber-border rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-display font-extrabold text-cyber-text-main mb-4">Knowledge Center</h2>
          <p className="text-cyber-text-secondary max-w-xl mx-auto">Documentation and support for technical auditors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-display font-bold text-cyber-text-main mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-cyber-primary"/> Common Queries
          </h3>
          {faqs.map((item, idx) => (
            <div key={idx} className="cyber-card">
              <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-5 text-left hover:bg-cyber-cardHighlight transition-colors">
                <span className="font-bold text-cyber-text-main">{item.q}</span>
                <ChevronDown size={18} className={`text-cyber-text-muted transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && <div className="p-5 pt-0 text-sm text-cyber-text-secondary leading-relaxed border-t border-cyber-border/50">{item.a}</div>}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="cyber-card p-6 bg-gradient-to-br from-cyber-card to-cyber-bg">
            <h3 className="text-sm font-bold text-cyber-text-main mb-6 flex items-center gap-2 uppercase tracking-wider font-display"><MessageCircle size={18} className="text-cyber-primary" /> Technical Support</h3>
            {!supportSent ? (
              <form onSubmit={(e) => { e.preventDefault(); setSupportSent(true); }} className="space-y-4">
                <textarea placeholder="How can we help?" className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-4 text-xs text-cyber-text-main h-32 outline-none focus:border-cyber-primary"></textarea>
                <button type="submit" className="w-full py-3 bg-cyber-primary text-white rounded-xl font-bold text-xs uppercase shadow-glow hover:bg-cyber-primaryEnd transition-all">Submit Ticket</button>
              </form>
            ) : (
              <div className="text-center py-8"><CheckCircle size={48} className="mx-auto text-emerald-400 mb-4"/><p className="text-sm font-bold text-cyber-text-main">Ticket Logged. Expect response within 2 hours.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};