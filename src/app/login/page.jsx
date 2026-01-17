"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { LogIn, Mail, Lock, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(187_92%_55%/0.1)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(280_70%_60%/0.1)] rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <Image src="/QFN-final-logo-black-line.-Edit.svg" alt="QF Logo" width={48} height={48} className="rounded-xl" />
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[hsl(187_92%_65%)] to-[hsl(280_70%_70%)] bg-clip-text text-transparent">QF ScreenCap</span>
          </Link>
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-[hsl(215_20%_70%)]">Sign in to your account</p>
        </div>
        
        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[hsl(0_84%_60%/0.1)] border border-[hsl(0_84%_60%/0.3)] text-[hsl(0_84%_60%)] p-4 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="flex items-center text-sm font-medium mb-3">
                <Mail className="w-4 h-4 mr-2 text-[hsl(187_92%_55%)]" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-[hsl(222_47%_22%)] border border-[hsl(222_47%_32%)] rounded-xl text-white placeholder-[hsl(215_20%_55%)] input-glow"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium mb-3">
                <Lock className="w-4 h-4 mr-2 text-[hsl(187_92%_55%)]" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-[hsl(222_47%_22%)] border border-[hsl(222_47%_32%)] rounded-xl text-white placeholder-[hsl(215_20%_55%)] input-glow"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[hsl(215_20%_70%)] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[hsl(187_92%_55%)] hover:text-[hsl(187_92%_65%)] font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}