import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map clicks and drop the pin
function LocationPicker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(prev => ({ ...prev, lat: e.latlng.lat, lng: e.latlng.lng }));
    },
  });
  return location.lat ? <Marker position={[location.lat, location.lng]} /> : null;
}

export default function ReportCase() {
  const [location, setLocation] = useState({ lat: null, lng: null, isManual: false });
  const [manualAddress, setManualAddress] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false); 
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleLocationLock = () => {
    setError('');
    setIsLocating(true);
    setLocation(prev => ({ ...prev, isManual: false }));

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isManual: false
        });
        setIsLocating(false);
        setError('');
      },
      (err) => {
        console.error("Location error:", err);
        setError('Failed to auto-detect location. Please use PIN & DESCRIBE.');
        setIsLocating(false);
        setLocation(prev => ({ ...prev, isManual: true }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
      
      // Trigger GPS lock automatically upon photo selection
      handleLocationLock();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImageFile) return setError('Please select an image of the emergency.');
    if (!location.lat && !manualAddress) return setError('Please provide a location.');

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      
      formData.append('location', JSON.stringify({
        lat: location.lat,
        lng: location.lng,
        address: manualAddress,
        isManual: location.isManual
      }));
      formData.append('description', issueDescription);
      formData.append('image', selectedImageFile); 

      const response = await fetch('https://anirescue-api.onrender.com/api/cases/report', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('anirescue_token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Rescue case submitted successfully!');
        navigate('/map');
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCSS = "w-full px-4 py-3 rounded-xl bg-[#e2e8f0] dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 outline-none transition-all duration-300 shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] focus:ring-2 focus:ring-rose-500/50";

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 transition-colors duration-300">
      <div className="w-full max-w-md p-8 rounded-[2rem] bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[10px_10px_20px_#cbd5e1,_-10px_-10px_20px_#f8fafc] dark:shadow-[10px_10px_20px_#070a13,_-10px_-10px_20px_#172441] transition-all duration-300">
        
        <h2 className="text-2xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-6">
          🚨 Emergency Report
        </h2>

        {error && (
          <div className="p-3 mb-6 text-sm font-bold text-center text-rose-500 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-full h-48 rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] hover:opacity-90 active:scale-95"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 font-bold">
                  <span className="text-4xl block mb-2">📸</span>
                  Tap to capture or upload
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 ml-1 uppercase tracking-wider">
              Location Mode
            </label>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={handleLocationLock} 
                className={`flex-1 py-3 rounded-xl text-sm font-bold shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ${!location.isManual ? 'bg-[#1a1f2e] dark:bg-black text-white' : 'bg-[#e2e8f0] dark:bg-[#0f172a] text-gray-500'}`}
              >
                LIVE GPS
              </button>
              <button 
                type="button" 
                onClick={() => setLocation(prev => ({ ...prev, isManual: true }))} 
                className={`flex-1 py-3 rounded-xl text-sm font-bold hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ${location.isManual ? 'bg-[#1a1f2e] dark:bg-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)]' : 'bg-[#e2e8f0] dark:bg-[#0f172a] text-gray-500 shadow-[6px_6px_12px_#cbd5e1,_-6px_-6px_12px_#f8fafc] dark:shadow-[6px_6px_12px_#070a13,_-6px_-6px_12px_#172441]'}`}
              >
                PIN & DESCRIBE
              </button>
            </div>

            {location.isManual ? (
              <div className="mt-4 space-y-4">
                {/* INTERACTIVE MAP BLOCK */}
                <div className="h-48 w-full rounded-xl overflow-hidden shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] z-0">
                  <MapContainer 
                    center={location.lat ? [location.lat, location.lng] : [19.0760, 72.8777]} 
                    zoom={12} 
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker location={location} setLocation={setLocation} />
                  </MapContainer>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-bold uppercase tracking-wider">
                  Tap map to drop pin
                </p>
                <input 
                  type="text" 
                  placeholder="E.g., Near City Mall, Main Gate" 
                  value={manualAddress} 
                  onChange={(e) => setManualAddress(e.target.value)} 
                  className={inputCSS}
                />
              </div>
            ) : (
              <div className="mt-4 px-4 py-3 rounded-xl bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] text-sm font-bold text-center">
                {isLocating ? (
                  <span className="text-amber-500 animate-pulse">Acquiring GPS Signal...</span>
                ) : location.lat ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Locked: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                ) : (
                  <span className="text-gray-500">Upload photo to auto-detect location...</span>
                )}
              </div>
            )}
          </div>

          <div>
            <textarea 
              placeholder="Describe the animal, injury, and severity..." 
              value={issueDescription} 
              onChange={(e) => setIssueDescription(e.target.value)} 
              className={`${inputCSS} h-24 resize-none`}
            ></textarea>
          </div>

          <button type="submit" disabled={isSubmitting || isLocating} className="w-full relative group block select-none focus:outline-none">
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-5 bg-rose-500 blur-lg rounded-full opacity-60 transition-all duration-300 ${isSubmitting || isLocating ? 'opacity-0' : 'group-hover:bg-rose-400 group-hover:h-6 group-hover:opacity-100 group-active:h-2 group-active:blur-md group-active:bg-rose-700 group-active:opacity-50'}`}></div>
            <div className={`relative z-10 w-full bg-[#1a1f2e] dark:bg-black text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 border-t border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex justify-center items-center gap-2 ${isSubmitting || isLocating ? 'opacity-50 cursor-not-allowed shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] scale-[0.97]' : 'group-hover:-translate-y-1 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-active:translate-y-1 group-active:scale-[0.97] group-active:shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)]'}`}>
              {isSubmitting ? 'Processing...' : isLocating ? 'Locating...' : 'Transmit Rescue Alert'}
            </div>
          </button>
          
        </form>
      </div>
    </div>
  );
}