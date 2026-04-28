import re

file_path = "src/pages/CenterDetail.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("Instagram, ", "").replace("<Instagram", "<Camera")
content = content.replace("from 'lucide-react'", ", Camera } from 'lucide-react'")
content = content.replace("Instagram }", "Camera }")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

