import { Monitor, Sparkles, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative text-center mb-16">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, hsl(187 92% 55% / 0.15) 0%, transparent 70%)' }}
      />
      
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(222_47%_14%/0.8)] border border-[hsl(222_47%_18%)] mb-8 backdrop-blur-sm">
        <Sparkles className="w-4 h-4 text-[hsl(187_92%_55%)]" />
        <span className="text-sm font-medium text-[hsl(215_20%_55%)]">High-fidelity web capture</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
        <span>Capture Any</span>
        <br />
        <span className="gradient-text">Website Perfectly</span>
      </h1>

      <p className="text-lg md:text-xl text-[hsl(215_20%_55%)] max-w-2xl mx-auto mb-12">
        Screenshots and screen recordings with pixel-perfect accuracy. 
        Capture animations, lazy-loaded content, and multi-page sites effortlessly.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {[
          { icon: Monitor, text: 'Full Page Capture', color: 'hsl(187_92%_55%)' },
          { icon: Zap, text: '60 FPS Recording', color: 'hsl(280_70%_60%)' },
          { icon: Sparkles, text: 'Animation Support', color: 'hsl(187_92%_55%)' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(222_47%_14%/0.5)] border border-[hsl(222_47%_18%/0.5)]">
            <item.icon className="w-4 h-4" style={{ color: item.color }} />
            <span className="text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
