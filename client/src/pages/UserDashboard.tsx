import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Zap, LogOut, BookOpen, PlusCircle, Filter, Users } from 'lucide-react';
import { logoutUser } from '../services/authService';
import api from '../services/api'; 

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const myId = localStorage.getItem("userId");

  const isHome = location.pathname === '/user-dashboard' || location.pathname === '/user-dashboard/';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/profile'); 
        if (response.data && response.data.name) {
          setUserName(response.data.name);
          localStorage.setItem("userName", response.data.name);
        }
      } catch (err) {
        console.error("Could not refresh profile data:", err);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center font-sans overflow-hidden py-10 bg-background text-foreground">
      
      {/* 1. Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/userdash.jpg"
          alt="User Dashboard"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>
      </div>

      {/* 2. Main Content Area */}
      <div className="relative z-10 max-w-6xl w-full px-6 text-center">
        
        {isHome ? (
          <div className="bg-card/10 backdrop-blur-2xl rounded-[3.5rem] border border-white/20 p-12 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
            
            {/* --- Profile Icon (Now INSIDE the card) --- */}
            <div className="absolute top-10 right-10">
              <Link 
                to={`/user-dashboard/profile/${myId}`}
                className="group flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-black text-xl hover:bg-white hover:text-black transition-all">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                  Profile
                </span>
              </Link>
            </div>

            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
            
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-primary to-orange-400 rounded-3xl mb-8 shadow-2xl shadow-primary/40 animate-pulse">
              <ChefHat className="w-12 h-12 text-primary-foreground" />
            </div>
            
            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter leading-tight">
              Welcome, <span className="text-primary">{userName}!</span>
            </h1>
            
            <p className="text-gray-200 text-xl font-medium mb-10 leading-relaxed max-w-md mx-auto">
              Ready to create some magic? Explore your pantry or publish your own recipe.
            </p>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('explore')} 
                className="group bg-primary hover:opacity-90 text-primary-foreground px-8 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/40 flex items-center gap-3 active:scale-95 border-none cursor-pointer"
              >
                <Zap className="w-6 h-6 fill-current" />
                Magic Kitchen
              </button>

              <button
                onClick={() => navigate('create-recipe')} 
                className="group bg-orange-500 hover:bg-orange-400 text-white px-8 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 active:scale-95 border-none cursor-pointer"
              >
                <PlusCircle className="w-6 h-6" />
                Post Recipe
              </button>

              <button
                onClick={() => navigate('public-recipes')} 
                className="group bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 py-5 rounded-2xl font-black text-lg transition-all flex items-center gap-3 active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-6 h-6" />
                Browse
              </button>

              <button
                onClick={() => navigate('diet-filter')}
                className="group bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 py-5 rounded-2xl font-black text-lg transition-all flex items-center gap-3 active:scale-95 cursor-pointer"
              >
                <Filter className="w-6 h-6" />
                Diet Filter
              </button>

              <button
                onClick={() => navigate('feed')}
                className="group bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 py-5 rounded-2xl font-black text-lg transition-all flex items-center gap-3 active:scale-95 cursor-pointer"
              >
                <Users className="w-6 h-6" />
                Chef's Board
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
             <button 
                onClick={() => navigate('/user-dashboard')}
                className="mb-8 text-white/50 hover:text-primary flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors bg-transparent border-none cursor-pointer p-0 shadow-none self-start"
             >
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Hub
             </button>
             
             <div className="w-full min-h-[500px]">
                <Outlet context={{ userName }} />
             </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <button 
            onClick={logoutUser} 
            className="flex items-center gap-2 text-white/40 hover:text-red-500 transition-colors font-bold uppercase tracking-widest text-[10px] group bg-transparent border-none cursor-pointer p-2 shadow-none"
          >
            <LogOut className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Exit Session
          </button>
        </div>
      </div>
    </div>
  );
}