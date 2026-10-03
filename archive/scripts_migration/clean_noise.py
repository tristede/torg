with open('public/index.html', 'r') as f:
    html = f.read()
import re
html = html.replace('<div class="crt-overlay pointer-events-none"></div>', '')
html = html.replace('<div class="grid-background pointer-events-none"></div>', '')
html = html.replace('<div class="absolute inset-0 bg-scanline pointer-events-none opacity-20"></div>', '')
html = re.sub(r'<div class="y2k-star"[^>]*>.*?</div>\n?', '', html)

with open('public/index.html', 'w') as f:
    f.write(html)
