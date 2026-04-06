import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { formatPrice } from '../utils/formatters';

function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (room) {
      document.title = `Xona №${room.room_number} - ${room.business_center_name || ''} | SmartOffice`;
    } else {
      document.title = "Xona malumotlari | SmartOffice";
    }
  }, [room]);

  useEffect(() => {
    api.get(`/rooms/${id}/`).then(response => {
      setRoom(response.data);
    });
  }, [id]);

  if (!room) return (
    <div className="flex justify-center flex-col items-center h-[50vh] gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      <p className="text-slate-500 font-medium">Yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link to={room.business_center ? `/center/${room.business_center}` : "/"} className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-colors bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-100 active:scale-95">
        <span className="text-xl">←</span> Markazga qaytish
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50 border border-slate-100"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            {room.qr_code && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center gap-4">
                <img src={room.qr_code} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                <p className="text-center text-sm text-slate-500 font-medium">Xona ma'lumotlarini ulashish uchun skanerlang</p>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
              Xona raqami: {room.room_number}
            </h1>
            
            <div className="flex gap-4 my-6">
              <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm border ${
                room.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                room.status === 'OCCUPIED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {room.status === 'AVAILABLE' ? 'Bo\'sh' : room.status === 'OCCUPIED' ? 'Band' : 'Ta\'mirda'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Narxi</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {room.price ? `${formatPrice(room.price)} ${room.currency}` : 'Kelishilgan'}
                  {room.price && (
                    <span className="text-sm font-medium text-slate-500 ml-1">
                      /{room.price_period === 'HOURLY' ? 'soatiga' : room.price_period === 'DAILY' ? 'kuniga' : 'oyiga'}
                    </span>
                  )}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Maydoni va Sig'imi</p>
                <p className="text-lg font-bold text-slate-700">{room.area} kv.m • {room.capacity} kishi</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Qavat</p>
                <p className="text-lg font-bold text-slate-700">{room.floor}-qavat</p>
              </div>
            </div>

            {room.description && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Xona haqida:</h3>
                <p className="text-slate-600 leading-relaxed bg-white border border-slate-100 p-5 rounded-2xl shadow-sm whitespace-pre-wrap">
                  {room.description}
                </p>
              </div>
            )}
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default RoomDetail;