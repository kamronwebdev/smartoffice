# -*- coding: utf-8 -*-
import re

files = ["frontend/src/pages/ManageCenter.jsx", "frontend/src/pages/EditCenter.jsx"]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    start_str = '<div className="sm:col-span-2 lg:col-span-1 border border-slate-200 p-3 rounded-xl bg-slate-50 space-y-3">'
    
    new_block = """<div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-4 border-2 border-indigo-50 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <label className="text-base font-bold text-slate-800 mb-1 block">Ish vaqtini belgilash</label>
                    <p className="text-sm text-slate-500 font-medium">Markaz ochiq bo'ladigan kun va soatlarni kiriting.</p>
                  </div>
                  <label className="flex items-center cursor-pointer text-sm font-bold text-indigo-700 bg-white border border-indigo-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-indigo-50 transition-colors">
                    <input type="checkbox" checked={formData.working_hours === '24/7'} onChange={(e) => setFormData({...formData, working_hours: e.target.checked ? '24/7' : 'Dushanba-Juma, 09:00-18:00'})} className="w-5 h-5 mr-3 accent-indigo-600 rounded" />
                    24/7 tinimsiz
                  </label>
                </div>
                
                {formData.working_hours !== '24/7' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Hafta kunlari</label>
                      <select 
                        className="w-full text-base font-bold text-slate-700 outline-none bg-transparent cursor-pointer ml-1"
                        value={formData.working_hours?.split(', ')[0] || "Dushanba-Juma"}
                        onChange={(e) => {
                          const times = formData.working_hours?.split(', ')[1] || "09:00-18:00";
                          setFormData({...formData, working_hours: `${e.target.value}, ${times}`});
                        }}
                      >
                        <option value="Dushanba-Juma">Dushanba - Juma</option>
                        <option value="Dushanba-Shanba">Dushanba - Shanba</option>
                        <option value="Har kuni">Har kuni (Dush - Yak)</option>
                      </select>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Soatlar oralig'i</label>
                      <div className="flex items-center justify-between gap-3 ml-1">
                        <input 
                          type="time" 
                          className="flex-1 px-3 py-2 text-center rounded-lg bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                          value={(formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[0] || "09:00"}
                          onChange={(e) => {
                            const days = formData.working_hours?.split(', ')[0] || "Dushanba-Juma";
                            const end = (formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[1] || "18:00";
                            setFormData({...formData, working_hours: `${days}, ${e.target.value}-${end}`});
                          }}
                        />
                        <span className="font-extrabold text-slate-400">-</span>
                        <input 
                          type="time" 
                          className="flex-1 px-3 py-2 text-center rounded-lg bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                          value={(formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[1] || "18:00"}
                          onChange={(e) => {
                            const days = formData.working_hours?.split(', ')[0] || "Dushanba-Juma";
                            const start = (formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[0] || "09:00";
                            setFormData({...formData, working_hours: `${days}, ${start}-${e.target.value}`});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>"""

    start_idx = content.find(start_str)
    if start_idx != -1:
        end_cond_idx = content.find(")}", start_idx)
        end_div_idx = content.find("</div>", end_cond_idx) + 6
        
        new_content = content[:start_idx] + new_block + content[end_div_idx:]
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Patched {file_path}")
    else:
        print(f"Could not find start string in {file_path}")

