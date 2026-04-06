import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, Phone, Hash, Link as LinkIcon, Image, Type, Info, Key, Mail, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function ManageCenter() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    document.title = "Yangi Markaz Qo'shish | SmartOffice";
  }, []);

  const [users, setUsers] = useState([]);
  const [isAddingNewAdmin, setIsAddingNewAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_phone: '',
    map_link: '',
    total_floors: 1,
    description: '',
    admins: [],
    logo: null,
    building_image: null
  });

  useEffect(() => {
    if (user && user.is_superuser) {
      api.get('/users/')
        .then(res => setUsers(res.data.results || res.data))
        .catch(err => console.error("Foydalanuvchilarni yuklashda xatolik:", err));
    }
  }, [user]);

  const handleCreateNewAdmin = async () => {
    if(!newAdminData.username || !newAdminData.password) {
      alert("Iltimos, username va parolni kiriting.");
      return;
    }
    try {
      const res = await api.post('/signup/', newAdminData);
      setUsers([...users, res.data]);
      setFormData({...formData, admins: [...(formData.admins || []), res.data.id]});
      setIsAddingNewAdmin(false);
      setNewAdminData({username: '', first_name: '', last_name: '', email: '', password: ''});
    } catch (err) {
      alert("Admin yaratishda xatolik: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleChange = (e) => {
    if (e.target.files) {
      setFormData({...formData, [e.target.name]: e.target.files[0]});
    } else if (e.target.multiple) {
      const values = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({...formData, [e.target.name]: values});
    } else {
      setFormData({...formData, [e.target.name]: e.target.value});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        if (key === 'admins') {
          formData.admins.forEach(adminId => {
            data.append('admins', adminId);
          });
        } else if (formData[key]) {
          data.append(key, formData[key]);
        }
      }
      
      await api.post('/business-centers/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Xatolik yuz berdi: " + JSON.stringify(error.response?.data || error.message));
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 md:mt-10 px-4 pb-20 md:pb-10">
      <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 text-slate-800">Yangi Biznes Markaz Qo'shish</h2>
      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-xl border border-slate-100 space-y-5 md:space-y-6 relative overflow-hidden">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2"><Building className="w-4 h-4 inline mr-1 text-slate-400"/> Markaz nomi</label>
          <input type="text" name="name" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium hover:border-indigo-300" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2"><MapPin className="w-4 h-4 inline mr-1 text-slate-400"/> Manzil</label>
          <input type="text" name="address" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium hover:border-indigo-300" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2"><Phone className="w-4 h-4 inline mr-1 text-slate-400"/> Telefon raqam</label>
            <input type="text" name="contact_phone" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium hover:border-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2"><Hash className="w-4 h-4 inline mr-1 text-slate-400"/> Qavatlar soni</label>
            <input type="number" name="total_floors" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium hover:border-indigo-300" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2"><LinkIcon className="w-4 h-4 inline mr-1 text-slate-400"/> Xarita linki (Google/Yandex)</label>
          <input type="url" name="map_link" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium hover:border-indigo-300" placeholder="https://..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2"><Image className="w-4 h-4 inline mr-1 text-slate-400"/> Markaz logotipi</label>
            <input type="file" accept="image/*" name="logo" onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2"><Image className="w-4 h-4 inline mr-1 text-slate-400"/> Bino rasmi (Cover)</label>
            <input type="file" accept="image/*" name="building_image" onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2"><Type className="w-4 h-4 inline mr-1 text-slate-400"/> Markaz haqida ma'lumot (Tavsif)</label>
          <textarea name="description" onChange={handleChange} required rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium hover:border-indigo-300" placeholder="Markaz haqida qisqacha ma'lumot qoldiring..."></textarea>
        </div>
        {user?.is_superuser && (
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold text-slate-700"><ShieldAlert className="w-4 h-4 inline mr-1 text-slate-400"/> Markaz adminini tanlang</label>
              <button 
                type="button" 
                onClick={() => setIsAddingNewAdmin(!isAddingNewAdmin)}
                className="text-indigo-600 text-sm font-bold hover:underline"
              >
                {isAddingNewAdmin ? "Mavjud adminni tanlash" : "+ Yangi admin yaratish"}
              </button>
            </div>
            
            {isAddingNewAdmin ? (
              <div className="space-y-3 mb-4 p-4 bg-white rounded-lg border border-indigo-100">
                <input type="text" placeholder="Foydalanuvchi nomi (username)" 
                       value={newAdminData.username} onChange={e => setNewAdminData({...newAdminData, username: e.target.value})} 
                       className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="text" placeholder="Ismi (Fist name)" 
                       value={newAdminData.first_name} onChange={e => setNewAdminData({...newAdminData, first_name: e.target.value})} 
                       className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="text" placeholder="Familiyasi (Last name)" 
                       value={newAdminData.last_name} onChange={e => setNewAdminData({...newAdminData, last_name: e.target.value})} 
                       className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="email" placeholder="Email (ixtiyoriy)" 
                       value={newAdminData.email} onChange={e => setNewAdminData({...newAdminData, email: e.target.value})} 
                       className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="password" placeholder="Parol" 
                       value={newAdminData.password} onChange={e => setNewAdminData({...newAdminData, password: e.target.value})} 
                       className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button type="button" onClick={handleCreateNewAdmin} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-indigo-700 transition">
                  Yaratish va asosiy admin etib tanlash
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-2 space-y-1 mb-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                {users.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-400 font-medium">Hozircha adminlar yo'q</div>
                ) : (
                  users.map(u => (
                    <label key={u.id} className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border ${formData.admins?.includes(u.id) ? 'bg-indigo-50 border-indigo-200' : 'border-transparent hover:bg-slate-50'}`}>
                      <input 
                        type="checkbox" 
                        name="admins" 
                        value={u.id} 
                        checked={formData.admins?.includes(u.id) || false} 
                        onChange={(e) => {
                          const id = u.id;
                          let newAdmins = formData.admins ? [...formData.admins] : [];
                          if (e.target.checked) {
                            newAdmins.push(id);
                          } else {
                            newAdmins = newAdmins.filter(adminId => adminId !== id);
                          }
                          setFormData({ ...formData, admins: newAdmins });
                        }} 
                        className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mr-3" 
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">@{u.username}</span>
                        {(u.first_name || u.last_name) && (
                          <span className="text-xs font-medium text-slate-500 mt-0.5">
                            {u.first_name} {u.last_name || ''}
                          </span>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500 font-medium">
              Ushbu biznes markazni boshqarish uchun adminlarni tanlang (Bir nechta tanlash mumkin).
            </p>
          </div>
        )}
        <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all">
          Markazni saqlash
        </button>
      </form>
    </div>
  );
}

export default ManageCenter;