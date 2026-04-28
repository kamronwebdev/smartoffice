import re

files = ["frontend/src/pages/ManageCenter.jsx", "frontend/src/pages/EditCenter.jsx"]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Fix the Working Hours UI
    old_working_hours = """              {formData.working_hours !== '24/7' && (
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
              )}"""

    new_working_hours = """              {formData.working_hours !== '24/7' && (
                <div className="flex flex-col gap-2 mt-1">
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500 bg-white"
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
                  <div className="flex items-center gap-2">
                    <input 
                      type="time" 
                      className="flex-1 px-2 py-2 text-center rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500 bg-white"
                      value={(formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[0] || "09:00"}
                      onChange={(e) => {
                        const days = formData.working_hours?.split(', ')[0] || "Dushanba-Juma";
                        const end = (formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[1] || "18:00";
                        setFormData({...formData, working_hours: `${days}, ${e.target.value}-${end}`});
                      }}
                    />
                    <span className="font-black text-slate-400">-</span>
                    <input 
                      type="time" 
                      className="flex-1 px-2 py-2 text-center rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500 bg-white"
                      value={(formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[1] || "18:00"}
                      onChange={(e) => {
                        const days = formData.working_hours?.split(', ')[0] || "Dushanba-Juma";
                        const start = (formData.working_hours?.split(', ')[1] || "09:00-18:00").split('-')[0] || "09:00";
                        setFormData({...formData, working_hours: `${days}, ${start}-${e.target.value}`});
                      }}
                    />
                  </div>
                </div>
              )}"""

    if old_working_hours in content:
        content = content.replace(old_working_hours, new_working_hours)
    
    # 2. Fix Redirect
    if "ManageCenter.jsx" in file_path:
        content = content.replace("navigate('/dashboard');", "navigate(-1);")
    elif "EditCenter.jsx" in file_path:
        content = content.replace("navigate(`/center/${id}`);", "navigate(-1);")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("UX and Redirect patched!")
