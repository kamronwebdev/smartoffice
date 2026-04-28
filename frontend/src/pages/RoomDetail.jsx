import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, ImageOff, Maximize, Users, Layers, Coins, Activity, AlignLeft } from 'lucide-react';
import api from '../services/api';
import { formatPrice } from '../utils/formatters';

function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (room) {
      document.title = `Xona ${room.room_number} - ${room.business_center_name || ''} | SmartOffice`;
    } else {
      document.title = "Xona ma'lumotlari | SmartOffice";
    }
  }, [room]);

  useEffect(() => {
    api.get(`/rooms/${id}/`).then(response => {
      setRoom(response.data);
    });
  }, [id]);

  const paginate = (newDirection) => {
    if (!room?.images?.length) return;
    setDirection(newDirection);
    setCurrentImageIndex((prev) => {
      let nextIndex = prev + newDirection;
      if (nextIndex < 0) nextIndex = room.images.length - 1;
      if (nextIndex >= room.images.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const dragEndHandler = (e, { offset, velocity }) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe > 10000) {
      if (offset.x < 0) {
        paginate(1);
      } else {
        paginate(-1);
      }
    }
  };

  if (!room) return (
    <div className="flex justify-center flex-col items-center h-[50vh] gap-4">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-6 px-4">
      <Link to={room.business_center ? `/center/${room.business_center}` : "/"} className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-4 md:mb-6 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 active:scale-95 text-sm">
        <ArrowLeft className="w-5 h-5" /> Qaytish
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-4 md:p-6 shadow-xl shadow-indigo-100/40 border border-slate-100">
        
        {/* CAROUSEL */}
        {room.images && room.images.length > 0 ? (
          <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] mb-6 rounded-2xl overflow-hidden bg-slate-900 group cursor-grab active:cursor-grabbing">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentImageIndex}
                src={room.images[currentImageIndex].image}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={dragEndHandler}
                className="absolute w-full h-full object-cover"
                alt={`Room image ${currentImageIndex + 1}`}
              />
            </AnimatePresence>

            {room.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex gap-2 justify-center items-center backdrop-blur-md transition-all focus:outline-none opacity-100 md:opacity-0 group-hover:opacity-100 z-10">
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); paginate(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex justify-center items-center backdrop-blur-md transition-all focus:outline-none opacity-100 md:opacity-0 group-hover:opacity-100 z-10">
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
                  {room.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 w-2'}`}
                    />
                 ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-[200px] mb-6 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 text-slate-400">
            {room.building_image ? (
               <img src={room.building_image} className="w-full h-full object-cover rounded-2xl" alt="Rasm" />
            ) : (
               <><ImageOff className="w-10 h-10 mb-2" /><span className="font-bold text-sm">Rasm yo'q</span></>
            )}
          </div>
        )}

        {/* DETAILS */}
        <div className="flex flex-col gap-4">
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              Xona: {room.room_number}
              {room.room_type_name && <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{room.room_type_name}</span>}
            </h1>
            
            <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border shadow-sm w-max ${
              room.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              room.status === 'OCCUPIED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <Activity className="w-4 h-4" />
              {room.status === 'AVAILABLE' ? "Bo'sh" : room.status === 'OCCUPIED' ? (room.assigned_to || 'Band') : "Ta'mirda"}
            </div>
          </div>

          {/* KEY ICONS STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {/* Price */}
            <div className="flex flex-col items-center justify-center text-center p-2 bg-white rounded-xl shadow-sm">
              <Coins className="w-7 h-7 text-indigo-500 mb-1" />
              <p className="text-lg md:text-xl font-bold italic text-indigo-600 leading-tight" style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                {room.price ? formatPrice(room.price) : '?'}
              </p>
              {room.price && (
                <span className="text-[10px] uppercase font-bold text-slate-400">
                   {room.currency} / {room.price_period === 'HOURLY' ? 'soat' : room.price_period === 'DAILY' ? 'kun' : 'oy'}
                </span>
              )}
            </div>

            {/* Area */}
            <div className="flex flex-col items-center justify-center text-center p-2 bg-white rounded-xl shadow-sm">
              <Maximize className="w-7 h-7 text-sky-500 mb-1" />
              <p className="text-lg md:text-xl font-black text-slate-800 leading-tight">{room.area}</p>
              <span className="text-[10px] uppercase font-bold text-slate-400">m²</span>
            </div>

            {/* Capacity */}
            <div className="flex flex-col items-center justify-center text-center p-2 bg-white rounded-xl shadow-sm">
              <Users className="w-7 h-7 text-amber-500 mb-1" />
                <p className="text-lg md:text-xl font-black text-slate-800 leading-tight">{room.capacity || 'Mavjud emas'}</p>
                <span className="text-[10px] uppercase font-bold text-slate-400">kishi</span>
            </div>

            {/* Floor */}
            <div className="flex flex-col items-center justify-center text-center p-2 bg-white rounded-xl shadow-sm">
              <Layers className="w-7 h-7 text-rose-400 mb-1" />
              <p className="text-lg md:text-xl font-black text-slate-800 leading-tight">{room.floor}</p>
              <span className="text-[10px] uppercase font-bold text-slate-400">qavat</span>
            </div>
          </div>

          {/* DESC */}
          {room.description && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5 mb-2 text-slate-400 font-bold uppercase tracking-wider text-xs">
                <AlignLeft className="w-4 h-4" /> INFO
              </div>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                {room.description}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    };
  }
};

export default RoomDetail;
