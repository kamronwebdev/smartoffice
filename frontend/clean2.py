import re

with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Fix Edit/Delete buttons to have icons
text = re.sub(
    r'<button onClick=\{.*?openForm\(room\)\} className="text-indigo-500 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm hover:bg-indigo-100">Tahrir</button>',
    r'<button onClick={() => openForm(room)} className="text-indigo-500 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-100 flex items-center gap-1.5 transition-colors"><Pencil className="w-3.5 h-3.5" /> Tahrir</button>',
    text)

text = re.sub(
    r'<button onClick=\{.*?handleDeleteRoom\(room\.id\)\} className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-lg text-sm hover:bg-red-100">O\'chir</button>',
    r'<button onClick={() => handleDeleteRoom(room.id)} className="text-red-500 font-bold bg-red-50 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 flex items-center gap-1.5 transition-colors"><Trash2 className="w-3.5 h-3.5" /> O\'chir</button>',
    text)

with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Added icons to buttons")
