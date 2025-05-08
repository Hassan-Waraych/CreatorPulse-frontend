"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Zap,
  Users,
  CreditCard,
} from "lucide-react"

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE = rawBase.replace(/\/+$/, "")

interface Client {
  id: number
  email: string
}
interface AdminCreator {
  id: number
  name: string
  profile_urls: string[]
  emails: string[]
  platforms: string[]
}
interface OutreachLog {
  creator_id: number
  contacted_at: string
  status: string
  reply?: string
}
interface Template {
  id: string
  name: string
  subject: string
  body: string
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem("jwt")!
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to load")
  return res.json()
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<AdminCreator | null>(null)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [previewSubject, setPreviewSubject] = useState("")
  const [previewBody, setPreviewBody] = useState("")
  const [originalTemplate, setOriginalTemplate] = useState<Template | null>(null)
  const [selectedCreators, setSelectedCreators] = useState<Set<number>>(new Set())
  const [massEmailModalOpen, setMassEmailModalOpen] = useState(false)
  const [isSendingMassEmail, setIsSendingMassEmail] = useState(false)

  // fetch clients
  const { data: clients, error: errClients } = useSWR<Client[]>(
    `${API_BASE}/admin/clients`,
    fetcher
  )
  // fetch creators for selected client
  const { data: creators, error: errCreators } = useSWR<AdminCreator[]>(
    activeClient ? `${API_BASE}/admin/clients/${activeClient.id}/creators` : null,
    fetcher
  )
  // fetch logs (only this client's outreach)
  const { data: logs = [] } = useSWR<OutreachLog[]>(
    activeClient ? `${API_BASE}/admin/logs?client_id=${activeClient.id}` : null,
    fetcher
  )
  // fetch available templates with full content
  const { data: templates = {}, error: errTemplates } = useSWR<Record<string, Template>>(
    `${API_BASE}/admin/templates`,
    fetcher
  )

  // build a quick lookup of already-contacted creator_ids
  const contactedSet = new Set(logs.map(l => l.creator_id))

  // open the modal to send a new email
  const openContact = (c: AdminCreator) => {
    setSelected(c)
    setSubject("")
    setBody("")
    setSelectedTemplate(null)
    setPreviewSubject("")
    setPreviewBody("")
    setOriginalTemplate(null)
    setModalOpen(true)
  }

  // Update preview when template is selected
  const handleTemplateSelect = (templateId: string | null) => {
    setSelectedTemplate(templateId)
    if (templateId && templates[templateId]) {
      const template = templates[templateId]
      setOriginalTemplate(template)
      // Replace ${creator_name} with actual name
      setPreviewSubject(template.subject)
      setPreviewBody(template.body.replace(/\${creator_name}/g, selected?.name || ""))
      setSubject(template.subject)
      setBody(template.body)
    } else {
      setSubject("")
      setBody("")
      setPreviewSubject("")
      setPreviewBody("")
      setOriginalTemplate(null)
    }
  }

  // Update preview when subject/body changes
  const handleContentChange = (field: "subject" | "body", value: string) => {
    if (field === "subject") {
      setSubject(value)
      setPreviewSubject(value)
    } else {
      setBody(value)
      setPreviewBody(value.replace(/\${creator_name}/g, selected?.name || ""))
    }
  }

