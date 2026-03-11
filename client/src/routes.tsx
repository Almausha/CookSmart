import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PublicRecipes from "./pages/PublicRecipes";
import PantryRecommendation from "./pages/PantryRecommendation";

/** * অন্য ডেভেলপারের জন্য ডামি কম্পোনেন্টসমূহ।
 * তারা যখন আসল কাজ করবে, তখন এগুলো সরিয়ে আসল ফাইল ইম্পোর্ট করে নেবে।
 */
const UserManagement = () => (
  <div className="text-white p-10 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
    <h2 className="text-2xl font-bold text-orange-500 mb-2">User Management Console</h2>
    <p className="text-gray-400 font-medium italic">Ready to explore your user details...</p>
  </div>
);

const AnalyticsPage = () => (
  <div className="text-white p-10 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
    <h2 className="text-2xl font-bold text-purple-400 mb-2">Live Statistics</h2>
    <p className="text-gray-400 font-medium italic">Analytics dashboard coming soon...</p>
  </div>
);

export const router = createBrowserRouter([
  // ১. ল্যান্ডিং পেজ (হোম)
  { 
    path: "/", 
    element: <LandingPage /> 
  },

  // ২. ইউজার ড্যাশবোর্ড (সবগুলো সাব-ফিচার সহ)
  { 
    path: "/user-dashboard", 
    element: <UserDashboard />,
    children: [
      {
        // ড্যাশবোর্ডে ঢোকার পর শুরুতে যা দেখাবে
        index: true, 
        element: (
          <div className="text-white/40 text-center mt-10 uppercase tracking-[0.3em] font-black text-xs">
            System Online — Select a magic tool to begin
          </div>
        )
      },
      {
        // Feature 4: Pantry-Based Recipe Recommendation
        path: "explore", 
        element: <PantryRecommendation />
      },
      {
        // Feature 3: Public Recipe Browsing System
        path: "public-recipes", 
        element: <PublicRecipes />
      }
    ]
  },

  // ৩. অ্যাডমিন ড্যাশবোর্ড (অ্যাডমিন ফিচারসমূহ)
  { 
    path: "/admin-dashboard", 
    element: <AdminDashboard />,
    children: [
      {
        index: true,
        element: (
          <div className="text-white/40 text-center text-sm p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] uppercase tracking-widest font-black">
            System Standby - Select a module to manage
          </div>
        )
      },
      { 
        path: "users", 
        element: <UserManagement /> 
      },
      { 
        path: "analytics", 
        element: <AnalyticsPage /> 
      },
      { 
        path: "settings", 
        element: (
          <div className="text-white p-10 text-center bg-white/5 rounded-3xl border border-white/10">
            Admin Settings Section
          </div>
        )
      },
    ]
  },
]);