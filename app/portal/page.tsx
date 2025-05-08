"use client"

import useSWR from "swr"
import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Filter as FilterIcon,
  ChevronDown,
  ChevronRight,
  Zap,
  Users,
  MessageSquare,
  CreditCard,
} from "lucide-react"

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE = rawBase.replace(/\/+$/, "")

interface CreatorGroup {
  name: string
  profile_urls: string[]
  emails: string[]
  platforms: string[]
  niche?: string
}

export default function ClientPortal() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [hasEmail, setHasEmail] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilters(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const params = new URLSearchParams()
  if (hasEmail) params.append("has_email", "true")
  if (hasProfile) params.append("has_url", "true")

  const fetcher = async (url: string) => {
    const token = localStorage.getItem("jwt")
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
    if (!res.ok) {
      if (res.status === 401) {
        router.push("/login")
        return []
      }
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data as CreatorGroup[]
  }

  const { data: creators, error } = useSWR<CreatorGroup[]>(
    `${API_BASE}/creators/?${params.toString()}`,
    fetcher
  )

  if (error) return <div className="p-4 text-red-500">Failed to load creators.</div>
  if (!creators) return <div className="p-4">Loading…</div>

  const filtered = creators.filter(c => {
    const lower = searchTerm.toLowerCase()
    return (
      c.name.toLowerCase().includes(lower) ||
      c.emails.some(e => e.toLowerCase().includes(lower))
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-[#ff4d8d] drop-shadow-[0_0_20px_rgba(255,77,141,0.7)]" />
          <span className="font-semibold">Creator Pulse</span>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("jwt")
            router.push("/login")
          }}
          className="text-sm font-medium text-white/90 hover:text-white transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-[180px] bg-black/20 border-r border-white/10 py-6 px-3">
          <div className="flex items-center gap-2 px-3 mb-8">
            <div className="h-7 w-7 rounded-md bg-[#ff4d8d] flex items-center justify-center shadow-[0_0_20px_rgba(255,77,141,0.7)]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold">Client Portal</h1>
          </div>
          <nav className="space-y-1">
            <Link href="#" className="flex items-center gap-2 px-3 py-2 text-white/70 hover:bg-[#ff4d8d]/10 hover:text-white rounded-md transition-colors">
              <Users className="h-4 w-4" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 px-3 py-2 bg-[#ff4d8d]/10 text-white rounded-md transition-colors">
              <Users className="h-4 w-4" />
              <span className="text-sm">Creators</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 px-3 py-2 text-white/70 hover:bg-[#ff4d8d]/10 hover:text-white rounded-md transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">Messages</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 px-3 py-2 text-white/70 hover:bg-[#ff4d8d]/10 hover:text-white rounded-md transition-colors">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm">Billing</span>
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="ml-[180px] w-[calc(100%-180px)] p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Creator Discovery</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search creators..."
                  className="pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d8d] focus:border-transparent w-[300px]"
                />
              </div>
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 px-4 py-2 bg-[#ff4d8d] hover:bg-[#ff1a6c] rounded-md text-sm font-medium transition-colors"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filters
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 bg-black/20 border border-white/10 rounded-md shadow-lg p-4 space-y-2 z-10">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={hasEmail}
                        onChange={() => setHasEmail(!hasEmail)}
                        className="h-4 w-4 rounded border-white/10 bg-black/30 text-[#ff4d8d] focus:ring-[#ff4d8d]"
                      />
                      <span className="text-white/70 text-sm">Has Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={hasProfile}
                        onChange={() => setHasProfile(!hasProfile)}
                        className="h-4 w-4 rounded border-white/10 bg-black/30 text-[#ff4d8d] focus:ring-[#ff4d8d]"
                      />
                      <span className="text-white/70 text-sm">Has Profile</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl border border-white/10 shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((creator, idx) => (
                  <div key={idx} className="bg-black/20 rounded-lg border border-white/10 overflow-hidden hover:border-[#ff4d8d]/50 transition-all duration-200">
                    <div className="h-24 bg-gradient-to-r from-[#ff4d8d]/10 to-[#ff1a6c]/10"></div>
                    <div className="p-5 pt-0">
                      <div className="flex items-center -mt-8 mb-3">
                        <div className="h-16 w-16 rounded-full bg-[#ff4d8d]/10 border-4 border-black/20 flex items-center justify-center text-xl font-bold">
                          {creator.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{creator.name}</h3>
                      {creator.emails[0] && (
                        <p className="text-sm text-white/70 mb-4 line-clamp-2">Email: {creator.emails[0]}</p>
                      )}

                      <div className="flex items-center justify-between">
                        {creator.profile_urls[0] && (
                          <button
                            onClick={() => {
                              const url = creator.profile_urls[0].match(/https?:\/\/[^\s)]+/)?.[0]
                              if (url) window.open(url, "_blank")
                            }}
                            className="flex items-center gap-1 text-[#ff4d8d] hover:text-[#ff1a6c] text-sm font-medium"
                          >
                            View Profile <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            creator.emails[0] && (window.location.href = `mailTo:${creator.emails[0]}`)
                          }
                          disabled={!creator.emails.length}
                          className="px-3 py-1 bg-[#ff4d8d]/10 hover:bg-[#ff4d8d]/20 text-[#ff4d8d] rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
