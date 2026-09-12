import { useState, useRef } from 'react';

export default function ResolveCase({ caseId, onResolutionSuccess }) {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create fast preview
      setImagePreview(URL.createObjectURL(file)); 
      
      // Convert to Base64 for the backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageBase64) return setError('Photographic evidence is required.');
    if (!resolutionNotes.trim()) return setError('Please provide resolution notes.');

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`https://anirescue-api.onrender.com/api/cases/${caseId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('anirescue_token')}`
        },
        body: JSON.stringify({
          resolutionImageBase64: imageBase64,
          resolutionNotes: resolutionNotes
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Evidence submitted. Case marked as Resolved!');
        if (onResolutionSuccess) onResolutionSuccess();
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCSS = "w-full px-4 py-3 rounded-xl bg-[#e2e8f0] dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 outline-none transition-all shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441]";

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#e2e8f0] dark:bg-[#0f172a] rounded-[2rem] shadow-[10px_10px_20px_#cbd5e1,_-10px_-10px_20px_#f8fafc] dark:shadow-[10px_10px_20px_#070a13,_-10px_-10px_20px_#172441]">
      <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        Verify Resolution
      </h3>

      {error && (
        <div className="p-3 mb-4 text-sm font-bold text-center text-rose-500 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 ml-1 uppercase tracking-wider">
            Evidence Photo (Required)
          </label>
          <div 
            onClick={() => fileInputRef.current.click()}
            className="w-full h-40 rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441] hover:opacity-90 active:scale-95"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Resolution Evidence" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500 font-bold">
                <span className="text-3xl block mb-1">📸</span>
                Tap to upload photo
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

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 ml-1 uppercase tracking-wider">
            Resolution Notes
          </label>
          <textarea 
            placeholder="Where was the animal taken? What treatment was provided?" 
            value={resolutionNotes} 
            onChange={(e) => setResolutionNotes(e.target.value)} 
            className={`${inputCSS} h-24 resize-none`}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold text-lg bg-[#1a1f2e] dark:bg-black text-emerald-400 hover:text-emerald-300 shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-200 border-t border-white/10"
        >
          {isSubmitting ? 'Uploading...' : 'Submit Evidence & Close Case'}
        </button>
      </form>
    </div>
  );
}