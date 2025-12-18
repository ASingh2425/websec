
import React, { useState, useEffect } from 'react';
import { Shield, Trash2, Key, Check, Palette, HardDrive } from 'lucide-react';
import { securityService } from '../services/securityService';
import { PlanConfig, AppSettings } from '../types';

interface SettingsPageProps {
  currentUser: string;
  onClearHistory: () => void;
  settings: AppSettings;
  onSettingsChange: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onClearHistory, settings, onSettingsChange }) => {
  const [success, setSuccess] = useState('');
  const [plan, setPlan] = useState<PlanConfig | null>(null);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    setPlan(securityService.getCurrentPlan());
  }, []);

  const handleToggle = (key: keyof AppSettings) => {
    onSettingsChange({ [key]: !settings[key] });
    setSuccess('Settings updated');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPass(true);
    setTimeout(() => {
      setLoadingPass(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setSuccess('Password updated');
      setTimeout(() => setSuccess(''), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col justify-center bg-cyber-card border border-cyber-border p-8 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold text-cyber-text-main mb-2 flex items-center gap-3">
              <Shield className="text-cyber-primary" /> System Preferences
            </h2>
            <p className="text-cyber-text-secondary">Logged in as <span className="text-cyber-primary font-mono">{currentUser}</span></p>
          </div>
          {success && <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2"><Check size={14}/> {success}</div>}
        </div>
        <div className="cyber-card p-6 bg-gradient-to-br from-cyber-cardHighlight/20 to-cyber-bg">
          <h4 className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-widest mb-3">License Info</h4>
          <div className="text-2xl font-display font-bold text-emerald-400">{plan?.name || 'Standard'}</div>
          <p className="text-xs text-cyber-text-muted mt-2">Enterprise identity active.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="cyber-card p-6">
            <h4 className="text-sm font-bold text-cyber-text-main mb-6 flex items-center gap-2 font-display uppercase tracking-wider"><Palette size={18} className="text-cyber-primary" /> Visuals</h4>
            <div className="space-y-3">
              <button onClick={() => handleToggle('highContrast')} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${settings.highContrast ? 'border-cyber-primary bg-cyber-primary/5' : 'border-cyber-border bg-cyber-bg'}`}>
                <span className="text-xs font-bold text-cyber-text-main">High Contrast Mode</span>
                {settings.highContrast && <Check size={14} className="text-cyber-primary" />}
              </button>
            </div>
          </div>

          <div className="cyber-card p-6">
            <h4 className="text-sm font-bold text-cyber-text-main mb-4 flex items-center gap-2 font-display uppercase tracking-wider"><HardDrive size={18} className="text-cyber-primary" /> Storage</h4>
            <button onClick={onClearHistory} className="w-full py-2.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all flex items-center justify-center gap-2">
              <Trash2 size={14}/> Purge Audit History
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="cyber-card p-8">
            <h3 className="text-lg font-bold text-cyber-text-main mb-6 border-b border-cyber-border/50 pb-4 flex items-center gap-2 font-display tracking-wide uppercase">
              <Key size={20} className="text-cyber-primary" /> Security Hardening
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="password" placeholder="New Password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="bg-cyber-bg border border-cyber-border rounded-lg p-3 text-sm focus:border-cyber-primary outline-none" />
                <input type="password" placeholder="Confirm" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="bg-cyber-bg border border-cyber-border rounded-lg p-3 text-sm focus:border-cyber-primary outline-none" />
              </div>
              <button disabled={loadingPass || !passwords.new} className="px-6 py-2 bg-cyber-primary text-white rounded-lg text-xs font-bold hover:bg-cyber-primaryEnd disabled:opacity-50 transition-all">
                {loadingPass ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
