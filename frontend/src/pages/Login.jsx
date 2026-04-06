import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Tizimga kirish | SmartOffice";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError("Login yoki parol xato.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-400 rounded-full blur-2xl opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-pink-500 to-rose-400 rounded-full blur-2xl opacity-20"></div>

        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 relative z-10">Tizimga kirish</h2>
        <p className="text-gray-500 mb-8 font-medium">Boshqaruv paneliga xush kelibsiz.</p>
        
        {error && <div className="mb-4 text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 font-semibold">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">Login</label>
            <input 
              type="text" 
              id="username"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Parol</label>
            <input 
              type="password" 
              id="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] transform transition-all active:scale-95"
          >
            Kirish →
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;