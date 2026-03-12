import { useState, useEffect } from 'react'; // useEffect যোগ করা হয়েছে
import { useNavigate } from 'react-router-dom';
import { ChefHat, Leaf, Clock, Users, Star, Eye, EyeOff } from 'lucide-react'; // Eye আইকন যোগ করা হয়েছে
import axios from 'axios';

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড দেখানোর জন্য স্টেট
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // --- AUTO LOGIN LOGIC ---
  // ওয়েবসাইট ওপেন করলেই চেক করবে আগে লগইন করা আছে কি না
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token && token !== 'no-token') {
      if (userRole === 'admin') navigate('/admin-dashboard');
      else navigate('/user-dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        const data = response.data;

        if (data) {
          const userObj = data.user || data; 
          const userRole = userObj.role || 'user';
          const userName = userObj.name || userObj.username || 'User';
          const userId = userObj._id; 

          // ডেটা সেভ করা হচ্ছে (এটিই পরে অটো-লগইন করতে সাহায্য করবে)
          localStorage.setItem('token', data.token || 'no-token');
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('userName', userName);
          
          if (userId) localStorage.setItem('userId', userId);

          if (userRole === 'admin') navigate('/admin-dashboard');
          else navigate('/user-dashboard');
        }
      } else {
        // REGISTER LOGIC (আগের মতোই)
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'user'
        });

        if (response.data) {
          alert('Registration successful! Please Sign In.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Connection failed.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen relative text-gray-900 font-sans">
      <img
        src="https://images.unsplash.com/photo-1556910103-1c02745aae4d"
        alt="Smart Kitchen"
        className="absolute inset-0 w-full h-full object-cover opacity-25 z-0"
      />
      <div className="absolute inset-0 bg-white/40 z-0"></div>

      <header className="bg-white/80 backdrop-blur-md border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CookSmart</span>
          </div>
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-orange-600 hover:text-orange-700 font-bold cursor-pointer transition-colors"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black leading-tight text-gray-900">
              Your Smart Kitchen <span className="block text-orange-500">Assistant</span>
            </h1>
            <p className="text-xl text-gray-800 font-medium max-w-lg">
              Manage your pantry, discover recipes, and cook smarter with AI-powered recommendations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: Leaf, title: 'Pantry Tracking', desc: 'Track ingredients', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Star, title: 'Smart Recipes', desc: 'AI recommendations', color: 'text-orange-500', bg: 'bg-orange-50' },
              { icon: Clock, title: 'Save Time', desc: 'Quick planning', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Users, title: 'Community', desc: 'Share recipes', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/90 p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all group">
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-700 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-orange-100 w-full max-w-md relative overflow-hidden">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-3 text-gray-900">
                {isLogin ? 'Welcome Back!' : 'Join CookSmart'}
              </h2>
              <p className="text-gray-600 font-bold text-sm">
                {isLogin ? 'Sign in with your email' : 'Create your free account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-black text-gray-900 ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-orange-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 font-medium"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-black text-gray-900 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-orange-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 font-medium"
                    placeholder="Your Name"
                    required
                  />
                </div>
              )}

              {/* Password field with Show/Hide toggle */}
              <div className="space-y-2 relative">
                <label className="block text-sm font-black text-gray-900 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // এখানে টাইপ পরিবর্তন হচ্ছে
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-orange-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error && <p className="text-red-600 text-xs font-bold mt-1 ml-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-[0.98] mt-4"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}