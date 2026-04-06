import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Maximize, DollarSign, Activity, User, Users, Layers, DoorOpen, Smartphone, Map, ArrowUpRight } from 'lucide-react';
import api from '../services/api';
import { formatPhoneNumber, formatPrice } from '../utils/formatters';

function CenterDetail() {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const [rooms, setRooms] = useState([]);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterFloor, setFilterFloor] = useState('');

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
  
  const filteredRooms = rooms.filter(room => {
    const matchStatus = filterStatus === 'ALL' || room.status === filterStatus;
    const matchFloor = filterFloor === '' || Number(room.floor) === Number(filterFloor);
    return matchStatus && matchFloor;
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

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-3 md:pt-4 border-t border-slate-100">
                {center.contact_phone && (
                  <a href={`tel:${center.contact_phone}`} className="bg-white border rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm flex items-center gap-3 md:gap-4 group cursor-pointer hover:border-green-200 hover:shadow-md transition-all w-full sm:w-auto active:scale-95">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors shrink-0"><Smartphone className="w-5 h-5 md:w-6 md:h-6" /></div>
                     <div>
                       <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Telefon</p>
                       <p className="text-sm md:text-base text-slate-800 font-black">{formatPhoneNumber(center.contact_phone)}</p>
                     </div>
                  </a>
                )}
                {center.map_link && (
                  <a href={center.map_link} target="_blank" rel="noopener noreferrer" className="bg-white border rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm flex items-center gap-3 md:gap-4 hover:border-blue-400 hover:shadow-md transition-all group w-full sm:w-auto active:scale-95">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0"><Map className="w-5 h-5 md:w-6 md:h-6" /></div>
                     <div>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Xarita</p>
                       <p className="text-blue-600 font-black flex items-center gap-1">Kartada ko'rish <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></p>
                     </div>
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
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
              <button onClick={() => setFilterStatus('ALL')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${filterStatus === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Barchasi</button>
              <button onClick={() => setFilterStatus('AVAILABLE')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${filterStatus === 'AVAILABLE' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Bo'sh</button>
              <button onClick={() => setFilterStatus('OCCUPIED')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${filterStatus === 'OCCUPIED' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Band</button>
              <button onClick={() => setFilterStatus('MAINTENANCE')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${filterStatus === 'MAINTENANCE' ? 'bg-orange-400 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>Ta'mirda</button>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-200">
              <span className="text-sm font-bold text-slate-500">Qavat:</span>
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
    </div>
  );
}

export default CenterDetail;