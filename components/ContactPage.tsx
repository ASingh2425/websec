import React from 'react';
import { PublicNavbar } from './PublicNavbar';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: 'home' | 'about' | 'features' | 'contact' | 'login') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text-main font-sans relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
      <PublicNavbar current="contact" onNavigate={onNavigate} />

      <main className="flex-1 relative z-10 px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start animate-fade-in-up">
            
            {/* Left Info */}
            <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Get in Touch</h1>
                <p className="text-xl text-cyber-text-secondary leading-relaxed mb-12">
                    Ready to secure your infrastructure? Contact our sales team for enterprise licensing or schedule a demo.
                </p>

                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center text-cyber-primary shrink-0 border border-cyber-border">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold font-display">Email Us</h3>
                            <p className="text-cyber-text-secondary mb-1">General: hello@websec.ai</p>
                            <p className="text-cyber-text-secondary">Security: security@websec.ai</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center text-cyber-primary shrink-0 border border-cyber-border">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold font-display">HQ Location</h3>
                            <p className="text-cyber-text-secondary">
                                1337 Cyberpunk Blvd, Suite 404<br />
                                San Francisco, CA 94107
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center text-cyber-primary shrink-0 border border-cyber-border">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold font-display">Emergency Response</h3>
                            <p className="text-cyber-text-secondary">
                                +1 (800) SEC-HACK
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form */}
            <div className="cyber-card p-8 bg-cyber-card border-cyber-border shadow-2xl">
                <h3 className="text-xl font-bold font-display mb-6">Send us a message</h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cyber-text-muted uppercase tracking-wider">First Name</label>
                            <input type="text" className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-cyber-text-main focus:border-cyber-primary focus:outline-none transition-colors" placeholder="Jane" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cyber-text-muted uppercase tracking-wider">Last Name</label>
                            <input type="text" className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-cyber-text-main focus:border-cyber-primary focus:outline-none transition-colors" placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cyber-text-muted uppercase tracking-wider">Email Address</label>
                        <input type="email" className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-cyber-text-main focus:border-cyber-primary focus:outline-none transition-colors" placeholder="jane@company.com" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cyber-text-muted uppercase tracking-wider">Message</label>
                        <textarea className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-4 py-3 text-cyber-text-main focus:border-cyber-primary focus:outline-none transition-colors h-32 resize-none" placeholder="Tell us about your security needs..."></textarea>
                    </div>

                    <button className="w-full bg-cyber-primary hover:bg-cyber-primaryEnd text-white font-bold py-4 rounded-xl shadow-glow transition-all flex items-center justify-center gap-2">
                        Send Message <Send size={18} />
                    </button>
                </form>
            </div>

        </div>
      </main>
    </div>
  );
};