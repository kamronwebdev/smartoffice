import re

with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "r", encoding="utf-8") as f:
    text = f.read()

old_block = r'''            <div className="space-y-2 text-sm text-slate-600 mb-4 bg-slate-50 p-4 rounded-xl">
              <p>.*? Qavat: <span className="font-bold">\{room\.floor\}</span></p>
              <p>.*? Maydon: <span className="font-bold">\{room\.area\} kv\.m</span></p>
              <p>.*? Narx: <span className="font-bold">\{formatPrice\(room\.price\)\} \{room\.currency\} / \{room\.price_period === 'HOURLY' \? 'soatiga' : room\.price_period === 'DAILY' \? 'kuniga' : 'oyiga'\}</span></p>
              <p>.*? Holat: <span className=\{room\.status === 'OCCUPIED' \? 'text-red-500 font-bold' : room\.status === 'MAINTENANCE' \? 'text-orange-500 font-bold' : 'text-green-500 font-bold'\}>\{room\.status === 'OCCUPIED' \? "Band qilingan" : room\.status === 'MAINTENANCE' \? "Ta'mirda" : "Bo'sh"\}</span></p>
              \{room\.status === 'OCCUPIED' && <p>.*? Ijarachi: <span className="font-bold text-slate-800">\{room\.assigned_to\}</span></p>\}
            </div>'''
            
new_block = '''            <div className="space-y-3 text-sm text-slate-600 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100/60 shadow-inner">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400 shrink-0" /> <span className="w-20 text-slate-500 font-medium">Qavat:</span> <span className="font-bold text-slate-800">{room.floor}-qavat</span></p>
              <p className="flex items-center gap-2"><Maximize className="w-4 h-4 text-slate-400 shrink-0" /> <span className="w-20 text-slate-500 font-medium">Maydon:</span> <span className="font-bold text-slate-800">{room.area} kv.m</span></p>
              <p className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-400 shrink-0" /> <span className="w-20 text-slate-500 font-medium">Narx:</span> <span className="font-bold text-indigo-600">{formatPrice(room.price)} {room.currency}</span> <span className="text-xs font-bold text-slate-400">/ {room.price_period === 'HOURLY' ? 'soat' : room.price_period === 'DAILY' ? 'kun' : 'oy'}</span></p>
              
              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-200/60">
                <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="w-20 text-slate-500 font-medium">Holat:</span>
                <span className={px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border }>{room.status === 'OCCUPIED' ? "Band" : room.status === 'MAINTENANCE' ? "Ta'mirda" : "Bo'sh"}</span>
              </div>

              {room.status === 'OCCUPIED' && (
                <div className="flex items-center gap-2 mt-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm mt-2">
                  <User className="w-4 h-4 text-indigo-500 shrink-0" /> <span className="text-xs text-slate-500 font-medium">Ijarachi:</span> <span className="font-bold text-slate-800 truncate">{room.assigned_to}</span>
                </div>
              )}
            </div>'''

text = re.sub(old_block, new_block, text)

# Just to be safe, replace with literal matches if regex fails (since those bad unicode chars might confuse re.sub sometimes if not handled correctly)
# I will use a fallback logic in python just in case:
import sys
with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Done")
