import re

file_path = "src/pages/CenterDetail.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
import_pattern = re.compile(r"import\s+\{[^}]*\}\s+from\s+'lucide-react';")
lucide_match = import_pattern.search(content)
if lucide_match:
    new_lucide_import = "import { ArrowLeft, MapPin, Maximize, DollarSign, Activity, User, Users, Layers, DoorOpen, Smartphone, Map, ArrowUpRight, Image as ImageIcon, Crown, Sparkles, ChevronDown, X, Clock, ArrowUpDown, Car, Wifi, Wind, Flame, ShieldCheck, MonitorPlay, ExternalLink, Instagram, Send, Globe, Building2, Phone } from 'lucide-react';"
    content = content.replace(lucide_match.group(0), new_lucide_import)

# 2. Add Helpers
helper_comps = """
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

function CenterDetail() {"""
content = content.replace("function CenterDetail() {", helper_comps)

# 3. Add useState
content = content.replace("const [rooms, setRooms] = useState([]);", "const [rooms, setRooms] = useState([]);\n  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);")

# 4. Replace buttons
start_idx = content.find('<div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-3 md:pt-4 border-t border-slate-100">')

end_match = re.search(r'</a>\s*\)\}\s*</div>', content[start_idx:])
if start_idx != -1 and end_match:
    end_idx = start_idx + end_match.end()
    
    new_buttons = """<div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-4 md:pt-5 border-t border-slate-100">
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
              </div>"""

    content = content[:start_idx] + new_buttons + content[end_idx:]
else:
    print("WARNING: Could not find start_idx or end_match for buttons. start=" + str(start_idx) + " end=" + str(bool(end_match)))

# 5. Inject modal
modal_code = """

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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                        <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{center.total_floors || 1} qavatli</p>
                      </div>
                    </div>
                    
                    {center.has_parking && (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 items-center hover:border-indigo-300 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                          <Car className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avtoturargoh</p>
                          <p className="text-sm sm:text-base font-black text-slate-700 leading-tight">{center.parking_capacity || 0} ta o'rin</p>
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
                    {center.has_elevator && <AmenityCard icon={<ArrowUpDown className="w-6 h-6" />} label="Lift xizmati" />}
                    {center.has_heating && <AmenityCard icon={<Flame className="w-6 h-6" />} label="Isitish tizimi" />}
                    {center.has_cooling && <AmenityCard icon={<Wind className="w-6 h-6" />} label="Sovutish tizimi" />}
                    {center.has_internet && <AmenityCard icon={<Wifi className="w-6 h-6" />} label="Tezyurar Internet" />}
                    {center.has_security && <AmenityCard icon={<ShieldCheck className="w-6 h-6" />} label="24/7 Qo'riqlash" />}
                    {center.has_conference_room && <AmenityCard icon={<MonitorPlay className="w-6 h-6" />} label="Konferens zal" />}
                    
                    {!center.has_parking && !center.has_elevator && !center.has_heating && !center.has_cooling && !center.has_internet && !center.has_security && !center.has_conference_room && (
                        <div className="col-span-full py-8 text-center text-slate-400 font-bold bg-white rounded-2xl border border-slate-100 shadow-sm text-sm">
                          Qo'shimcha qulayliklar ko'rsatilmagan
                        </div>
                    )}
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
                      <ContactCard href={`https://instagram.com/${center.instagram.replace('@', '').replace('https://instagram.com/', '')}`} icon={<Instagram className="w-5 h-5" />} label="Instagram" value={"@" + center.instagram.replace('@', '').replace('https://instagram.com/', '')} target="_blank" />
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
"""

content = content.replace("</div>\n    </div>\n  );\n}", modal_code + "</div>\n    </div>\n  );\n}")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modal properly injected!")

