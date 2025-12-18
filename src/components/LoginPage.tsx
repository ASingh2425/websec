import React, { useState } from 'react';
import { Shield, ArrowRight, UserCheck, AlertCircle, Info, Zap } from 'lucide-react';
import { securityService } from '../services/securityService';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Force 'guest' credentials for the simulation
      const isValid = await securityService.login('guest', 'guest');
      if (isValid) {
        onLogin();
      } else {
        setError('Authentication system rejected the session uplink.');
        setLoading(false);
      }
    } catch (e) {
      setError('Connection to security gateway timed out.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

        <div className="w-full max-w-md bg-cyber-card border border-cyber-border rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
            {/* Top Decoration */}
            <div className="h-1.5 w-full bg-gradient-to-r from-cyber-primary via-purple-500 to-cyber-accent"></div>
            
            <div className="p-8 md:p-12">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-cyber-cardHighlight border border-cyber-border rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyber-primary shadow-glow">
                        <Shield size={40} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-cyber-text-main mb-2 tracking-tight">Terminal Login</h2>
                    <p className="text-cyber-text-secondary text-sm font-medium flex items-center justify-center gap-2">
                      <Zap size={14} className="text-emerald-400" /> System Status: Nominal
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="p-5 bg-cyber-cardHighlight/50 border border-cyber-border rounded-xl space-y-3">
                        <div className="flex items-start gap-3">
                            <Info size={18} className="text-cyber-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-cyber-text-secondary leading-relaxed">
                              You are accessing the platform as an <span className="text-cyber-text-main font-bold">Anonymous Auditor</span>. 
                              Local storage will be used to maintain session persistence.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold animate-pulse">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button 
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="w-full bg-cyber-primary hover:bg-cyber-primaryEnd text-white font-bold py-5 rounded-xl shadow-glow transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-wait relative overflow-hidden"
                    >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="animate-pulse tracking-widest uppercase text-xs">Syncing Session...</span>
                          </div>
                        ) : (
                          <>
                            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                            <UserCheck size={20} className="relative z-10" />
                            <span className="tracking-widest text-sm font-display uppercase relative z-10">Sign In as Guest</span>
                            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform opacity-70" />
                          </>
                        )}
                    </button>
                </div>

                <div className="mt-12 text-center border-t border-cyber-border/30 pt-6">
                    <p className="text-[10px] text-cyber-text-muted uppercase tracking-[0.3em] font-mono font-bold">
                        AES-256 Encrypted Session
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};