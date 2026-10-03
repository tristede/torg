import re
with open('public/index.html', 'r') as f:
    html = f.read()

# Using regex to find the logo svg and replace it
html = re.sub(r'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 65".*?</svg>', '<div class="text-2xl font-black text-[#4A5D23] dark:text-[#FDFBF7] tracking-widest uppercase">SWIPP</div>', html, flags=re.DOTALL)

with open('public/index.html', 'w') as f:
    f.write(html)
