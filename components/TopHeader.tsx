import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Menu, User, CheckCircle, AlertTriangle, Info, X, Zap } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  time: string;
  unread: boolean;
}

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  username?: string;
  onMenuClick: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ title, subtitle, username = 'Guest', onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Uplink Synchronized',
      message: 'Neural security link established with central terminal.',
      type: 'success',
      time: 'Just now',
      unread: true
    },
    {
      id: '2',
      title: 'Credits Available',
      message: 'You have 3 guest audit credits remaining.',
      type: 'info',
      time: '5m ago',
      unread: true
    },
    {
      id: '3',
      title: 'Security Advisory',
      message: 'Patch for CVE-2024-3094 released. Monitor active.',
      type: 'warning',
      time: '1h ago',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-emerald-400" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-400" />;
      case 'alert': return <Zap size={16} className="text-rose-400" />;
      default: return <Info size={16} className="text-cyber-primary" />;
    }
  };

  return (
    <div className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between glass-panel sticky top-0 z-40 shadow-sm border-b border-cyber-border/50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-cyber-text-secondary hover:text-cyber-text-main transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-lg md:text-xl font-display font-bold text-cyber-text-main tracking-tight">{title}</h2>
          {subtitle && <p className="text-cyber-text-muted text-xs font-medium hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative" ref={dropdownRef}>
           <button 
             onClick={() => setShowNotifications(!showNotifications)}
             className={`relative p-2.5 rounded-xl transition-all border ${showNotifications ? 'bg-cyber-cardHighlight border-cyber-primary text-cyber-primary' : 'bg-cyber-card border-cyber-border text-cyber-text-secondary hover:text-cyber-primary hover:border-cyber-primary/30'}`}
           >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-cyber-card animate-pulse shadow-glow"></span>
              )}
           </button>

           {/* Notification Dropdown */}
           {showNotifications && (
             <div className="absolute right-0 mt-3 w-80 md:w-96 bg-cyber-card border border-cyber-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up origin-top-right ring-1 ring-cyber-border/50">
                <div className="p-4 bg-cyber-cardHighlight/50 border-b border-cyber-border flex justify-between items-center backdrop-blur-md">
                    <h3 className="text-sm font-bold text-cyber-text-main flex items-center gap-2">
                      <Bell size={14} className="text-cyber-primary" /> Signal Feed
                    </h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        className="text-[10px] font-bold text-cyber-primary hover:text-cyber-primaryEnd uppercase tracking-widest transition-colors"
                      >
                        Purge Unread
                      </button>
                    )}
                </div>
                
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <Info size={32} className="mx-auto text-cyber-text-muted opacity-30 mb-2" />
                      <p className="text-xs text-cyber-text-muted">No signals detected.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-cyber-border/30">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-4 transition-colors relative group ${n.unread ? 'bg-cyber-primary/5' : 'hover:bg-cyber-cardHighlight/30'}`}>
                           <div className="flex gap-3">
                              <div className="mt-1 shrink-0"><NotificationIcon type={n.type} /></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <p className={`text-sm font-bold truncate ${n.unread ? 'text-cyber-text-main' : 'text-cyber-text-secondary'}`}>{n.title}</p>
                                  <span className="text-[10px] text-cyber-text-muted whitespace-nowrap">{n.time}</span>
                                </div>
                                <p className="text-xs text-cyber-text-secondary mt-1 leading-relaxed">{n.message}</p>
                              </div>
                              {n.unread && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyber-primary rounded-full"></div>
                              )}
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-cyber-border bg-cyber-cardHighlight/20">
                   <button className="w-full py-2 text-[10px] font-bold text-cyber-text-muted hover:text-cyber-text-main uppercase tracking-[0.2em] transition-colors">
                      View System Logs
                   </button>
                </div>
             </div>
           )}
        </div>

        <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-accent text-white flex items-center justify-center font-bold font-display text-xs border border-white/10 shadow-glow uppercase">
                {username === 'Guest' ? <User size={16} /> : getInitials(username)}
            </div>
            <div className="hidden lg:block text-left">
                <p className="text-sm font-display font-bold text-cyber-text-main group-hover:text-cyber-primary transition-colors capitalize">{username}</p>
                <p className="text-[10px] text-cyber-text-muted font-mono uppercase tracking-wider font-semibold">
                    {username.toLowerCase() === 'admin' ? 'System Administrator' : 'Security Analyst'}
                </p>
            </div>
            <ChevronDown size={14} className="text-cyber-text-muted hidden lg:block group-hover:text-cyber-text-main transition-colors" />
        </div>
      </div>
    </div>
  );
};
