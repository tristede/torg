import re
with open('public/index.html', 'r') as f:
    html = f.read()

# Remove all hard Y2K borders and shadows from HTML classes
html = re.sub(r'border-[24] border-black(?: dark:border-\[#[0-9a-fA-F]+\])?', '', html)
html = re.sub(r'border border-black(?: dark:border-\[#[0-9a-fA-F]+\])?', '', html)
html = re.sub(r'shadow-\[3px_3px_0_#000\](?: dark:shadow-\[3px_3px_0_#[0-9a-fA-F]+\])?', '', html)
html = re.sub(r'border-b-4 border-black(?: dark:border-\[#[0-9a-fA-F]+\])?', '', html)
html = re.sub(r'border-b border-black(?: dark:border-\[#[0-9a-fA-F]+\])?', '', html)
html = re.sub(r'bg-white dark:bg-\[#120e24\]', 'glass-panel', html)
html = re.sub(r'bg-white/95 dark:bg-\[#120e24\]/95', 'glass-panel', html)
html = re.sub(r'bg-white dark:bg-neutral-900', 'glass-panel', html)
html = re.sub(r'bg-gray-50 dark:bg-neutral-900', 'glass-panel', html)
html = re.sub(r'bg-white', 'glass-panel', html)

# Replace remaining `text-black` with `text-cream`
html = html.replace('text-black dark:text-white', 'text-white')
html = html.replace('text-black', 'text-white')
html = html.replace('text-gray-500', 'text-white/70')
html = html.replace('text-gray-600', 'text-white/70')

# Make sure buttons use glass-btn
html = html.replace('cyber-btn-small', 'glass-btn-small')
html = html.replace('cyber-btn', 'glass-btn')
html = html.replace('cyber-input', 'glass-input')
html = html.replace('cyber-panel', 'glass-panel')
html = html.replace('cyber-badge', 'glass-badge')
html = html.replace('cyber-filter-btn', 'glass-btn-small')

# Add Space Grotesk font
html = re.sub(r'family=Outfit:.*&display=swap', 'family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;600;700;800;900&family=Inter:wght@300;400;600;700;800;900&display=swap', html)

with open('public/index.html', 'w') as f:
    f.write(html)
