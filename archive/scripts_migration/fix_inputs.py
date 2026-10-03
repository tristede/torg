import re

with open('public/style.css', 'r') as f:
    css = f.read()

# Remove the global input and select styling blocks
css = re.sub(r'input\[type="text"\], input\[type="password"\], input\[type="email"\], select\s*\{[^}]*\}', '', css)
css = re.sub(r'body\.dark input\[type="text"\], body\.dark input\[type="password"\], body\.dark input\[type="email"\], body\.dark select\s*\{[^}]*\}', '', css)

with open('public/style.css', 'w') as f:
    f.write(css)
