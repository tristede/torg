import re

with open('public/index.html', 'r') as f:
    html = f.read()

# Update Google Fonts to include bold and black weights
html = re.sub(r'family=Outfit:wght@[0-9;]+&family=Inter:wght@[0-9;]+&display=swap', 'family=Outfit:wght@300;400;600;700;800;900&family=Inter:wght@300;400;600;700;800;900&display=swap', html)

# Some remaining `dark:` classes might interfere, we can remove them
html = re.sub(r'dark:[^\s"\'<>]+', '', html)

with open('public/index.html', 'w') as f:
    f.write(html)
