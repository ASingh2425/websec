import React, { useState } from "react";
import { PublicNavbar } from "./PublicNavbar";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";

interface ContactPageProps {
  onNavigate: (page: "home" | "about" | "features" | "contact" | "login") => void;
}

const FORMCARRY_URL = "https://formcarry.com/s/3Z7NIipQ5YP";

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setLoading(true);

    try {
      const response = await fetch(FORMCARRY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
      }

      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert("Message delivery failed. Please try again later.");
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

          {/* LEFT INFO */}
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-cyber-text-secondary leading-relaxed">
                Ready to secure your infrastructure? Contact our elite security
                team for enterprise licensing or customized intelligence
                solutions.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center text-cyber-primary border border-cyber-border shadow-glow">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Email Us</h3>
                  <p className="text-sm font-mono">admin@websecultra.com</p>
                  <p className="text-sm font-mono">singh.dilprit27@gmail.com</p>
                  <p className="text-sm font-mono">9a.anveshasingh@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center text-cyber-primary border border-cyber-border">
                  <MapPin size={24} />
                </div>
                <p className="text-sm leading-relaxed max-w-xs">
                  Manipal Institute of Technology, Eshwar Nagar, Manipal,
                  Karnataka, 576104
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyber-cardHighlight rounded-xl flex items-center justify-center text-cyber-primary border border-cyber-border">
                  <Phone size={24} />
                </div>
                <div className="text-sm font-mono">
                  <p>+91 9234606590</p>
                  <p>+91 9236518010</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="cyber-card p-8 bg-cyber-card border-cyber-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-primary via-cyber-primaryEnd to-cyber-accent"></div>

            {submitted ? (
              <div className="py-20 text-center animate-fade-in">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-glow">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Transmission Successful
                </h3>
                <p className="text-sm text-cyber-text-secondary max-w-xs mx-auto">
                  Your message has been securely delivered to our administrative
                  team.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-6">
                  Initialize Communication
                </h3>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyber-primary outline-none"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyber-primary outline-none"
                    />
                  </div>

                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-cyber-primary outline-none"
                  />

                  <textarea
                    required
                    rows={6}
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-cyber-bg border border-cyber-border rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-cyber-primary outline-none"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyber-primary hover:bg-cyber-primaryEnd disabled:opacity-60 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all"
                  >
                    {loading ? "Sending…" : "Send Signal"}
                    <Send size={18} />
                  </button>

                  <p className="text-[10px] text-cyber-text-muted text-center">
                    Messages are routed securely via Formcarry.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm border-t border-cyber-border">
        © 2025 WebSec Ultra. System Core: Stable.
      </footer>
    </div>
  );
};
