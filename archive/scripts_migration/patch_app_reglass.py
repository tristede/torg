with open('public/app.js', 'r') as f:
    js = f.read()

# 1. Update deck card templates to use text-[#5C4033] and clean styling
js = js.replace('class="text-xl font-black mb-2 text-center text-neon-pink">',
                'class="text-xl font-black mb-2 text-center text-[#5C4033] text-glow">')
js = js.replace('class="text-lg font-black text-center text-neon-pink">',
                'class="text-lg font-black text-center text-[#5C4033] text-glow">')

js = js.replace('<p class="text-xs text-gray-700  text-center mb-3">${translatedSubtitle}</p>',
                '<p class="text-xs text-[#5C4033]/70 text-center mb-3">${translatedSubtitle}</p>')
js = js.replace('<p class="text-xs text-gray-500  text-center">${translatedSubtitle}</p>',
                '<p class="text-xs text-[#5C4033]/70 text-center">${translatedSubtitle}</p>')

js = js.replace('<p class="text-xs text-electric-blue text-center font-bold mb-4">${cardCount} ${cardsText}</p>',
                '<p class="text-xs text-[#5C4033]/90 text-center font-bold mb-4">${cardCount} ${cardsText}</p>')
js = js.replace('<p class="text-xs text-electric-blue text-center font-bold my-3">${cardCount} ${cardsText}</p>',
                '<p class="text-xs text-[#5C4033]/90 text-center font-bold my-3">${cardCount} ${cardsText}</p>')

# 2. Update scoreFilterButtons to use .filter-btn
js = js.replace("DOM.scoreFilterButtons.querySelectorAll('.cyber-filter-btn')",
                "DOM.scoreFilterButtons.querySelectorAll('.filter-btn')")
js = js.replace("allBtn.className = 'cyber-filter-btn active';",
                "allBtn.className = 'filter-btn active';")
js = js.replace("btn.className = 'cyber-filter-btn';",
                "btn.className = 'filter-btn';")

# 3. Update scores list items
js = js.replace('<span class="font-bold text-neon-pink">${safePlayerName}</span>',
                '<span class="font-bold text-[#5C4033]">${safePlayerName}</span>')
js = js.replace('<div class="text-2xl font-black text-electric-blue">${score.percentage}%</div>',
                '<div class="text-2xl font-black text-[#5C4033] text-glow">${score.percentage}%</div>')

with open('public/app.js', 'w') as f:
    f.write(js)
print('Updated app.js successfully')
