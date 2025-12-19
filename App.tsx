import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ScanForm } from './components/ScanForm';
import { Dashboard } from './components/Dashboard';
import { Intelligence } from './components/Intelligence';
import { LiveMonitor } from './components/LiveMonitor';
import { History } from './components/History';
import { AgentChat } from './components/AgentChat';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { FeaturesPage } from './components/FeaturesPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { ScanLoadingScreen } from './components/ScanLoadingScreen';
import { SettingsPage } from './components/SettingsPage';
import { HelpPage } from './components/HelpPage';
import { runScan } from './services/geminiService';
import { securityService } from './services/securityService';
import { settingsService } from './services/settingsService';
import { ScanResult, ScanModule, ScanConfig, AppSettings } from './types';
import { playSound } from './utils/audio';
import { AlertCircle } from 'lucide-react';

type AppState = 'home' | 'about' | 'features' | 'contact' | 'login' | 'dashboard';
type ViewState = 'scanner' | 'intelligence' | 'monitor' | 'history' | 'settings' | 'help';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [currentView, setCurrentView] = useState<ViewState>('scanner');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('Guest');
  const [appSettings, setAppSettings] = useState<AppSettings>(settingsService.getSettings());
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    const initApp = async () => {
      settingsService.applySettings(appSettings);
      if (securityService.isAuthenticated()) {
        const user = securityService.getCurrentUser();
        if (user) setCurrentUser(user);
        setAppState('dashboard');
        try {
          const userHistory = await securityService.getUserHistory();
          setHistory(userHistory || []);
        } catch (e) {
          setHistory([]);
        }
      }
    };
    initApp();
  }, []);

  const handleSettingsChange = (newSettings: Partial<AppSettings>) => {
    const updated = { ...appSettings, ...newSettings };
    setAppSettings(updated);
    settingsService.saveSettings(updated);
    settingsService.applySettings(updated);
  };

  const handleScan = async (target: string, type: 'url' | 'code', modules: ScanModule[], config: ScanConfig) => {
    setIsScanning(true);
    setError(null);
    setScanLog([]);
    setScanResult(null);

    if (!securityService.consumeCredit()) {
      setError("Insufficient credits.");
      setIsScanning(false);
      return;
    }

    const addLog = (msg: string) => setScanLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    addLog(`STARTING: ${target.slice(0, 30)}...`);

    try {
      const result = await runScan(target, type, modules.filter(m => m.enabled).map(m => m.name), config);
      if (appSettings.soundEffects) playSound('success');
      setHistory(prev => [result, ...prev].slice(0, 10));
      await securityService.saveUserHistory([result, ...history].slice(0, 10));
      setScanResult(result);
    } catch (err: any) {
      securityService.refundCredit();
      setError(err.message || "Failed.");
      if (appSettings.soundEffects) playSound('error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleLogout = () => {
    securityService.logout();
    setAppState('home');
    setScanResult(null);
    setHistory([]);
  };

  if (appState !== 'dashboard') {
    switch (appState) {
      case 'about': return <AboutPage onNavigate={setAppState} />;
      case 'features': return <FeaturesPage onNavigate={setAppState} />;
      case 'contact': return <ContactPage onNavigate={setAppState} />;
      case 'login': return <LoginPage onLogin={() => {
        setCurrentUser(securityService.getCurrentUser() || 'Guest');
        setAppState('dashboard');
      }} />;
      default: return <HomePage onNavigate={setAppState} />;
    }
  }

  return (
    <div className="flex h-screen bg-cyber-bg overflow-hidden font-sans text-cyber-text-main relative">
      {isScanning && <ScanLoadingScreen logs={scanLog} />}
      <Sidebar 
        currentView={currentView} 
        onNavigate={(view) => { setCurrentView(view); setIsSidebarOpen(false); }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout} 
      />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopHeader title={currentView === 'scanner' ? 'Security Dashboard' : 'System Hub'} username={currentUser} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
           {currentView === 'intelligence' && <Intelligence />}
           {currentView === 'monitor' && <LiveMonitor />}
           {currentView === 'history' && <History history={history} onLoad={(r) => { setScanResult(r); setCurrentView('scanner'); }} onClear={() => setHistory([])} onDelete={(t) => setHistory(history.filter(h => h.timestamp !== t))} />}
           {currentView === 'settings' && <SettingsPage settings={appSettings} onSettingsChange={handleSettingsChange} currentUser={currentUser} onClearHistory={() => setHistory([])} />}
           {currentView === 'help' && <HelpPage />}
           {currentView === 'scanner' && (
              !scanResult ? (
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                   <ScanForm onScan={handleScan} isScanning={isScanning} />
                   {error && (
                     <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3">
                        <AlertCircle size={20} />
                        <p className="text-sm font-medium">{error}</p>
                     </div>
                   )}
                </div>
              ) : (
                <div className="animate-fade-in-up">
                   <button onClick={() => setScanResult(null)} className="mb-6 text-sm text-cyber-text-secondary hover:text-cyber-primary flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-border transition-colors bg-cyber-card">
                     ← New Audit
                   </button>
                   <Dashboard data={scanResult} />
                </div>
              )
           )}
        </main>
      </div>
      <AgentChat />
    </div>
  );
};

export default App;
