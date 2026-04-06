# -*- coding: utf-8 -*-
import re

def fix_utf8(path):
    with open(path, "rb") as f:
        content = f.read()
    
    # Let's decode as utf-8, but the emojis might literally be corrupted bytes in string
    try:
        text = content.decode("utf-8")
    except:
        text = content.decode("latin1")
        
    # Manually replace corrupted sequences or any emojis with explicit React lucide icons
    pass

def update_center_detail():
    path = "C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/CenterDetail.jsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
        
    if "import { ArrowLeft" not in text:
        text = re.sub(r"import \{ motion \} from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { ArrowLeft, MapPin, Maximize, DollarSign, Activity, User, DoorOpen } from 'lucide-react';", text)
        
    text = text.replace('â†', '<ArrowLeft className="w-5 h-5 inline" />')
    text = text.replace('ðŸ“±', '<Smartphone className="w-5 h-5 inline" />')
    text = text.replace('<span className="text-xl">â†</span> Barcha markazlarga qaytish', '<ArrowLeft className="w-5 h-5 inline text-slate-500 mr-2" /> Barcha markazlarga qaytish')
    text = text.replace('<span className="bg-slate-100 p-2 rounded-xl">??</span> Ofis Xonalari', '<span className="bg-slate-100 p-2 rounded-xl"><DoorOpen className="w-6 h-6 inline text-slate-600" /></span> Ofis Xonalari')
    text = text.replace('<h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">? {room.room_number}</h3>', '<h3 className="text-3xl font-extrabold text-slate-800 tracking-tight whitespace-nowrap"><DoorOpen className="w-6 h-6 inline mr-1 text-slate-500" /> {room.room_number}</h3>')
    
    text = text.replace('<span className="text-slate-400 text-xl mb-1">??</span>', '<MapPin className="w-6 h-6 text-slate-400 mb-1" />')
    text = text.replace('<span className="text-slate-400 text-xl mb-1">??</span>', '<Maximize className="w-6 h-6 text-slate-400 mb-1" />')
    
    # room type badge
    text = re.sub(r'(<p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">Xona<\/p>)', r'\1\n                    {room.room_type_name && <span className="mt-2 inline-block bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-widest">{room.room_type_name}</span>}', text)

    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("CenterDetail Updated")

