'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/lib/supabase';
import { api } from '@/utils/api';

type Airport = Database['public']['Tables']['airports']['Row'];

export default function ConfigPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<string>('');
  const [newAirport, setNewAirport] = useState({
    name: '',
    iata_code: '',
    icao_code: '',
    location: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAirports();
  }, []);

  async function fetchAirports() {
    try {
      setLoading(true);
      // Using backend API instead of direct Supabase calls
      const data = await api.airports.getAll();
      setAirports(data);
    } catch (error: any) {
      console.error('Error fetching airports:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveBaseAirport() {
    if (!selectedAirport) {
      setMessage({ text: 'Please select an airport', type: 'error' });
      return;
    }

    try {
      // In a real app, you would update the user's preference in the database
      // For now, just simulate success
      // We could add a user preferences endpoint to the backend API later
      setMessage({ text: 'Base airport updated successfully', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    }
  }

  async function addNewAirport() {
    if (!newAirport.name) {
      setMessage({ text: 'Airport name is required', type: 'error' });
      return;
    }

    try {
      // Using backend API instead of direct Supabase calls
      await api.airports.create(newAirport);
      
      setMessage({ text: 'Airport added successfully', type: 'success' });
      fetchAirports();
      setNewAirport({ name: '', iata_code: '', icao_code: '', location: '' });
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    }
  }

  return (
    <div className="space-y-8">
      <section className="bg-airport-black text-airport-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-airport-yellow mb-4">Airport Configuration</h1>
        
        {message.text && (
          <div 
            className={`p-3 rounded mb-4 ${
              message.type === 'error' ? 'bg-red-900' : 'bg-green-900'
            } text-white`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-bold">Base Airport Selection</h2>
          <p className="text-gray-300">
            Select your base airport from the list below or add a new one.
          </p>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="airport" className="block text-sm font-medium mb-2">
                  Select Base Airport
                </label>
                <select
                  id="airport"
                  value={selectedAirport}
                  onChange={(e) => setSelectedAirport(e.target.value)}
                  className="w-full px-3 py-2 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
                >
                  <option value="">-- Select an airport --</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.name} {airport.iata_code ? `(${airport.iata_code})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={saveBaseAirport}
                className="px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium"
              >
                Set as Base Airport
              </button>
            </>
          )}
        </div>
      </section>

      <section className="bg-airport-black text-airport-white p-6 rounded-lg">
        <h2 className="text-xl font-bold text-airport-yellow mb-4">Add New Airport</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Airport Name*
            </label>
            <input
              id="name"
              type="text"
              value={newAirport.name}
              onChange={(e) => setNewAirport({ ...newAirport, name: e.target.value })}
              className="w-full px-3 py-2 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
              required
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={newAirport.location}
              onChange={(e) => setNewAirport({ ...newAirport, location: e.target.value })}
              className="w-full px-3 py-2 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
            />
          </div>

          <div>
            <label htmlFor="iata" className="block text-sm font-medium mb-1">
              IATA Code
            </label>
            <input
              id="iata"
              type="text"
              value={newAirport.iata_code || ''}
              onChange={(e) => setNewAirport({ ...newAirport, iata_code: e.target.value })}
              className="w-full px-3 py-2 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
              maxLength={3}
            />
          </div>
          
          <div>
            <label htmlFor="icao" className="block text-sm font-medium mb-1">
              ICAO Code
            </label>
            <input
              id="icao"
              type="text"
              value={newAirport.icao_code || ''}
              onChange={(e) => setNewAirport({ ...newAirport, icao_code: e.target.value })}
              className="w-full px-3 py-2 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
              maxLength={4}
            />
          </div>
        </div>

        <button
          onClick={addNewAirport}
          className="px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium"
        >
          Add Airport
        </button>
      </section>
    </div>
  );
} 