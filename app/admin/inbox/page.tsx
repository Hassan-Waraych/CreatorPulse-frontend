"use client"

import React, { useState, useMemo } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Zap,
  Users,
  Mail,
  ChevronDown,
  LayoutGrid,
  CreditCard,
  X,
  Clock,
  User,
  Reply,
  Search,
  Filter,
  ArrowUpDown,
  Send,
  Loader2,
} from "lucide-react"

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE = rawBase.replace(/\/+$/, "")

interface Client {
  id: number
  email: string
}

interface Email {
  id: string
  subject: string
  date: string
  from: string
  to: string
  snippet: string
  body?: string
  creator_id?: number
  status?: string
  reply?: string
  reply_date?: string
  message_id?: string
}

type SortField = 'date' | 'subject' | 'status'
type SortOrder = 'asc' | 'desc'
type FilterStatus = 'all' | 'replied' | 'unreplied'

// Loading skeleton component
const EmailSkeleton = () => (
  <div className="p-4 rounded bg-black/20 border border-white/10 animate-pulse">
    <div className="flex items-start justify-between mb-2">
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-3 bg-white/10 rounded w-1/2"></div>
      </div>
      <div className="h-3 bg-white/10 rounded w-24"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-white/10 rounded w-full"></div>
      <div className="h-3 bg-white/10 rounded w-5/6"></div>
      <div className="h-3 bg-white/10 rounded w-4/6"></div>
    </div>
    <div className="mt-2">
      <div className="h-3 bg-white/10 rounded w-20"></div>
    </div>
  </div>
)

// Add this function after the interfaces
function cleanReplyContent(reply: string): string {
  // Split by the first occurrence of "On ... wrote:"
  const parts = reply.split(/On .* wrote:/);
  // Return only the first part (the actual reply)
  return parts[0].trim();
}