def update_dashboard():
    path = "C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if "import { ArrowLeft" not in text:
        text = re.sub(r"import \{ useParams, Link \} from 'react-router-dom';", "import { useParams, Link } from 'react-router-dom';\nimport { ArrowLeft, MapPin, Maximize, DollarSign, Activity, User, DoorOpen, Smartphone, Pencil, Trash2 } from 'lucide-react';", text)
        
    text = text.replace('â† Kabinetga qaytish', '<ArrowLeft className="w-4 h-4 inline mr-1" /> Kabinetga qaytish')
    text = text.replace('<span className="text-2xl pt-1">ðŸ“±</span>', '<Smartphone className="w-6 h-6 text-slate-500 mt-1" />')
    text = text.replace('<h3 className="text-2xl font-bold text-slate-800">â„–{room.room_number}</h3>', '<h3 className="text-2xl font-bold text-slate-800"><DoorOpen className="w-6 h-6 inline mr-1 text-slate-500"/> â„?{room.room_number}</h3>')
    text = text.replace('<h3 className="text-2xl font-bold text-slate-800">?{room.room_number}</h3>', '<h3 className="text-2xl font-bold text-slate-800"><DoorOpen className="w-6 h-6 inline mr-1 text-slate-500"/> ?{room.room_number}</h3>')
    
    bad_emojis = ['ðŸ“', 'ðŸ’°', 'ðŸ·ï¸', 'ðŸ‘¤', 'â„?']
    for e in bad_emojis: text = text.replace(e, '')
    
    text = text.replace('?? Qavat', '<MapPin className="w-4 h-4 inline mr-1"/> Qavat')
    text = text.replace('?? Maydon', '<Maximize className="w-4 h-4 inline mr-1"/> Maydon')
    text = text.replace('?? Narx', '<DollarSign className="w-4 h-4 inline mr-1"/> Narx')
    text = text.replace('??? Holat', '<Activity className="w-4 h-4 inline mr-1"/> Holat')
    text = text.replace('?? Ijarachi', '<User className="w-4 h-4 inline mr-1"/> Ijarachi')
    text = text.replace('??', '<MapPin className="w-4 h-4 inline mr-1"/>')
    text = text.replace('??', '<Maximize className="w-4 h-4 inline mr-1"/>')
    text = text.replace('??', '<DollarSign className="w-4 h-4 inline mr-1"/>')
    text = text.replace('???', '<Activity className="w-4 h-4 inline mr-1"/>')
    text = text.replace('??', '<User className="w-4 h-4 inline mr-1"/>')
    text = text.replace('??', '<Smartphone className="w-4 h-4 inline mr-1"/>')

    text = re.sub(r'const \[rooms, setRooms\] = useState\(\[\]\);', r'const [rooms, setRooms] = useState([]);\n  const [roomTypes, setRoomTypes] = useState([]);\n  const [newRoomTypeMode, setNewRoomTypeMode] = useState(false);\n  const [newRoomTypeName, setNewRoomTypeName] = useState("");', text)
    
    text = re.sub(r'setRooms\(rRes\.data\.results \|\| rRes\.data\);', r'setRooms(rRes.data.results || rRes.data);\n      const tRes = await api.get(`/room-types/?business_center=${id}`);\n      setRoomTypes(tRes.data.results || tRes.data);', text)

    text = re.sub(r"room_number: '', floor: '', area: '', price: '', price_period: 'MONTHLY', currency: 'UZS', status: 'AVAILABLE', capacity: '', assigned_to: ''", r"room_number: '', room_type: '', floor: '', area: '', price: '', price_period: 'MONTHLY', currency: 'UZS', status: 'AVAILABLE', capacity: '', assigned_to: ''", text)

    # Creating a new room type function
    add_type_func = """
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
"""
    if "handleCreateRoomType" not in text:
        text = text.replace("const handleSaveRoom = async", add_type_func + "\n  const handleSaveRoom = async")


    # Form modifications
    room_type_select = """
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700">Xona Turi (Majburiy emas)</label>
                    <button type="button" onClick={() => setNewRoomTypeMode(!newRoomTypeMode)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                        {newRoomTypeMode ? 'Bekor qilish' : '+ Yangi tur yaratish'}
                    </button>
                </div>
                {newRoomTypeMode ? (
                    <div className="flex gap-2">
                        <input type="text" value={newRoomTypeName} onChange={e => setNewRoomTypeName(e.target.value)} placeholder="Masalan: Majlislar zali" className="flex-grow px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                        <button type="button" onClick={handleCreateRoomType} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700">Qo'shish</button>
                    </div>
                ) : (
                    <select name="room_type" value={roomForm.room_type || ''} onChange={handleRoomChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none bg-slate-50 focus:bg-white text-slate-800 font-medium">
                        <option value="">-- Tanlanmagan --</option>
                        {roomTypes.map(rt => (
                            <option key={rt.id} value={rt.id}>{rt.name}</option>
                        ))}
                    </select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
"""
    text = re.sub(r'<div className="grid grid-cols-2 gap-4">[\s\S]*?<label className="block text-sm font-bold text-slate-700 mb-1">Qavat<\/label>', room_type_select + '\n                <div>\n                  <label className="block text-sm font-bold text-slate-700 mb-1">Qavat</label>', text, count=1)
    
    # Displaying room_type in the room card
    text = re.sub(r'(<h3 className="text-2xl font-bold text-slate-800">.*?<\/h3>)', r'\1\n                  {room.room_type_name && <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">{room.room_type_name}</span>}', text)


    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("DashboardCenter Updated")

update_center_detail()
update_dashboard()
print("Done!")

