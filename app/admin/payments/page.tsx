"use client"

import React, { useState, useEffect } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Zap,
  Users,
  CreditCard,
  X,
  LayoutGrid,
  Mail,
  Search,
  Filter,
  ChevronDown,
  Check,
  X as XIcon,
} from "lucide-react"

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE = rawBase.replace(/\/+$/, "")

interface Creator {
  id: number
  name: string
  email: string
  is_active: boolean
  status_notes: string | null
  status_updated_at: string
  onboarding_completed_at: string | null
  onboarding_stage: string | null
  contract_signed: boolean
  payment_setup_completed: boolean
  client_statuses: Record<string, {
    status: string
    since: string
    notes: string | null
  }>
}

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No token found")
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to load")
  return res.json()
}

export default function PaymentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [onboardingFilter, setOnboardingFilter] = useState<string | null>(null)
  const [clientFilter, setClientFilter] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Fetch creators with status info
  const { data: creators, error, mutate } = useSWR<Creator[]>(
    `${API_BASE}/admin/creators`,
    fetcher
  )

  // Fetch clients for filter
  const { data: clients } = useSWR<{ id: number; email: string }[]>(
    `${API_BASE}/admin/clients`,
    fetcher
  )

  const filteredCreators = creators?.filter(creator => {
    const matchesSearch = searchQuery === "" || 
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !statusFilter || 
      (statusFilter === "active" && creator.is_active) ||
      (statusFilter === "inactive" && !creator.is_active)
    
    const matchesOnboarding = !onboardingFilter || 
      creator.onboarding_stage === onboardingFilter
    
    const matchesClient = !clientFilter || 
      Object.keys(creator.client_statuses).includes(clientFilter)

    return matchesSearch && matchesStatus && matchesOnboarding && matchesClient
  })

  const updateCreatorStatus = async (creatorId: number, isActive: boolean, notes?: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/creators/${creatorId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ is_active: isActive, notes }),
      })

      if (!response.ok) throw new Error("Failed to update status")
      
      // Refresh the data
      mutate()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    }
  }

  const updateOnboarding = async (creatorId: number, stage: string, contractSigned?: boolean, paymentSetupCompleted?: boolean) => {
    try {
      const response = await fetch(`${API_BASE}/admin/creators/${creatorId}/onboarding`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          stage,
          contract_signed: contractSigned,
          payment_setup_completed: paymentSetupCompleted,
        }),
      })

      if (!response.ok) throw new Error("Failed to update onboarding")
      
      // Refresh the data
      mutate()
    } catch (error) {
      console.error("Error updating onboarding:", error)
      alert("Failed to update onboarding")
    }
  }

  const updateClientStatus = async (creatorId: number, clientId: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/creators/${creatorId}/client-status/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status, notes }),
      })

      if (!response.ok) throw new Error("Failed to update client status")
      
      // Refresh the data
      mutate()
    } catch (error) {
      console.error("Error updating client status:", error)
      alert("Failed to update client status")
    }
  }

  if (error) return <div className="p-4 text-red-500">Error loading creators.</div>
  if (!creators) return <div className="p-4">Loading creators...</div>

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-black/20 border-r border-white/10 py-6 px-4 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Zap className="h-8 w-8 text-[#ff4d8d] drop-shadow-[0_0_20px_rgba(255,77,141,0.7)]" />
            <span className="text-lg font-semibold">CreatorPulse</span>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-[#ff4d8d]/10 transition"
            >
              <LayoutGrid className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => router.push("/admin/inbox")}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-[#ff4d8d]/10 transition"
            >
              <Mail className="h-4 w-4" />
              Inbox
            </button>
            <button
              onClick={() => router.push("/admin/payments")}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded bg-[#ff4d8d]/10 transition"
            >
              <CreditCard className="h-4 w-4" />
              Payments
            </button>
            <button
              onClick={() => router.push("/admin/twitter")}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-[#ff4d8d]/10 transition"
            >
              <X className="h-4 w-4" />
              Twitter
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Creator Status & Onboarding</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded hover:bg-black/30 transition"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search creators by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                <select
                  value={statusFilter || ""}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Onboarding Stage</label>
                <select
                  value={onboardingFilter || ""}
                  onChange={(e) => setOnboardingFilter(e.target.value || null)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                >
                  <option value="">All Stages</option>
                  <option value="initial">Initial Contact</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="contract_sent">Contract Sent</option>
                  <option value="contract_signed">Contract Signed</option>
                  <option value="payment_setup">Payment Setup</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Client</label>
                <select
                  value={clientFilter || ""}
                  onChange={(e) => setClientFilter(e.target.value || null)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                >
                  <option value="">All Clients</option>
                  {clients?.map(client => (
                    <option key={client.id} value={client.id.toString()}>
                      {client.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Creators Table */}
          <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Onboarding</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Client Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreators?.map(creator => (
                  <tr key={creator.id} className="border-b border-white/10 last:border-0">
                    <td className="px-6 py-4">{creator.name}</td>
                    <td className="px-6 py-4">{creator.email}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateCreatorStatus(creator.id, !creator.is_active)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          creator.is_active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {creator.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{creator.onboarding_stage || "Not Started"}</span>
                        {creator.contract_signed && (
                          <Check className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(creator.client_statuses).map(([clientId, status]) => (
                          <span
                            key={clientId}
                            className="px-2 py-1 bg-black/20 rounded text-xs"
                          >
                            {status.status}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedCreator(creator)
                          setIsEditModalOpen(true)
                        }}
                        className="text-[#ff4d8d] hover:text-[#ff1a6c] text-sm font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedCreator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">Edit Creator Status</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Section */}
              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateCreatorStatus(selectedCreator.id, true)}
                    className={`px-4 py-2 rounded ${
                      selectedCreator.is_active
                        ? "bg-green-500 text-white"
                        : "bg-black/20 text-white/70 hover:text-white"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => updateCreatorStatus(selectedCreator.id, false)}
                    className={`px-4 py-2 rounded ${
                      !selectedCreator.is_active
                        ? "bg-red-500 text-white"
                        : "bg-black/20 text-white/70 hover:text-white"
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              {/* Onboarding Section */}
              <div>
                <h3 className="text-sm font-medium mb-2">Onboarding Stage</h3>
                <select
                  value={selectedCreator.onboarding_stage || ""}
                  onChange={(e) => updateOnboarding(selectedCreator.id, e.target.value)}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                >
                  <option value="">Select Stage</option>
                  <option value="initial">Initial Contact</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="contract_sent">Contract Sent</option>
                  <option value="contract_signed">Contract Signed</option>
                  <option value="payment_setup">Payment Setup</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Contract & Payment Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCreator.contract_signed}
                      onChange={(e) => updateOnboarding(
                        selectedCreator.id,
                        selectedCreator.onboarding_stage || "",
                        e.target.checked
                      )}
                      className="w-4 h-4 rounded border-white/10 bg-black/20"
                    />
                    Contract Signed
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCreator.payment_setup_completed}
                      onChange={(e) => updateOnboarding(
                        selectedCreator.id,
                        selectedCreator.onboarding_stage || "",
                        undefined,
                        e.target.checked
                      )}
                      className="w-4 h-4 rounded border-white/10 bg-black/20"
                    />
                    Payment Setup Completed
                  </label>
                </div>
              </div>

              {/* Client Status Section */}
              <div>
                <h3 className="text-sm font-medium mb-2">Client Status</h3>
                <div className="space-y-4">
                  {clients?.map(client => {
                    const status = selectedCreator.client_statuses[client.id.toString()]
                    return (
                      <div key={client.id} className="flex items-center gap-4">
                        <span className="text-sm text-white/70 w-48 truncate">
                          {client.email}
                        </span>
                        <select
                          value={status?.status || ""}
                          onChange={(e) => updateClientStatus(
                            selectedCreator.id,
                            client.id.toString(),
                            e.target.value
                          )}
                          className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4d8d]"
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 