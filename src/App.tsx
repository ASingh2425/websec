
import React, { useState, useEffect, useRef } from 'react';
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
  
  // App-wide Settings
  const [appSettings, setAppSettings] = useState<AppSettings>(settingsService.getSettings());

  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const initApp = async () => {
      settingsService.applySettings(appSettings); // Apply initial settings
      if (securityService.isAuthenticated()) {
        const user = securityService.getCurrentUser();
        if (user) setCurrentUser(user);
        setAppState('dashboard');
        try {
          const userHistory = await securityService.getUserHistory();
          setHistory(userHistory || []);
        } catch (e) {
          console.error("Failed to load secure history.", e);
          setHistory([]);
        }
      } else if (appState === 'dashboard') {
        setAppState('home');
      }
    };
    initApp();
  }, []);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (appState === 'dashboard') {
      inactivityTimer.current = setTimeout(() => {
        handleLogout();
        alert("Session expired due to inactivity.");
      }, 15 * 60 * 1000);
    }
  };

  useEffect(() => {
    if (appState === 'dashboard') {
      window.addEventListener('mousemove', resetInactivityTimer);
      window.addEventListener('keypress', resetInactivityTimer);
      window.addEventListener('click', resetInactivityTimer);
      resetInactivityTimer();
    }
    return () => {
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [appState]);

  const handleSettingsChange = (newSettings: Partial<AppSettings>) => {
    setAppSettings(prevSettings => {
        const updatedSettings = { ...prevSettings, ...newSettings };
        settingsService.saveSettings(updatedSettings);
        settingsService.applySettings(updatedSettings); // Apply changes immediately
        return updatedSettings;
    });
  };

  const saveToHistory = async (result: ScanResult) => {
    const newResult = { ...result, timestamp: new Date().toISOString() };
    const newHistory = [newResult, ...history].slice(0, 10);
    setHistory(newHistory);
    await securityService.saveUserHistory(newHistory);
    return newResult;
  };

  const handleClearHistory = async () => {
    setHistory([]);
    await securityService.clearUserHistory();
  };

  const handleDeleteHistoryItem = async (timestamp: string) => {
      const newHistory = history.filter(h => h.timestamp !== timestamp);
      setHistory(newHistory);
      await securityService.saveUserHistory(newHistory);
  };

  const handleLoadHistory = (result: ScanResult) => {
      setScanResult(result);
      setCurrentView('scanner');
      setScanLog([]);
  };

  const addLog = (msg: string) => setScanLog(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,8)}] ${msg}`]);

  const handleScan = async (target: string, type: 'url' | 'code', modules: ScanModule[], config: ScanConfig) => {
    setIsScanning(true);
    setError(null);
    setScanLog([]);
    setScanResult(null);
    const sanitizedTarget = securityService.sanitizeInput(target);
    const activeModules = modules.filter(m => m.enabled).map(m => m.name);
    addLog(`TARGET_ACQUIRED: ${sanitizedTarget.slice(0,30)}...`);
    addLog(`CONFIG: ${config.aggressiveness.toUpperCase()} | MODEL: ${config.model.toUpperCase()}`);
    await new Promise(r => setTimeout(r, 800));
    try {
      const result = await runScan(sanitizedTarget, type, activeModules, config);
      if (result.modelUsed === 'Gemini 2.5 Flash' && config.model === 'pro') {
         addLog('ALERT: Pro Quota/Load Exceeded. Fell back to Flash.');
      }
      addLog('SUCCESS: Analysis Complete.');
      if (appSettings.soundEffects) playSound('success');
      await new Promise(r => setTimeout(r, 500));
      const timestampedResult = await saveToHistory(result);
      setScanResult(timestampedResult);
    } catch (err: any) {
      let errorMessage = err.message || "An unexpected error occurred.";
      if (err.message?.toLowerCase().includes('overloaded')) errorMessage = "AI Model is overloaded. Please try again later.";
      setError(errorMessage);
      addLog('CRITICAL_FAILURE: Execution aborted.');
      securityService.refundCredit();
      if (appSettings.soundEffects) playSound('error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoginSuccess = () => {
      const user = securityService.getCurrentUser();
      if (user) setCurrentUser(user);
      setAppState('dashboard');
  };

  const handleLogout = () => {
    securityService.logout();
    setAppState('home');
    setScanResult(null);
    setScanLog([]);
    setHistory([]);
    setCurrentUser('Guest');
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'intelligence': return 'Threat Intelligence';
      case 'monitor': return 'Live System Monitor';
      case 'history': return 'Secure Audit History';
      case 'settings': return 'System Settings';
      case 'help': return 'Help & Documentation';
      default: return 'Security Dashboard';
    }
  };

  if (appState !== 'dashboard') {
    switch (appState) {
      case 'about': return <AboutPage onNavigate={setAppState} />;
      case 'features': return <FeaturesPage onNavigate={setAppState} />;
      case 'contact': return <ContactPage onNavigate={setAppState} />;
      case 'login': return <LoginPage onLogin={handleLoginSuccess} />;
      default: return <HomePage onNavigate={setAppState} />;
    }
  }

  return (
    <div className="flex h-screen bg-cyber-bg overflow-hidden font-sans text-cyber-text-main selection:bg-cyber-primary selection:text-white relative">
      {isScanning && <ScanLoadingScreen logs={scanLog} />}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
      <Sidebar 
        currentView={currentView} 
        onNavigate={(view) => { setCurrentView(view); setIsSidebarOpen(false); }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout} 
      />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopHeader title={getPageTitle()} username={currentUser} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
           {currentView === 'intelligence' && <Intelligence />}
           {currentView === 'monitor' && <LiveMonitor />}
           {currentView === 'history' && <History history={history} onLoad={handleLoadHistory} onClear={() => { if(window.confirm('Clear all history?')) handleClearHistory(); }} onDelete={handleDeleteHistoryItem} />}
           {currentView === 'settings' && <SettingsPage settings={appSettings} onSettingsChange={handleSettingsChange} currentUser={currentUser} onClearHistory={handleClearHistory} />}
           {currentView === 'help' && <HelpPage />}
           {currentView === 'scanner' && (
              !scanResult ? (
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                   <ScanForm onScan={handleScan} isScanning={isScanning} />
                   {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3"><AlertCircle /> <p>{error}</p></div>}
                </div>
              ) : (
                <div className="animate-fade-in-up">
                   <button onClick={() => setScanResult(null)} className="mb-6 text-sm text-cyber-text-secondary hover:text-cyber-primary flex items-center gap-2 font-medium bg-cyber-card px-4 py-2 rounded-lg border border-cyber-border">
                     ← New Scan
                   </button>
                   <Dashboard data={scanResult} history={history} />
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
