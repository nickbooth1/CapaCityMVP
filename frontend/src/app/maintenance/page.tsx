'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { supabase } from '@/lib/supabase';

type MaintenanceRequest = Database['public']['Tables']['maintenance_requests']['Row'];
type Stand = Database['public']['Tables']['stands']['Row'];
type Airport = Database['public']['Tables']['airports']['Row'];

// Extended type that includes stand details
type MaintenanceRequestWithStand = MaintenanceRequest & {
  stands?: Stand;
};

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequestWithStand[]>([]);
  const [stands, setStands] = useState<Stand[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isAddingRequest, setIsAddingRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    stand_id: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planned' as 'planned' | 'in_progress' | 'completed' | 'cancelled',
  });
  const router = useRouter();

  useEffect(() => {
    fetchAirports();
  }, []);

  useEffect(() => {
    if (selectedAirport) {
      fetchStands(selectedAirport);
      fetchMaintenanceRequests(selectedAirport);
    }
  }, [selectedAirport]);

  async function fetchAirports() {
    try {
      setLoading(true);
      // Using backend API instead of direct Supabase calls
      const data = await api.airports.getAll();
      
      setAirports(data);
      if (data.length > 0 && !selectedAirport) {
        setSelectedAirport(data[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching airports:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStands(airportId: string) {
    try {
      // Using backend API instead of direct Supabase calls
      const data = await api.stands.getAll(airportId);
      setStands(data);
    } catch (error: any) {
      console.error('Error fetching stands:', error.message);
    }
  }

  async function fetchMaintenanceRequests(airportId: string) {
    try {
      setLoading(true);
      
      // Using backend API - we'll filter by airportId at the API level
      const data = await api.maintenance.getAll({ airportId });
      setRequests(data);
    } catch (error: any) {
      console.error('Error fetching maintenance requests:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveMaintenanceRequest() {
    try {
      if (!newRequest.stand_id || !newRequest.description || !newRequest.start_date || !newRequest.end_date) {
        setMessage({ text: 'All fields are required', type: 'error' });
        return;
      }

      // Validate end date is after start date
      if (new Date(newRequest.end_date) <= new Date(newRequest.start_date)) {
        setMessage({ text: 'End date must be after start date', type: 'error' });
        return;
      }

      // We still need to get the user from Supabase auth, as auth is still managed by Supabase directly
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push('/login');
        return;
      }

      // Using backend API instead of direct Supabase calls
      await api.maintenance.create({
        ...newRequest,
        created_by: userData.user.id,
      });

      setMessage({ text: 'Maintenance request created successfully', type: 'success' });
      fetchMaintenanceRequests(selectedAirport);
      fetchStands(selectedAirport);
      setNewRequest({
        stand_id: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'planned',
      });
      setIsAddingRequest(false);
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function getStatusClass(status: string) {
    switch (status) {
      case 'planned':
        return 'bg-blue-700';
      case 'in_progress':
        return 'bg-amber-600';
      case 'completed':
        return 'bg-green-700';
      case 'cancelled':
        return 'bg-red-700';
      default:
        return 'bg-gray-600';
    }
  }

  return (
    <div className="space-y-8">
      <section className="bg-airport-black text-airport-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-airport-yellow mb-4">Maintenance Planning</h1>
        
        {message.text && (
          <div 
            className={`p-3 rounded mb-4 ${
              message.type === 'error' ? 'bg-red-900' : 'bg-green-900'
            } text-white`}
          >
            {message.text}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="airport-select" className="block text-sm font-medium mb-2">
            Select Airport
          </label>
          <select
            id="airport-select"
            value={selectedAirport}
            onChange={(e) => setSelectedAirport(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
          >
            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.name} {airport.iata_code ? `(${airport.iata_code})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Maintenance Requests</h2>
          <button
            onClick={() => setIsAddingRequest(true)}
            className="px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium"
          >
            Create New Request
          </button>
        </div>

        {isAddingRequest && (
          <div className="bg-airport-gray p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-airport-yellow mb-3">New Maintenance Request</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="stand-select" className="block text-sm font-medium mb-1">
                  Select Stand*
                </label>
                <select
                  id="stand-select"
                  value={newRequest.stand_id}
                  onChange={(e) => setNewRequest({ ...newRequest, stand_id: e.target.value })}
                  className="w-full px-3 py-2 bg-black text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                  required
                >
                  <option value="">Select a stand</option>
                  {stands.map((stand) => (
                    <option key={stand.id} value={stand.id}>
                      {stand.name} ({stand.status})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="request-status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="request-status"
                  value={newRequest.status}
                  onChange={(e) => setNewRequest({ 
                    ...newRequest, 
                    status: e.target.value as 'planned' | 'in_progress' | 'completed' | 'cancelled' 
                  })}
                  className="w-full px-3 py-2 bg-black text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                >
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium mb-1">
                  Start Date*
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={newRequest.start_date}
                  onChange={(e) => setNewRequest({ ...newRequest, start_date: e.target.value })}
                  className="w-full px-3 py-2 bg-black text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium mb-1">
                  End Date*
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={newRequest.end_date}
                  onChange={(e) => setNewRequest({ ...newRequest, end_date: e.target.value })}
                  className="w-full px-3 py-2 bg-black text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-black text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingRequest(false)}
                className="px-4 py-2 bg-airport-gray text-airport-white border border-airport-white rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveMaintenanceRequest}
                className="px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium"
              >
                Save Request
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="bg-airport-gray p-4 rounded text-center">
            No maintenance requests found for this airport. Create one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-airport-gray">
              <thead className="bg-airport-gray">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-airport-yellow uppercase tracking-wider">
                    Stand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-airport-yellow uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-airport-yellow uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-airport-yellow uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-airport-gray">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-airport-white">
                      {request.stands?.name || request.stand_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-airport-white">
                      {formatDate(request.start_date)} - {formatDate(request.end_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-airport-white">
                      <div className="line-clamp-2">{request.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${getStatusClass(request.status)} px-2 py-1 rounded text-white text-xs`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
} 