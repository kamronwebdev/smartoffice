import re

with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/CenterDetail.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Replace the address block
text = re.sub(
    r'<p className="text-2xl font-medium flex items-center gap-3 text-slate-500">\s*<span className="text-3xl">.*?</span> \{center\.address\}\s*</p>',
    r'<p className="text-2xl font-medium flex items-center gap-3 text-slate-500">\n                  <MapPin className="w-8 h-8 text-indigo-500" /> {center.address}\n                </p>',
    text)

# Replace the floors block
text = re.sub(
    r'<p className="text-lg font-medium flex items-center gap-3 border-b pb-8 text-slate-400 border-slate-100 mt-2">\s*<span className="text-2xl">.*?</span> Qavatlar soni: \{center\.total_floors\}\s*</p>',
    r'<p className="text-lg font-medium flex items-center gap-3 border-b pb-8 text-slate-400 border-slate-100 mt-2">\n                  <Maximize className="w-6 h-6 text-indigo-400" /> Qavatlar soni: {center.total_floors}\n                </p>',
    text)

# Replace phone block
text = re.sub(
    r'<div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xl">.*?</div>',
    r'<div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors"><Smartphone className="w-6 h-6" /></div>',
    text)

# Replace Map block
text = re.sub(
    r'<div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl group-hover:scale-110 transition-transform">.*?</div>',
    r'<div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors"><Map className="w-6 h-6" /></div>',
    text)

# Update the phone container to have group hover
text = text.replace(
    '<div className="bg-white border rounded-2xl p-4 shadow-sm flex items-center gap-4">',
    '<div className="bg-white border rounded-2xl p-4 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-green-200 hover:shadow-md transition-all">'
)

with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/CenterDetail.jsx", "w", encoding="utf-8") as f:
    f.write(text)

print("Done")
