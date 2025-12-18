import React from 'react';
import { Shield, Menu, X, ChevronRight } from 'lucide-react';

interface PublicNavbarProps {
  current: 'home' | 'about' | 'features' | 'contact';
  onNavigate: (page: 'home' | 'about' | 'features' | 'contact' | 'login') => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ current, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItemClass = (page: 'home' | 'about' | 'features' | 'contact') => 
    `text-sm font-medium transition-colors hover:text-cyber-primary cursor-pointer tracking-wide ${
      current === page ? 'text-cyber-primary' : 'text-cyber-text-secondary'
    }`;

  return (
    <nav className="relative z-50 w-full border-b border-cyber-border/50 backdrop-blur-md sticky top-0 bg-cyber-bg/90">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        
        {/* 1. Logo Section (Left Aligned) */}
        <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0 relative z-20"
            onClick={() => onNavigate('home')}
        >
            <div className="w-9 h-9 bg-cyber-cardHighlight border border-cyber-border text-cyber-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                <Shield size={18} fill="currentColor" />
            </div>
            <span className="text-lg font-display font-extrabold tracking-tight text-cyber-text-main">
                WebSec<span className="text-cyber-primary">.AI</span>
            </span>
        </div>

        {/* 2. Navigation Links (Absolute Center) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-10">
            <button onClick={() => onNavigate('home')} className={navItemClass('home')}>Home</button>
            <button onClick={() => onNavigate('about')} className={navItemClass('about')}>About Us</button>
            <button onClick={() => onNavigate('features')} className={navItemClass('features')}>Capabilities</button>
            <button onClick={() => onNavigate('contact')} className={navItemClass('contact')}>Contact</button>
        </div>

        {/* 3. Login Button (Right Aligned) */}
        <div className="hidden md:flex items-center gap-4 relative z-20">
            <button 
                onClick={() => onNavigate('login')}
                className="group flex items-center gap-2 px-6 py-2.5 bg-cyber-primary hover:bg-cyber-primaryEnd text-white rounded-lg text-sm font-bold shadow-glow transition-all hover:scale-105 active:scale-95"
            >
                <span>Login</span>
                <ChevronRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
            className="md:hidden text-cyber-text-secondary hover:text-cyber-primary p-2 relative z-20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-cyber-card border-b border-cyber-border p-4 md:hidden flex flex-col gap-4 shadow-2xl animate-fade-in z-10">
            <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className={`text-left px-4 py-3 rounded-lg hover:bg-cyber-cardHighlight ${current === 'home' ? 'text-cyber-primary font-bold bg-cyber-primary/5' : 'text-cyber-text-secondary'}`}>Home</button>
            <button onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }} className={`text-left px-4 py-3 rounded-lg hover:bg-cyber-cardHighlight ${current === 'about' ? 'text-cyber-primary font-bold bg-cyber-primary/5' : 'text-cyber-text-secondary'}`}>About Us</button>
            <button onClick={() => { onNavigate('features'); setMobileMenuOpen(false); }} className={`text-left px-4 py-3 rounded-lg hover:bg-cyber-cardHighlight ${current === 'features' ? 'text-cyber-primary font-bold bg-cyber-primary/5' : 'text-cyber-text-secondary'}`}>Capabilities</button>
            <button onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }} className={`text-left px-4 py-3 rounded-lg hover:bg-cyber-cardHighlight ${current === 'contact' ? 'text-cyber-primary font-bold bg-cyber-primary/5' : 'text-cyber-text-secondary'}`}>Contact</button>
            <div className="h-px bg-cyber-border my-2"></div>
            <button 
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="w-full py-3 bg-cyber-primary text-white rounded-lg font-bold text-center shadow-glow"
            >
                Login
            </button>
        </div>
      )}
    </nav>
  );
};