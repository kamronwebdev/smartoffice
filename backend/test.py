import re
with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'(<h1 className="text-4xl font-black text-slate-800">\{center\.name\} - Boshqaruv</h1>\s*<p className="text-slate-500 mt-2 font-medium">Barcha xonalar va sozlamalar</p>\s*</div>\s*</div>)'

replacement = r'''\1
          {center.qr_code && (
            <a href={center.qr_code} target="_blank" rel="noopener noreferrer" className="ml-auto bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-center transition-colors flex items-center gap-3">
              <span className="text-2xl pt-1">??</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Markaz</span>
                <span className="text-sm font-bold text-slate-700 leading-tight">QR Kodi</span>
              </div>
            </a>
          )}
          <div className="hidden">'''

content = re.sub(pattern, replacement, content, count=1, flags=re.DOTALL)

with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("regex injected QR code successfully!")
