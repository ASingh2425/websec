
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Shield, Trash2 } from 'lucide-react';
import { queryAgent } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AgentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const initialMessage: ChatMessage = {
      id: 'init',
      role: 'ai',
      content: "Hello. I am Sentinel. I can explain any security finding in simple terms. How can I help?",
      timestamp: new Date()
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass history excluding the message we just added (since state updates are async, 'messages' here is still the old list)
      // Actually, queryAgent expects history including previous context. 
      // We map the current 'messages' state (which is technically "history" relative to the new userMsg)
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
      
      const responseText = await queryAgent(historyPayload, userMsg.content);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: "Communication interrupted. Please check console.",
          timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
      setMessages([initialMessage]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto w-[350px] md:w-[400px] h-[500px] bg-cyber-card border border-cyber-border rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-fade-in-up origin-bottom-right ring-1 ring-cyber-border">
          
          {/* Header */}
          <div className="bg-cyber-cardHighlight/50 p-4 border-b border-cyber-border flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 flex items-center justify-center text-cyber-primary shadow-glow">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-cyber-text-main font-bold font-display text-sm">Sentinel AI</h3>
                <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
                <button 
                  onClick={clearChat}
                  title="Clear Chat"
                  className="text-cyber-text-secondary hover:text-rose-400 p-2 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-cyber-text-secondary hover:text-cyber-text-main hover:rotate-90 transition-all p-2 rounded-lg"
                >
                  <X size={18} />
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-cyber-bg/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 border ${
                  msg.role === 'user' 
                    ? 'bg-cyber-primary border-cyber-primary text-white' 
                    : 'bg-cyber-card border-cyber-border text-cyber-primary'
                }`}>
                  {msg.role === 'user' ? <User size={12} /> : <Shield size={12} />}
                </div>
                
                <div className={`p-3 rounded-xl text-xs md:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyber-primary text-white font-medium shadow-lg shadow-indigo-500/20 rounded-tr-sm'
                    : 'bg-cyber-card text-cyber-text-main border border-cyber-border rounded-tl-sm shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%]">
                 <div className="w-6 h-6 rounded-full bg-cyber-card border border-cyber-border flex items-center justify-center shrink-0 mt-1 text-cyber-primary">
                    <Bot size={12} />
                 </div>
                 <div className="bg-cyber-card p-3 rounded-xl border border-cyber-border rounded-tl-sm flex items-center gap-2 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-cyber-primary rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-cyber-card border-t border-cyber-border">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a security question..."
                className="w-full bg-cyber-bg border border-cyber-border rounded-lg pl-4 pr-12 py-3 text-sm text-cyber-text-main placeholder-cyber-text-muted focus:outline-none focus:border-cyber-primary focus:bg-cyber-bg transition-all font-sans"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyber-primary text-white rounded-md hover:bg-cyber-primaryEnd disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'bg-cyber-card text-slate-400 rotate-90 scale-90 border border-cyber-border' : 'bg-cyber-primary text-white hover:scale-110 hover:shadow-glow shadow-indigo-900/50'}`}
      >
        {isOpen ? (
            <X size={24} />
        ) : (
            <>
              <MessageSquare size={24} fill="currentColor" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-cyber-bg animate-pulse"></div>
            </>
        )}
      </button>
    </div>
  );
};
