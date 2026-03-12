import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ChefHat, ArrowRight, Sparkles, Zap, LogOut, BookOpen } from 'lucide-react';

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const username = localStorage.getItem("userName") || "User"; 

  
  const isHome = location.pathname === '/user-dashboard';

  const handleLogout = () => {
    navigate('/'); 
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center font-sans overflow-hidden py-10">
      {/* Background Image with Blur Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/userdash.jpg"
          alt="User Dashboard"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl w-full px-6 text-center">
        
        {isHome ? (
          /* --- ল্যান্ডিং ভিউ: যখন ইউজার প্রথম ঢুকে --- */
          <div className="bg-white/10 backdrop-blur-2xl rounded-[3.5rem] border border-white/20 p-12 shadow-2xl ring-1 ring-white/10 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl"></div>
            
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-3xl mb-8 shadow-2xl shadow-orange-500/40 animate-pulse">
              <ChefHat className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
              Welcome, <span className="text-orange-500">{username}!</span>
            </h1>
            
            <p className="text-gray-200 text-xl font-medium mb-10 leading-relaxed max-w-md mx-auto">
              Ready to create some magic? Explore your pantry or browse public favorites.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Feature 4: Magic Kitchen Button */}
              <button
                onClick={() => navigate('explore')} 
                className="group relative bg-orange-500 hover:bg-orange-600 text-white px-8 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-orange-500/40 flex items-center gap-3 overflow-hidden active:scale-95"
              >
                <Zap className="w-6 h-6 fill-current" />
                Launch Magic Kitchen
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>

              {/* Feature 3: Public Recipes Button */}
              <button
                onClick={() => navigate('public-recipes')} 
                className="group bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 py-5 rounded-2xl font-black text-xl transition-all flex items-center gap-3 active:scale-95"
              >
                <BookOpen className="w-6 h-6" />
                Browse Recipes
              </button>
            </div>
            
            <div className="mt-12 flex flex-col items-center gap-2">
              <p className="text-orange-400 font-black text-sm flex items-center gap-2 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" /> 15+ Smart Features Loaded
              </p>
            </div>
          </div>
        ) : (
        
          <div className="w-full transition-all duration-500 animate-in fade-in zoom-in-95">
             {/* Back to Dashboard Button */}
             <button 
                onClick={() => navigate('/user-dashboard')}
                className="mb-6 text-white/50 hover:text-orange-500 flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors"
             >
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Hub
             </button>
             
             {/* এই Outlet-এই আপনার PublicRecipes এবং PantryRecommendation পেজগুলো শো করবে */}
             <Outlet />
          </div>
        )}
        
        {/* Footer Actions */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors font-bold uppercase tracking-widest text-xs group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Exit Session
          </button>
          
          <p className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase">
            Secured Session • CookSmart AI System
          </p>
        </div>
      </div>
    </div>
  );
}