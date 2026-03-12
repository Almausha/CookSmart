import { Shield, LogOut, LayoutDashboard, Settings, Users, BarChart3, Zap, ArrowRight } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { logoutUser } from '../services/authService';

export default function AdminDashboard() {

  return (
    <div className="min-h-screen relative flex flex-col font-sans overflow-hidden bg-background text-foreground">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/adminpage.jpg"
          alt="Admin Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay color now uses theme-based black/75 fallback */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[4px]"></div>
      </div>

      {/* Top Navigation */}
      <nav className="relative z-50 bg-card/40 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin-dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase">
              COOK<span className="text-primary">SMART</span> <span className="text-gray-400 font-medium text-sm">ADMIN</span>
            </span>
          </Link>
          
          <button
            onClick={logoutUser}
            className="flex items-center gap-2 bg-white/5 hover:bg-destructive/20 hover:text-destructive text-white px-5 py-2 rounded-xl transition-all border border-white/10 font-bold cursor-pointer shadow-none"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow p-6 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full">
          
          {/* Dashboard Central Welcome Card */}
          <div className="bg-card/10 backdrop-blur-2xl rounded-[3.5rem] border border-white/20 p-12 text-center shadow-2xl relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>

            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-primary to-orange-400 rounded-3xl mb-8 shadow-2xl shadow-primary/40 animate-pulse">
              <LayoutDashboard className="w-12 h-12 text-primary-foreground" />
            </div>
            
            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter leading-tight">
              Long time no see, <span className="text-primary">Admin!</span>
            </h1>
            
            <p className="text-gray-300 text-xl font-medium mb-12 max-w-lg mx-auto leading-relaxed">
              System is stable. Everything is set to <span className="text-primary font-bold">explore your user details</span> and manage the CookSmart empire.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <Link to="users" className="group bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl transition-all flex flex-col items-center gap-3">
                <Users className="w-8 h-8 text-blue-400 group-hover:scale-110 transition" />
                <span className="text-white font-bold text-sm uppercase tracking-widest">Manage Users</span>
              </Link>
              
              <Link to="analytics" className="group bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl transition-all flex flex-col items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-400 group-hover:scale-110 transition" />
                <span className="text-white font-bold text-sm uppercase tracking-widest">Live Stats</span>
              </Link>

              <Link to="settings" className="group bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl transition-all flex flex-col items-center gap-3">
                <Settings className="w-8 h-8 text-primary group-hover:scale-110 transition" />
                <span className="text-white font-bold text-sm uppercase tracking-widest">Settings</span>
              </Link>
            </div>

            <button
              onClick={() => document.getElementById('outlet-view')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:text-orange-300 transition-colors bg-transparent p-0 shadow-none"
            >
              <Zap className="w-4 h-4 fill-current" />
              Scroll to view deeper insights
              <ArrowRight className="w-4 h-4 rotate-90" />
            </button>
          </div>

          {/* Dynamic Content Area (Outlet) */}
          {/* অন্য মেম্বাররা শুধু এই এরিয়ার ভেতরেই তাদের কাজ দেখতে পাবে */}
          <div id="outlet-view" className="mt-16 transition-all duration-500">
             <Outlet />
          </div>

        </div>
      </main>

      <footer className="relative z-10 py-8 text-center">
        <p className="text-white/20 text-[10px] font-black tracking-[0.5em] uppercase">
          Master Administrative Console • v3.1.0
        </p>
      </footer>
    </div>
  );
}