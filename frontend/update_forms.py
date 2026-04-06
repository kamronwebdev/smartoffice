import re
import codecs

FILES = [
    "C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/ManageCenter.jsx",
    "C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/EditCenter.jsx"
]

for filepath in FILES:
    with codecs.open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Add icons to forms
    if "import { Building, MapPin, Phone, Hash, Link as LinkIcon, Image, Type } from 'lucide-react';" not in text:
        text = text.replace("import api from '../services/api';", "import { Building, MapPin, Phone, Hash, Link as LinkIcon, Image, Type, Info, Key, Mail, ShieldAlert } from 'lucide-react';\nimport api from '../services/api';")
    
    text = text.replace('Markaz nomi</label>', '<Building className="w-4 h-4 inline mr-1 text-slate-400"/> Markaz nomi</label>')
    text = text.replace('Manzil</label>', '<MapPin className="w-4 h-4 inline mr-1 text-slate-400"/> Manzil</label>')
    text = text.replace('Telefon raqam</label>', '<Phone className="w-4 h-4 inline mr-1 text-slate-400"/> Telefon raqam</label>')
    text = text.replace('Qavatlar soni</label>', '<Hash className="w-4 h-4 inline mr-1 text-slate-400"/> Qavatlar soni</label>')
    text = text.replace('Xarita linki (Google/Yandex)</label>', '<LinkIcon className="w-4 h-4 inline mr-1 text-slate-400"/> Xarita linki (Google/Yandex)</label>')
    
    text = text.replace('Markaz logotipi</label>', '<Image className="w-4 h-4 inline mr-1 text-slate-400"/> Markaz logotipi</label>')
    text = text.replace('Bino rasmi (Cover)</label>', '<Image className="w-4 h-4 inline mr-1 text-slate-400"/> Bino rasmi (Cover)</label>')
    text = text.replace('Markaz haqida ma\'lumot (Tavsif)</label>', '<Type className="w-4 h-4 inline mr-1 text-slate-400"/> Markaz haqida ma\'lumot (Tavsif)</label>')
    text = text.replace('Markaz adminini tanlang</label>', '<ShieldAlert className="w-4 h-4 inline mr-1 text-slate-400"/> Markaz adminini tanlang</label>')
    
    # New Admin inputs inside forms
    text = text.replace('Yangi admin login</label>', '<User className="w-4 h-4 inline mr-1 text-slate-400"/> Yangi admin login</label>')
    text = text.replace('Email</label>', '<Mail className="w-4 h-4 inline mr-1 text-slate-400"/> Email</label>')
    text = text.replace('Parol</label>', '<Key className="w-4 h-4 inline mr-1 text-slate-400"/> Parol</label>')


    # Improve Inputs
    old_input = 'className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"'
    new_input = 'className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium hover:border-indigo-300"'
    text = text.replace(old_input, new_input)
    
    # Improve Textarea
    old_textarea = 'className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"'
    new_textarea = 'className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white transition-all text-slate-700 font-medium hover:border-indigo-300"'
    text = text.replace(old_textarea, new_textarea)
    
    # Forms Container wrapper
    text = text.replace('className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6"', 'className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6 relative overflow-hidden"')
    
    # Improve Buttons
    text = text.replace('className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all text-lg"', 'className="w-full py-4 mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-2"')

    with codecs.open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

print("Forms Updated")
