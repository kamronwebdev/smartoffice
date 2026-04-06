import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { formatPhoneNumber } from '../utils/formatters';

function Home() {
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    document.title = "Barcha Biznes Markazlar | SmartOffice";
    api.get('/business-centers/')
      .then(response => {
        setCenters(response.data.results || response.data);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="py-6 md:py-10 px-2 sm:px-4">
      <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4">
        <motion.div initial={{opacity: 0, y:-20}} animate={{opacity: 1, y:0}} className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs md:text-sm mb-1 md:mb-2">
          Hamma uchun ochiq
        </motion.div>
        <motion.h1 initial={{opacity: 0}} animate={{opacity: 1}} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight leading-tight">
          Biznes Markazlar
        </motion.h1>
        <motion.p initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.1}} className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium px-4">
          O'zingiz uchun eng qulay va zamonaviy ofis xonalarini toping.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {centers.map((center, index) => (
          <motion.div
            key={center.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group bg-white rounded-[1.5rem] md:rounded-[2rem] p-1 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col"
          >
            <div className="h-full w-full bg-white rounded-[1.4rem] md:rounded-[1.8rem] relative overflow-hidden flex flex-col">
              
              {center.building_image && (
                <div className="h-44 md:h-52 w-full shrink-0 relative overflow-hidden">
                  <img src={center.building_image} alt={center.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"></div>
                </div>
              )}

              <div className={`flex-grow flex flex-col relative z-10 ${center.building_image ? 'p-5 pt-0 md:p-6 md:pt-0' : 'p-6 md:p-8'}`}>
                {!center.building_image && (
                  <div className="absolute -top-16 -right-16 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                )}

                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 z-20 ${
                  center.building_image 
                    ? '-mt-6 md:-mt-8 mb-3 md:mb-4 border-4 border-white shadow-lg bg-white overflow-hidden' 
                    : 'bg-gradient-to-br from-blue-100 to-indigo-100 mb-6 shadow-inner text-indigo-600'
                }`}>
                  {center.logo ? (
                    <img src={center.logo} alt="logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    '🏢'
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 md:mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{center.name}</h2>
                <p className="text-sm md:text-base text-slate-500 mb-3 md:mb-4 font-medium flex items-start gap-2">
                  <span className="mt-0.5 md:mt-1 text-sm md:text-base">📍</span> <span className="line-clamp-2 leading-relaxed">{center.address}</span>
                </p>
                {center.contact_phone && (
                  <a href={`tel:${center.contact_phone}`} className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4 bg-slate-50 inline-flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-lg border border-slate-100 font-semibold w-fit hover:bg-slate-100 hover:border-slate-200 transition-colors active:scale-95" title="Qo'ng'iroq qilish">
                    <span>📞</span> {formatPhoneNumber(center.contact_phone)}
                  </a>
                )}
              </div>

              <div className={`mt-auto border-t border-slate-100 flex items-center justify-between relative z-10 bg-white/50 backdrop-blur-md ${center.building_image ? 'px-4 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4' : 'pt-4 mt-2 pb-0 px-6 mb-6 md:pt-6 md:mt-4 md:px-8 md:mb-8'}`}>
                {center.map_link && (
                  <a href={center.map_link} target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-indigo-500 hover:text-indigo-700 font-bold hover:underline truncate mr-2 active:scale-95">
                    Xaritada ko'rish
                  </a>
                )}
                <Link
                  to={`/center/${center.id}`}
                  className="ml-auto bg-slate-900 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-md hover:bg-indigo-600 hover:shadow-indigo-200 transition-colors whitespace-nowrap active:scale-95"
                >
                  Xonalar →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Home;