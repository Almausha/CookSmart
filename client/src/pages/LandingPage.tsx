import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Leaf, Clock, Users, Star } from 'lucide-react';
import axios from 'axios';

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email || formData.username,
          password: formData.password
        });

        const data = response.data;

        // আপনার ব্যাকএন্ড সরাসরি ইউজার অবজেক্ট (user) বা টোকেনসহ ডাটা পাঠালে তা সেভ হবে
        if (data) {
          const userRole = data.role || data.user?.role || 'user';
          const userName = data.name || data.username || data.user?.name || 'User';

          localStorage.setItem('token', data.token || 'no-token');
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('userName', userName);

          // রোলের ওপর ভিত্তি করে রিডাইরেক্ট
          if (userRole === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/user-dashboard');
          }
        }
      } else {
        // --- REGISTER LOGIC ---
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.username, // ব্যাকএন্ডে 'name' হিসেবে পাঠাচ্ছি
          email: formData.email,
          password: formData.password,
          role: 'user'
        });

        if (response.data) {
          alert('Registration successful! Please Sign In.');
          setIsLogin(true);
          // ফর্ম পরিষ্কার করা
          setFormData({ username: '', email: '', password: '' });
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err.response?.data);
      setError(err.response?.data?.message || 'Connection failed. Check your server.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen relative text-gray-900 font-sans">
      {/* Background Images */}
      <img
        src="/images/landpage.jpg"
        alt="Smart Kitchen"
        className="absolute inset-0 w-full h-full object-cover opacity-25 z-0"
      />
      <div className="absolute inset-0 bg-white/40 z-0"></div>

      {/* Header */}
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

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
        {/* Left side: Hero */}
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

        {/* Right side: Form */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-orange-100 w-full max-w-md relative overflow-hidden">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-3 text-gray-900">
                {isLogin ? 'Welcome Back!' : 'Join CookSmart'}
              </h2>
              <p className="text-gray-600 font-bold text-sm">
                {isLogin ? 'Sign in with your email/username' : 'Create your free account'}
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

              <div className="space-y-2">
                <label className="block text-sm font-black text-gray-900 ml-1">
                  {isLogin ? 'Username' : 'Full Name'}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-orange-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 font-medium"
                  placeholder={isLogin ? "Username" : "Your Name"}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-black text-gray-900 ml-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-orange-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 font-medium"
                  placeholder="••••••••"
                  required
                />
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