'use client';

import { useState, useEffect } from 'react';
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
  status_notes?: string;
  status_updated_at?: string;
  onboarding_completed_at?: string;
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

export default function CreatorDetailPage({ params }: { params: { id: string } }) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusNotes, setStatusNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCreator();
    fetchClients();
  }, [params.id]);

  const fetchCreator = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/creators/${params.id}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch creator');
      const data = await response.json();
      setCreator(data);
      setStatusNotes(data.status_notes || '');
    } catch (error) {
      toast.error('Failed to load creator details');
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

  const updateCreatorStatus = async (isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/creators/${params.id}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ is_active: isActive, status_notes: statusNotes }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      toast.success('Status updated successfully');
      fetchCreator();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const updateClientStatus = async (clientId: number, status: string, notes?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/creators/${params.id}/client-status/${clientId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status, notes }),
      });
      if (!response.ok) throw new Error('Failed to update client status');
      toast.success('Client status updated successfully');
      fetchCreator();
    } catch (error) {
      toast.error('Failed to update client status');
      console.error(error);
    }
  };

  const updateOnboarding = async (stage: string, contractSigned?: boolean, paymentSetupCompleted?: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/creators/${params.id}/onboarding`, {
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
      fetchCreator();
    } catch (error) {
      toast.error('Failed to update onboarding');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Creator not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{creator.name}</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="mt-1 text-base text-gray-900 font-mono">{creator.emails && creator.emails.length > 0 ? creator.emails[0] : 'N/A'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
              <div className="mt-1 text-base text-gray-900 font-mono">{Array.isArray(creator.platforms) && creator.platforms.length > 0 ? creator.platforms.join(', ') : 'N/A'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile URLs</label>
              <div className="mt-1 text-base text-gray-900 font-mono">
                {Array.isArray(creator.profile_urls) && creator.profile_urls.length > 0 ? (
                  creator.profile_urls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 block underline"
                    >
                      {url}
                    </a>
                  ))
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Management */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Active Status</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="mt-2">
                <button
                  onClick={() => updateCreatorStatus(!creator.is_active)}
                  className={`px-4 py-2 rounded-md text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${
                    creator.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {creator.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Notes</label>
              <textarea
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white p-2"
                rows={3}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                onBlur={() => updateCreatorStatus(creator.is_active)}
              />
            </div>
          </div>
        </div>

        {/* Onboarding Status */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Onboarding Status</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white"
                value={creator.onboarding_stage || ''}
                onChange={(e) => updateOnboarding(e.target.value)}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Status</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    checked={creator.contract_signed}
                    onChange={(e) => updateOnboarding(
                      creator.onboarding_stage || 'initial',
                      e.target.checked,
                      creator.payment_setup_completed
                    )}
                  />
                  <span className="ml-2 text-gray-700">Contract Signed</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Setup</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    checked={creator.payment_setup_completed}
                    onChange={(e) => updateOnboarding(
                      creator.onboarding_stage || 'initial',
                      creator.contract_signed,
                      e.target.checked
                    )}
                  />
                  <span className="ml-2 text-gray-700">Payment Setup Completed</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Client Statuses */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Client Statuses</h2>
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{client.email}</label>
                <select
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 bg-white"
                  value={creator.client_statuses[client.id]?.status || ''}
                  onChange={(e) => updateClientStatus(client.id, e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 