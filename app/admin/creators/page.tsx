'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000';

interface Creator {
  id: number;
  name: string;
  profile_urls: string[];
  emails: string[];
  platforms: string[];
  twitter_id?: string;
  twitter_username?: string;
  is_active: boolean;
  onboarding_stage?: string;
  contract_signed: boolean;
  payment_setup_completed: boolean;
  client_statuses: Record<string, any>;
}

interface Client {
  id: number;
  email: string;
  plan: string;
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [filters, setFilters] = useState({
    is_active: null as boolean | null,
    onboarding_stage: null as string | null,
    contract_signed: null as boolean | null,
    payment_setup_completed: null as boolean | null,
    client_id: null as number | null,
    client_status: null as string | null,
  });
  const [search, setSearch] = useState('');
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [addClientMode, setAddClientMode] = useState(false);
  const [newClientId, setNewClientId] = useState<number | null>(null);
  const [newClientStatus, setNewClientStatus] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetchCreators(search);
    fetchClients();
  }, [filters]);

  // Real-time search effect
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setLoading(true);
      fetchCreators(search);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, filters]);

  const fetchCreators = async (searchQuery?: string) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      if (searchQuery !== undefined && searchQuery.trim() !== '') {
        queryParams.append('search', searchQuery.trim());
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/creators?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch creators');
      const data = await response.json();
      setCreators(data);
    } catch (error) {
      toast.error('Failed to load creators');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      toast.error('Failed to load clients');
      console.error(error);
    }
  };

  const updateCreatorStatus = async (creatorId: number, isActive: boolean, notes?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/creators/${creatorId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ is_active: isActive, status_notes: notes }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      toast.success('Status updated successfully');
      fetchCreators();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const updateClientStatus = async (creatorId: number, clientId: number, status: string, notes?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/creators/${creatorId}/client-status/${clientId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status, notes }),
      });
      if (!response.ok) throw new Error('Failed to update client status');
      toast.success('Client status updated successfully');
      fetchCreators();
    } catch (error) {
      toast.error('Failed to update client status');
      console.error(error);
    }
  };

  const updateOnboarding = async (creatorId: number, stage: string, contractSigned?: boolean, paymentSetupCompleted?: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/creators/${creatorId}/onboarding`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          stage,
          contract_signed: contractSigned,
          payment_setup_completed: paymentSetupCompleted,
        }),
      });
      if (!response.ok) throw new Error('Failed to update onboarding');
      toast.success('Onboarding status updated successfully');
      fetchCreators();
    } catch (error) {
      toast.error('Failed to update onboarding');
      console.error(error);
    }
  };

  // Filter creators by client if client_id is set
  const filteredCreators = filters.client_id
    ? creators.filter(c => c.client_statuses && c.client_statuses[filters.client_id!])
    : creators;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Creator Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setFilters({
                is_active: null,
                onboarding_stage: null,
                contract_signed: null,
                payment_setup_completed: null,
                client_id: null,
                client_status: null,
              });
              setSearch('');
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search creators by name or email..."
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
              value={filters.is_active === null ? '' : filters.is_active.toString()}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value === '' ? null : e.target.value === 'true' })}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Onboarding Stage</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
              value={filters.onboarding_stage || ''}
              onChange={(e) => setFilters({ ...filters, onboarding_stage: e.target.value || null })}
            >
              <option value="">All Stages</option>
              <option value="initial">Initial</option>
              <option value="contacted">Contacted</option>
              <option value="negotiating">Negotiating</option>
              <option value="contract_sent">Contract Sent</option>
              <option value="contract_signed">Contract Signed</option>
              <option value="payment_setup">Payment Setup</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
              value={filters.client_id?.toString() || ''}
              onChange={(e) => setFilters({ ...filters, client_id: e.target.value ? parseInt(e.target.value) : null })}
            >
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Creators List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onboarding</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCreators.map((creator) => (
                <tr key={creator.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{creator.name}</div>
                    <div className="text-sm text-gray-500">{creator.emails[0]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => updateCreatorStatus(creator.id, !creator.is_active)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        creator.is_active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors duration-200`}
                    >
                      {creator.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{creator.onboarding_stage || 'Not Started'}</div>
                    <div className="text-sm text-gray-500 space-x-2">
                      <span className={creator.contract_signed ? 'text-green-600' : 'text-red-600'}>
                        {creator.contract_signed ? '✓ Contract Signed' : '✗ Contract Pending'}
                      </span>
                      <span className={creator.payment_setup_completed ? 'text-green-600' : 'text-red-600'}>
                        {creator.payment_setup_completed ? '✓ Payment Setup' : '✗ Payment Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedCreator(creator)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => router.push(`/admin/creators/${creator.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedCreator && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Edit Creator: {selectedCreator.name}
              </h3>
              
              {/* Onboarding Stage */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Onboarding Stage</label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 max-h-48 overflow-y-auto border"
                  value={selectedCreator.onboarding_stage || ''}
                  onChange={(e) => updateOnboarding(selectedCreator.id, e.target.value)}
                >
                  <option value="initial">Initial</option>
                  <option value="contacted">Contacted</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="contract_sent">Contract Sent</option>
                  <option value="contract_signed">Contract Signed</option>
                  <option value="payment_setup">Payment Setup</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Contract Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Status</label>
                <div className="mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      checked={selectedCreator.contract_signed}
                      onChange={(e) => updateOnboarding(
                        selectedCreator.id,
                        selectedCreator.onboarding_stage || 'initial',
                        e.target.checked,
                        selectedCreator.payment_setup_completed
                      )}
                    />
                    <span className="ml-2 text-sm text-gray-700">Contract Signed</span>
                  </label>
                </div>
              </div>

              {/* Payment Setup */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Setup</label>
                <div className="mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      checked={selectedCreator.payment_setup_completed}
                      onChange={(e) => updateOnboarding(
                        selectedCreator.id,
                        selectedCreator.onboarding_stage || 'initial',
                        selectedCreator.contract_signed,
                        e.target.checked
                      )}
                    />
                    <span className="ml-2 text-sm text-gray-700">Payment Setup Completed</span>
                  </label>
                </div>
              </div>

              {/* Client Statuses */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Statuses</label>
                {Object.keys(selectedCreator.client_statuses || {}).length === 0 ? (
                  <div className="text-gray-500 text-sm">No client onboardings yet.</div>
                ) : (
                  clients.filter(client => selectedCreator.client_statuses[client.id]).map((client) => (
                    <div key={client.id} className="mt-2">
                      <label className="block text-sm text-gray-600 mb-1">{client.email}</label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
                        value={selectedCreator.client_statuses[client.id]?.status || ''}
                        onChange={(e) => updateClientStatus(selectedCreator.id, client.id, e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="onboarding">Onboarding</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  ))
                )}
                {/* Add Client Onboarding UI */}
                <div className="mt-4">
                  {!addClientMode ? (
                    <button
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                      onClick={() => setAddClientMode(true)}
                    >
                      Add Client Onboarding
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
                        value={newClientId || ''}
                        onChange={e => setNewClientId(Number(e.target.value))}
                      >
                        <option value="">Select Client</option>
                        {clients.filter(client => !selectedCreator.client_statuses[client.id]).map(client => (
                          <option key={client.id} value={client.id}>{client.email}</option>
                        ))}
                      </select>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
                        value={newClientStatus}
                        onChange={e => setNewClientStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="onboarding">Onboarding</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          disabled={!newClientId || !newClientStatus}
                          onClick={async () => {
                            if (newClientId && newClientStatus) {
                              await updateClientStatus(selectedCreator.id, newClientId, newClientStatus);
                              setAddClientMode(false);
                              setNewClientId(null);
                              setNewClientStatus('');
                            }
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                          onClick={() => {
                            setAddClientMode(false);
                            setNewClientId(null);
                            setNewClientStatus('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedCreator(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 