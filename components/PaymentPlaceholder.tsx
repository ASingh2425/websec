
import React from 'react';
import { CreditCard, ShieldAlert, ArrowLeft, Construction } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const PaymentPlaceholder: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in bg-cyber-bg rounded-2xl">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-cyber-cardHighlight rounded-full flex items-center justify-center border border-cyber-border shadow-glow">
            <Construction size={48} className="text-cyber-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-cyber-card border border-cyber-border p-2.5 rounded-full text-amber-400 shadow-lg">
            <ShieldAlert size={20} />
        </div>
      </div>
      
      <h2 className="text-3xl font-display font-bold text-cyber-text-main mb-4">Gateway Upgrading</h2>
      
      <div className="max-w-md space-y-6 mb-10">
          <p className="text-cyber-text-secondary text-lg leading-relaxed">
            Our payment window is currently under progress. We are integrating a quantum-resistant encryption layer for financial transactions.
          </p>
          
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-amber-400 font-mono font-bold tracking-widest">STATUS: MAINTENANCE_MODE</p>
          </div>
      </div>

      <button 
        onClick={onBack}
        className="flex items-center gap-2 px-8 py-3 bg-cyber-card border border-cyber-border hover:border-cyber-primary text-cyber-text-main rounded-xl transition-all font-bold text-sm group hover:shadow-glow"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Return to Plans
      </button>
    </div>
  );
};
