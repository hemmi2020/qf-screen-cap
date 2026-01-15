import { Video } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[hsl(222_47%_6%/0.8)] border-b border-[hsl(222_47%_18%/0.5)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(187_92%_55%)] to-[hsl(280_70%_60%)] flex items-center justify-center">
            <Video className="w-5 h-5 text-[hsl(222_47%_6%)]" />
          </div>
          <span className="text-xl font-bold">QF ScreenCap</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-[hsl(215_20%_55%)] hover:text-white transition-colors">Features</a>
          <a href="#tool" className="text-sm text-[hsl(215_20%_55%)] hover:text-white transition-colors">Try It</a>
          <a href="#docs" className="text-sm text-[hsl(215_20%_55%)] hover:text-white transition-colors">Docs</a>
        </nav>

        <button className="btn-gradient px-4 py-2 rounded-lg text-sm font-medium">
          Get Started
        </button>
      </div>
    </header>
  );
}
