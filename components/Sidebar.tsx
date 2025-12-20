
import React from 'react';
import { LayoutDashboard, Scan, Globe, History, Settings, HelpCircle, LogOut, X, ChevronRight, ChevronLeft, Shield, Zap, Menu } from 'lucide-react';
import { securityService } from '../services/securityService';

type ViewType = 'scanner' | 'intelligence' | 'monitor' | 'history' | 'settings' | 'help';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isOpen: boolean; // Mobile overlay open/close
  onClose: () => void;
  onLogout: () => void;
  isCollapsed: boolean; // Desktop/Mini-mode toggle
  onToggleCollapse: () => void;
  onOpenPricing: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate, 
  isOpen, 
  onClose, 
  onLogout,
  isCollapsed,
  onToggleCollapse,
  onOpenPricing
}) => {
  const plan = securityService.getCurrentPlan();

  const menuItems = [
    { id: 'scanner', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'intelligence', label: 'Intelligence', icon: Globe },
    { id: 'monitor', label: 'Live Monitor', icon: Scan },
    { id: 'history', label: 'Audit History', icon: History },
  ];
  
  const systemItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle },
  ];

  const NavButton: React.FC<{ item: { id: string, label: string, icon: React.ElementType } }> = ({ item }) => (
    <button
      onClick={() => {
        onNavigate(item.id as ViewType);
        if (window.innerWidth < 768) onClose();
      }}
      title={isCollapsed ? item.label : ''}
      className={`w-full flex items-center py-3 rounded-lg text-sm font-medium transition-all group relative ${
        currentView === item.id 
          ? 'bg-cyber-primary/10 text-cyber-text-main border-l-4 border-cyber-primary shadow-[0_0_15px_rgba(129,140,248,0.1)]' 
          : 'text-cyber-text-secondary hover:bg-cyber-cardHighlight hover:text-cyber-text-main border-l-4 border-transparent'
      } ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3'}`}
    >
      <div className={`flex items-center gap-3 z-10 ${isCollapsed ? 'w-full justify-center' : ''}`}>
        <item.icon size={18} className={`${currentView === item.id ? 'text-cyber-primary' : 'text-slate-500 group-hover:text-cyber-text-main'}`} />
        {!isCollapsed && <span className="font-display tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
      </div>
      {!isCollapsed && currentView === item.id && <ChevronRight size={14} className="text-cyber-primary z-10 opacity-80" />}
    </button>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div className={`
        fixed md:relative inset-y-0 left-0 z-50
        bg-cyber-card/80 backdrop-blur-xl border-r border-cyber-border 
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
        flex flex-col h-full flex-shrink-0 shadow-2xl
      `}>
        {/* Logo & Toggle */}
        <div className={`h-20 px-4 md:px-6 flex items-center border-b border-cyber-border/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div 
            className={`flex items-center gap-3 cursor-pointer overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 invisible' : 'w-auto opacity-100 visible'}`} 
            onClick={() => onNavigate('scanner')}
          >
            <div className="w-9 h-9 bg-cyber-cardHighlight border border-cyber-border text-cyber-primary rounded-xl flex items-center justify-center shadow-glow shrink-0">
               <Shield size={18} fill="currentColor" />
            </div>
            <div>
               <h1 className="text-xl font-display font-extrabold text-cyber-text-main tracking-tight leading-none whitespace-nowrap">
                WebSec
              </h1>
              <span className="text-[10px] font-bold text-cyber-primary tracking-[0.2em] uppercase">Enterprise</span>
            </div>
          </div>
          
          <button 
            onClick={onToggleCollapse} 
            className={`p-2 rounded-lg text-cyber-text-muted hover:text-cyber-text-main hover:bg-cyber-cardHighlight transition-all ${isCollapsed ? '' : 'hidden md:block'}`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <Menu size={20}/> : <ChevronLeft size={20}/>}
          </button>

          <button onClick={onClose} className="md:hidden text-cyber-text-muted hover:text-cyber-text-main p-2">
            <X size={20}/>
          </button>
        </div>

        {/* Menu */}
        <div className="px-3 py-8 space-y-8 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          
          {/* Plan Status Widget */}
          {!isCollapsed && (
            <div className="bg-cyber-cardHighlight/50 border border-cyber-border rounded-xl p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-cyber-text-muted">Current Plan</span>
                    <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap">{plan.id === 'free' ? 'Starter' : 'Pro'}</span>
                </div>
                <h3 className="font-display font-bold text-cyber-text-main whitespace-nowrap overflow-hidden text-ellipsis">{plan.name}</h3>
                {plan.id === 'free' && (
                    <button 
                      onClick={onOpenPricing}
                      className="w-full mt-3 flex items-center justify-center gap-2 bg-cyber-primary hover:bg-cyber-primaryEnd text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-glow"
                    >
                        <Zap size={12} fill="currentColor" /> Upgrade
                    </button>
                )}
            </div>
          )}

          <div className="space-y-1">
            {!isCollapsed && <p className="px-3 text-[10px] font-bold text-cyber-text-muted uppercase tracking-widest mb-3 font-display whitespace-nowrap">Main Menu</p>}
            {menuItems.map((item) => <NavButton key={item.id} item={item} />)}
          </div>

          <div className="space-y-1">
            {!isCollapsed && <p className="px-3 text-[10px] font-bold text-cyber-text-muted uppercase tracking-widest mb-3 font-display whitespace-nowrap">System</p>}
            {systemItems.map((item) => <NavButton key={item.id} item={item} />)}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t border-cyber-border bg-cyber-cardHighlight/30 ${isCollapsed ? 'flex justify-center' : ''}`}>
           <button 
             onClick={onLogout} 
             title={isCollapsed ? "Sign Out" : ""}
             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-cyber-text-secondary hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20 group ${isCollapsed ? 'justify-center px-0' : ''}`}
           >
              <LogOut size={18} className="group-hover:text-rose-400 shrink-0"/> 
              {!isCollapsed && <span className="font-display whitespace-nowrap">Sign Out</span>}
           </button>
        </div>
      </div>
    </>
  );
};
