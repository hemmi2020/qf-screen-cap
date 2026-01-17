import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[hsl(222_47%_18%/0.9)] border-b border-[hsl(222_47%_30%/0.6)] h-[72px]">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/QFN-final-logo-black-line.-Edit.svg" alt="QF Logo" width={56} height={56} className="rounded-xl" />
          <span className="text-2xl mb-2 font-extrabold tracking-tight bg-gradient-to-r from-white via-[hsl(187_92%_65%)] to-[hsl(280_70%_70%)] bg-clip-text text-transparent">QF ScreenCap</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors">Features</a>
        </nav>

        <Link href="/login" className="btn-gradient px-4 py-2 rounded-lg text-sm font-medium">
          Get Started
        </Link>
      </div>
    </header>
  );
}
