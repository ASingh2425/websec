
import React, { useState } from 'react';
import { X, Check, Shield, Zap, Database, Play } from 'lucide-react';
import { securityService, PLANS } from '../services/securityService';
import { PlanType } from '../types';
import { PaymentPlaceholder } from './PaymentPlaceholder';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanUpdated: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onPlanUpdated }) => {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async (planId: PlanType) => {
    // Simulating initial click feedback
    setLoadingPlan(planId);
    await new Promise(r => setTimeout(r, 600));
    setLoadingPlan(null);
    
    // Instead of upgrading, show the maintenance page
    // securityService.upgradePlan(planId); 
    // onPlanUpdated();
    
    setShowPaymentInfo(true);
  };

  const handleClose = () => {
      setShowPaymentInfo(false);
      onClose();
  };

  const PlanCard = ({ planId, icon: Icon, color, features, recommended }: any) => {
      const plan = PLANS[planId as PlanType];
      const isProcessing = loadingPlan === planId;

      return (
        <div className={`cyber-card p-6 flex flex-col relative border-2 transition-all ${recommended ? 'border-cyber-primary scale-105 z-10 bg-[#161b2c]' : 'border-cyber-border bg-cyber-card hover:border-cyber-primary/50'}`}>
            {recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyber-primary text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-glow">
                    Most Popular
                </div>
            )}
            <div className="mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-cyber-text-main font-display">{plan.name}</h3>
                <div className="text-2xl font-bold text-cyber-text-main mt-2">
                    {plan.priceDisplay}
                </div>
                <p className="text-xs text-cyber-text-muted mt-1">
                    {plan.resetPeriod === 'never' ? 'One-time payment' : 'Billed monthly'}
                </p>
            </div>
            
            <div className="space-y-3 flex-1 mb-8">
                {features.map((feat: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-cyber-text-secondary">
                        <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => handlePurchase(planId)}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    recommended 
                    ? 'bg-cyber-primary hover:bg-cyber-primaryEnd text-white shadow-glow'
                    : 'bg-cyber-cardHighlight hover:bg-cyber-border text-cyber-text-main border border-cyber-border'
                }`}
            >
                {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Select Plan'}
            </button>
        </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-6xl h-auto max-h-[90vh] overflow-y-auto custom-scrollbar bg-cyber-bg border border-cyber-border rounded-2xl relative flex flex-col">
            <button 
                onClick={handleClose} 
                className="absolute top-4 right-4 p-2 text-cyber-text-muted hover:text-cyber-text-main transition-colors z-20"
            >
                <X size={24} />
            </button>

            {showPaymentInfo ? (
                <div className="p-4">
                    <PaymentPlaceholder onBack={() => setShowPaymentInfo(false)} />
                </div>
            ) : (
                <>
                    <div className="p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-display font-bold text-cyber-text-main mb-4">Upgrade Your Arsenal</h2>
                        <p className="text-cyber-text-secondary max-w-2xl mx-auto">
                            Unlock enterprise-grade scanning capabilities, automated remediation, and advanced AI reasoning models.
                        </p>
                    </div>

                    <div className="px-8 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* One Time 350 */}
                        <PlanCard 
                            planId="onetime_350"
                            icon={Zap}
                            color="bg-emerald-500/10 text-emerald-400"
                            features={[
                                "1 Full Deep Scan Credit",
                                "Gemini Pro Model",
                                "Stealth & Deep Modes",
                                "All Simulated Tools",
                                "Downloadable PDF Report"
                            ]}
                        />

                        {/* One Time 500 */}
                        <PlanCard 
                            planId="onetime_500"
                            icon={Database}
                            color="bg-amber-500/10 text-amber-400"
                            recommended={true}
                            features={[
                                "3 Scan Credits",
                                "Aggressive Mode Unlocked",
                                "Vulnerability Solutions",
                                "Probable Vulnerabilities",
                                "All Simulated Tools",
                                "Downloadable PDF Report"
                            ]}
                        />

                        {/* Sub 1899 */}
                        <PlanCard 
                            planId="sub_1899"
                            icon={Shield}
                            color="bg-blue-500/10 text-blue-400"
                            features={[
                                "Unlimited Scans / Month",
                                "Gemini Flash Model",
                                "Stealth & Deep Modes",
                                "5 Simulated Tools",
                                "Downloadable PDF Report",
                                "No Solutions Included"
                            ]}
                        />

                        {/* Sub 2999 */}
                        <PlanCard 
                            planId="sub_2999"
                            icon={Play}
                            color="bg-purple-500/10 text-purple-400"
                            features={[
                                "Unlimited Scans / Month",
                                "Gemini Pro Model",
                                "All Scanning Modes",
                                "All Simulated Tools",
                                "Full Remediation Code",
                                "Probable Vulnerabilities"
                            ]}
                        />

                    </div>
                </>
            )}
        </div>
    </div>
  );
};
