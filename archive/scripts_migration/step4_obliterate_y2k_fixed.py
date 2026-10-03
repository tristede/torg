import re

with open('public/index.html', 'r') as f:
    html = f.read()

# Bad borders
html = html.replace('border border-black', '')
html = html.replace('border-2 border-black', '')
html = html.replace('border-3 border-dashed border-gray-400', 'border-2 border-dashed border-white/50')
html = html.replace('border-dashed border-gray-400', 'border-dashed border-white/50')
html = html.replace('border-b-2 border-black', 'border-b border-white/20')
html = html.replace('border-b-4 border-black', 'border-b border-white/20')
html = html.replace('border-b border-black', 'border-b border-white/20')
html = html.replace('border-t border-black', 'border-t border-white/20')
html = html.replace('border-black', '')
html = html.replace('dark:border-[#494069]', '')
html = html.replace('border-neon-pink', '')

# Bad backgrounds
html = html.replace('bg-white', '')
html = html.replace('bg-gray-50', 'bg-black/10')
html = html.replace('bg-gray-100', 'bg-black/10')
html = html.replace('dark:bg-neutral-900', '')
html = html.replace('dark:bg-neutral-800', '')
html = html.replace('bg-black', 'bg-black/30')
html = html.replace('dark:bg-[#120e24]', '')

# Hardcoded inline styles on buttons that break Reglass
html = re.sub(r'style="[^"]*background:[^"]*!important;[^"]*"', '', html)

# Double space cleanup but keep newlines!
html = re.sub(r' +', ' ', html)

with open('public/index.html', 'w') as f:
    f.write(html)
