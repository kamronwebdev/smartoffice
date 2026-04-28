import { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Key, X, Eye, EyeOff, User as UserIcon } from 'lucide-react';
import api from '../services/api';

function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const [centers, setCenters] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    managed_centers: []
  });

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/');
      setAdmins(res.data.results || res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const res = await api.get('/business-centers/');
      setCenters(res.data.results || res.data);
    } catch (e) {
      console.error("Markazlarni yuklashda xatolik", e);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchCenters();
  }, []);

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({ 
        username: admin.username, 
        first_name: admin.first_name || '', 
        last_name: admin.last_name || '', 
        email: admin.email || '', 
        password: '',
        managed_centers: admin.managed_centers || []
      });
    } else {
      setEditingAdmin(null);
      setFormData({ 
        username: '', 
        first_name: '', 
        last_name: '', 
        email: '', 
        password: '',
        managed_centers: []
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        username: formData.username, 
        first_name: formData.first_name, 
        last_name: formData.last_name, 
        email: formData.email,
        managed_centers: formData.managed_centers
      };
      if (formData.password) payload.password = formData.password;

      if (editingAdmin) {
        await api.patch(`/users/${editingAdmin.id}/`, payload);
      } else {
        await api.post('/users/', payload);
      }
      setShowModal(false);
      fetchAdmins();
    } catch (e) {
      alert("Xatolik: " + JSON.stringify(e.response?.data || e.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Rostdan ham ushbu adminni o'chirib tashlamoqchimisiz?")) {
      try {
        await api.delete(`/users/${id}/`);
        fetchAdmins();
      } catch (e) {
        alert("Xatolik yuz berdi");
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-indigo-600 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-500" /> Tizim Adminlari
        </h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" /> Yangi admin
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Yuklanmoqda...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Username</th>
                  <th className="p-4 font-bold">Ism Familiyasi</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Parol</th>
                  <th className="p-4 font-bold text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 font-bold text-slate-800">@{admin.username}</td>
                    <td className="p-4 text-slate-700 font-medium">
                      {admin.first_name || admin.last_name ? `${admin.first_name} ${admin.last_name}` : <span className="text-slate-400 italic">Kiritilmagan</span>}
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{admin.email || '—'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md text-sm tracking-widest inline-block min-w-[140px] text-center">
                          {visiblePasswords[admin.id] ? (admin.raw_password ? admin.raw_password : 'Noma\'lum') : '••••••••'}
                        </span>
                        <button 
                          onClick={() => togglePasswordVisibility(admin.id)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors active:scale-95"
                          title={visiblePasswords[admin.id] ? "Yashirish" : "Ko'rsatish"}
                        >
                          {visiblePasswords[admin.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(admin)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors active:scale-95" title="Tahrirlash">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(admin.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors active:scale-95" title="O'chirish">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">Hozircha adminlar yo'q</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">{editingAdmin ? 'Adminni tahrirlash' : 'Yangi admin'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Foydalanuvchi nomi (Username)</label>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Ism</label>
                  <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" placeholder="Ali..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Familiya</label>
                  <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" placeholder="Valiyev..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email (Ixtiyoriy)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Parol {editingAdmin && <span className="text-xs text-slate-400 font-normal">(O'zgartirish uchun kiriting)</span>}</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required={!editingAdmin} type={visiblePasswords['modal'] ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" />
                  <button 
                    type="button"
                    onClick={() => togglePasswordVisibility('modal')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {visiblePasswords['modal'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md active:scale-95">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminList;




