
import React from 'react';
import { Search, Bell, Command, ChevronDown, Menu, User } from 'lucide-react';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  username?: string;
  onMenuClick: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ title, subtitle, username = 'Guest', onMenuClick }) => {
  // Generate initials (max 2 chars)
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between glass-panel sticky top-0 z-40 shadow-sm">
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
        <div className="flex items-center gap-3 border-r border-cyber-border pr-6">
           <button className="relative p-2 rounded-lg hover:bg-cyber-cardHighlight transition-colors text-cyber-text-secondary hover:text-cyber-primary group">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full shadow-sm group-hover:scale-110 transition-transform"></span>
           </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-accent text-white flex items-center justify-center font-bold font-display text-xs border border-white/10 shadow-glow uppercase">
                {username === 'Guest' ? <User size={16} /> : getInitials(username)}
            </div>
            <div className="hidden lg:block text-left">
                <p className="text-sm font-display font-bold text-cyber-text-main group-hover:text-cyber-primary transition-colors capitalize">{username}</p>
                <p className="text-[10px] text-cyber-text-muted font-mono uppercase tracking-wider font-semibold">
                    {username === 'admin' ? 'System Administrator' : 'Security Analyst'}
                </p>
            </div>
            <ChevronDown size={14} className="text-cyber-text-muted hidden lg:block group-hover:text-cyber-text-main transition-colors" />
        </div>
      </div>
    </div>
  );
};
