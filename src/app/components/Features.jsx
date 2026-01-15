import { Camera, Video, Layers, Clock, Zap, Download } from 'lucide-react';

const features = [
  { icon: Camera, title: 'Full Page Screenshots', description: 'Capture entire web pages including content below the fold.', color: 'hsl(187_92%_55%)' },
  { icon: Video, title: 'Screen Recording', description: 'Record smooth animations at 30 or 60 FPS.', color: 'hsl(280_70%_60%)' },
  { icon: Layers, title: 'Multi-Page Capture', description: 'Automatically capture all pages in one session.', color: 'hsl(187_92%_55%)' },
  { icon: Clock, title: 'Smart Waiting', description: 'Intelligent wait for lazy-loaded content.', color: 'hsl(280_70%_60%)' },
  { icon: Zap, title: 'Lightning Fast', description: 'Optimized rendering without sacrificing quality.', color: 'hsl(187_92%_55%)' },
  { icon: Download, title: 'Easy Export', description: 'Download as PNG or WebM with one click.', color: 'hsl(280_70%_60%)' },
];

export default function Features() {
  return (
    <section id="features" className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
        <p className="text-lg text-[hsl(215_20%_55%)] max-w-2xl mx-auto">
          Powerful features to capture any website exactly as you see it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="glass-card rounded-xl p-6 hover:border-[hsl(187_92%_55%/0.5)] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-[hsl(222_47%_14%)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-[hsl(215_20%_55%)]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
