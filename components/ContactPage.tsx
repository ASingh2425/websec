import React, { useState } from 'react';
import { PublicNavbar } from './PublicNavbar';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: 'home' | 'about' | 'features' | 'contact' | 'login') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setLoading(true);

    try {
      const response = await fetch(
        'https://formcarry.com/s/3Z7NIipQ5YP',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            message: formData.message
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Form submission failed');
      }

      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (error) {
      alert('Message delivery failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text-main font-sans relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
      <PublicNavbar current="contact" onNavigate={onNavigate} />

      <main className="flex-1 relative z-10 px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start animate-fade-in-up">

          {/* Left Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Get in Touch</h1>
              <p className="text-xl text-cyber-text-secondary leading-relaxed">
                Ready to secure your infrastructure? Contact our elite security team for enterprise licensing or customized intelligence solutions.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center text-cyber-primary shrink-0 border border-cyber-border shadow-glow">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-cyber-text-main mb-2">Email Us</h3>
                  <div className="space-y-1">
                    <p className="text-cyber-text-secondary font-mono text-sm">admin@websecultra.com</p>
                    <p className="text-cyber-text-secondary font-mono text-sm">singh.dilprit27@gmail.com</p>
                    <p className="text-cyber-text-secondary font-mono text-sm">9a.anveshasingh@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center text-cyber-primary shrink-0 border border-cyber-border">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-cyber-text-main mb-2">HQ Location</h3>
                  <p className="text-cyber-text-secondary leading-relaxed max-w-xs">
                    Manipal Institute of Technology, Eshwar Nagar, Manipal, Karnataka, 576104
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center text-cyber-primary shrink-0 border border-cyber-border">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-cyber-text-main mb-2">Emergency Response</h3>
                  <div className="space-y-1">
                    <p className="text-cyber-text-secondary font-mono text-sm">+91 9234606590</p>
                    <p className="text-cyber-text-secondary font-mono text-sm">+91 9236518010</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="cyber-card p-8 bg-cyber-card border-cyber-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-primary via-cyber-primaryEnd to-cyber-accent"></div>

            {submitted ? (
              <div className="py-20 text-center animate-fade-in">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-glow">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Transmission Successful</h3>
                <p className="text-cyber-text-secondary text-sm max-w-xs mx-auto">
                  Your message has been routed to our administrative team.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold font-display mb-6">Initialize Communication</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* form fields unchanged */}
                  {/* button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyber-primary hover:bg-cyber-primaryEnd text-white font-bold py-4 rounded-xl shadow-glow transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? 'Sending…' : 'Send Signal'}
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </main>

      <footer className="py-8 text-center text-cyber-text-muted text-sm border-t border-cyber-border bg-cyber-bg">
        <p>© 2025 WebSec Ultra. System Core: Stable.</p>
      </footer>
    </div>
  );
};
