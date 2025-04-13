import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-airport-black text-airport-white p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to <span className="text-airport-yellow">Capa</span>City
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-airport-gray p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-3 text-airport-yellow">Airport Configuration</h2>
          <p className="mb-4">Configure your airport, add stands, and manage facilities.</p>
          <a href="/config" className="inline-block px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium">
            Configure
          </a>
        </div>
        
        <div className="bg-airport-gray p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-3 text-airport-yellow">Stand Management</h2>
          <p className="mb-4">View and manage airport stands and their status.</p>
          <a href="/stands" className="inline-block px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium">
            Manage Stands
          </a>
        </div>
        
        <div className="bg-airport-gray p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-3 text-airport-yellow">Maintenance Planning</h2>
          <p className="mb-4">Schedule and track maintenance activities for your airport facilities.</p>
          <a href="/maintenance" className="inline-block px-4 py-2 bg-airport-yellow text-airport-black rounded font-medium">
            Plan Maintenance
          </a>
        </div>
      </div>
      
      <div className="mt-12 bg-airport-gray p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-airport-yellow">Airport Capacity Dashboard</h2>
        <p className="mb-4">
          This dashboard will show capacity statistics in future releases. The MVP focuses on airport configuration and stand management.
        </p>
      </div>
    </div>
  );
}
