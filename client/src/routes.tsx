import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PublicRecipes from "./pages/PublicRecipes";
import PantryRecommendation from "./pages/PantryRecommendation";
import RecipeDetails from "./pages/RecipeDetails";
import AddRecipe from "./pages/AddRecipe"; 
import UserAddRecipe from "./pages/UserAddRecipe"; 
import AdminMasterIngredients from "./pages/AdminMasterIngredients"; 
import DietFilter from "./pages/DietFilter";

const UserManagement = () => (
  <div className="text-white p-10 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold text-blue-400 mb-2">User Management Console</h2>
    <p className="text-gray-400 font-medium italic">Manage system users and access levels here...</p>
  </div>
);

const AnalyticsPage = () => (
  <div className="text-white p-10 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold text-purple-400 mb-2">Live Statistics</h2>
    <p className="text-gray-400 font-medium italic">Real-time data and system performance metrics...</p>
  </div>
);

export const router = createBrowserRouter([
  { 
    path: "/", 
    element: <LandingPage /> 
  },

  { 
    path: "/user-dashboard", 
    element: <UserDashboard />,
    children: [
      {
        index: true, 
        element: (
          <div className="text-white/40 text-center mt-10 uppercase tracking-[0.3em] font-black text-xs">
            System Online — Select a magic tool to begin
          </div>
        )
      },
      { path: "explore", element: <PantryRecommendation /> },
      { path: "create-recipe", element: <UserAddRecipe /> },
      { path: "public-recipes", element: <PublicRecipes /> },
      { path: "diet-filter", element: <DietFilter /> },
      { path: "recipe/:id", element: <RecipeDetails /> }
    ]
  },

  { 
    path: "/admin-dashboard", 
    element: <AdminDashboard />,
    children: [
      {
        index: true,
        element: (
          <div className="text-white/20 text-center text-sm p-16 border-2 border-dashed border-white/5 rounded-[3.5rem] uppercase tracking-[0.5em] font-black">
            System Standby - Choose a command
          </div>
        )
      },
      { path: "add-recipe", element: <AddRecipe /> },
      
   
      { path: "master-ingredients", element: <AdminMasterIngredients /> }, 

      { path: "users", element: <UserManagement /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { 
        path: "settings", 
        element: (
          <div className="text-white p-10 text-center bg-white/5 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold text-primary mb-2">System Settings</h2>
            <p className="text-gray-400 font-medium italic">Configure core application parameters...</p>
          </div>
        ) 
      },
    ]
  }
]);