# -*- coding: utf-8 -*-
import json
import codecs

dashboard_path = "C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx"
center_path = "C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/CenterDetail.jsx"

with codecs.open(center_path, 'r', encoding='utf-8') as f:
    c_text = f.read()

# Fix CenterDetail icons
c_text = c_text.replace('ðŸ“ž', '<Smartphone className="w-5 h-5" />')
c_text = c_text.replace('ðŸ—ºï¸', '<Map className="w-5 h-5" />')
c_text = c_text.replace('ðŸ“', '<MapPin className="w-6 h-6" />')
c_text = c_text.replace('ðŸ¢', '<Maximize className="w-6 h-6" />')
# Fix imports
c_text = c_text.replace("import { ArrowLeft, MapPin, Maximize, DollarSign, Activity, User, DoorOpen } from 'lucide-react';", "import { ArrowLeft, MapPin, Maximize, DollarSign, Activity, User, DoorOpen, Smartphone, Map } from 'lucide-react';")

# Fix the MapPin duplicate for area
c_text = c_text.replace('''<MapPin className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-slate-700 font-bold">{room.area} kv.m</span>''', '''<Maximize className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-slate-700 font-bold">{room.area} kv.m</span>''')

with codecs.open(center_path, 'w', encoding='utf-8') as f:
    f.write(c_text)


with codecs.open(dashboard_path, 'r', encoding='utf-8') as f:
    d_text = f.read()

# Fix inputs UI/UX design in DashboardCenter
# We want inputs to be nicer and have icons where possible. But let's first fix inputs styles.
d_text = d_text.replace('className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 focus:bg-white"', 'className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium"')
d_text = d_text.replace('className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none bg-slate-50 focus:bg-white"', 'className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium"')
d_text = d_text.replace('className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none bg-slate-50 focus:bg-white text-slate-800 font-medium"', 'className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium"')
d_text = d_text.replace('className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none bg-white"', 'className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white transition-all text-slate-700 font-medium"')

# Update Modal UI to be a bit spacious and clean
d_text = d_text.replace('bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto', 'bg-white p-8 md:p-10 rounded-[2rem] w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-100')

with codecs.open(dashboard_path, 'w', encoding='utf-8') as f:
    f.write(d_text)

