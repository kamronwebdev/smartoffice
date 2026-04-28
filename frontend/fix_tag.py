import sys

files = ["frontend/src/pages/ManageCenter.jsx", "frontend/src/pages/EditCenter.jsx"]
for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The missing closing tag '}' instead of '}>'
    old_str = ': "border-slate-100 hover:border-slate-300 bg-white"}`}'
    new_str = ': "border-slate-100 hover:border-slate-300 bg-white"}`}>'

    content = content.replace(old_str, new_str)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
