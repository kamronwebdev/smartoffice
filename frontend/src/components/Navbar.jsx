import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition-opacity flex items-center gap-1.5 md:gap-2">
              <span className="text-2xl md:text-3xl">🏢</span> <span className="hidden sm:inline">SmartOffice</span><span className="sm:hidden">SmartOffice</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors hidden sm:block text-sm md:text-base">Bosh Sahifa</Link>
            
            {user ? (
              <div className="flex gap-2 md:gap-4 items-center">
                <Link to="/dashboard" className="text-indigo-600 bg-indigo-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-sm md:text-base font-bold hover:bg-indigo-100 transition-colors active:scale-95">
                  Kabinet
                </Link>
                <button onClick={logout} className="text-gray-500 hover:text-red-500 font-medium transition-colors text-sm md:text-base active:scale-95">
                  Chiqish
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-gray-900 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl text-sm md:text-base font-bold hover:bg-gray-800 transition-all hover:shadow-lg shadow-gray-200 active:scale-95"
              >
                Kirish
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;