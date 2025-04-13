'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/lib/supabase';
import { api } from '@/utils/api';

type Stand = Database['public']['Tables']['stands']['Row'];
type Airport = Database['public']['Tables']['airports']['Row'];

export default function StandsPage() {
  const [stands, setStands] = useState<Stand[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isAddingStand, setIsAddingStand] = useState(false);
  const [isEditingStand, setIsEditingStand] = useState<Stand | null>(null);
  const [newStand, setNewStand] = useState({
    name: '',
    airport_id: '',
    status: 'active' as 'active' | 'maintenance' | 'inactive',
  });

  useEffect(() => {
    fetchAirports();
  }, []);

  useEffect(() => {
    if (selectedAirport) {
      fetchStands(selectedAirport);
    }
  }, [selectedAirport]);

  async function fetchAirports() {
    try {
      setLoading(true);
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
      setLoading(true);
      const data = await api.stands.getAll(airportId);
      setStands(data);
    } catch (error: any) {
      console.error('Error fetching stands:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveStand() {
    try {
      if (!newStand.name) {
        setMessage({ text: 'Stand name is required', type: 'error' });
        return;
      }

      const standData = {
        ...newStand,
        airport_id: selectedAirport,
      };

      await api.stands.create(standData);

      setMessage({ text: 'Stand added successfully', type: 'success' });
      fetchStands(selectedAirport);
      setNewStand({
        name: '',
        airport_id: '',
        status: 'active',
      });
      setIsAddingStand(false);
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    }
  }

  async function updateStand() {
    if (!isEditingStand) return;
    
    try {
      await api.stands.update(isEditingStand.id, {
        name: newStand.name,
        status: newStand.status,
      });

      setMessage({ text: 'Stand updated successfully', type: 'success' });
      fetchStands(selectedAirport);
      setNewStand({
        name: '',
        airport_id: '',
        status: 'active',
      });
      setIsEditingStand(null);
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    }
  }

  function startEditing(stand: Stand) {
    setIsEditingStand(stand);
    setNewStand({
      name: stand.name,
      airport_id: stand.airport_id,
      status: stand.status,
    });
  }

  function cancelEdit() {
    setIsEditingStand(null);
    setNewStand({
      name: '',
      airport_id: '',
      status: 'active',
    });
  }

  function getStatusClass(status: string) {
    switch (status) {
      case 'active':
        return 'bg-green-700';
      case 'maintenance':
        return 'bg-amber-600';
      case 'inactive':
        return 'bg-red-700';
      default:
        return 'bg-gray-600';
    }
  }

  return (
    <div className="space-y-8">
      <section className="bg-airport-black text-airport-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-airport-yellow mb-4">Stand Management</h1>
        
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
          <h2 className="text-xl font-bold">Stands</h2>
          <button
            onClick={() => setIsAddingStand(true)}
            className="px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium"
          >
            Add New Stand
          </button>
        </div>

        {isAddingStand && (
          <div className="bg-airport-gray p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-airport-yellow mb-3">Add New Stand</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="stand-name" className="block text-sm font-medium mb-1">
                  Stand Name*
                </label>
                <input
                  id="stand-name"
                  type="text"
                  value={newStand.name}
                  onChange={(e) => setNewStand({ ...newStand, name: e.target.value })}
                  className="w-full px-3 py-2 bg-black text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="stand-status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="stand-status"
                  value={newStand.status}
                  onChange={(e) => setNewStand({ 
                    ...newStand, 
                    status: e.target.value as 'active' | 'maintenance' | 'inactive' 
                  })}
                  className="w-full px-3 py-2 bg-black text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingStand(false)}
                className="px-4 py-2 bg-airport-gray text-airport-white border border-airport-white rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveStand}
                className="px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {isEditingStand && (
          <div className="bg-airport-gray p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-airport-yellow mb-3">Edit Stand: {isEditingStand.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="edit-stand-name" className="block text-sm font-medium mb-1">
                  Stand Name*
                </label>
                <input
                  id="edit-stand-name"
                  type="text"
                  value={newStand.name}
                  onChange={(e) => setNewStand({ ...newStand, name: e.target.value })}
                  className="w-full px-3 py-2 bg-black text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-stand-status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="edit-stand-status"
                  value={newStand.status}
                  onChange={(e) => setNewStand({ 
                    ...newStand, 
                    status: e.target.value as 'active' | 'maintenance' | 'inactive' 
                  })}
                  className="w-full px-3 py-2 bg-black text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-airport-gray text-airport-white border border-airport-white rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={updateStand}
                className="px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium"
              >
                Update
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : stands.length === 0 ? (
          <div className="bg-airport-gray p-4 rounded text-center">
            No stands found for this airport. Create one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-airport-gray">
              <thead className="bg-airport-gray">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-airport-yellow uppercase tracking-wider">
                    Stand ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-airport-yellow uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-airport-yellow uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-airport-yellow uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-airport-gray">
                {stands.map((stand) => (
                  <tr key={stand.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-airport-white">
                      {stand.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-airport-white">
                      {stand.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${getStatusClass(stand.status)} px-2 py-1 rounded text-white text-xs`}>
                        {stand.status.charAt(0).toUpperCase() + stand.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-airport-white">
                      <button
                        onClick={() => startEditing(stand)}
                        className="text-airport-yellow hover:text-airport-white mr-4"
                      >
                        Edit
                      </button>
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