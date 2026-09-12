import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import ResolveCase from '../components/ResolveCase'; // NEW: Import the evidence form

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [isAvailable, setIsAvailable] = useState(true);
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); 
  
  // NEW: State to control the Resolution Modal
  const [resolvingCaseId, setResolvingCaseId] = useState(null);
  
  const { user } = useAuth();

  // Abstracted fetch function so we can refresh the list after submitting evidence
  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('anirescue_token');
      // Using your explicit Render URL to match your PUT request
      const response = await fetch('https://anirescue-api.onrender.com/api/cases', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCases(data);
      }
    } catch (error) {
      console.error("Failed to load volunteer cases", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleUpdateStatus = async (caseId, newStatus) => {
    setProcessingId(caseId); 
    
    try {
      const token = localStorage.getItem('anirescue_token');
      const response = await fetch(`https://anirescue-api.onrender.com/api/cases/${caseId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setCases(cases.map(c => c.id === caseId ? { ...c, status: newStatus, assigned_volunteer_id: user.id } : c));
        
        if (newStatus === 'Active') setActiveTab('active');
        if (newStatus === 'Resolved') setActiveTab('resolved');
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating case:", error);
    } finally {
      setProcessingId(null); 
    }
  };

  const displayedCases = cases.filter(c => {
    if (activeTab === 'pending') return c.status === 'Unassigned' || c.status === 'Pending';
    if (activeTab === 'active') return c.status === 'Active';
    return c.status === 'Resolved';
  });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto mb-20 md:mb-0 transition-colors duration-300">
      
      {/* --- NEW: Resolution Modal Overlay --- */}
      {resolvingCaseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md animate-fade-in-up">
            <button 
              onClick={() => setResolvingCaseId(null)}
              className="absolute -top-12 right-0 text-gray-300 hover:text-white font-bold text-lg"
            >
              ✕ Close
            </button>
            <ResolveCase 
              caseId={resolvingCaseId} 
              onResolutionSuccess={() => {
                setResolvingCaseId(null);
                fetchCases(); // Refresh database
                setActiveTab('resolved'); // Move them to the success tab
              }} 
            />
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Volunteer Dispatch</h2>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Manage your active rescue operations.</p>
      </div>

      <div className="rounded-[2rem] p-6 md:p-8 transition-colors duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[10px_10px_20px_#cbd5e1,_-10px_-10px_20px_#f8fafc] dark:shadow-[10px_10px_20px_#070a13,_-10px_-10px_20px_#172441]">
        
        <div className="flex p-1.5 rounded-xl mb-8 transition-colors duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441]">
          {['pending', 'active', 'resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-lg text-xs md:text-sm font-bold capitalize transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-[#1a1f2e] dark:bg-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)]' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl mb-8 transition-colors duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441]">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Available for Dispatch</span>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${isAvailable ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-600'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${isAvailable ? 'translate-x-7' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-4 ml-2">Alert Queue</h3>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="p-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400 rounded-2xl bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc]">
                Syncing Network...
              </div>
            ) : displayedCases.length === 0 ? (
              <div className="p-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400 rounded-2xl bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441]">
                No {activeTab} cases currently in the database.
              </div>
            ) : (
              displayedCases.map((caseItem) => (
                <div key={caseItem.id} className="p-5 rounded-2xl transition-all duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[6px_6px_12px_#cbd5e1,_-6px_-6px_12px_#f8fafc] dark:shadow-[6px_6px_12px_#070a13,_-6px_-6px_12px_#172441]">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{caseItem.species || 'Unknown'}</h4>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400">CASE-{caseItem.id} • {caseItem.priority} Priority</p>
                    </div>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#f8fafc] dark:shadow-[inset_2px_2px_4px_#070a13,inset_-2px_-2px_4px_#172441]">
                      {caseItem.priority === 'High' ? '🚨' : '⚠️'}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4 bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-gray-300/50 dark:border-white/5">
                    {caseItem.issue_description}
                  </p>
                  
                  <div className="flex gap-3">
                    
                    {activeTab === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(caseItem.id, 'Active')}
                        disabled={processingId === caseItem.id}
                        className="flex-1 py-3 rounded-xl text-sm font-bold bg-[#1a1f2e] dark:bg-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {processingId === caseItem.id ? 'Processing...' : 'Accept Case'}
                      </button>
                    )}

                    {activeTab === 'active' && (
                      caseItem.assigned_volunteer_id === user?.id ? (
                        <button 
                          // NEW: Open the modal instead of bypassing the evidence protocol
                          onClick={() => setResolvingCaseId(caseItem.id)}
                          className="flex-1 py-3 rounded-xl text-sm font-bold bg-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all"
                        >
                          Verify Resolution
                        </button>
                      ) : (
                        <div className="flex-1 py-3 rounded-xl text-sm font-bold text-center bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] text-gray-400 dark:text-gray-500">
                          🔒 Claimed by another volunteer
                        </div>
                      )
                    )}

                    {activeTab === 'resolved' && (
                      <div className="flex-1 py-3 rounded-xl text-sm font-bold text-center bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] text-gray-400 dark:text-gray-500">
                        Rescue Completed ✅
                      </div>
                    )}

                  </div>
                  
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
} 