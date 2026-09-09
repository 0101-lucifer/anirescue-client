import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-800 dark:text-gray-100 transition-colors tracking-tight">
          AI-Powered Animal Rescue
          <span className="text-emerald-600 dark:text-emerald-400 block mt-2 drop-shadow-sm">
            When Seconds Count.
          </span>
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto transition-colors">
          India has over 35 million stray animals, yet less than 2% get help when injured. 
          AniRescue connects bystanders, volunteers, and NGOs instantly using AI and real-time GPS.
        </p>
      </div>

      {/* CTA Buttons - Interactive Animated LED Theme */}
      <div className="flex flex-col sm:flex-row gap-6 mb-24 w-full max-w-lg mx-auto justify-center z-10">
        
        {/* Primary Action: Red LED Glow */}
        <Link to="/report" className="relative group w-full sm:w-auto flex-1 focus:outline-none block select-none">
          {/* LED Glow Layer - Pulses on hover, squishes on click */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-5 bg-rose-500 blur-lg rounded-full opacity-80 transition-all duration-300 group-hover:bg-rose-400 group-hover:h-6 group-hover:opacity-100 group-active:h-2 group-active:blur-md group-active:bg-rose-700 group-active:opacity-50"></div>
          
          {/* Physical Button Layer - Floats up on hover, presses IN on click */}
          <div className="relative z-10 w-full bg-[#1a1f2e] dark:bg-black text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 border-t border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.4)] group-hover:-translate-y-1 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-active:translate-y-1 group-active:scale-[0.97] group-active:shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] flex justify-center items-center gap-2">
            🚨 Report Emergency
          </div>
        </Link>

        {/* Secondary Action: Blue LED Glow */}
        <Link to="/map" className="relative group w-full sm:w-auto flex-1 focus:outline-none block select-none">
          {/* LED Glow Layer - Pulses on hover, squishes on click */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-5 bg-blue-500 blur-lg rounded-full opacity-80 transition-all duration-300 group-hover:bg-blue-400 group-hover:h-6 group-hover:opacity-100 group-active:h-2 group-active:blur-md group-active:bg-blue-700 group-active:opacity-50"></div>
          
          {/* Physical Button Layer - Floats up on hover, presses IN on click */}
          <div className="relative z-10 w-full bg-[#1a1f2e] dark:bg-black text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 border-t border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.4)] group-hover:-translate-y-1 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-active:translate-y-1 group-active:scale-[0.97] group-active:shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] flex justify-center items-center gap-2">
            🗺️ View Live Map
          </div>
        </Link>
        
      </div>

      {/* Features Section - 3D Neumorphic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full pb-10">
        
        {/* Feature 1 */}
        <div className="rounded-[2rem] p-8 transition-all duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[8px_8px_16px_#cbd5e1,_-8px_-8px_16px_#f8fafc] dark:shadow-[8px_8px_16px_#070a13,_-8px_-8px_16px_#172441] hover:-translate-y-2 hover:shadow-[12px_12px_24px_#cbd5e1,_-12px_-12px_24px_#f8fafc] dark:hover:shadow-[12px_12px_24px_#070a13,_-12px_-12px_24px_#172441] group cursor-default">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441]">
            📸
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 transition-colors">
            Gemini AI Vision
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed transition-colors">
            Snap a photo. Our AI instantly identifies the species, assesses the injury, and provides immediate first aid steps.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="rounded-[2rem] p-8 transition-all duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[8px_8px_16px_#cbd5e1,_-8px_-8px_16px_#f8fafc] dark:shadow-[8px_8px_16px_#070a13,_-8px_-8px_16px_#172441] hover:-translate-y-2 hover:shadow-[12px_12px_24px_#cbd5e1,_-12px_-12px_24px_#f8fafc] dark:hover:shadow-[12px_12px_24px_#070a13,_-12px_-12px_24px_#172441] group cursor-default">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441]">
            📍
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 transition-colors">
            Real-Time GPS
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed transition-colors">
            Zero typing required. We automatically grab your exact coordinates to map the rescue case instantly.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="rounded-[2rem] p-8 transition-all duration-300 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[8px_8px_16px_#cbd5e1,_-8px_-8px_16px_#f8fafc] dark:shadow-[8px_8px_16px_#070a13,_-8px_-8px_16px_#172441] hover:-translate-y-2 hover:shadow-[12px_12px_24px_#cbd5e1,_-12px_-12px_24px_#f8fafc] dark:hover:shadow-[12px_12px_24px_#070a13,_-12px_-12px_24px_#172441] group cursor-default">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 bg-[#e2e8f0] dark:bg-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#f8fafc] dark:shadow-[inset_4px_4px_8px_#070a13,inset_-4px_-4px_8px_#172441]">
            🔔
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 transition-colors">
            Instant Alerts
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed transition-colors">
            Push notifications are sent automatically to the nearest registered volunteers within a 5km radius.
          </p>
        </div>

      </div>
    </div>
  );
}