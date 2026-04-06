with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("  return (\n    <div className=\"max-w-7xl mx-auto mt-8\">", "  return (\n    <>\n    <div className=\"max-w-7xl mx-auto mt-8\">")
content = content.replace("    </div>\n  );\n}\n\nexport default DashboardCenter;", "    </div>\n    </>\n  );\n}\n\nexport default DashboardCenter;")

with open("C:/Users/kamro/Desktop/IT/Diploma work/frontend/src/pages/DashboardCenter.jsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Wrapped inside fragment")
