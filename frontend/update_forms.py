# -*- coding: utf-8 -*-
import os

files = ['frontend/src/pages/ManageCenter.jsx', 'frontend/src/pages/EditCenter.jsx']

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Fix parking capacity visibility
    old_parking_block = '''            <div>
              <label className={labelClass}>Parking sig'imi</label>
              <input type="number" name="parking_capacity" value={formData.parking_capacity} disabled={!formData.has_parking} onChange={handleChange} className={inputClass} />
            </div>'''
    
    new_parking_block = '''            {formData.has_parking && (
              <div>
                <label className={labelClass}>Parking sig'imi</label>
                <input type="number" name="parking_capacity" value={formData.parking_capacity} onChange={handleChange} className={inputClass} />
              </div>
            )}'''
    content = content.replace(old_parking_block, new_parking_block)

    # 2. Fix heating/cooling (isitish_sovutish) -> text string input transformed into Checkbox inside the same Infrastructure list
    # remove it from text blocks, add to boolean list
    
    infra_text_block = '''            <div>
              <label className={labelClass}>Isitish/Sovutish</label>
              <input type="text" name="heating_cooling" value={formData.heating_cooling} onChange={handleChange} className={inputClass} />
            </div>'''
    content = content.replace(infra_text_block, '')
    
    # And add it to the checkbox grid:
    bool_grid_old = '''<label className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent transition-all">
              <input type="checkbox" name="has_backup_power" checked={formData.has_backup_power} onChange={handleChange} className={checkClass} />
              <span className="font-bold text-slate-700">Zaxira elektr (Generator)</span>
            </label>'''
    bool_grid_new = '''<label className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent transition-all">
              <input type="checkbox" name="has_backup_power" checked={formData.has_backup_power} onChange={handleChange} className={checkClass} />
              <span className="font-bold text-slate-700">Zaxira elektr (Generator)</span>
            </label>
            <label className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent transition-all">
              <input type="checkbox" name="heating_cooling" checked={formData.heating_cooling === true || formData.heating_cooling === "true"} onChange={(e) => setFormData({...formData, heating_cooling: e.target.checked ? "true" : "false"})} className={checkClass} />
              <span className="font-bold text-slate-700">Isitish/Sovutish tizimi</span>
            </label>'''
    content = content.replace(bool_grid_old, bool_grid_new)

    # 3. Instagram, Telegram structure update
    # replace the entire Contact and Time section
    
    old_contact_block = '''        {/* Contact and Time */}
        <div className={sectionClass}>
          <h3 className={titleClass}><Phone className="w-5 h-5 text-indigo-500" /> Aloqa va Ish vaqti</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Asosiy Telefon</label>
              <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Telegram username/link</label>
              <input type="text" name="telegram" value={formData.telegram} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instagram</label>
              <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email manzili</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Veb-sayt</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Ish vaqti</label>
              <input type="text" name="working_hours" value={formData.working_hours} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>'''

    new_contact_block = '''        {/* Contact and Time */}
        <div className={sectionClass}>
          <h3 className={titleClass}><Phone className="w-5 h-5 text-indigo-500" /> Aloqa va Ish vaqti</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Asosiy Telefon</label>
              <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} placeholder="+998" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Telegram account</label>
              <div className="flex shadow-sm rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/20 border border-slate-200">
                <span className="px-4 py-3 bg-slate-100 text-slate-500 font-bold border-r border-slate-200">@</span>
                <input type="text" name="telegram" value={formData.telegram?.replace('https://t.me/', '').replace('@', '') || ''} onChange={(e) => setFormData({...formData, telegram: e.target.value})} placeholder="username" className="w-full px-4 py-3 outline-none font-medium text-slate-700 bg-slate-50 focus:bg-white" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Instagram account</label>
              <div className="flex shadow-sm rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/20 border border-slate-200">
                <span className="px-4 py-3 bg-slate-100 text-slate-500 font-bold border-r border-slate-200">@</span>
                <input type="text" name="instagram" value={formData.instagram?.replace('https://instagram.com/', '').replace('@', '') || ''} onChange={(e) => setFormData({...formData, instagram: e.target.value})} placeholder="username" className="w-full px-4 py-3 outline-none font-medium text-slate-700 bg-slate-50 focus:bg-white" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email manzili</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Veb-sayt</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>
            <div className="sm:col-span-2 lg:col-span-1 border border-slate-200 p-3 rounded-xl bg-slate-50">
              <label className={labelClass}>Ish vaqtini belgilash</label>
              <div className="flex gap-2">
                <select 
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500"
                  value={formData.working_hours?.split(', ')[0] || "Dushanba-Juma"}
                  onChange={(e) => {
                    const times = formData.working_hours?.split(', ')[1] || "09:00-18:00";
                    setFormData({...formData, working_hours: `${e.target.value}, ${times}`});
                  }}
                >
                  <option value="Dushanba-Juma">Dush-Juma</option>
                  <option value="Dushanba-Shanba">Dush-Shanba</option>
                  <option value="Har kuni">Har kuni (24/7)</option>
                </select>
                <input 
                  type="time" 
                  className="w-24 px-2 py-2 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500"
                  value={(formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[0] || "09:00"}
                  onChange={(e) => {
                    const days = formData.working_hours?.split(', ')[0] || "Dushanba-Juma";
                    const end = (formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[1] || "18:00";
                    setFormData({...formData, working_hours: `${days}, ${e.target.value}-${end}`});
                  }}
                />
                <span className="self-center font-bold text-slate-400">-</span>
                <input 
                  type="time" 
                  className="w-24 px-2 py-2 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500"
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
        </div>'''
    
    content = content.replace(old_contact_block, new_contact_block)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated files successfully.")
