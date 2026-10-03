import re
with open('public/style.css', 'r') as f:
    css = f.read()

# Replace variables
vars_old = """  --text-main: #FFFFFF;
  --text-muted: rgba(255, 255, 255, 0.7);
  --glass-bg: rgba(255, 255, 255, 0.15);
  --glass-bg-hover: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.4);
  --glass-border-light: rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);"""

vars_new = """  --text-main: #FFFFFF; /* keep white for text on dark glass */
  --text-muted: rgba(255, 255, 255, 0.7);
  --glass-bg: rgba(25, 20, 15, 0.6); /* dark glass */
  --glass-bg-hover: rgba(25, 20, 15, 0.8);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-border-light: rgba(255, 255, 255, 0.05);
  --glass-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);"""

css = css.replace(vars_old, vars_new)

# Make sure body has cream text color for text NOT in glass
css = css.replace('color: #5C4033;', 'color: #5C4033;')
css = css.replace('color: var(--text-main);', 'color: #5C4033;')

with open('public/style.css', 'w') as f:
    f.write(css)