  // send via singular endpoint
  async function sendEmail() {
    if (!selected || !activeClient) return
    setLoadingId(selected.id)

    const payload = {
      client_id: activeClient.id,
      creator_id: selected.id,
      template_id: selectedTemplate,
      subject: selectedTemplate ? undefined : subject,
      body: selectedTemplate ? undefined : body,
    }
    await fetch(`${API_BASE}/admin/outreach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(payload),
    })

    setLoadingId(null)
    setModalOpen(false)
  }

  // Toggle creator selection for mass email
  const toggleCreatorSelection = (creatorId: number) => {
    const newSelected = new Set(selectedCreators)
    if (newSelected.has(creatorId)) {
      newSelected.delete(creatorId)
    } else {
      newSelected.add(creatorId)
    }
    setSelectedCreators(newSelected)
  }

  // Send mass email
  async function sendMassEmail() {
    if (!activeClient || selectedCreators.size === 0) return
    setIsSendingMassEmail(true)

    const payload = {
      client_id: activeClient.id,
      creator_ids: Array.from(selectedCreators),
      template_id: selectedTemplate,
      subject: selectedTemplate ? undefined : subject,
      body: selectedTemplate ? undefined : body,
    }

    try {
      await fetch(`${API_BASE}/admin/mass-outreach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify(payload),
      })
      setMassEmailModalOpen(false)
      setSelectedCreators(new Set())
      setSubject("")
      setBody("")
      setSelectedTemplate(null)
    } catch (error) {
      console.error("Failed to send mass email:", error)
    } finally {
      setIsSendingMassEmail(false)
    }
  }

  if (errClients) return <div className="p-4 text-red-500">Error loading clients.</div>
  if (!clients) return <div className="p-4">Loading clients…</div>

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white">
      {/* Top Nav */}
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-[#ff4d8d] drop-shadow-[0_0_20px_rgba(255,77,141,0.7)]" />
          <span className="text-lg font-semibold">Admin Dashboard</span>
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
        <aside className="w-64 bg-black/20 border-r border-white/10 py-6 px-4 space-y-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveClient(null)}
              className="block w-full text-left px-3 py-2 rounded hover:bg-[#ff4d8d]/10 transition"
            >
              Home
            </button>
            <p className="px-3 text-sm font-medium text-white/70">Clients</p>
            {clients.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveClient(c)}
                className={`flex items-center w-full text-left px-3 py-2 rounded transition ${
                  c.id === activeClient?.id
                    ? "bg-[#ff4d8d] text-black"
                    : "hover:bg-[#ff4d8d]/10"
                }`}
              >
                <Users className="h-4 w-4 mr-2" /> {c.email}
              </button>
            ))}
            <button
              onClick={() => router.push("/admin/payments")}
              className="block w-full text-left px-3 py-2 rounded hover:bg-[#ff4d8d]/10 transition"
            >
              <CreditCard className="h-4 w-4 mr-2" /> Payments
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 container mx-auto">
          {!activeClient ? (
            <p className="text-white/70">Select a client from the sidebar to view their outreach.</p>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Creators for {activeClient.email}</h1>
                {selectedCreators.size > 0 && (
                  <button
                    onClick={() => setMassEmailModalOpen(true)}
                    className="bg-[#ff4d8d] text-black px-4 py-2 rounded hover:bg-[#ff4d8d]/90 transition"
                  >
                    Send Mass Email ({selectedCreators.size} selected)
                  </button>
                )}
              </div>

              {errCreators && <p className="text-red-500 mb-4">Error loading creators.</p>}
              {!creators ? (
                <p>Loading creators…</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {creators.map(c => {
                    const already = contactedSet.has(c.id)
                    return (
                      <div
                        key={c.id}
                        className={`bg-black/20 rounded-lg p-4 border ${
                          selectedCreators.has(c.id) ? "border-[#ff4d8d]" : "border-white/10"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{c.name}</h3>
                          <input
                            type="checkbox"
                            checked={selectedCreators.has(c.id)}
                            onChange={() => toggleCreatorSelection(c.id)}
                            className="w-5 h-5 rounded border-2 border-[#ff4d8d]/50 bg-transparent
                              checked:bg-[#ff4d8d] checked:border-[#ff4d8d]
                              focus:ring-2 focus:ring-[#ff4d8d] focus:ring-offset-2 focus:ring-offset-gray-900
                              cursor-pointer transition-all duration-200
                              hover:border-[#ff4d8d] hover:scale-110
                              checked:hover:scale-110"
                          />
                        </div>
                        <p className="text-sm text-white/70 mb-2">{c.emails[0] || "No email"}</p>
                        <p className="text-xs text-white/50 mb-4">{c.platforms.join(", ")}</p>
                        <div className="flex justify-between items-center">
                          <Link
                            href={`/admin/creators/${c.id}`}
                            prefetch={false}
                            className="text-[#ff4d8d] hover:text-[#ff1a6c] text-sm font-medium"
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={() => openContact(c)}
                            disabled={already || loadingId === c.id}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              already
                                ? "bg-gray-600 text-white/50 cursor-not-allowed"
                                : loadingId === c.id
                                ? "bg-[#ff4d8d]/50"
                                : "bg-[#ff4d8d] hover:bg-[#ff1a6c] text-white"
                            }`}
                          >
                            {already ? "Already contacted" : loadingId === c.id ? "Sending…" : "Contact"}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* Contact Modal */}
          {modalOpen && selected && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-black/30 backdrop-blur p-6 rounded-xl border border-white/10 w-full max-w-2xl">
                <h2 className="text-xl font-semibold text-white mb-4">Contact {selected.name}</h2>
                
                {/* Template Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Email Template
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                    value={selectedTemplate || ""}
                    onChange={(e) => handleTemplateSelect(e.target.value || null)}
                  >
                    <option value="">Custom Message</option>
                    {Object.entries(templates).map(([id, template]) => (
                      <option key={id} value={id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  {errTemplates && (
                    <p className="mt-2 text-sm text-red-500">Error loading templates</p>
                  )}
                </div>

                {/* Split view for template editing and preview */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Edit Section */}
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Edit</h3>
                    <input
                      className="w-full mb-3 px-3 py-2 bg-black/30 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                      placeholder="Subject"
                      value={subject}
                      onChange={e => handleContentChange("subject", e.target.value)}
                    />
                    <textarea
                      className="w-full mb-3 px-3 py-2 h-48 bg-black/30 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                      placeholder="Body"
                      value={body}
                      onChange={e => handleContentChange("body", e.target.value)}
                    />
                  </div>

                  {/* Preview Section */}
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Preview</h3>
                    <div className="bg-black/20 rounded p-4 mb-3">
                      <div className="text-sm font-medium text-white/90 mb-1">Subject:</div>
                      <div className="text-white/70">{previewSubject}</div>
                    </div>
                    <div className="bg-black/20 rounded p-4 h-48 overflow-y-auto whitespace-pre-wrap">
                      <div className="text-sm font-medium text-white/90 mb-1">Body:</div>
                      <div className="text-white/70">{previewBody}</div>
                    </div>
                  </div>
                </div>

                {/* Original Template Reference */}
                {originalTemplate && (
                  <div className="mt-4 p-3 bg-black/20 rounded border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white/70">Original Template</h3>
                      <button
                        onClick={() => handleTemplateSelect(selectedTemplate)}
                        className="text-xs text-[#ff4d8d] hover:text-[#ff1a6c]"
                      >
                        Reset to Original
                      </button>
                    </div>
                    <div className="text-xs text-white/50">
                      <div className="mb-1">Subject: {originalTemplate.subject}</div>
                      <div className="whitespace-pre-wrap">{originalTemplate.body}</div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-white/30 rounded text-white/70 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendEmail}
                    disabled={!subject || !body}
                    className={`px-4 py-2 rounded transition ${
                      !subject || !body
                        ? "bg-gray-600 text-white/50 cursor-not-allowed"
                        : "bg-[#ff4d8d] hover:bg-[#ff1a6c] text-white"
                    }`}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mass Email Modal */}
      {massEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Send Mass Email</h2>
            <p className="text-white/70 mb-4">
              Sending to {selectedCreators.size} creators
            </p>

            {/* Template Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email Template</label>
              <select
                value={selectedTemplate || ""}
                onChange={(e) => handleTemplateSelect(e.target.value || null)}
                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2"
              >
                <option value="">Write custom message</option>
                {Object.entries(templates).map(([id, template]) => (
                  <option key={id} value={id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Content */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => handleContentChange("subject", e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2"
                  placeholder="Email subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preview</label>
                <div className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 min-h-[38px]">
                  {previewSubject}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={body}
                  onChange={(e) => handleContentChange("body", e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 h-32"
                  placeholder="Email body"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preview</label>
                <div className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 h-32 overflow-auto">
                  {previewBody}
                </div>
              </div>
            </div>

            {/* Original Template Reference */}
            {originalTemplate && (
              <div className="mt-4 p-4 bg-black/20 rounded">
                <h3 className="text-sm font-medium mb-2">Original Template</h3>
                <p className="text-sm text-white/70 mb-1">
                  <strong>Subject:</strong> {originalTemplate.subject}
                </p>
                <p className="text-sm text-white/70">
                  <strong>Body:</strong> {originalTemplate.body}
                </p>
                <button
                  onClick={() => {
                    setSubject(originalTemplate.subject)
                    setBody(originalTemplate.body)
                    setPreviewSubject(originalTemplate.subject)
                    setPreviewBody(originalTemplate.body.replace(/\${creator_name}/g, "Creator"))
                  }}
                  className="mt-2 text-sm text-[#ff4d8d] hover:text-[#ff4d8d]/80"
                >
                  Reset to Original
                </button>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setMassEmailModalOpen(false)}
                className="px-4 py-2 rounded border border-white/10 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={sendMassEmail}
                disabled={isSendingMassEmail}
                className="bg-[#ff4d8d] text-black px-4 py-2 rounded hover:bg-[#ff4d8d]/90 transition disabled:opacity-50"
              >
                {isSendingMassEmail ? "Sending..." : "Send Mass Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mass Outreach Floating Button */}
      {selectedCreators.size > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setMassEmailModalOpen(true)}
            className="bg-gradient-to-r from-[#ff4d8d] to-[#ff1a6c] text-white px-6 py-3 rounded-full
              shadow-[0_0_20px_rgba(255,77,141,0.3)] flex items-center space-x-2 
              transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,77,141,0.5)]
              backdrop-blur-sm border border-white/10"
          >
            <span className="text-lg font-semibold">
              Send Mass Outreach ({selectedCreators.size})
            </span>
            <svg
              className="w-6 h-6 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
