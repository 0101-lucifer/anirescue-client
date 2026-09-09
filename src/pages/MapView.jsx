import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function MapView() {
  const [mapCases, setMapCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Center on Mumbai by default
  const defaultCenter = [19.0760, 72.8777];

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch('https://anirescue-api.onrender.com/api/cases/map');
        if (response.ok) {
          const data = await response.json();
          setMapCases(data);
        }
      } catch (error) {
        console.error("Failed to load map pins", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMapData();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto mb-20 md:mb-0 transition-colors duration-300">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[4px_4px_8px_#cbd5e1,_-4px_-4px_8px_#f8fafc] dark:shadow-[4px_4px_8px_#070a13,_-4px_-4px_8px_#172441]">
          🗺️
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Live Rescue Map</h2>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Real-time view of active emergency cases.</p>
        </div>
      </div>

      <div className="rounded-[2rem] p-4 md:p-6 transition-colors duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[10px_10px_20px_#cbd5e1,_-10px_-10px_20px_#f8fafc] dark:shadow-[10px_10px_20px_#070a13,_-10px_-10px_20px_#172441]">
        <div className="rounded-2xl overflow-hidden h-[60vh] md:h-[70vh] relative shadow-[inset_6px_6px_12px_#cbd5e1,inset_-6px_-6px_12px_#f8fafc] dark:shadow-[inset_6px_6px_12px_#070a13,inset_-6px_-6px_12px_#172441] border border-gray-300/50 dark:border-white/5 z-0">
          
          {isLoading ? (
            <div className="flex h-full items-center justify-center font-bold text-gray-500">Syncing Satellite Data...</div>
          ) : (
            <MapContainer center={defaultCenter} zoom={12} className="w-full h-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {mapCases.map((caseItem) => (
                <Marker 
                  key={caseItem.id} 
                  position={[parseFloat(caseItem.latitude), parseFloat(caseItem.longitude)]}
                >
                  <Popup className="rounded-xl overflow-hidden shadow-lg">
                    <div className="p-1 min-w-[150px]">
                      <h4 className="font-bold text-gray-800 text-sm mb-1">{caseItem.species || 'Unknown Animal'}</h4>
                      <p className="text-xs text-gray-600 mb-2">{caseItem.issue_description}</p>
                      <span className="inline-block px-2 py-1 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">
                        {caseItem.priority} Priority
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

        </div>
      </div>
    </div>
  );
}