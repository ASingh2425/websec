import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import { PublicNavbar } from "./PublicNavbar";

interface ContactPageProps {
  onNavigate: (page: "home" | "about" | "features" | "contact" | "login") => void;
}

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
      const response = await fetch("https://formcarry.com/s/YOUR_FORMCARRY_ID", {
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
    } catch (err) {
      alert("Message delivery failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text-main flex flex-col">
      <PublicNavbar current="contact" onNavigate={onNavigate} />

      <main className="flex-1 px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT INFO */}
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-cyber-text-secondary">
                Ready to secure your infrastructure? Contact our elite security
                team for enterprise licensing or customized intelligence
                solutions.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <Mail />
                <div>
                  <h3 className="font-bold mb-1">Email Us</h3>
                  <p className="text-sm">admin@websecultra.com</p>
                  <p className="text-sm">singh.dilprit27@gmail.com</p>
                  <p className="text-sm">9a.anveshasingh@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin />
                <p className="text-sm">
                  Manipal Institute of Technology, Eshwar Nagar, Manipal,
                  Karnataka, 576104
                </p>
              </div>

              <div className="flex gap-4">
                <Phone />
                <div>
                  <p className="text-sm">+91 9234606590</p>
                  <p className="text-sm">+91 9236518010</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 shadow-2xl">
            {submitted ? (
              <div className="py-20 text-center">
                <CheckCircle size={48} className="mx-auto text-emerald-500 mb-6" />
                <h3 className="text-2xl font-bold mb-4">
                  Transmission Successful
                </h3>
                <p className="text-cyber-text-secondary">
                  Your message has been delivered to our team.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-6">
                  Initialize Communication
                </h3>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input"
                    required
                  />

                  <textarea
                    placeholder="Your Message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="input resize-none"
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyber-primary hover:bg-cyber-primaryEnd text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3"
                  >
                    {loading ? "Sending…" : "Send Signal"}
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm border-t border-cyber-border">
        © 2025 WebSec Ultra. All systems operational.
      </footer>
    </div>
  );
};
