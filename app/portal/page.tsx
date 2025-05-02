"use client"

import useSWR from "swr"
import { Search, Filter as FilterIcon, ChevronDown, ChevronRight } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface CreatorGroup {
  name: string
  profile_urls: string[]
  emails: string[]
  platforms: string[]
  niche?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ClientPortal() {
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

  // Helper to extract the first valid URL
  const sanitizeUrl = (raw: string): string | null => {
    const match = raw.match(/https?:\/\/[^)\]\s]+/i)
    if (!match) return null
    let url = match[0]
    // if URL has trailing punctuation, remove it
    url = url.replace(/[.,;!?)]+$/g, "")
    return url
  }

  // Build API query parameters
  const params = new URLSearchParams()
  if (hasEmail) params.append("has_email", "true")
  if (hasProfile) params.append("has_url", "true")

  const { data: creators, error } = useSWR<CreatorGroup[]>(
    '${API_BASE}/creators/?${params.toString()}',
    fetcher
  )

  if (error) return <div className="p-4 text-red-500">Failed to load creators.</div>
  if (!creators) return <div className="p-4">Loading…</div>

  // Client-side search filtering
  const filtered = creators.filter(c => {
    const lower = searchTerm.toLowerCase()
    return (
      c.name.toLowerCase().includes(lower) ||
      c.emails.some(e => e.toLowerCase().includes(lower))
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#8a0d23] to-[#14061e] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with search and filters */}
        <header className="flex flex-wrap items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 lg:mb-0">Creator Discovery</h1>
          <div className="flex items-center space-x-4">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search creators..."
                className="pl-10 pr-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c31432] w-64"
              />
            </div>
            {/* Filters dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 bg-[#c31432] px-4 py-2 rounded-md text-sm"
              >
                <FilterIcon className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4" />
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 bg-[#1d0910] border border-gray-800 rounded-md shadow-lg p-4 space-y-2 z-10">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={hasEmail}
                      onChange={() => setHasEmail(!hasEmail)}
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={hasProfile}
                      onChange={() => setHasProfile(!hasProfile)}
                    />
                    <span>Profile</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Creator List Container */}
        <div className="bg-black rounded-xl border border-gray-800 shadow-xl p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((creator, idx) => (
              <div key={idx} className="bg-[#1d0910] rounded-lg p-5">
                <h3 className="text-lg font-semibold mb-2">{creator.name}</h3>
                {creator.emails[0] && (
                  <p className="text-sm text-gray-400 mb-2">
                    Email: {creator.emails[0]}
                  </p>
                )}
                {creator.profile_urls[0] && (
                  <button
                    onClick={() => {
                      const url = sanitizeUrl(creator.profile_urls[0])
                      if (url) window.open(url, '_blank')
                    }}
                    className="text-sm text-[#e04c6c] hover:text-[#f06c8c] flex items-center gap-1 mb-2"
                  >
                    View Profile <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => creator.emails[0] && (window.location.href = `mailto:${creator.emails[0]}`)}
                  disabled={!creator.emails.length}
                  className="mt-3 px-3 py-1 bg-[#c31432]/20 disabled:opacity-50 rounded-md text-sm"
                >
                  Contact
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
