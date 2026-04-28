import re

file_path = "frontend/src/pages/CenterDetail.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("import { motion } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

