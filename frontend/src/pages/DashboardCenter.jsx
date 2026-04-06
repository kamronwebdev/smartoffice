import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Maximize, DollarSign, Activity, User, Users, Layers, DoorOpen, Smartphone, Pencil, Trash2, QrCode, Plus, Download, Share2, Copy, X } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { formatPrice } from '../utils/formatters';

function DashboardCenter() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [center, setCenter] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomTypeMode, setNewRoomTypeMode] = useState(false);
  const [newRoomTypeName, setNewRoomTypeName] = useState("");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  const [qrModal, setQrModal] = useState({ isOpen: false, item: null, type: '' });

  const [roomForm, setRoomForm] = useState({
    room_number: '', room_type: '', floor: '', area: '', price: '', price_period: 'MONTHLY', currency: 'UZS', status: 'AVAILABLE', capacity: '', assigned_to: ''
  });

  useEffect(() => {
    if (center) {
      document.title = `${center.name} - Boshqaruv | SmartOffice`;
    } else {
      document.title = "Markazni boshqarish | SmartOffice";
    }
  }, [center]);

  const fetchData = async () => {
    try {
      const cRes = await api.get(`/business-centers/${id}/`);
      setCenter(cRes.data);
      const rRes = await api.get(`/rooms/?business_center=${id}`);
      setRooms(rRes.data.results || rRes.data);
      const tRes = await api.get(`/room-types/?business_center=${id}`);
      setRoomTypes(tRes.data.results || tRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRoomChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setRoomForm({ ...roomForm, [e.target.name]: value });
  };

  const handleOpenQrModal = (item, type) => {
    setQrModal({ isOpen: true, item, type });
  };

  const handleDownloadQr = async () => {
    try {
      const response = await fetch(qrModal.item.qr_code);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = qrModal.type === 'center' 
        ? `${center.name}_QR_Kod.png` 
        : `${center.name}_${qrModal.item.room_number}-Xona_QR_Kod.png`;
      
      link.download = fileName.replace(/\s+/g, '_');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download QR code', e);
      // Fallback
      const link = document.createElement('a');
      link.href = qrModal.item.qr_code;
      
      const fallbackFileName = qrModal.type === 'center' 
        ? `${center.name}_QR_Kod.png` 
        : `${center.name}_${qrModal.item.room_number}-Xona_QR_Kod.png`;
      
      link.download = fallbackFileName.replace(/\s+/g, '_');
      link.target = "_blank";
      link.click();
    }
  };

  const handleShareQrUrl = async () => {
    try {
      // Use the frontend URL or specific room URL if possible, otherwise whatever link they need.
      // Usually, QR code image contains a specific payload. We'll share the current page or a specific route.
      // E.g., https://smartoffice/center/1
      const shareUrl = qrModal.type === 'center' 
        ? `${window.location.origin}/centers/${center.id}` 
        : `${window.location.origin}/rooms/${qrModal.item.id}`; 
      
      if (navigator.share) {
        await navigator.share({
          title: qrModal.type === 'center' ? center.name : `Xona №${qrModal.item.room_number}`,
          text: "Ushbu QR kod orqali bino yoki xona ma'lumotlari bilan tanishing.",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Havola nusxalandi!");
      }
    } catch (error) {
      console.error('Error sharing', error);
    }
  };

  const handleCopyQrUrl = async () => {
    try {
      const shareUrl = qrModal.type === 'center' 
        ? `${window.location.origin}/centers/${center.id}` 
        : `${window.location.origin}/rooms/${qrModal.item.id}`; 
      await navigator.clipboard.writeText(shareUrl);
      alert("Havola nusxalandi!");
    } catch (e) {
      console.log(e);
    }
  };
  
  const handleCreateRoomType = async () => {
    if (!newRoomTypeName.trim()) return;
    try {
      const res = await api.post(`/room-types/`, { name: newRoomTypeName, business_center: id });
      setRoomTypes([...roomTypes, res.data]);
      setRoomForm({ ...roomForm, room_type: res.data.id });
      setNewRoomTypeMode(false);
      setNewRoomTypeName("");
    } catch(e) {
      alert("Xatolik: Xona turi yaratilmadi");
    }
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...roomForm };
      // Keraksiz va fayl turlarini (URL keladigan) jo'natmaslik uchun o'chirib tashlaymiz
      delete payload.qr_code;
      delete payload.images;
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.business_center;

      if (editingRoom) {
        await api.patch(`/rooms/${editingRoom}/`, payload);
      } else {
        await api.post(`/rooms/`, { ...payload, business_center: id });
      }
      setShowRoomModal(false);
      setEditingRoom(null);
      fetchData();
    } catch (e) {
      console.error(e.response?.data || e);
      alert("Xatolik yuz berdi: " + JSON.stringify(e.response?.data || e.message));
    }
  };

  const openForm = (room = null) => {
    if (room) {
      setEditingRoom(room.id);
      setRoomForm(room);
    } else {
      setEditingRoom(null);
      setRoomForm({
        room_number: '', room_type: '', floor: '', area: '', price: '', price_period: 'MONTHLY', currency: 'UZS', status: 'AVAILABLE', capacity: '', assigned_to: ''
      });
    }
    setShowRoomModal(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Rostdan ham ofis xonasini o'chirib tashlamoqchimisiz?")) {
      await api.delete(`/rooms/${roomId}/`);
      fetchData();
    }
  };

  if (!center) return <div className="text-center py-20">Yuklanmoqda...</div>;

  return (
    <>
    <div className="max-w-7xl mx-auto mt-6 md:mt-8 px-4 sm:px-6 lg:px-8 mb-10 pb-16 md:pb-0">
      <Link to="/dashboard" className="text-indigo-600 font-bold mb-6 inline-block hover:text-indigo-800 transition-colors active:scale-95">â† Kabinetga qaytish</Link>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6 md:mb-8">
        <div className="flex flex-row items-center gap-3 md:gap-4 text-left">
          {center.logo && (
            <div className="w-16 h-12 md:w-24 md:h-16 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 flex justify-center items-center p-1 relative shrink-0">
                <img src={center.logo} alt="logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight">{center.name} <span className="hidden md:inline">- Boshqaruv</span></h1>
            <p className="text-slate-500 mt-1 md:mt-2 font-medium text-xs md:text-base">Barcha xonalar va sozlamalar</p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full md:w-auto mt-1 md:mt-0 justify-between md:justify-end">
          {center.qr_code && (
            <button onClick={() => setQrModal({ isOpen: true, item: center, type: 'center' })} className="flex-1 md:flex-none justify-center bg-white md:bg-white hover:bg-slate-50 border border-slate-200 py-3 px-4 md:p-3 rounded-xl shadow-sm text-slate-500 hover:text-indigo-600 transition-colors flex items-center md:h-12 md:w-12 gap-2 active:scale-95" title="Markaz QR Kodi">
              <QrCode className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
              <span className="md:hidden font-bold text-sm">QR Kod</span>
            </button>
          )}
          {(user?.is_superuser || center?.admin === user?.id) && (
            <button onClick={() => openForm()} className="flex-1 md:flex-none justify-center bg-indigo-600 text-white py-3 px-4 md:p-3 rounded-xl shadow-lg hover:bg-indigo-700 transition flex items-center md:h-12 md:w-12 gap-2 active:scale-95" title="Yangi Xona Qo'shish">
              <Plus className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
              <span className="md:hidden font-bold text-sm">Qo'shish</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">№{room.room_number}</h3>
                  {room.room_type_name && <span className="bg-indigo-100 text-indigo-700 text-[10px] md:text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider inline-block">{room.room_type_name}</span>}
                </div>
              <div className="flex gap-1 md:gap-2">
                  {room.qr_code && (
                    <button onClick={() => setQrModal({ isOpen: true, item: room, type: 'room' })} className="text-slate-500 hover:text-indigo-600 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-center shadow-sm transition-colors md:text-xs font-bold active:scale-90" title="QR kod">
                      <QrCode className="w-4 h-4" />
                    </button>
                  )}
                 <button onClick={() => openForm(room)} className="text-indigo-500 font-bold bg-indigo-50 p-2 rounded-lg border border-transparent hover:border-indigo-100 hover:bg-indigo-100 flex items-center justify-center transition-colors active:scale-90" title="Tahrirlash"><Pencil className="w-4 h-4" /></button>
                 {(user?.is_superuser || center?.admin === user?.id) && (
                   <button onClick={() => handleDeleteRoom(room.id)} className="text-red-500 font-bold bg-red-50 p-2 rounded-lg border border-transparent hover:border-red-100 hover:bg-red-100 flex items-center justify-center transition-colors active:scale-90" title="O'chirish"><Trash2 className="w-4 h-4" /></button>
                 )}
              </div>
            </div>
            <div className="space-y-3 text-sm text-slate-600 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100/60 shadow-inner">
              <p className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-400 shrink-0" /> <span className="w-20 text-slate-500 font-medium">Qavat:</span> <span className="font-bold text-slate-800">{Number(room.floor) <= 0 ? `Podval (${room.floor})` : `${room.floor}-qavat`}</span></p>
              <p className="flex items-center gap-2"><Maximize className="w-4 h-4 text-slate-400 shrink-0" /> <span className="w-20 text-slate-500 font-medium">Maydon:</span> <span className="font-bold text-slate-800">{room.area} kv.m</span></p>
              <p className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400 shrink-0" /> <span className="w-20 text-slate-500 font-medium">Sig'im:</span> <span className="font-bold text-slate-800">{room.capacity ? room.capacity : '?'} kishi</span></p>
              <p className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-400 shrink-0" /> <span className="w-20 text-slate-500 font-medium">Narx:</span> <span className="font-bold text-indigo-600">{formatPrice(room.price)} {room.currency}</span> <span className="text-xs font-bold text-slate-400">/ {room.price_period === 'HOURLY' ? 'soat' : room.price_period === 'DAILY' ? 'kun' : 'oy'}</span></p>
              
              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-200/60">
                <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="w-20 text-slate-500 font-medium">Holat:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border">{room.status === 'OCCUPIED' ? "Band" : room.status === 'MAINTENANCE' ? "Ta'mirda" : "Bo'sh"}</span>
              </div>

              {room.status === 'OCCUPIED' && (
                <div className="flex items-center gap-2 mt-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm mt-2">
                  <User className="w-4 h-4 text-indigo-500 shrink-0" /> <span className="text-xs text-slate-500 font-medium">Ijarachi:</span> <span className="font-bold text-slate-800 truncate">{room.assigned_to}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showRoomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-[70]">
          <div className="bg-white p-5 sm:p-8 md:p-10 rounded-[2rem] w-full max-w-lg shadow-2xl relative max-h-[90vh] md:max-h-[85vh] flex flex-col border border-slate-100">
            <button onClick={() => setShowRoomModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-400 hover:text-slate-800 font-bold transition-colors">
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <h2 className="text-xl md:text-2xl font-black mb-5 md:mb-6 text-slate-800 pr-10">{editingRoom ? 'Xonani tahrirlash' : 'Yangi Xona'}</h2>
            
            <div className="overflow-y-auto overflow-x-hidden pr-1 md:pr-3 -mr-1 md:-mr-3 scrollbar-thin pb-4">
              <form onSubmit={handleSaveRoom} className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">Xona raqami</label>
                  <input type="text" name="room_number" value={roomForm.room_number || ''} onChange={handleRoomChange} required className="w-full px-3 md:px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-bold text-sm md:text-base" placeholder="№" />
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 sm:mb-2 gap-2 sm:gap-0">
                      <label className="block text-xs md:text-sm font-bold text-slate-700">Xona Turi (Tanlash ixtiyoriy)</label>
                      <button type="button" onClick={() => setNewRoomTypeMode(!newRoomTypeMode)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-md sm:bg-transparent sm:px-0 sm:py-0 self-start sm:self-auto">
                          {newRoomTypeMode ? 'Bekor qilish' : '+ Yangi tur'}
                      </button>
                  </div>
                  {newRoomTypeMode ? (
                      <div className="flex gap-2">
                          <input type="text" value={newRoomTypeName} onChange={e => setNewRoomTypeName(e.target.value)} placeholder="Masalan: Majlislar zali" className="flex-grow px-3 py-2.5 md:py-2 rounded-xl text-sm md:text-base border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium" />
                          <button type="button" onClick={handleCreateRoomType} className="bg-indigo-600 text-white px-4 md:px-5 py-2.5 md:py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md text-sm md:text-base whitespace-nowrap">Qo'shish</button>
                      </div>
                  ) : (
                      <select name="room_type" value={roomForm.room_type || ''} onChange={handleRoomChange} className="w-full px-3 md:px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-bold text-sm md:text-base truncate">
                          <option value="">-- Tanlanmagan --</option>
                          {roomTypes.map(rt => (
                              <option key={rt.id} value={rt.id}>{rt.name}</option>
                          ))}
                      </select>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1.5 gap-1">
                      <label className="block text-xs md:text-sm font-bold text-slate-700">Qavat</label>
                      <span className="text-[9px] md:text-[10px] uppercase font-bold text-slate-400">Masalan: 1.5, 0, -1</span>
                    </div>
                    <input type="number" step="0.5" name="floor" value={roomForm.floor || ''} onChange={handleRoomChange} required className="w-full px-3 md:px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-bold text-sm md:text-base" placeholder="0 = Podval" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">Maydon (kv.m)</label>
                    <input type="number" step="0.1" name="area" value={roomForm.area || ''} onChange={handleRoomChange} required className="w-full px-3 md:px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-bold text-sm md:text-base" placeholder="kv.m" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-2">
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">Narx</label>
                      <input type="number" step="0.01" name="price" value={roomForm.price || ''} onChange={handleRoomChange} required className="w-full px-3 md:px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-bold text-sm md:text-base" placeholder="Ummumiy narx" />
                    </div>
                    <div className="grid grid-cols-2 sm:col-span-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">Valyuta</label>
                        <select name="currency" value={roomForm.currency || 'UZS'} onChange={handleRoomChange} className="w-full px-3 md:px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-bold text-sm md:text-base">
                          <option value="UZS">UZS</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">Muddat</label>
                        <select name="price_period" value={roomForm.price_period} onChange={handleRoomChange} className="w-full px-3 md:px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-bold text-sm md:text-base">
                          <option value="HOURLY">Soatlik</option>
                          <option value="DAILY">Kunlik</option>
                          <option value="MONTHLY">Oylik</option>
                        </select>
                      </div>
                    </div>
                </div>
                <div className="mt-2">
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">Holati (Status)</label>
                    <select name="status" value={roomForm.status || 'AVAILABLE'} onChange={handleRoomChange} className="w-full px-3 md:px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-bold text-sm md:text-base">
                      <option value="AVAILABLE">Bo'sh (Available)</option>
                      <option value="OCCUPIED">Band (Occupied)</option>
                      <option value="MAINTENANCE">Ta'mirda (Maintenance)</option>
                    </select>
                </div>
                <div className={`transition-all duration-300 ${roomForm.status === 'OCCUPIED' ? 'bg-indigo-50 p-4 border border-indigo-100 rounded-xl mt-2' : 'h-0 overflow-hidden m-0 p-0 opacity-0'}`}>
                  {roomForm.status === 'OCCUPIED' && (
                    <div className="mt-1">
                      <label className="block text-xs md:text-sm font-bold text-indigo-700 mb-1.5">Ijarachi / Kompaniya nomi</label>
                      <input type="text" name="assigned_to" value={roomForm.assigned_to || ''} onChange={handleRoomChange} className="w-full px-3 md:px-4 py-3 md:py-3.5 rounded-xl border border-indigo-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white transition-all text-slate-800 font-bold text-sm md:text-base" placeholder="Masalan: MCHJ..." />
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-[0_8px_15px_-3px_rgba(79,70,229,0.4)] transition-all text-base md:text-lg mb-4 hover:shadow-[0_12px_20px_-3px_rgba(79,70,229,0.5)] transform hover:-translate-y-0.5 relative z-10 block">
                    {editingRoom ? "O'zgarishlarni saqlash" : "Xonani saqlash"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {qrModal.isOpen && qrModal.item && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[60] transition-opacity duration-300"
          onClick={() => setQrModal({ isOpen: false, item: null, type: '' })}
        >
          <div 
            className="bg-white p-8 md:p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative flex flex-col items-center animate-[scaleIn_0.3s_ease-out_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setQrModal({ isOpen: false, item: null, type: '' })} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 text-xl font-bold bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all">
              <X className="w-5 h-5" />
            </button>
            
            <div className="bg-indigo-50 text-indigo-700 font-bold px-4 py-1.5 rounded-full text-sm mb-6 flex items-center gap-2">
              <QrCode className="w-4 h-4" /> 
              {qrModal.type === 'center' ? center.name : `Xona №${qrModal.item.room_number}`}
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-sm border-2 border-slate-100 mb-8 inline-block overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <img 
                src={qrModal.item.qr_code} 
                alt={qrModal.type === 'center' ? 'Center QR' : 'Room QR'} 
                className="w-56 h-56 md:w-64 md:h-64 object-contain rounded-xl"
              />
            </div>

            <div className="w-full">
              <p className="text-center text-slate-500 font-medium text-sm mb-4">Ushbu QR kodni saqlab oling yoki boshqalar bilan ulashing</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button onClick={handleDownloadQr} className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-2xl transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Yuklab olish</span>
                </button>
                <button onClick={handleShareQrUrl} className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-2xl transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Ulashing</span>
                </button>
              </div>
              <button onClick={handleCopyQrUrl} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all">
                <Copy className="w-5 h-5" />
                <span>Havolani nusxalash</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Animation for Scale In to the Head or globally (it can be in Tailwind config, but inline style works too if simple) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />

    </div>
    </>
  );
}

export default DashboardCenter;

