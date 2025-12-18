import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Wifi, Zap, Cpu, Laptop, Signal } from 'lucide-react';

export const LiveMonitor: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPing, setCurrentPing] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);
  const [connectionType, setConnectionType] = useState<string>('Unknown');
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  // 1. REAL FPS Counter
  useEffect(() => {
    let animationFrameId: number;

    const countFPS = () => {
      const now = performance.now();
      frameCount.current++;
      
      if (now - lastTime.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = now;
      }
      animationFrameId = requestAnimationFrame(countFPS);
    };

    animationFrameId = requestAnimationFrame(countFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 2. REAL Network Latency & Data Stream
  useEffect(() => {
    // Get initial connection info if available
    if ((navigator as any).connection) {
      setConnectionType((navigator as any).connection.effectiveType || '4g');
    }

    const measureLatency = async () => {
      const start = performance.now();
      try {
        await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' });
      } catch (e) {
        // Ignore CORS errors
      }
      const end = performance.now();
      return Math.round(end - start);
    };

    const interval = setInterval(async () => {
      const latency = await measureLatency();
      setCurrentPing(latency);

      setData(current => {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        const newPoint = {
          time: timeStr,
          latency: latency,
          fps: frameCount.current, 
          stability: Math.max(0, 100 - (latency / 5)), 
        };
        
        const newData = [...current, newPoint];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPingColor = (ms: number) => {
    if (ms < 50) return 'text-emerald-400';
    if (ms < 150) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up space-y-8 pb-20">
      
      {/* Header */}
      <div className="cyber-card p-8 flex flex-col md:flex-row justify-between items-end gap-6 bg-cyber-card">
        <div>
           <h2 className="text-3xl font-display font-bold text-cyber-text-main mb-2 flex items-center gap-3">
             <Activity className="text-cyber-primary" />
             Live Telemetry
           </h2>
           <p className="text-cyber-text-secondary max-w-2xl">
             Real-time monitoring of client-side performance and connectivity stability.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Real Latency */}
        <div className="cyber-card p-6 flex flex-col justify-between group border-l-4 border-l-transparent hover:border-l-cyber-primary transition-all bg-cyber-card">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyber-text-muted text-xs uppercase font-bold tracking-widest">Latency</h3>
              <Wifi size={16} className="text-cyber-primary"/>
           </div>
           <div className={`text-4xl font-mono font-bold ${getPingColor(currentPing)}`}>
              {currentPing} <span className="text-sm text-cyber-text-muted font-sans opacity-50">ms</span>
           </div>
           <div className="text-[10px] text-cyber-text-muted mt-2 font-mono">
             RTT to Edge
           </div>
        </div>

        {/* Real FPS */}
        <div className="cyber-card p-6 flex flex-col justify-between group border-l-4 border-l-transparent hover:border-l-cyber-primary transition-all bg-cyber-card">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyber-text-muted text-xs uppercase font-bold tracking-widest">Frame Rate</h3>
              <Zap size={16} className="text-amber-400"/>
           </div>
           <div className="text-4xl font-mono font-bold text-cyber-text-main">
              {fps} <span className="text-sm text-cyber-text-muted font-sans opacity-50">FPS</span>
           </div>
           <div className="text-[10px] text-cyber-text-muted mt-2 font-mono">
             WebGL Engine
           </div>
        </div>

        {/* Real Connection Type */}
        <div className="cyber-card p-6 flex flex-col justify-between group border-l-4 border-l-transparent hover:border-l-cyber-primary transition-all bg-cyber-card">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyber-text-muted text-xs uppercase font-bold tracking-widest">Network</h3>
              <Signal size={16} className="text-emerald-500"/>
           </div>
           <div className="text-4xl font-mono font-bold text-emerald-500 uppercase">
              {connectionType.toUpperCase()}
           </div>
           <div className="text-[10px] text-cyber-text-muted mt-2 font-mono">
             Effective Type
           </div>
        </div>

         {/* Device Info */}
         <div className="cyber-card p-6 flex flex-col justify-between group border-l-4 border-l-transparent hover:border-l-cyber-primary transition-all bg-cyber-card">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyber-text-muted text-xs uppercase font-bold tracking-widest">Client</h3>
              <Cpu size={16} className="text-blue-500"/>
           </div>
           <div className="text-xl font-mono font-bold text-cyber-text-main truncate">
              {navigator.platform.toUpperCase()}
           </div>
           <div className="text-[10px] text-cyber-text-muted mt-2 font-mono truncate">
             {navigator.userAgent.slice(0, 20)}...
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-Time Latency Chart */}
        <div className="lg:col-span-2 cyber-card p-8 bg-cyber-card">
           <h3 className="text-cyber-text-main font-bold mb-6 flex items-center gap-2 font-display text-sm uppercase tracking-wider">
              <Activity size={16} className="text-cyber-primary"/> Connection Stability
           </h3>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#F8FAFC', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#818CF8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorLat)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* System Info Panel */}
        <div className="cyber-card p-8 bg-cyber-cardHighlight">
            <h3 className="text-cyber-text-main font-bold mb-6 flex items-center gap-2 font-display text-sm uppercase tracking-wider">
              <Laptop size={16} className="text-cyber-primary"/> Diagnostics
           </h3>
           <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-cyber-text-muted text-xs font-bold uppercase">Threads</span>
                    <span className="text-cyber-text-main font-mono text-sm">{navigator.hardwareConcurrency || 4} Cores</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-full"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-cyber-text-muted text-xs font-bold uppercase">Memory</span>
                    {/* @ts-ignore */}
                    <span className="text-cyber-text-main font-mono text-sm">{navigator.deviceMemory ? `>= ${navigator.deviceMemory} GB` : 'N/A'}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-3/4"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-cyber-text-muted text-xs font-bold uppercase">Resolution</span>
                    <span className="text-cyber-text-main font-mono text-sm">{window.screen.width}x{window.screen.height}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-full"></div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-cyber-bg rounded-xl border border-cyber-border shadow-inner">
                <p className="text-[10px] text-cyber-text-muted leading-relaxed">
                   METRICS ARE LOCAL. This dashboard visualizes your specific browser session performance and network round-trip time (RTT).
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};