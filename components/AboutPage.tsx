import React from 'react';
import { PublicNavbar } from './PublicNavbar';
import { Target, Users, ShieldCheck, Award } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: 'home' | 'about' | 'features' | 'contact' | 'login') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text-main font-sans relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
      <PublicNavbar current="about" onNavigate={onNavigate} />

      <main className="flex-1 relative z-10 px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Mission</h1>
            <p className="text-xl text-cyber-text-secondary max-w-3xl mx-auto leading-relaxed">
                To democratize enterprise-grade security intelligence, enabling developers and organizations to fix vulnerabilities at the speed of code.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 animate-fade-in-up delay-100">
            <div className="cyber-card p-10 bg-gradient-to-br from-cyber-card to-[#0d121f]">
                <div className="w-14 h-14 bg-cyber-primary/10 rounded-2xl flex items-center justify-center mb-6 text-cyber-primary">
                    <Target size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display">Precision Engineering</h3>
                <p className="text-cyber-text-secondary leading-relaxed">
                    We built WebSec Ultra because traditional scanners are noisy. They flood you with false positives. 
                    Our engine uses reasoning models to validate findings with actual Proof-of-Concept payloads, 
                    saving your security team hundreds of hours.
                </p>
            </div>
            <div className="cyber-card p-10 bg-gradient-to-br from-cyber-card to-[#0d121f]">
                <div className="w-14 h-14 bg-cyber-primary/10 rounded-2xl flex items-center justify-center mb-6 text-cyber-accent">
                    <Users size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display">For Developers, By Hackers</h3>
                <p className="text-cyber-text-secondary leading-relaxed">
                    Founded by ex-NSA red teamers and AI researchers, we bridge the gap between offensive security and 
                    defensive engineering. We speak HTTP, but we also speak React, Python, and Go.
                </p>
            </div>
        </div>

        <div className="text-center mb-16 animate-fade-in-up delay-200">
            <h2 className="text-3xl font-display font-bold mb-12">Trusted By The Industry</h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
                <div className="flex items-center gap-2 text-2xl font-bold font-display"><ShieldCheck /> CyberCorp</div>
                <div className="flex items-center gap-2 text-2xl font-bold font-display"><Award /> SecureNet</div>
                <div className="flex items-center gap-2 text-2xl font-bold font-display"><Target /> DefenseGrid</div>
            </div>
        </div>
      </main>

      <footer className="py-8 text-center text-cyber-text-muted text-sm border-t border-cyber-border relative z-10 bg-cyber-bg">
        <p>© 2025 WebSec Ultra. All rights reserved.</p>
      </footer>
    </div>
  );
};
