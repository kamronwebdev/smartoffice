files = ["frontend/src/pages/ManageCenter.jsx", "frontend/src/pages/EditCenter.jsx"]

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace the regex literal with RegExp constructor to avoid JSX parse errors
    content = content.replace(r"/^https?:\/\//", "new RegExp('^https?://')")

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
print("Regex fixed")
