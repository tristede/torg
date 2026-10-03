import re

with open('public/style.css', 'r') as f:
    css = f.read()

# Make cyber-btn and cyber-btn-small pills
css = css.replace('border-radius: 30px !important;', 'border-radius: 99px !important;')
css = css.replace('border-radius: 20px !important;', 'border-radius: 99px !important;')
css = css.replace('border-radius: 12px !important;', 'border-radius: 99px !important;')

with open('public/style.css', 'w') as f:
    f.write(css)
