import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PublicNavbar } from './PublicNavbar';

interface HomePageProps {
  onNavigate: (page: 'home' | 'about' | 'features' | 'contact' | 'login') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text-main font-sans relative overflow-hidden flex flex-col">
      {/* Background FX */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyber-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyber-accent/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      <PublicNavbar current="home" onNavigate={onNavigate} />

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center relative z-10 px-6 pb-20">
        <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-cyber-primary text-xs font-bold uppercase tracking-widest mb-8 shadow-soft animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Operational v2.5
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up">
                Next-Generation <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary via-blue-400 to-cyber-accent">Penetration Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-cyber-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-100">
                Automated security auditing powered by advanced AI neural networks. 
                Identify vulnerabilities, analyze risk, and secure your infrastructure before the threat arrives.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
                <button 
                    onClick={() => onNavigate('login')}
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-cyber-primary text-white rounded-xl font-bold text-lg tracking-wide overflow-hidden transition-all hover:scale-105 shadow-glow"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 flex items-center gap-2">
                        Initialize Scan <ChevronRight size={20} />
                    </span>
                </button>
                <button 
                    onClick={() => onNavigate('about')}
                    className="px-8 py-4 bg-cyber-card border border-cyber-border text-cyber-text-main rounded-xl font-bold text-lg hover:bg-cyber-cardHighlight transition-all"
                >
                    Learn More
                </button>
            </div>
        </div>
      </main>

      <footer className="py-8 text-center text-cyber-text-muted text-sm border-t border-cyber-border relative z-10 bg-cyber-bg">
        <p>© 2024 WebSec AI. All systems nominal.</p>
      </footer>
    </div>
  );
};