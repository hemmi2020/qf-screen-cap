import Header from './components/Header';
import Hero from './components/Hero';
import RecorderTool from './components/RecorderTool';
import Features from './components/Features';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Hero />
          <section id="tool" className="mb-24">
            <RecorderTool />
          </section>
          <Features />
        </div>
      </main>

      <footer className="border-t border-[hsl(222_47%_30%/0.6)] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[hsl(215_20%_70%)]">© 2026 ScreenCap</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-[hsl(215_20%_70%)] hover:text-white">Privacy</a>
            <a href="#" className="text-sm text-[hsl(215_20%_70%)] hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
