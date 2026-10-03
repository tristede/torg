with open('public/app.js', 'r') as f:
    js = f.read()

# Replace hardcoded score container style
js = js.replace("el.className = 'relative score-item-container flex flex-col p-3 bg-white rounded-lg hover:bg-gray-100 transition';", 
                "el.className = 'relative score-item-container flex flex-col p-3 cyber-panel mb-3 hover:bg-black/10 transition';")

# Remove hardcoded border-black from recap images
js = js.replace("const cardBorder = `border-black`;", "const cardBorder = ``;")

# Replace text-white with text-[#5C4033]
js = js.replace('text-white', 'text-[#5C4033]')

with open('public/app.js', 'w') as f:
    f.write(js)
