import re

files = ['frontend/src/pages/ManageCenter.jsx', 'frontend/src/pages/EditCenter.jsx']

new_block = """        {/* Contact and Time */}
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
              <div className="flex shadow-sm rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/20 border border-slate-200">
                <span className="px-3 py-3 bg-slate-100 text-slate-500 font-bold border-r border-slate-200 text-sm flex items-center">https://</span>
                <input type="text" name="website" value={formData.website?.replace(/^https?:\/\//, '') || ''} onChange={(e) => setFormData({...formData, website: e.target.value ? `https://${e.target.value.replace(/^https?:\/\//, '')}` : ''})} placeholder="smartoffice.uz" className="w-full px-3 py-3 outline-none font-medium text-slate-700 bg-slate-50 focus:bg-white text-sm" />
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-1 border border-slate-200 p-3 rounded-xl bg-slate-50 space-y-3">
              <div className="flex justify-between items-center">
                <label className={labelClass.replace(" mb-2", "") + " m-0"}>Ish vaqtini belgilash</label>
                <label className="flex items-center cursor-pointer text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                  <input type="checkbox" checked={formData.working_hours === '24/7'} onChange={(e) => setFormData({...formData, working_hours: e.target.checked ? '24/7' : 'Dushanba-Juma, 09:00-18:00'})} className="w-4 h-4 mr-2" />
                  24/7
                </label>
              </div>
              
              {formData.working_hours !== '24/7' && (
                <div className="flex gap-2">
                  <select 
                    className="flex-1 px-2 py-2 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500"
                    value={formData.working_hours?.split(', ')[0] || "Dushanba-Juma"}
                    onChange={(e) => {
                      const times = formData.working_hours?.split(', ')[1] || "09:00-18:00";
                      setFormData({...formData, working_hours: `${e.target.value}, ${times}`});
                    }}
                  >
                    <option value="Dushanba-Juma">Dush-Juma</option>
                    <option value="Dushanba-Shanba">Dush-Shanba</option>
                    <option value="Har kuni">Har kuni</option>
                  </select>
                  <input 
                    type="time" 
                    className="w-24 px-1 py-2 text-center rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500"
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
                    className="w-24 px-1 py-2 text-center rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500"
                    value={(formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[1] || "18:00"}
                    onChange={(e) => {
                      const days = formData.working_hours?.split(', ')[0] || "Dushanba-Juma";
                      const start = (formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[0] || "09:00";
                      setFormData({...formData, working_hours: `${days}, ${start}-${e.target.value}`});
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>"""

for fpath in files:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # regex match from Contact and time to Media
    pattern = r"\{/\*\s*Contact and Time\s*\*/\}(.*?)\{/\*\s*Media\s*\*/\}"
    content = re.sub(pattern, new_block + '\n\n        {/* Media */} ', content, flags=re.DOTALL)
    
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated perfectly")
