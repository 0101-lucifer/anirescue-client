import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportCase() {
  // State Management
  const [location, setLocation] = useState({ lat: null, lng: null, isManual: false });
  const [manualAddress, setManualAddress] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  
  // File states (No more Base64!)
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleLocationLock = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            isManual: false
          });
          setError('');
        },
        () => {
          setError('Unable to retrieve your location automatically.');
        }
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      // Create a fast, local preview URL without converting to Base64
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImageFile) return setError('Please select an image of the emergency.');
    if (!location.lat && !manualAddress) return setError('Please provide a location.');

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Create the Multipart Form payload
      const formData = new FormData();
      
      // 2. Append text fields
      formData.append('location', JSON.stringify({
        lat: location.lat,
        lng: location.lng,
        address: manualAddress,
        isManual: location.isManual
      }));
      formData.append('description', issueDescription);
      
      // 3. Append the raw binary file directly
      formData.append('image', selectedImageFile); 

      // 4. Transmit payload
      const response = await fetch('https://anirescue-api.onrender.com/api/cases/report', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('anirescue_token')}`
          // Let the browser set the 'Content-Type' automatically for FormData!
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

  // Shared CSS for inputs
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
          
          {/* Image Upload Area */}
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
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
              />
            </div>
          </div>

          {/* Location Controls */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 ml-1 uppercase tracking-wider">
              Location Lock
            </label>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={handleLocationLock} 
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-[#1a1f2e] dark:bg-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                AUTO GPS
              </button>
              <button 
                type="button" 
                onClick={() => setLocation({ ...location, isManual: true })} 
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-[#e2e8f0] dark:bg-[#0f172a] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 shadow-[6px_6px_12px_#cbd5e1,_-6px_-6px_12px_#f8fafc] dark:shadow-[6px_6px_12px_#070a13,_-6px_-6px_12px_#172441] hover:-translate-y-0.5 active:scale-95 active:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:active:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] transition-all duration-200"
              >
                PIN & DESCRIBE
              </button>
            </div>

            {location.isManual && (
              <input 
                type="text" 
                placeholder="E.g., Near City Mall, Main Gate" 
                value={manualAddress} 
                onChange={(e) => setManualAddress(e.target.value)} 
                className={`mt-4 ${inputCSS}`}
              />
            )}

            {!location.isManual && location.lat && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] text-sm font-bold text-emerald-600 dark:text-emerald-400 text-center">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea 
              placeholder="Describe the animal, injury, and severity..." 
              value={issueDescription} 
              onChange={(e) => setIssueDescription(e.target.value)} 
              className={`${inputCSS} h-24 resize-none`}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full relative group block select-none focus:outline-none"
          >
            {/* Red LED Glow Base */}
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-5 bg-rose-500 blur-lg rounded-full opacity-60 transition-all duration-300 ${isSubmitting ? 'opacity-0' : 'group-hover:bg-rose-400 group-hover:h-6 group-hover:opacity-100 group-active:h-2 group-active:blur-md group-active:bg-rose-700 group-active:opacity-50'}`}></div>
            
            {/* Physical Button Level */}
            <div className={`relative z-10 w-full bg-[#1a1f2e] dark:bg-black text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 border-t border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex justify-center items-center gap-2 ${
              isSubmitting 
                ? 'opacity-50 cursor-not-allowed shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] scale-[0.97]' 
                : 'group-hover:-translate-y-1 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-active:translate-y-1 group-active:scale-[0.97] group-active:shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)]'
            }`}>
              {isSubmitting ? 'Processing...' : 'Transmit Rescue Alert'}
            </div>
          </button>
          
        </form>
      </div>
    </div>
  );
}