import { Shield, LogOut, LayoutDashboard, Settings, Users, BarChart3, Zap, ArrowRight, PlusCircle, Database } from 'lucide-react'; // Database icon যোগ করা হয়েছে
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const scrollToContent = () => {
    document.getElementById('outlet-view')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans overflow-hidden bg-background text-foreground">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/adminpage.jpg"
          alt="Admin Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px]"></div>
      </div>

      {/* Top Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin-dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-300">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tight text-white uppercase">
              COOK<span className="text-primary">SMART</span> <span className="text-white/40 font-medium text-xs">CORE</span>
            </span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/5 hover:bg-destructive/20 hover:text-destructive text-white px-5 py-2 rounded-xl transition-all border border-white/10 font-bold shadow-none"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow p-6 flex flex-col items-center">
        <div className="max-w-6xl w-full mt-12">
          
          {/* Dashboard Central Welcome Card */}
          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[4rem] border border-white/10 p-12 text-center shadow-2xl relative overflow-hidden">
            
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>

            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-primary to-orange-400 rounded-[2rem] mb-8 shadow-2xl shadow-primary/40">
              <LayoutDashboard className="w-12 h-12 text-primary-foreground" />
            </div>
            
            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter leading-tight">
              Welcome back, <span className="text-primary italic">Command Center.</span>
            </h1>
            
            <p className="text-gray-400 text-lg font-medium mb-12 max-w-xl mx-auto leading-relaxed">
              System status: <span className="text-green-400">OPTIMAL</span>. Manage recipes, track users, and oversee the evolution of your culinary empire.
            </p>

            {/* Main Navigation Grid - Updated to 5 Columns for better fit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              
              {/* Add Recipe Card */}
              <Link 
                to="add-recipe" 
                onClick={scrollToContent}
                className="group bg-primary/10 hover:bg-primary/20 border border-primary/20 p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 hover:-translate-y-1 shadow-xl hover:shadow-primary/10"
              >
                <div className="p-3 bg-primary rounded-2xl group-hover:rotate-90 transition-transform duration-500">
                   <PlusCircle className="w-8 h-8 text-white" />
                </div>
                <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Add Recipe</span>
              </Link>

              {/* NEW: Master Ingredients Card */}
              <Link 
                to="master-ingredients" 
                onClick={scrollToContent} 
                className="group bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 hover:-translate-y-1 shadow-xl"
              >
                <div className="p-3 bg-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Master List</span>
              </Link>

              {/* Users Card */}
              <Link to="users" onClick={scrollToContent} className="group bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 hover:-translate-y-1">
                <Users className="w-8 h-8 text-blue-400 group-hover:scale-110 transition" />
                <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Users</span>
              </Link>
              
              {/* Analytics Card */}
              <Link to="analytics" onClick={scrollToContent} className="group bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 hover:-translate-y-1">
                <BarChart3 className="w-8 h-8 text-purple-400 group-hover:scale-110 transition" />
                <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Analytics</span>
              </Link>

              {/* Settings Card */}
              <Link to="settings" onClick={scrollToContent} className="group bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-[2.5rem] transition-all flex flex-col items-center gap-4 hover:-translate-y-1">
                <Settings className="w-8 h-8 text-gray-400 group-hover:rotate-90 transition-all duration-500" />
                <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Settings</span>
              </Link>
            </div>

            <button
              onClick={scrollToContent}
              className="inline-flex items-center gap-3 text-primary/60 font-black uppercase tracking-[0.4em] text-[10px] hover:text-primary transition-all bg-transparent p-0 shadow-none group"
            >
              <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition" />
              Initialize Detailed View
              <ArrowRight className="w-4 h-4 rotate-90" />
            </button>
          </div>

          {/* Dynamic Content Area (Outlet) */}
          <div id="outlet-view" className="mt-20 mb-20 min-h-[400px] transition-all duration-700">
             <Outlet />
          </div>

        </div>
      </main>

      <footer className="relative z-10 py-12 text-center border-t border-white/5">
        <p className="text-white/10 text-[10px] font-black tracking-[1em] uppercase">
          Master Administrative Console • Security Level 4 • v3.1.0
        </p>
      </footer>
    </div>
  );
}