import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NGODashboard() {
  const [recentCases, setRecentCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem('anirescue_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cases`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setRecentCases(data);
        }
      } catch (error) {
        console.error("Failed to load cases", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCases();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto mb-20 md:mb-0 transition-colors duration-300">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 transition-colors">NGO Command Center</h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Live Database Connection</p>
        </div>
      </div>

      <div className="rounded-[2rem] p-6 md:p-8 transition-colors duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[10px_10px_20px_#cbd5e1,_-10px_-10px_20px_#f8fafc] dark:shadow-[10px_10px_20px_#070a13,_-10px_-10px_20px_#172441]">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-gray-800 dark:text-gray-100 text-lg">Active Rescue Queue</h3>
          <Link to="/map" className="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline drop-shadow-sm">View Map Mode</Link>
        </div>

        <div className="rounded-2xl overflow-x-auto transition-colors duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] p-2">
          
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 font-bold">📡 Syncing with Neon Database...</div>
          ) : recentCases.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-bold">No active cases in the database.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-300/50 dark:border-white/5">
                  <th className="p-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Case ID</th>
                  <th className="p-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Animal & Issue</th>
                  <th className="p-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Location Details</th>
                  <th className="p-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b border-gray-300/30 dark:border-white/5 last:border-0 hover:bg-white/5 dark:hover:bg-black/10 transition-colors">
                    <td className="p-4 font-bold text-gray-800 dark:text-gray-200 text-sm">CASE-{caseItem.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{caseItem.species || 'Unknown'}</div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{caseItem.issue_description || 'No description provided'}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-600 dark:text-gray-300 text-sm">
                      {caseItem.manual_address ? caseItem.manual_address : 'GPS Coordinates Provided'}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        {caseItem.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}