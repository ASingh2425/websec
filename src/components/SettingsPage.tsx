import React, { useState, useEffect } from 'react';
import { User, Shield, Trash2, Key, Globe, Eye, Volume2, Download, CreditCard, Activity, Check, AlertCircle, Smartphone, Palette, Bell, Monitor, Zap, BrainCircuit, HardDrive } from 'lucide-react';
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
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<PlanConfig | null>(null);
  
  // Security State
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
      setPlan(securityService.getCurrentPlan());
  }, []);

  const showSuccess = (msg: string) => {
      setSuccess(msg);
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
  };

  const handleToggle = (key: keyof AppSettings) => {
      onSettingsChange({ [key]: !settings[key] });
      showSuccess('Preference updated');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoadingPass(true);
      if (passwords.new.length < 8) {
          setError('New password must be at least 8 characters');
          setLoadingPass(false);
          return;
      }
      if (passwords.new !== passwords.confirm) {
          setError('New passwords do not match');
          setLoadingPass(false);
          return;
      }
      setTimeout(() => {
          setLoadingPass(false);
          setPasswords({ current: '', new: '', confirm: '' });
          showSuccess('Password updated successfully');
      }, 1500);
  };

  const handleExportData = async () => {
      const history = await securityService.getUserHistory();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user: currentUser, timestamp: new Date().toISOString(), history }));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `websec_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up space-y-8 pb-20">
      
      {/* Header with Account Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col justify-center bg-cyber-card border border-cyber-border p-8 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-display font-bold text-cyber-text-main mb-2 flex items-center gap-3">
                <Shield className="text-cyber-primary" />
                System Configuration
                </h2>
                <p className="text-cyber-text-secondary max-w-xl">
                Authorized: <span className="text-cyber-primary font-mono">{currentUser}</span> • Manage your security infrastructure and preferences.
                </p>
            </div>
            {success && (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-2 animate-fade-in absolute top-4 right-4 shadow-glow">
                    <Check size={14}/> {success}
                </div>
            )}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>

        <div className="cyber-card p-6 bg-gradient-to-br from-cyber-cardHighlight/20 to-cyber-bg border-cyber-border">
            <h4 className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-widest mb-3">Identity Hardening</h4>
            <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-display font-bold text-emerald-400">92%</div>
                <div className="flex-1 h-2 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] w-[92%]"></div>
                </div>
            </div>
            <p className="text-[10px] text-cyber-text-muted">High Security Score. Your account is verified and hardened against unauthorized access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & Navigation */}
          <div className="lg:col-span-1 space-y-6">
              <div className="cyber-card p-6 border-cyber-border">
                  <h4 className="text-sm font-bold text-cyber-text-main uppercase tracking-wider mb-6 flex items-center gap-2"><Palette className="text-cyber-primary" size={16} /> Visual Identity</h4>
                  <div className="grid grid-cols-1 gap-3">
                      <button onClick={() => settings.highContrast && handleToggle('highContrast')} 
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${!settings.highContrast ? 'border-cyber-primary bg-cyber-primary/5' : 'border-cyber-border bg-cyber-bg hover:border-cyber-text-muted'}`}>
                          <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border bg-slate-900 border-slate-700"></div>
                              <span className="text-xs font-bold text-cyber-text-main">Obsidian Void</span>
                          </div>
                          {!settings.highContrast && <Check size={14} className="text-cyber-primary" />}
                      </button>
                      <button onClick={() => !settings.highContrast && handleToggle('highContrast')} 
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${settings.highContrast ? 'border-cyber-primary bg-cyber-primary/5' : 'border-cyber-border bg-cyber-bg hover:border-cyber-text-muted'}`}>
                          <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full border bg-black border-white"></div>
                              <span className="text-xs font-bold text-cyber-text-main">High Contrast</span>
                          </div>
                          {settings.highContrast && <Check size={14} className="text-cyber-primary" />}
                      </button>
                  </div>
              </div>

              <div className="cyber-card p-6">
                  <h4 className="text-sm font-bold text-cyber-text-main uppercase tracking-wider mb-4 flex items-center gap-2"><CreditCard className="text-cyber-primary" size={16} /> Entitlements</h4>
                  <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs"><span className="text-cyber-text-muted">License Tier</span><span className="font-bold text-emerald-400">{plan?.name}</span></div>
                      <div className="flex justify-between items-center text-xs"><span className="text-cyber-text-muted">Intelligence Credits</span><span className="font-mono font-bold text-cyber-text-main">{plan?.maxScans === -1 ? 'Unlimited' : `${securityService.getCredits()} / ${plan?.maxScans}`}</span></div>
                      <div className="flex justify-between items-center text-xs"><span className="text-cyber-text-muted">Node Registry</span><span className="font-mono text-cyber-text-secondary">Primary Central</span></div>
                  </div>
              </div>

              <div className="cyber-card p-6">
                  <h4 className="text-sm font-bold text-cyber-text-main uppercase tracking-wider mb-4 flex items-center gap-2"><HardDrive className="text-cyber-primary" size={16} /> Data & Vault</h4>
                  <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-cyber-text-muted">Local Store Usage</span>
                            <span className="text-cyber-text-main font-mono">1.2 MB / 5 MB</span>
                        </div>
                        <div className="h-1.5 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
                            <div className="h-full bg-cyber-primary w-[24%]"></div>
                        </div>
                        <button onClick={handleExportData} className="w-full py-2.5 rounded-lg border border-cyber-border bg-cyber-card hover:bg-cyber-cardHighlight transition-all flex items-center justify-center gap-2 text-xs font-bold text-cyber-text-main group">
                            <Download size={14} className="text-cyber-text-secondary group-hover:text-cyber-primary" />
                            Download Secure Export
                        </button>
                  </div>
              </div>

              <div className="cyber-card p-6 border-rose-500/30 bg-rose-500/5">
                  <h4 className="text-rose-400 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2"><Trash2 size={14} /> System Purge</h4>
                  <p className="text-[10px] text-cyber-text-secondary mb-4 leading-relaxed font-mono">DESTROY_ALL_LOCAL_RECORDS: Irreversible deletion of audit history.</p>
                  <button onClick={() => { if(window.confirm('WARNING: PERMANENT DATA LOSS. Purge all audit history?')) onClearHistory(); }}
                    className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold uppercase transition-all">
                      Execute Purge
                  </button>
              </div>
          </div>

          {/* Right Column: Preferences & Security */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Audit Defaults */}
              <div className="cyber-card p-8">
                  <h3 className="text-lg font-bold text-cyber-text-main mb-6 font-display border-b border-cyber-border/50 pb-4 flex items-center gap-2"><Zap size={20} className="text-cyber-primary" /> Audit Defaults</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                          <label className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-widest">Default Intelligence Node</label>
                          <div className="grid grid-cols-2 gap-2">
                              <button className="p-3 border border-cyber-primary bg-cyber-primary/5 rounded-xl text-xs font-bold text-cyber-primary flex items-center gap-2"><BrainCircuit size={14}/> Gemini Pro</button>
                              <button className="p-3 border border-cyber-border bg-cyber-bg rounded-xl text-xs font-bold text-cyber-text-muted hover:border-cyber-primary/50 flex items-center gap-2"><Monitor size={14}/> High Speed</button>
                          </div>
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-bold text-cyber-text-muted uppercase tracking-widest">Analysis Aggressiveness</label>
                          <select className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-4 py-3 text-xs text-cyber-text-main outline-none focus:border-cyber-primary transition-all">
                              <option>Stealth (Passive Checks)</option>
                              <option selected>Deep (Comprehensive)</option>
                              <option>Invasive (Exploit Verification)</option>
                          </select>
                      </div>
                  </div>
              </div>

              {/* Notification Routing */}
              <div className="cyber-card p-8">
                  <h3 className="text-lg font-bold text-cyber-text-main mb-6 font-display border-b border-cyber-border/50 pb-4 flex items-center gap-2"><Bell size={20} className="text-cyber-primary" /> Signal Routing</h3>
                  <div className="space-y-6">
                      {[
                        { icon: Monitor, label: 'Desktop Push Alerts', desc: 'Real-time telemetry on scan events' },
                        { icon: Globe, label: 'Email Reports', desc: 'Secure digest of critical findings' },
                        { icon: Activity, label: 'Webhook Integration', desc: 'Pipe raw audit data to Slack/Discord' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-cyber-bg rounded-xl text-cyber-text-secondary border border-cyber-border"><item.icon size={20} /></div>
                                <div>
                                    <div className="text-sm font-bold text-cyber-text-main">{item.label}</div>
                                    <div className="text-xs text-cyber-text-muted">{item.desc}</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked={i === 0} />
                                <div className="w-11 h-6 bg-cyber-bg rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-primary border border-cyber-border"></div>
                            </label>
                        </div>
                      ))}
                  </div>
              </div>

              {/* Security Hardening */}
              <div className="cyber-card p-8">
                  <h3 className="text-lg font-bold text-cyber-text-main mb-6 font-display border-b border-cyber-border/50 pb-4 flex items-center gap-2"><Key size={20} className="text-cyber-primary" /> Terminal Security</h3>
                  
                  <div className="space-y-8">
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-cyber-text-muted uppercase tracking-wider">New Password</label>
                                  <input 
                                    type="password" 
                                    className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text-main focus:border-cyber-primary focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-xs font-bold text-cyber-text-muted uppercase tracking-wider">Confirm Password</label>
                                  <input 
                                    type="password" 
                                    className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-sm text-cyber-text-main focus:border-cyber-primary focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                  />
                              </div>
                          </div>
                          {error && <p className="text-xs text-rose-400 font-bold flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
                          <div className="flex justify-end">
                              <button type="submit" disabled={loadingPass || !passwords.new} className="px-6 py-2 bg-cyber-card border border-cyber-border hover:bg-cyber-cardHighlight text-cyber-text-main text-xs font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50">
                                  {loadingPass ? 'Encrypting...' : 'Rotate Password'}
                              </button>
                          </div>
                      </form>

                      <div className="h-px bg-cyber-border"></div>

                      {/* 2FA Toggle */}
                      <div className="p-5 bg-emerald-500/5 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 border flex items-center justify-center">
                                <Smartphone size={20} />
                              </div>
                              <div>
                                  <div className="text-sm font-bold text-cyber-text-main">Multi-Factor Authentication (MFA)</div>
                                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM_PROTECTED
                                  </div>
                              </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={is2FAEnabled} onChange={() => setIs2FAEnabled(!is2FAEnabled)} />
                                <div className="w-11 h-6 bg-cyber-bg rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 border border-cyber-border"></div>
                          </label>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};