export default function InboxPage() {
  const router = useRouter()
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [replyText, setReplyText] = useState("")
  const [isSendingReply, setIsSendingReply] = useState(false)

  // Fetch clients
  const { data: clients = [] } = useSWR<Client[]>(
    `${API_BASE}/admin/clients`,
    async (url: string) => {
      const token = localStorage.getItem("jwt")
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch clients")
      return res.json()
    }
  )

  // Fetch emails for selected client
  const { data: emails = [], mutate: refreshEmails, isLoading } = useSWR<Email[]>(
    selectedClient ? `${API_BASE}/admin/clients/${selectedClient.id}/inbox` : null,
    async (url: string) => {
      const token = localStorage.getItem("jwt")
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch emails")
      const data = await res.json()
      
      // Deduplicate emails based on message_id
      const uniqueEmails = data.reduce((acc: Email[], email: Email) => {
        const existingEmail = acc.find(e => e.message_id === email.message_id)
        if (!existingEmail) {
          acc.push(email)
        }
        return acc
      }, [])

      return uniqueEmails
    }
  )

  // Filter and sort emails
  const filteredAndSortedEmails = useMemo(() => {
    let result = [...emails]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(email => 
        email.subject.toLowerCase().includes(query) ||
        email.to.toLowerCase().includes(query) ||
        (email.body || email.snippet).toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(email => 
        filterStatus === 'replied' ? email.status === 'replied' : email.status !== 'replied'
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'subject':
          comparison = a.subject.localeCompare(b.subject)
          break
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '')
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [emails, searchQuery, filterStatus, sortField, sortOrder])

  // Handle reply submission
  const handleReply = async () => {
    if (!selectedEmail || !replyText.trim()) return

    setIsSendingReply(true)
    try {
      const response = await fetch(`${API_BASE}/admin/outreach/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          email_id: selectedEmail.id,
          reply: replyText,
        }),
      })

      if (!response.ok) throw new Error('Failed to send reply')
      
      // Refresh emails to show the new reply
      await refreshEmails()
      setReplyText("")
      setShowEmailModal(false)
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Failed to send reply. Please try again.')
    } finally {
      setIsSendingReply(false)
    }
  }

  // Auto-refresh emails every minute
  React.useEffect(() => {
    if (selectedClient) {
      const interval = setInterval(() => {
        refreshEmails()
      }, 60000) // Refresh every minute
      return () => clearInterval(interval)
    }
  }, [selectedClient, refreshEmails])

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
    setShowEmailModal(true)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-black/20 border-r border-white/10 py-6 px-4">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="h-8 w-8 text-[#ff4d8d] drop-shadow-[0_0_20px_rgba(255,77,141,0.7)]" />
          <span className="text-lg font-semibold">CreatorPulse</span>
        </div>
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-[#ff4d8d]/10 transition">
            <LayoutGrid className="h-4 w-4" />
            Dashboard
          </Link>
          <button
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded bg-[#ff4d8d]/10 transition"
          >
            <Mail className="h-4 w-4" />
            Inbox
          </button>
          <Link href="/admin/payments" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-[#ff4d8d]/10 transition">
            <CreditCard className="h-4 w-4" />
            Payments
          </Link>
          <Link href="/admin/twitter" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-[#ff4d8d]/10 transition">
            <X className="h-4 w-4" />
            Twitter
          </Link>

          <div className="mt-8">
            <p className="px-3 text-sm font-medium text-white/70 mb-2">Clients</p>
            {clients.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedClient(c)
                  setShowClientDropdown(false)
                }}
                className={`flex items-center w-full text-left px-3 py-2 rounded transition gap-2 ${
                  c.id === selectedClient?.id
                    ? "bg-[#ff4d8d] text-black"
                    : "hover:bg-[#ff4d8d]/10"
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="truncate">{c.email}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="w-full px-8 py-4 flex items-center justify-between border-b border-white/10 bg-black/10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Inbox</h1>
            <div className="relative">
              <button
                onClick={() => setShowClientDropdown(!showClientDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded bg-black/20 hover:bg-black/30 transition"
              >
                <span>{selectedClient?.email || "Select Client"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showClientDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-black/90 border border-white/10 rounded shadow-lg z-50">
                  {clients.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedClient(c)
                        setShowClientDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#ff4d8d]/10 transition"
                    >
                      {c.email}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="p-4 border-b border-white/10 bg-black/10">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="px-3 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
              >
                <option value="all">All Emails</option>
                <option value="replied">Replied</option>
                <option value="unreplied">Unreplied</option>
              </select>
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortField(field as SortField)
                  setSortOrder(order as SortOrder)
                }}
                className="px-3 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="subject-asc">Subject A-Z</option>
                <option value="subject-desc">Subject Z-A</option>
                <option value="status-asc">Status A-Z</option>
                <option value="status-desc">Status Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 p-8">
          {!selectedClient ? (
            <div className="text-center text-white/60 mt-8">
              Select a client to view their emails
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <EmailSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSortedEmails.length === 0 ? (
            <div className="text-center text-white/60 mt-8">
              {searchQuery || filterStatus !== 'all' 
                ? "No emails match your filters"
                : "No emails found for this client"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedEmails.map(email => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className="p-4 rounded bg-black/20 border border-white/10 hover:border-[#ff4d8d]/50 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{email.subject}</h3>
                      <p className="text-sm text-white/60">
                        To: {email.to}
                      </p>
                    </div>
                    <div className="text-sm text-white/60 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {new Date(email.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-white/80">{email.snippet}</p>
                  {email.status && (
                    <div className="mt-2 text-sm flex items-center gap-2">
                      <span className="text-white/60">Status: </span>
                      <span className={email.status === "replied" ? "text-green-400" : "text-yellow-400"}>
                        {email.status}
                      </span>
                      {email.status === "replied" && <Reply className="h-4 w-4 text-green-400" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && selectedEmail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-black/90 border border-white/10 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-white/60" />
                  <span className="text-white/60">To:</span>
                  <span>{selectedEmail.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-white/60" />
                  <span className="text-white/60">Sent:</span>
                  <span>{new Date(selectedEmail.date).toLocaleString()}</span>
                </div>
                {selectedEmail.status && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">Status:</span>
                    <span className={selectedEmail.status === "replied" ? "text-green-400" : "text-yellow-400"}>
                      {selectedEmail.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert max-w-none">
                <div 
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedEmail.body 
                      ? selectedEmail.body.replace(/\n/g, '<br>')
                      : selectedEmail.snippet.replace(/\n/g, '<br>')
                  }} 
                />
              </div>
              {selectedEmail.reply && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Reply className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold">Previous Reply</h3>
                    {selectedEmail.reply_date && (
                      <span className="text-sm text-white/60">
                        ({new Date(selectedEmail.reply_date).toLocaleString()})
                      </span>
                    )}
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <div 
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: cleanReplyContent(selectedEmail.reply).replace(/\n/g, '<br>')
                      }} 
                    />
                  </div>
                </div>
              )}
              {/* Always show reply section */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Send Reply</h3>
                  {selectedEmail.status === 'replied' && (
                    <span className="text-sm text-white/60">Continuing conversation...</span>
                  )}
                </div>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full h-32 px-3 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim() || isSendingReply}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      !replyText.trim() || isSendingReply
                        ? "bg-gray-600 text-white/50 cursor-not-allowed"
                        : "bg-[#ff4d8d] hover:bg-[#ff1a6c] text-white"
                    }`}
                  >
                    {isSendingReply ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 