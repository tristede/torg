import re
with open('public/index.html', 'r') as f:
    html = f.read()

# Replace old logo with a classy glass text logo
old_logo_pattern = r'<div class="text-2xl font-black text-\[#4A5D23\] tracking-widest uppercase">SWIPP</div>'
new_logo = '<div class="text-2xl font-black text-white tracking-widest uppercase" style="text-shadow: 0 2px 10px rgba(0,0,0,0.3);">SWIPP</div>'
html = re.sub(old_logo_pattern, new_logo, html)

with open('public/index.html', 'w') as f:
    f.write(html)
