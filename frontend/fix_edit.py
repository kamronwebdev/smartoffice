# -*- coding: utf-8 -*-
with open("frontend/src/pages/EditCenter.jsx", "w", encoding="utf-8") as f:
    f.write(r"""import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Building, MapPin, Phone, Hash, Link as LinkIcon, Image, Type, Info, Key, Mail, ShieldAlert, Clock, Wifi, Coffee, Calendar, ShieldCheck, Car, Zap, Laptop, MonitorSpeaker } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function EditCenter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isAddingNewAdmin, setIsAddingNewAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    username: '', first_name: '', last_name: '', email: '', password: ''
  });
  
  const [formData, setFormData] = useState({
    name: '', address: '', contact_phone: '', map_link: '', description: '',
    building_class: '', year_built: '', total_floors: 1, total_area: '',
    has_parking: false, parking_capacity: '', elevator_count: 0,
    security_24_7: false, access_control: false, has_reception: false,
    has_backup_power: false, heating_cooling: '', internet_providers: '',
    has_wifi: false, has_meeting_rooms: false, has_conference_hall: false,
    has_kitchen: false, has_lounge: false, has_coffee_zone: false,
    has_terrace: false, has_chill_zone: false,
    email: '', website: '', telegram: '', instagram: '', working_hours: '',
    admins: [], logo: null, building_image: null
  });
  const [currentImages, setCurrentImages] = useState({ logo: null, building_image: null });

  useEffect(() => {
    document.title = "Markazni tahrirlash | SmartOffice";
    if (user && user.is_superuser) {
      api.get('/users/').then(res => setUsers(res.data.results || res.data)).catch(err => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    api.get(`/business-centers/${id}/`)
      .then(res => {
        const data = res.data;
        setFormData({
          name: data.name || '', address: data.address || '', contact_phone: data.contact_phone || '', 
          map_link: data.map_link || '', description: data.description || '',
          building_class: data.building_class || '', year_built: data.year_built || '', 
          total_floors: data.total_floors || 1, total_area: data.total_area || '',
          has_parking: data.has_parking || false, parking_capacity: data.parking_capacity || '', 
          elevator_count: data.elevator_count || 0, security_24_7: data.security_24_7 || false, 
          access_control: data.access_control || false, has_reception: data.has_reception || false,
          has_backup_power: data.has_backup_power || false, heating_cooling: data.heating_cooling || '', 
          internet_providers: data.internet_providers || '', has_wifi: data.has_wifi || false, 
          has_meeting_rooms: data.has_meeting_rooms || false, has_conference_hall: data.has_conference_hall || false,
          has_kitchen: data.has_kitchen || false, has_lounge: data.has_lounge || false, 
          has_coffee_zone: data.has_coffee_zone || false, has_terrace: data.has_terrace || false, 
          has_chill_zone: data.has_chill_zone || false, email: data.email || '', website: data.website || '', 
          telegram: data.telegram || '', instagram: data.instagram || '', working_hours: data.working_hours || '',
          admins: data.admins ? data.admins.map(a => a.id || a) : [], 
          logo: null, building_image: null
        });
        setCurrentImages({ logo: data.logo, building_image: data.building_image });
      })
      .catch(err => {
        console.error("Markaz ma'lumotlarini yuklashda xatolik:", err);
        navigate('/dashboard');
      });
  }, [id, navigate]);

  const handleCreateNewAdmin = async () => {
    if(!newAdminData.username || !newAdminData.password) return alert("Iltimos, username va parolni kiriting.");
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
    const { name, value, type, checked, files, multiple, selectedOptions } = e.target;
    if (type === 'file') setFormData({...formData, [name]: files[0]});
    else if (type === 'checkbox') setFormData({...formData, [name]: checked});
    else if (multiple) setFormData({...formData, [name]: Array.from(selectedOptions, option => option.value)});
    else setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        if (key === 'admins') {
          formData.admins.forEach(adminId => data.append('admins', adminId));
        } else if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      }
      
      await api.patch(`/business-centers/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/center/${id}`);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Xatolik yuz berdi: " + JSON.stringify(error.response?.data || error.message));
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold animate-pulse">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const sectionClass = "bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-5 mb-8";
  const titleClass = "text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-3 border-slate-100";
  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2";
  const checkClass = "w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-3 cursor-pointer";

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-10 px-4 pb-20 md:pb-10">
      <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 text-slate-800">Markazni Tahrirlash</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Main info */}
        <div className={sectionClass}>
          <h3 className={titleClass}><Building className="w-5 h-5 text-indigo-500" /> Asosiy ma'lumotlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Markaz nomi *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Manzil (To'liq) *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Xarita linki (Google/Yandex)</label>
              <input type="url" name="map_link" value={formData.map_link} onChange={handleChange} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Tavsif *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className={inputClass}></textarea>
            </div>
          </div>
        </div>

        {/* About */}
        <div className={sectionClass}>
          <h3 className={titleClass}><Info className="w-5 h-5 text-indigo-500" /> Bino haqida (About)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Bino sinfi</label>
              <select name="building_class" value={formData.building_class} onChange={handleChange} className={inputClass}>
                <option value="">Tanlang</option>
                <option value="A">Class A</option>
                <option value="B+">Class B+</option>
                <option value="B">Class B</option>
                <option value="C">Class C</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Qurilgan yili</label>
              <input type="number" name="year_built" value={formData.year_built} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Qavatlar soni</label>
              <input type="number" name="total_floors" value={formData.total_floors} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Umumiy maydoni (kv.m)</label>
              <input type="number" step="0.01" name="total_area" value={formData.total_area} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className={sectionClass}>
          <h3 className={titleClass}><ShieldCheck className="w-5 h-5 text-indigo-500" /> Infratuzilma</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <label className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent transition-all">
              <input type="checkbox" name="has_parking" checked={formData.has_parking} onChange={handleChange} className={checkClass} />
              <span className="font-bold text-slate-700">Avtoturargoh (Parking)</span>
            </label>
            <label className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent transition-all">
              <input type="checkbox" name="security_24_7" checked={formData.security_24_7} onChange={handleChange} className={checkClass} />
              <span className="font-bold text-slate-700">24/7 Xavfsizlik</span>
            </label>
            <label className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent transition-all">
              <input type="checkbox" name="access_control" checked={formData.access_control} onChange={handleChange} className={checkClass} />
              <span className="font-bold text-slate-700">Access Control (Kirish)</span>
            </label>
            <label className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent transition-all">
              <input type="checkbox" name="has_reception" checked={formData.has_reception} onChange={handleChange} className={checkClass} />
              <span className="font-bold text-slate-700">Qabulxona (Reception)</span>
            </label>
            <label className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent transition-all">
              <input type="checkbox" name="has_backup_power" checked={formData.has_backup_power} onChange={handleChange} className={checkClass} />
              <span className="font-bold text-slate-700">Zaxira elektr (Generator)</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Parking sig'imi</label>
              <input type="number" name="parking_capacity" value={formData.parking_capacity} disabled={!formData.has_parking} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Liftlar soni</label>
              <input type="number" name="elevator_count" value={formData.elevator_count} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Isitish/Sovutish</label>
              <input type="text" name="heating_cooling" value={formData.heating_cooling} onChange={handleChange} className={inputClass} />
            </div>
            <div className="sm:col-span-3">
              <label className={labelClass}>Internet provayderlar</label>
              <input type="text" name="internet_providers" value={formData.internet_providers} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className={sectionClass}>
          <h3 className={titleClass}><Coffee className="w-5 h-5 text-indigo-500" /> Qulayliklar (Amenities)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[ 
              {name: 'has_wifi', label: 'Wi-Fi tarmog`i'}, {name: 'has_meeting_rooms', label: 'Majlislar xonasi'},
              {name: 'has_conference_hall', label: 'Konferensiya zali'}, {name: 'has_kitchen', label: 'Oshxona'},
              {name: 'has_lounge', label: 'Dam olish (Lounge)'}, {name: 'has_coffee_zone', label: 'Kofe zonasi'},
              {name: 'has_terrace', label: 'Terrasa'}, {name: 'has_chill_zone', label: 'Chill Zone'}
            ].map(f => (
              <label key={f.name} className="flex items-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 cursor-pointer border border-transparent transition-all">
                <input type="checkbox" name={f.name} checked={formData[f.name]} onChange={handleChange} className={checkClass} />
                <span className="font-bold text-slate-700 text-sm">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact and Time */}
        <div className={sectionClass}>
          <h3 className={titleClass}><Phone className="w-5 h-5 text-indigo-500" /> Aloqa va Ish vaqti</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Asosiy Telefon</label>
              <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Telegram username/link</label>
              <input type="text" name="telegram" value={formData.telegram} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instagram</label>
              <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email manzili</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Veb-sayt</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Ish vaqti</label>
              <input type="text" name="working_hours" value={formData.working_hours} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className={sectionClass}>
          <h3 className={titleClass}><Image className="w-5 h-5 text-indigo-500" /> Media fayllar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Markaz logotipi</label>
              {currentImages.logo && <img src={currentImages.logo} alt="Logo" className="h-16 mb-2 rounded-lg object-cover" />}
              <input type="file" accept="image/*" name="logo" onChange={handleChange} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 p-2 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className={labelClass}>Bino rasmi (Cover)</label>
              {currentImages.building_image && <img src={currentImages.building_image} alt="Bino" className="h-16 mb-2 rounded-lg object-cover" />}
              <input type="file" accept="image/*" name="building_image" onChange={handleChange} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 p-2 border border-slate-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Admin Management */}
        {user?.is_superuser && (
          <div className={sectionClass}>
             <h3 className={titleClass}><ShieldAlert className="w-5 h-5 text-indigo-500" /> Biriktirilgan Adminlar</h3>
             <div className="flex justify-between items-center mb-3">
              <label className={labelClass}>Mavjud adminlarni tanlang yoki yarating *</label>
              <button type="button" onClick={() => setIsAddingNewAdmin(!isAddingNewAdmin)} className="text-indigo-600 text-sm font-bold hover:underline">
                {isAddingNewAdmin ? "Mavjud adminlarni tanlash" : "+ Yangi admin yaratish"}
              </button>
             </div>
             
             {isAddingNewAdmin ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-4 bg-slate-50 rounded-xl border border-indigo-100">
                  <input type="text" placeholder="Foydalanuvchi nomi (username)" value={newAdminData.username} onChange={e => setNewAdminData({...newAdminData, username: e.target.value})} className={inputClass} />
                  <input type="password" placeholder="Parol" value={newAdminData.password} onChange={e => setNewAdminData({...newAdminData, password: e.target.value})} className={inputClass} />
                  <input type="text" placeholder="Ismi" value={newAdminData.first_name} onChange={e => setNewAdminData({...newAdminData, first_name: e.target.value})} className={inputClass} />
                  <input type="text" placeholder="Familiyasi" value={newAdminData.last_name} onChange={e => setNewAdminData({...newAdminData, last_name: e.target.value})} className={inputClass} />
                  <div className="sm:col-span-2">
                    <button type="button" onClick={handleCreateNewAdmin} className="bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold w-full hover:bg-indigo-700 transition">
                      Yaratish va ro'yxatga qo'shish
                    </button>
                  </div>
              </div>
             ) : (
              <div className="border border-slate-200 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                 {users.map(u => (
                   <label key={u.id} className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border ${formData.admins?.includes(u.id) ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
                     <input type="checkbox" checked={formData.admins?.includes(u.id) || false} onChange={(e) => {
                       let newAdmins = formData.admins ? [...formData.admins] : [];
                       if (e.target.checked) newAdmins.push(u.id); else newAdmins = newAdmins.filter(id => id !== u.id);
                       setFormData({ ...formData, admins: newAdmins });
                     }} className={checkClass} />
                     <div><span className="text-sm font-bold text-slate-800">@{u.username}</span></div>
                   </label>
                 ))}
                 {users.length === 0 && <div className="col-span-3 text-center text-sm text-slate-400 py-4">Hozircha adminlar yo'q</div>}
              </div>
             )}
          </div>
        )}

        <button type="submit" className="w-full py-5 text-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black rounded-2xl shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1">
          O'zgarishlarni Saqlash
        </button>
      </form>
    </div>
  );
}

export default EditCenter;
"""
    )
