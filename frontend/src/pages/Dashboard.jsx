import { useContext, useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Users, Building2 } from 'lucide-react';
import api from '../services/api';
import AdminList from '../components/AdminList';

function Dashboard() {
  const { user, loading, logout } = useContext(AuthContext);
  const [centers, setCenters] = useState([]);
  const [activeTab, setActiveTab] = useState('centers'); // 'centers' or 'admins'

  const fetchCenters = () => {
    api.get('/business-centers/?managed_by_me=true').then(res => {
      setCenters(res.data.results || res.data);
    }).catch(err => console.error(err));
  };

  useEffect(() => {
    document.title = "Boshqaruv Paneli | SmartOffice";
    if (user) {
      fetchCenters();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham ushbu markazni oʻchirib tashlamoqchimisiz?')) {
      try {
        await api.delete(`/business-centers/${id}/`);
        fetchCenters();
      } catch (error) {
        console.error("Xatolik", error);
        alert("O'chirishda xatolik yuz berdi");
      }
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const getRoleLabel = () => {
    if (user.is_superuser) return { label: 'Superadmin', color: 'bg-gradient-to-r from-red-500 to-pink-600' };
    if (user.is_staff) return { label: 'Markaz Admini', color: 'bg-gradient-to-r from-orange-400 to-amber-500' };
    return { label: 'Foydalanuvchi', color: 'bg-gradient-to-r from-blue-400 to-indigo-500' };
  };

  const role = getRoleLabel();

  return (
    <div className="max-w-6xl mx-auto md:mt-10 p-4 md:p-6 bg-white md:rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] md:border border-gray-100 mb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 md:mb-8 border-b pb-4 md:pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">
            Shaxsiy Kabinet
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-2 font-medium">
            Xush kelibsiz, <span className="text-gray-800 font-bold">{user.username}</span>!
          </p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <div className={`text-white px-3 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-base font-bold shadow-lg ${role.color}`}>
            {role.label}
          </div>
          <button 
            onClick={logout}
            className="px-3 py-1.5 md:px-5 md:py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 text-xs md:text-base font-bold transition-all shadow-sm active:scale-95"
          >
            Chiqish
          </button>
        </div>
      </div>

      {user.is_superuser && (
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl mb-8 w-fit overflow-x-auto">
          <button 
            onClick={() => setActiveTab('centers')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${activeTab === 'centers' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            <Building2 className="w-4 h-4" /> Markazlar
          </button>
          <button 
            onClick={() => setActiveTab('admins')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${activeTab === 'admins' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            <Users className="w-4 h-4" /> Adminlar
          </button>
        </div>
      )}

      {(!user.is_superuser || activeTab === 'centers') ? (
        <>
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500">
              {user.is_superuser ? 'Barcha markazlar' : 'Sizning markazlaringiz'}
            </h2>
            {user.is_superuser && (
              <Link 
                to="/dashboard/center/new" 
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-xl font-bold transition shadow shadow-indigo-200 w-fit active:scale-95"
              >
                + Yangi markaz
              </Link>
            )}
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {centers.map((center, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={center.id}
            className="group relative bg-white border border-gray-100 p-0 flex flex-col rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {center.building_image && (
              <div className="h-32 md:h-40 w-full shrink-0 relative overflow-hidden bg-slate-100">
                <img src={center.building_image} alt={center.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>
            )}
            <div className="p-4 md:p-6 flex flex-col flex-grow relative z-10">
              {!center.building_image && (
                <div className="absolute top-0 right-0 w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br from-purple-200 to-indigo-100 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform"></div>
              )}
              
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                {center.logo && (
                  <div className="w-12 h-10 md:w-16 md:h-12 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm -mt-2 bg-white flex items-center justify-center">
                    <img src={center.logo} alt="logo" className="w-full h-full object-contain p-1" />
                  </div>
                )}
                <h3 className="text-lg md:text-xl font-black text-gray-800 leading-tight">{center.name}</h3>
              </div>
              <p className="text-gray-500 mb-3 md:mb-4 text-xs md:text-sm font-medium flex gap-2"><span className="shrink-0">📍</span> <span>{center.address}</span></p>

              <div className="flex flex-col gap-2 mt-auto pt-2">
                <Link
                to={`/dashboard/center/${center.id}/manage`}
                className="w-full text-center px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold text-xs md:text-sm hover:shadow-lg transition-all active:scale-95"
              >
                Markazni & Xonalarni boshqarish
              </Link>
              <div className="flex gap-2">
                <Link 
                  to={`/dashboard/center/${center.id}/edit`}
                  className="flex-1 text-center px-2 py-1.5 md:px-3 md:py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-200 transition active:scale-95"
                >
                  Tahrirlash
                </Link>
                {user.is_superuser && (
                  <button 
                    onClick={() => handleDelete(center.id)}
                    className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-red-50 text-red-600 rounded-xl font-semibold text-xs hover:bg-red-100 transition active:scale-95"
                  >
                    O'chirish
                  </button>
                )}
              </div>
            </div>
            </div>
          </motion.div>
        ))}
        {centers.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <p className="text-gray-400 font-medium text-lg">Hozircha markazlar mavjud emas</p>
          </div>
        )}
      </div>
        </>
      ) : (
        <AdminList />
      )}
    </div>
  );
}

export default Dashboard;