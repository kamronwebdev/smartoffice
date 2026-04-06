with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "r", encoding="utf-8") as f:
    content = f.read()

target = """            </a>
          )}
        </div>
        <div className="flex gap-4">"""

replacement = """            </a>
          )}
        <div className="flex gap-4">"""

if target in content:
    content = content.replace(target, replacement)
    with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed closing tag!")
else:
    print("NOT FOUND")
