import sys

file_path = "frontend/src/pages/ManageCenter.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# The corrupted string has a formfeed '\x0c'.
# We find exactly what's failing.
old_str = 'className={\x0clex items-center p-3 rounded-xl cursor-pointer transition-all border }>'
new_str = 'className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border ${formData.admins?.includes(u.id) ? "bg-indigo-50 border-indigo-200 shadow-sm" : "border-slate-100 hover:border-slate-300 bg-white"}`}'

content = content.replace(old_str, new_str)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
