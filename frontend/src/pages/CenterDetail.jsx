import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Maximize, DollarSign, Activity, User, Users, Layers, DoorOpen, Smartphone, Map, ArrowUpRight, Image as ImageIcon, Crown, Sparkles, ChevronDown, X, Clock, ArrowUpDown, Car, Wifi, Wind, Flame, ShieldCheck, MonitorPlay, ExternalLink, Send, Globe, Building2, Phone , Camera } from 'lucide-react';
import api from '../services/api';
import { formatPhoneNumber, formatPrice } from '../utils/formatters';


const AmenityCard = ({ icon, label }) => (
  <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
      {icon}
    </div>
    <span className="text-xs sm:text-sm font-bold text-slate-700">{label}</span>
  </div>
);

const ContactCard = ({ href, icon, label, value, target }) => (
  <a href={href} target={target} rel={target ? "noopener noreferrer" : undefined} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-2 hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 transition-all group overflow-hidden">
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-black text-slate-700 truncate w-full" title={value}>{value}</p>
    </div>
  </a>
);

const RoomImageCarousel = ({ room }) => {
  const images = room.images?.map(img => img.image).filter(Boolean) || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="h-52 sm:h-56 md:h-60 bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center text-slate-300 relative">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm font-bold">Rasm yo'q</p>
        </div>
        {room.room_type_name && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm z-20">
            {room.room_type_name}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-52 sm:h-56 md:h-60 overflow-hidden bg-slate-100 group">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={room.room_number}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent z-10" />
      {room.room_type_name && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm z-20">
          {room.room_type_name}
        </div>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function CenterDetail() {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterFloor, setFilterFloor] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    if (center) {
      document.title = `${center.name} | SmartOffice`;
    } else {
      document.title = "Markaz haqida | SmartOffice";
    }
  }, [center]);

  useEffect(() => {
    // Fetch center details
    api.get(`/business-centers/${id}/`).then(response => {
      setCenter(response.data);
    });
    // Fetch rooms for this center
    api.get(`/rooms/?business_center=${id}`).then(response => {
      setRooms(response.data.results || response.data);
    });
  }, [id]);

  // Get unique floors for the dropdown filter, ensuring proper sorting.
  const uniqueFloors = [...new Set(rooms.map(room => Number(room.floor)))].sort((a, b) => a - b);
  // Unique room types for the type filter (preserve display order)
  const uniqueTypes = [...new Set(rooms.map(room => room.room_type_name).filter(Boolean))];

  const roomSortRank = (room) => {
    const roomType = (room.room_type_name || '').toLowerCase();
    if (roomType.includes('meeting')) return 0;
    if (roomType.includes('conference')) return 1;
    return 2;
  };

  const getRoomCoverImage = (room) => room.images?.find((image) => image.is_main)?.image || room.images?.[0]?.image || null;
  
  const filteredRooms = rooms.filter(room => {
    const matchStatus = filterStatus === 'ALL' || room.status === filterStatus;
    const matchFloor = filterFloor === '' || Number(room.floor) === Number(filterFloor);
    const matchType = filterType === '' || ((room.room_type_name || '').toLowerCase() === filterType.toLowerCase());
    return matchStatus && matchFloor && matchType;
  }).sort((a, b) => {
    const rankDiff = roomSortRank(a) - roomSortRank(b);
    if (rankDiff !== 0) return rankDiff;
    return Number(a.floor) - Number(b.floor);
  });

  if (!center) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-8 px-4 md:px-0">
      <Link to="/" className="inline-flex items-center gap-1.5 md:gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 md:mb-8 transition-colors bg-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl shadow-sm border border-slate-100 text-sm md:text-base">
        <span className="text-lg md:text-xl">←</span> Barcha markazlarga qaytish
      </Link>
      
      <div className="bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-10 md:mb-16 border border-slate-100 relative flex flex-col">
        {center.building_image && (
          <div className="w-full h-56 md:h-[400px] relative overflow-hidden bg-slate-100 shrink-0">
            <img src={center.building_image} alt={center.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          </div>
        )}

        {!center.building_image && (
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-indigo-100 via-purple-50 to-transparent rounded-bl-full -z-10 opacity-70 border-b border-slate-100"></div>
        )}
        
        <div className={`p-6 sm:p-10 md:p-14 relative z-10 flex-grow bg-white ${center.building_image ? '-mt-8 md:-mt-16 rounded-t-[2rem] md:rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]' : ''}`}>
          
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-8 relative">
              

            <div className="space-y-3 md:space-y-4 w-full">
              <div className="flex flex-col gap-2 mt-2 md:mt-4">
                {center.logo && (
                  <div className={`w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden shrink-0 border-2 md:border-4 border-white shadow-xl bg-white ${center.building_image ? '-mt-16 md:-mt-24 z-20 relative' : ''}`}>
                      <img src={center.logo} alt="logo" className="w-full h-full object-contain p-1.5 md:p-2" />
                  </div>
                )}
                <div>
                  <span className={`mb-2 px-3 py-1 md:px-4 md:py-1.5 rounded-lg text-xs md:text-sm font-bold border inline-block ${!center.building_image ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    Premium Markaz
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mt-1 md:mt-2 leading-tight">{center.name}</h1>
                </div>
              </div>

              <div className="pt-2 md:pt-4 space-y-1.5 md:space-y-2">
                <p className="text-base sm:text-lg md:text-2xl font-medium flex items-center gap-2 md:gap-3 text-slate-500">
                  <MapPin className="w-5 h-5 md:w-8 md:h-8 text-indigo-500 shrink-0" /> <span className="leading-snug">{center.address}</span>
                </p>
                <p className="text-sm md:text-lg font-medium flex items-center gap-2 md:gap-3 text-slate-400">
                  <Maximize className="w-4 h-4 md:w-6 md:h-6 text-indigo-400 shrink-0" /> Qavatlar soni: {center.total_floors}
                </p>
              </div>

              {center.description && (
                <div className="mt-4 md:mt-6 mb-6 md:mb-8 bg-slate-50 p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 relative">
                  <div className="absolute top-0 right-4 md:right-6 -translate-y-1/2 bg-white px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-slate-100 shadow-sm text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    Markaz tavsifi
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {center.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-4 md:pt-5 border-t border-slate-100">
                <button 
                  onClick={() => setIsCenterModalOpen(true)}
                  className="bg-indigo-600 text-white rounded-xl md:rounded-2xl px-6 md:px-8 py-3 md:py-4 shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3 md:gap-4 hover:bg-indigo-700 hover:shadow-lg transition-all group w-full sm:w-auto active:scale-95 border border-indigo-500 font-bold"
                >
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-indigo-300 group-hover:text-white transition-colors" />
                  <span className="text-sm md:text-base tracking-wide">Batafsil ma'lumot va Qulayliklar</span>
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </button>

                {center.contact_phone && (
                  <a href={`tel:${center.contact_phone}`} className="bg-white border text-slate-600 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm flex items-center justify-center gap-3 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md transition-all w-full sm:w-auto active:scale-95 font-bold">
                     <Smartphone className="w-5 h-5" /> <span className="text-sm md:text-base tracking-wide">Qo'ng'iroq</span>
                  </a>
                )}
                {center.map_link && (
                  <a href={center.map_link} target="_blank" rel="noopener noreferrer" className="bg-white border text-slate-600 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm flex items-center justify-center gap-3 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md transition-all w-full sm:w-auto active:scale-95 font-bold">
                     <Map className="w-5 h-5" /> <span className="text-sm md:text-base tracking-wide">Xarita</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <span className="bg-slate-100 p-2 rounded-xl"><DoorOpen className="w-6 h-6 inline text-slate-600" /></span> Ofis Xonalari
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex-wrap">
              <button onClick={() => setFilterStatus('ALL')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${filterStatus === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Barchasi</button>
              <button onClick={() => setFilterStatus('AVAILABLE')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${filterStatus === 'AVAILABLE' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Bo'sh</button>
              <button onClick={() => setFilterStatus('OCCUPIED')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${filterStatus === 'OCCUPIED' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Band</button>
              <button onClick={() => setFilterStatus('MAINTENANCE')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${filterStatus === 'MAINTENANCE' ? 'bg-orange-400 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Ta'mirda</button>

              <div className="w-px h-6 bg-slate-100 mx-1 hidden sm:block" />

              <span className="text-sm font-bold text-slate-500 whitespace-nowrap">Tur:</span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                <button onClick={() => setFilterType('')} className={`px-3 py-1 rounded-lg text-sm font-bold transition-all active:scale-95 whitespace-nowrap ${filterType === '' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Barchasi</button>
                {uniqueTypes.map(type => (
                  <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1 rounded-lg text-sm font-bold transition-all active:scale-95 whitespace-nowrap ${filterType === type ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>{type}</button>
                ))}
                {filterType && (
                  <button onClick={() => setFilterType('')} className="ml-2 text-slate-400 hover:text-slate-600 p-1 rounded-full">✕</button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-200">
              <span className="text-sm font-bold text-slate-500 whitespace-nowrap">Qavat:</span>
              <select 
                value={filterFloor} 
                onChange={e => setFilterFloor(e.target.value)} 
                className="w-full px-2 py-1 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-bold text-slate-700 cursor-pointer"
              >
                <option value="">Barchasi</option>
                {uniqueFloors.map(floor => (
                  <option key={floor} value={floor}>
                    {floor === 0 ? "Podval (0)" : floor < 0 ? `Podval (${floor})` : `${floor}-qavat`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredRooms.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 font-bold bg-white rounded-3xl border border-slate-100 shadow-sm">
              Ushbu parametrlar bo'yicha hech qanday ofis topilmadi
            </div>
          ) : (
            filteredRooms.map((room, idx) => (
              <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1, type: "spring", stiffness: 100 }}
              className="group relative bg-white border border-slate-100 hover:border-indigo-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              
              <RoomImageCarousel room={room} />

              <div className={`h-1.5 w-full ${room.status === 'OCCUPIED' ? 'bg-rose-500' : room.status === 'MAINTENANCE' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
              
              <Link to={`/room/${room.id}`} className="p-6 flex-grow flex flex-col cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight whitespace-nowrap"><DoorOpen className="w-6 h-6 inline mr-1 text-slate-500" /> {room.room_number}</h3>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">Xona</p>
                    {room.room_type_name && <span className="mt-2 inline-block bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-widest">{room.room_type_name}</span>}
                  </div>
                  
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm border
                    ${room.status === 'OCCUPIED' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                      room.status === 'MAINTENANCE' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                      'bg-emerald-50 text-emerald-700 border-emerald-100'}
                  `}>
                    <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'OCCUPIED' ? 'bg-rose-500' : room.status === 'MAINTENANCE' ? 'bg-orange-500' : 'bg-emerald-500'} ${room.status === 'AVAILABLE' ? 'animate-pulse' : ''}`}></span>
                    {room.status === 'OCCUPIED' ? 'Band' : room.status === 'MAINTENANCE' ? 'Ta\'mirda' : 'Bo\'sh'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 flex-grow">
                  <div className="bg-slate-50 rounded-2xl p-2 sm:p-3 flex flex-col justify-center items-center text-center group-hover:bg-indigo-50/50 transition-colors">
                    <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 mb-1" />
                    <span className="text-slate-700 font-bold text-xs sm:text-sm">
                      {Number(room.floor) <= 0 ? `Podval ${room.floor}` : `${room.floor}-qavat`}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-2 sm:p-3 flex flex-col justify-center items-center text-center group-hover:bg-indigo-50/50 transition-colors">
                    <Maximize className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 mb-1" />
                    <span className="text-slate-700 font-bold text-xs sm:text-sm">{room.area} kv.m</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-2 sm:p-3 flex flex-col justify-center items-center text-center group-hover:bg-indigo-50/50 transition-colors">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 mb-1" />
                    <span className="text-slate-700 font-bold text-xs sm:text-sm">{room.capacity ? room.capacity : '?'} kishi</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-end gap-2 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-50/50 group-hover:bg-indigo-50 transition-colors">
                    <div>
                      <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Ijara Narxi</p>
                      <p className="text-2xl font-black text-indigo-600 leading-none">
                        {room.price ? formatPrice(room.price) : 'Kelishilgan'} 
                        {room.price && <span className="text-sm font-bold text-indigo-400 ml-1">{room.currency}</span>}
                      </p>
                    </div>
                    {room.price && (
                      <span className="text-xs font-bold text-slate-500 mb-[2px] ml-auto">
                        / {room.price_period === 'HOURLY' ? 'soat' : room.price_period === 'DAILY' ? 'kun' : 'oy'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
          )}
        </div>

      {/* Center Details Modal */}
      <AnimatePresence>
        {isCenterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCenterModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
            >
              <style dangerouslySetInlineStyle={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
              `}} />

              {/* Header */}
              <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10 shrink-0">
                <div className="pr-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight flex items-center gap-3">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 shrink-0" />
                    Barcha ma'lumotlar
                  </h2>
                  <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider line-clamp-1">{center.name}</p>
                </div>
                <button 
                  onClick={() => setIsCenterModalOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-colors active:scale-95 shrink-0"
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              </div>
            
            

              {/* Body */}
              <div className="overflow-y-auto flex-grow p-6 sm:p-8 bg-slate-50/50 space-y-8 sm:space-y-10 custom-scrollbar">
                
                {/* 1. Asosiy parametrlar */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4 ml-1">Asosiy Parametrlar</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 items-center hover:border-indigo-300 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ish vaqti</p>
                        <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{center.working_hours || "Ko'rsatilmagan"}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 items-center hover:border-indigo-300 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Qavatlar</p>
                        <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{center.total_floors || "Noma'lum"}</p>
                      </div>
                    </div>

                    {center.building_class && (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 items-center hover:border-indigo-300 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                          <Crown className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bino sinfi</p>
                          <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{center.building_class}-klass</p>
                        </div>
                      </div>
                    )}
                    
                    {center.built_year && (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 items-center hover:border-indigo-300 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Qurilgan yili</p>
                          <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{center.built_year}-yil</p>
                        </div>
                      </div>
                    )}

                    {center.total_area && (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 items-center hover:border-indigo-300 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                          <Maximize className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Umumiy maydoni</p>
                          <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{center.total_area} kv.m</p>
                        </div>
                      </div>
                    )}
                    
                    {center.has_parking && (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 items-center hover:border-indigo-300 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                          <Car className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avtoturargoh</p>
                          <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{center.parking_capacity || "Bor"} ta o'rin</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Qulayliklar va Infratuzilma */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4 ml-1">Markaz infratuzilmasi</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {center.has_parking && <AmenityCard icon={<Car className="w-6 h-6" />} label="Avtoturargoh" />}
                    {center.elevator_count > 0 && <AmenityCard icon={<ArrowUpDown className="w-6 h-6" />} label={`${center.elevator_count} ta lift`} />}
                    {center.security_24_7 && <AmenityCard icon={<ShieldCheck className="w-6 h-6" />} label="24/7 Qo'riqlash" />}
                    {center.access_control && <AmenityCard icon={<DoorOpen className="w-6 h-6" />} label="Access Control" />}
                    {center.has_reception && <AmenityCard icon={<User className="w-6 h-6" />} label="Qabulxona" />}
                    {center.has_backup_power && <AmenityCard icon={<Activity className="w-6 h-6" />} label="Zaxira quvvat" />}
                    {center.heating_cooling && <AmenityCard icon={<Flame className="w-6 h-6" />} label={center.heating_cooling} />}
                    {center.has_wifi && <AmenityCard icon={<Wifi className="w-6 h-6" />} label="Wi-Fi mavjud" />}
                    {center.has_meeting_rooms && <AmenityCard icon={<Users className="w-6 h-6" />} label="Majlislar xonasi" />}
                    {center.has_conference_hall && <AmenityCard icon={<MonitorPlay className="w-6 h-6" />} label="Konferens zal" />}
                    {center.has_kitchen && <AmenityCard icon={<Crown className="w-6 h-6" />} label="Oshxona" />}
                    {center.has_lounge && <AmenityCard icon={<Sparkles className="w-6 h-6" />} label="Lounge oromgoh" />}
                    {center.has_coffee_zone && <AmenityCard icon={<Activity className="w-6 h-6" />} label="Kofe zonasi" />}
                    {center.has_terrace && <AmenityCard icon={<Crown className="w-6 h-6" />} label="Terrasa" />}
                    {center.has_chill_zone && <AmenityCard icon={<Sparkles className="w-6 h-6" />} label="Chill Zone" />}
                  </div>
                </div>

                {/* 3. Aloqa va Tarmoqlar */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4 ml-1">Aloqa va Ijtimoy Tarmoqlar</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {center.contact_phone && (
                      <ContactCard href={`tel:${center.contact_phone}`} icon={<Smartphone className="w-5 h-5" />} label="Telefon" value={center.contact_phone} />
                    )}
                    {center.telegram && (
                      <ContactCard href={`https://t.me/${center.telegram.replace('@', '').replace('https://t.me/', '')}`} icon={<Send className="w-5 h-5" />} label="Telegram" value={"@" + center.telegram.replace('@', '').replace('https://t.me/', '')} target="_blank" />
                    )}
                    {center.instagram && (
                      <ContactCard href={`https://instagram.com/${center.instagram.replace('@', '').replace('https://instagram.com/', '')}`} icon={<Camera className="w-5 h-5" />} label="Instagram" value={"@" + center.instagram.replace('@', '').replace('https://instagram.com/', '')} target="_blank" />
                    )}
                    {center.website && (
                      <ContactCard href={center.website.startsWith('http') ? center.website : `https://${center.website}`} icon={<Globe className="w-5 h-5" />} label="Vebsayt" value={center.website.replace('https://', '').replace('http://', '')} target="_blank" />
                    )}
                    {center.map_link && (
                      <ContactCard href={center.map_link} icon={<Map className="w-5 h-5" />} label="Manzil" value="Xaritadan ko'rish" target="_blank" />
                    )}
                    
                    {!center.contact_phone && !center.telegram && !center.instagram && !center.website && !center.map_link && (
                        <div className="col-span-full py-6 text-center text-slate-400 font-bold bg-white rounded-2xl border border-slate-100 shadow-sm text-sm">
                          Aloqa ma'lumotlari kiritilmagan
                        </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CenterDetail;