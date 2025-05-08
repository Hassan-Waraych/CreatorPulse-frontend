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
              <h1 className="text-2xl font-bold mb-4">Outreach for {activeClient.email}</h1>

              {errCreators && <p className="text-red-500 mb-4">Error loading creators.</p>}
              {!creators ? (
                <p>Loading creators…</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {creators.map(c => {
                    const already = contactedSet.has(c.id)
                    return (
                      <div
                        key={c.id}
                        className="bg-black/20 rounded-lg border border-white/10 overflow-hidden hover:border-[#ff4d8d]/50 transition-all"
                      >
                        <div className="h-24 bg-gradient-to-r from-[#ff4d8d]/10 to-[#ff1a6c]/10" />
                        <div className="p-5 pt-0">
                          <div className="flex items-center -mt-8 mb-3">
                            <div className="h-16 w-16 rounded-full bg-[#ff4d8d]/10 border-4 border-black/20 flex items-center justify-center text-xl font-bold">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold mb-1">{c.name}</h3>
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
    </div>
  )
}
