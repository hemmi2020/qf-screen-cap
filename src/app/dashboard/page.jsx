"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { LogOut, Camera } from "lucide-react"
import RecorderTool from "../components/RecorderTool"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[hsl(187_92%_55%/0.2)] border-t-[hsl(187_92%_55%)] animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[hsl(222_47%_18%/0.9)] border-b border-[hsl(222_47%_30%/0.6)] h-[72px]">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/QFN-final-logo-black-line.-Edit.svg" alt="QF Logo" width={56} height={56} className="rounded-xl" />
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[hsl(187_92%_65%)] to-[hsl(280_70%_70%)] bg-clip-text text-transparent">QF ScreenCap</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">{session.user?.name || 'User'}</p>
              <p className="text-xs text-[hsl(215_20%_70%)]">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(222_47%_22%)] border border-[hsl(222_47%_32%)] hover:border-[hsl(0_84%_60%)] text-[hsl(0_84%_60%)] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(222_47%_22%/0.8)] border border-[hsl(222_47%_32%)] mb-6 backdrop-blur-sm">
              <Camera className="w-4 h-4 text-[hsl(187_92%_55%)]" />
              <span className="text-sm font-medium text-[hsl(215_20%_70%)]">Welcome back, {session.user?.name || 'User'}!</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Capture Tool</span>
            </h1>
            <p className="text-lg text-[hsl(215_20%_70%)] max-w-2xl mx-auto">
              Take screenshots and record screen animations with ease
            </p>
          </div>

          {/* Recorder Tool */}
          <section id="tool">
            <RecorderTool />
          </section>
        </div>
      </main>

      {/* Footer */}
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
  )
}