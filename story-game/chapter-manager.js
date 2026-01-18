// Chapter Manager - handles all chapter logic with intro-style animations
class ChapterManager {
  constructor() {
    this.container = document.getElementById("chapterContainer")
    this.content = document.getElementById("chapterContent")
    this.buttons = document.getElementById("chapterButtons")
    this.currentChapter = null
    this.currentScene = 0
    this.userInput = ""
    this.isRendering = false  // Prevent double rendering
    
    // All chapters data
    this.chapters = {
      napoleon: this.getNapoleonChapter(),
      freaky_comix: this.getFreakyComixChapter(),
      jednou_vetou: this.getJednouVetouChapter(),
      site_video: this.getSiteVideoChapter(),
      nektera_proc: this.getNekteraProcChapter(),
      pudinkovy_pribeh: this.getPudinkovyPribehChapter(),
      konec: this.getKonecChapter()
    }
  }

  // Resume chapter from saved state
  async resumeChapter(chapterId, sceneIndex) {
    this.currentChapter = chapterId
    this.currentScene = sceneIndex
    
    const chapterScreen = document.getElementById("chapterScreen")
    const mapScreen = document.getElementById("mapScreen")
    
    // Hide map
    mapScreen.style.display = "none"
    mapScreen.classList.remove("active")
    
    // Show chapter screen
    chapterScreen.style.display = "block"
    chapterScreen.classList.add("active")
    chapterScreen.style.opacity = "1"
    
    // Play the specific scene
    await this.delay(300)
    await this.playScene()
  }
  
  // Start a chapter
  async startChapter(chapterId) {
    this.currentChapter = chapterId
    this.currentScene = 0
    
    // Update game state
    window.gameState.currentLocation = chapterId
    window.gameState.currentScene = 0
    
    const chapterScreen = document.getElementById("chapterScreen")
    const mapScreen = document.getElementById("mapScreen")
    
    // Fade out map
    mapScreen.style.transition = "opacity 0.5s ease"
    mapScreen.style.opacity = "0"
    
    await this.delay(500)
    
    mapScreen.classList.remove("active")
    mapScreen.style.display = "none"
    
    // Show chapter screen
    chapterScreen.style.display = "block"
    chapterScreen.classList.add("active")
    chapterScreen.style.opacity = "0"
    
    await this.delay(50)
    chapterScreen.style.transition = "opacity 0.5s ease"
    chapterScreen.style.opacity = "1"
    
    // Start first scene
    await this.delay(500)
    await this.playScene()
  }

  // Play current scene
  async playScene() {
    // Prevent double rendering
    if (this.isRendering) return
    this.isRendering = true
    
    try {
      const chapter = this.chapters[this.currentChapter]
      if (!chapter || this.currentScene >= chapter.scenes.length) {
        this.endChapter()
        return
      }
      
      const scene = chapter.scenes[this.currentScene]
    
    // Update game state with current scene
    window.gameState.currentLocation = this.currentChapter
    window.gameState.currentScene = this.currentScene
    
    // Clear previous content
    this.content.innerHTML = ""
    this.buttons.innerHTML = ""
    
    // Empty screen pause
    await this.delay(scene.pauseBefore || 400)
    
    // Play scene content
    await this.renderScene(scene)
    
    // Show buttons after content
    console.log("Scene buttons:", scene.buttons)
    await this.delay(scene.pauseAfter || 600)
    await this.showButtons(scene.buttons)
    } finally {
      // Allow next rendering
      this.isRendering = false
    }
  }

  // Render scene content with animations
  async renderScene(scene) {
    // Handle special scene types
    if (scene.type === "title") {
      await this.renderTitle(scene)
    } else if (scene.type === "quote") {
      await this.renderQuote(scene)
    } else if (scene.type === "list") {
      await this.renderList(scene)
    } else if (scene.type === "image") {
      await this.renderImage(scene)
    } else if (scene.type === "input") {
      await this.renderInput(scene)
    } else if (scene.type === "comic") {
      await this.renderComic(scene)
    } else if (scene.type === "pudding_game") {
      await this.renderPuddingGame(scene)

    } else if (scene.type === "video") {
      await this.renderVideo(scene)
    } else if (scene.type === "dual_list") {
      await this.renderDualList(scene)
    } else {
      await this.renderText(scene)
    }
  }

  // Render title with emoji
  async renderTitle(scene) {
    const titleEl = document.createElement("div")
    titleEl.className = "chapter-title-text"
    titleEl.textContent = scene.title
    this.content.appendChild(titleEl)
    
    await this.delay(100)
    titleEl.classList.add("visible")
    
    if (scene.emoji) {
      await this.delay(400)
      const emojiEl = document.createElement("span")
      emojiEl.className = "chapter-emoji"
      emojiEl.textContent = scene.emoji
      titleEl.appendChild(document.createTextNode(" "))
      titleEl.appendChild(emojiEl)
      
      await this.delay(100)
      emojiEl.classList.add("bounce")
    }
    
    if (scene.lines) {
      await this.delay(600)
      for (const line of scene.lines) {
        await this.renderLine(line)
      }
    }
  }

  // Render regular text
  async renderText(scene) {
    for (const line of scene.lines) {
      await this.renderLine(line)
    }
  }

  // Render a single line
  async renderLine(line) {
    const el = document.createElement("div")
    el.className = "chapter-line"
    
    // Apply modifiers
    if (line.small) el.classList.add("small")
    if (line.big) el.classList.add("big")
    if (line.huge) el.classList.add("huge")
    if (line.red) el.classList.add("red")
    if (line.green) el.classList.add("green")
    if (line.gold) el.classList.add("gold")
    if (line.orange) el.classList.add("orange")
    if (line.glow) el.classList.add("glow")
    if (line.bold) el.style.fontWeight = "700"
    
    this.content.appendChild(el)
    
    // Animation type
    if (line.instant) {
      el.textContent = line.text
      el.classList.add("instant")
      el.classList.add("visible")
      if (line.shake) {
        await this.delay(100)
        el.classList.add("shake")
      }
    } else {
      // Typewriter effect
      const speed = line.speed || 45
      await this.typewriter(el, line.text, speed)
      el.classList.add("visible")
    }
    
    // Post-line effects
    if (line.shake && !line.instant) {
      el.classList.add("shake")
    }
    
    // Handle emoji bounce
    if (line.emojiBounce) {
      const match = line.text.match(/([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])+/gu)
      if (match) {
        let html = el.textContent
        match.forEach(emoji => {
          html = html.replace(emoji, `<span class="chapter-emoji bounce">${emoji}</span>`)
        })
        el.innerHTML = html
      }
    }
    
    // Handle strikethrough correction
    if (line.strikethrough && line.corrected) {
      const strikeText = line.strikethrough
      const correctedText = line.corrected
      
      // Create strikethrough effect
      const strikeEl = document.createElement("span")
      strikeEl.style.textDecoration = "line-through"
      strikeEl.style.opacity = "0.6"
      strikeEl.textContent = strikeText
      
      // Create corrected text
      const correctEl = document.createElement("span")
      correctEl.style.marginLeft = "0.3rem"
      correctEl.textContent = correctedText
      
      // Replace the text content
      const newText = line.text.replace(strikeText, "")
      el.innerHTML = newText
      el.appendChild(strikeEl)
      el.appendChild(correctEl)
    }
    
    await this.delay(line.pauseAfter || 300)
  }

  // Render quote block
  async renderQuote(scene) {
    const quoteEl = document.createElement("div")
    quoteEl.className = "quote-block"
    quoteEl.innerHTML = scene.lines.map(l => l.text).join("<br>")
    this.content.appendChild(quoteEl)
    
    await this.delay(100)
    quoteEl.classList.add("visible")
    
    await this.delay(800)
  }

  // Render list
  async renderList(scene) {
    if (scene.title) {
      const titleEl = document.createElement("div")
      titleEl.className = "chapter-line big"
      titleEl.textContent = scene.title
      titleEl.style.marginBottom = "1rem"
      this.content.appendChild(titleEl)
      await this.delay(100)
      titleEl.classList.add("visible")
      await this.delay(400)
    }
    
    const listEl = document.createElement("div")
    listEl.className = "chapter-list"
    this.content.appendChild(listEl)
    
    for (const item of scene.items) {
      const itemEl = document.createElement("div")
      itemEl.className = "chapter-list-item"
      if (item.type === "plus") itemEl.classList.add("plus")
      if (item.type === "minus") itemEl.classList.add("minus")
      itemEl.textContent = item.text
      listEl.appendChild(itemEl)
      
      await this.delay(item.delay || 200)
      itemEl.classList.add("visible")
      await this.delay(300)
    }
  }

  // Render input field
  async renderInput(scene) {
    for (const line of scene.lines) {
      await this.renderLine(line)
    }
    
    const inputEl = document.createElement("input")
    inputEl.type = "text"
    inputEl.className = "chapter-input"
    inputEl.placeholder = scene.placeholder || "Napiš sem..."
    this.content.appendChild(inputEl)
    
    await this.delay(100)
    inputEl.classList.add("visible")
    inputEl.focus()
    
    // Store reference
    this.inputField = inputEl
  }

  // Render image
  async renderImage(scene) {
    if (scene.textBefore) {
      for (const line of scene.textBefore) {
        await this.renderLine(line)
      }
    }
    
    const imgEl = document.createElement("img")
    imgEl.className = "chapter-image"
    imgEl.src = scene.src
    imgEl.alt = scene.alt || ""
    this.content.appendChild(imgEl)
    
    await this.delay(300)
    imgEl.classList.add("visible")
  }

  // Render comic grid
  async renderComic(scene) {
    if (scene.textBefore) {
      for (const line of scene.textBefore) {
        await this.renderLine(line)
      }
    }
    
    const gridEl = document.createElement("div")
    gridEl.className = "comic-grid"
    gridEl.style.display = "grid"
    gridEl.style.gridTemplateColumns = "repeat(2, 1fr)"
    gridEl.style.gap = "1rem"
    gridEl.style.maxWidth = "800px"
    gridEl.style.margin = "0 auto"
    
    if (scene.chaos) {
      gridEl.classList.add("chaos-mode")
      gridEl.style.gridTemplateColumns = "1fr"
    }
    this.content.appendChild(gridEl)
    
    const colors = ["#ff6b35", "#a855f7", "#4ade80", "#fbbf24", "#ef4444"]
    
    // Create all panels first to establish grid layout
    const panels = []
    
    for (let i = 0; i < scene.images.length; i++) {
      const panelEl = document.createElement("div")
      panelEl.className = "comic-panel"
      panelEl.style.position = "relative"
      
      // Panel number
      const panelNumber = document.createElement("div")
      panelNumber.className = "panel-number"
      panelNumber.textContent = `Panel ${i + 1}`
      panelNumber.style.fontSize = "0.9rem"
      panelNumber.style.marginBottom = "0.5rem"
      panelNumber.style.color = "#a0a0c0"
      panelNumber.style.textAlign = "center"
      panelEl.appendChild(panelNumber)
      
      if (scene.chaos) {
        panelEl.classList.add("chaos")
        panelEl.style.borderColor = colors[i % colors.length]
        panelEl.style.transform = `rotate(${(Math.random() - 0.5) * 10}deg)`
      }
      
      // Create image element but don't append yet
      const img = document.createElement("img")
      img.src = scene.images[i]
      img.alt = `Panel ${i + 1}`
      img.style.width = "100%"
      img.style.height = "auto"
      img.style.display = "block"
      
      // Loading placeholder
      const placeholder = document.createElement("div")
      placeholder.className = "image-placeholder"
      placeholder.style.width = "100%"
      placeholder.style.minHeight = "150px"
      placeholder.style.background = "rgba(60, 60, 80, 0.5)"
      placeholder.style.borderRadius = "8px"
      placeholder.style.display = "flex"
      placeholder.style.alignItems = "center"
      placeholder.style.justifyContent = "center"
      placeholder.style.color = "#888"
      placeholder.textContent = "Načítám..."
      
      panelEl.appendChild(placeholder)
      
      // Store references
      panels.push({
        element: panelEl,
        image: img,
        placeholder: placeholder,
        index: i
      })
      
      gridEl.appendChild(panelEl)
    }
    
    // Now load images sequentially with delays
    for (let i = 0; i < panels.length; i++) {
      const panelData = panels[i]
      const { element, image, placeholder } = panelData
      
      // Handle image loading
      image.onload = () => {
        if (placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder)
        }
        element.appendChild(image)
        element.classList.add("visible")
      }
      
      image.onerror = () => {
        if (placeholder.parentNode) {
          placeholder.textContent = "❌ Obrázek nenalezen"
          placeholder.style.color = "#ef4444"
        }
        element.classList.add("visible")
      }
      
      // Wait for image to load or timeout
      await new Promise(resolve => {
        if (image.complete) {
          if (placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder)
          }
          element.appendChild(image)
          element.classList.add("visible")
          setTimeout(resolve, 2500) // 2.5 second delay between images
        } else {
          image.onload = () => {
            if (placeholder.parentNode) {
              placeholder.parentNode.removeChild(placeholder)
            }
            element.appendChild(image)
            element.classList.add("visible")
            setTimeout(resolve, 2500)
          }
          image.onerror = () => {
            if (placeholder.parentNode) {
              placeholder.textContent = "❌ Obrázek nenalezen"
              placeholder.style.color = "#ef4444"
            }
            element.classList.add("visible")
            setTimeout(resolve, 2500)
          }
          // Timeout fallback
          setTimeout(() => {
            if (placeholder.parentNode) {
              placeholder.textContent = "⏱️ Čas vypršel"
              placeholder.style.color = "#fbbf24"
            }
            element.classList.add("visible")
            resolve()
          }, 3000)
        }
      })
    }
    
    // Confetti for chaos mode
    if (scene.confetti) {
      this.createConfettiExplosion()
    }
  }

  // Show buttons
  async showButtons(buttonConfigs) {
    console.log("showButtons called with:", buttonConfigs)
    if (!buttonConfigs || buttonConfigs.length === 0) {
      console.log("No buttons to show")
      return
    }
    
    for (const config of buttonConfigs) {
      const btn = document.createElement("button")
      btn.className = "chapter-btn"
      if (config.primary) btn.classList.add("primary")
      btn.textContent = config.text
      
      btn.addEventListener("click", () => this.handleButtonClick(config))
      
      this.buttons.appendChild(btn)
      await this.delay(100)
      btn.classList.add("visible")
    }
  }

  // Handle button click
  async handleButtonClick(config) {
    // Disable all buttons
    const allBtns = this.buttons.querySelectorAll(".chapter-btn")
    allBtns.forEach(b => b.disabled = true)
    
    // Special actions
    if (config.action === "next") {
      this.currentScene++
      await this.playScene()
    } else if (config.action === "end") {
      this.endChapter()
    } else if (config.action === "map") {
      this.returnToMap()
    } else if (config.action === "submit") {
      // Handle input submission
      if (this.inputField && this.inputField.value.length >= 10) {
        this.userInput = this.inputField.value
        // End chapter after successful input submission
        this.endChapter()
      }
    } else if (config.action === "skip") {
      // Skip bonus chapter
      this.returnToMap()
    } else {
      // Default: go to next scene
      this.currentScene++
      await this.playScene()
    }
  }

  // End chapter
  async endChapter() {
    // Mark chapter as completed
    if (!window.gameState.completedLocations.includes(this.currentChapter)) {
      window.gameState.completedLocations.push(this.currentChapter)
    }
    
    // Update unlocks
    this.updateUnlocks()
    
    // If this is the final chapter, close the window
    if (this.currentChapter === "konec") {
      // Small delay for celebration effect
      await this.delay(1500)
      
      // Close the window
      window.close()
    } else {
      // Return to map for other chapters
      this.returnToMap()
    }
  }

  // Update what's unlocked
  updateUnlocks() {
    const completed = window.gameState.completedLocations
    
    // Napoleon unlocks Freaky Comix (bonus)
    if (completed.includes("napoleon") && !completed.includes("freaky_comix")) {
      // freaky_comix becomes available
    }
    
    // Freaky Comix unlocks Jednou větou (main)
    if (completed.includes("freaky_comix") && !completed.includes("jednou_vetou")) {
      // jednou_vetou becomes available
    }
    
    // Jednou větou unlocks Sítě Video (bonus)
    if (completed.includes("jednou_vetou") && !completed.includes("site_video")) {
      // site_video becomes available
    }
    
    // Sítě Video unlocks Některá proč (main)
    if (completed.includes("site_video") && !completed.includes("nektera_proc")) {
      // nektera_proc becomes available
    }
    
    // Některá proč unlocks Pudinkový příběh (bonus)
    if (completed.includes("nektera_proc") && !completed.includes("pudinkovy_pribeh")) {
      // pudinkovy_pribeh becomes available
    }
    
    // Pudinkový příběh unlocks Konec (main)
    if (completed.includes("pudinkovy_pribeh") && !completed.includes("konec")) {
      // konec becomes available
    }
  }

  // Return to map
  async returnToMap() {
    const chapterScreen = document.getElementById("chapterScreen")
    const mapScreen = document.getElementById("mapScreen")
    
    chapterScreen.style.transition = "opacity 0.5s ease"
    chapterScreen.style.opacity = "0"
    
    await this.delay(500)
    
    chapterScreen.classList.remove("active")
    chapterScreen.style.display = "none"
    
    mapScreen.style.display = "block"
    mapScreen.classList.add("active")
    mapScreen.style.opacity = "0"
    
    await this.delay(50)
    mapScreen.style.transition = "opacity 0.5s ease"
    mapScreen.style.opacity = "1"
    
    // Update map nodes
    window.updateMapNodes()
    
    // Update bottom navigation buttons
    if (typeof updateBottomButtons === "function") {
      updateBottomButtons()
    }
  }

  // Typewriter effect
  async typewriter(element, text, speed = 45) {
    element.textContent = ""
    element.style.opacity = "1"
    
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i]
      const variance = Math.random() * 20 - 10
      const punctuationDelay = [",", ".", "?", "!"].includes(text[i]) ? 150 : 0
      await this.delay(speed + variance + punctuationDelay)
    }
  }

  // Confetti explosion
  createConfettiExplosion() {
    const colors = ["#ff6b35", "#a855f7", "#4ade80", "#fbbf24", "#ef4444", "#3b82f6"]
    
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = Math.random() * 100 + "vw"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 0.5 + "s"
      document.body.appendChild(confetti)
      
      setTimeout(() => confetti.remove(), 2500)
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // ============================================
  // CHAPTER DATA
  // ============================================

  getNapoleonChapter() {
    return {
      id: "napoleon",
      name: "Napoleon",
      scenes: [
        {
          type: "title",
          title: "Napoleon",
          emoji: "🤪",
          lines: [
            { text: "Jsem čtenář", speed: 40 },
            { text: "a když jsem slyšel,", speed: 40 },
            { text: "že existuje kniha od Napoleona,", speed: 40 },
            { text: "byl jsem mega happy.", speed: 40 }
          ],
          buttons: [
            { text: "Pokračuj", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Protože jsem si myslel", speed: 40 },
            { text: "(iluze porozumění – #meme_naší_školy)", small: true, speed: 35, pauseAfter: 2000 },
            { text: "že Napoleon byl ten,", speed: 40 },
            { text: "co spálil svoje lodě", speed: 40 },
            { text: "při nějakém dobývání.", speed: 40, pauseAfter: 600 }
          ],
          buttons: [
            { text: "Cože? 😳", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Šlo tam o to,", speed: 50 },
            { text: "že když vojákům nedáš možnost jít zpět,", speed: 50 },
            { text: "budou bojovat mnohem líp.", speed: 50, pauseAfter: 600 },
            { text: "Budou mít v hlavě,", speed: 50 },
            { text: "že pokud se někdy v životě ještě nají,", speed: 50 },
            { text: "tak to bude jídlo,", speed: 50 },
            { text: "které vyrabují z nepřátelských měst.", speed: 50, pauseAfter: 800 }
          ],
          buttons: [
            { text: "Hardcore 🔥", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "K mému smutku", speed: 35 },
            { text: "Napoleon nic takového neudělal.", speed: 35, pauseAfter: 1200 },
            { text: "Byl to někdo úplně jiný.", instant: true, pauseAfter: 400 }
          ],
          buttons: [
            { text: "Ou... 😐", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Další rána přišla,", speed: 35 },
            { text: "když jsem zjistil,", speed: 35 },
            { text: "že to ani nebylo od Bonaparta,", speed: 35 },
            { text: "ale od nějakýho Hilla 🙃🤯", speed: 35, shake: true, emojiBounce: true }
          ],
          buttons: [
            { text: "Však já ti to říkala !!", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "No a do třetice všeho špatného", speed: 30 },
            { text: "ta kniha nešla upirátit 😋😋😋", speed: 30, emojiBounce: true }
          ],
          buttons: [
            { text: "XDD 😂😂😂", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Takže budu muset upustit od svého závazku k tobě", speed: 35 },
            { text: "a tu knihu nečíst z důvodu mé neznalosti k autorovi", speed: 35 }
          ],
          buttons: [
            { text: "Cože?! 🤯", action: "next" },
                   ]
        },
        {
          type: "text",
          pauseBefore: 800,
          lines: [
            { text: "..", speed: 400, pauseAfter: 800 },
            { text: ".......", speed: 300, pauseAfter: 800 },
            { text: "............", speed: 200, pauseAfter: 800 },
            { text: "Actually......", speed: 150, pauseAfter: 600 }
          ],
          buttons: [
            { text: "... 👀", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Tahle výmluva je totální bullshit 🤣🤣🤣🤪", instant: true, big: true, green: true, glow: true, emojiBounce: true }
          ],
          buttons: [
            { text: "???", action: "next" }
          ]
        },
        {
          type: "image",
          src: "Book.jpg",
          alt: "Kniha",
          caption: "TADÁ",
          buttons: [
            { text: "Continue →", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "MYSLÍŠ, ŽE BYCH PORUŠIL SVOJE SLOVO!!!", instant: true, huge: true, red: true, shake: true, pauseAfter: 800 },
            { text: "NA UHHH.", speed: 30 }
          ],
          buttons: [
            { text: "Respect 🫡", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Tu knihu jsem koupil.", speed: 45, pauseAfter: 600 },
            { text: "To, že ji měli jen v angličtině,", speed: 45 },
            { text: "už neberu ani jako něco, co by mě mohlo zpomalit, natož zastavit.", speed: 45 }
          ],
          buttons: [
            { text: "Sigma 😎", action: "next" },
            { text: "A přečteš ji?", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Tu knihu schroustám tak do týdne,", speed: 35 },
            { text: "takže potom jsem ready na párek v rohlíku 🤤😋", speed: 35, emojiBounce: true }
          ],
          buttons: [
            { text: "Jasně! 🌭", action: "end" },
          ]
        }
      ]
    }
  }

  getJednouVetouChapter() {
    return {
      id: "jednou_vetou",
      name: "Jednou větou",
      scenes: [
        {
          type: "title",
          title: "Jednou větou",
          lines: [
            { text: "Emmmm…", speed: 100, small: true, pauseAfter: 600 }
          ],
          buttons: [
            { text: "Co? 🤔", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Takže budu citovat jeden poznatek", speed: 45 },
            { text: "z těch zápisků o komunikaci →", speed: 45, pauseAfter: 400 }
          ],
          buttons: [
            { text: "Pokračuj 📝", action: "next" }
          ]
        },
        {
          type: "quote",
          lines: [
            { text: "„Všichni jsou nepochopení.", big: true },
            { text: "Není možné dostat celý obsah své mysli ven.", big: true },
            { text: "To, co sdílíme, je jen subset", big: true },
            { text: "(jen část prožitku nebo myšlenky).", big: true }
          ],
          buttons: [
            { text: "okay 👍", action: "next", delay: 2000 }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Výhoda toho že dokážeš jednou vetou popsat složitý koncept tak aby to druhý člověk pochopi z tebe udělá lepšího komunikátora", speed: 40 },
            { text: "výhody pokud jseš posluchač", speed: 30 },
            { text: "→ dozvíš se celou podstatu HNED", delay: 800, speed: 30 },
            { text: "→ budeš víc sigma", delay: 600, speed: 35 },
            { text: "→ dozvíš se celou podstatu HNED", delay: 400, speed: 30 }
          ],
          buttons: [
            { text: "Jasně! 👍", action: "next" }
          ]
        },
      
        {
          type: "text",
          lines: [
            { text: "Hlavní podstata něčeho", speed: 55 },
            { text: "v jedné větě", speed: 55, bold: true },
            { text: "je POWERFUL.", speed: 55, big: true, gold: true, glow: true }
          ],
          buttons: [
            { text: "True 💪", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Co jsem se já dozvěděl, je,", speed: 45 },
            { text: "že podnikáš se sestrami,", speed: 45 },
            { text: "že jsi zapálený motivátor", speed: 45 },
            { text: "a že už něco víš o podnikání.", speed: 45 }
          ],
          buttons: [
            { text: "Správně 👍", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Ale vůbec jsem se nedozvěděl,", speed: 55 },
            { text: "co to vlastně děláš 😭", speed: 55, emojiBounce: true, pauseAfter: 500 }
          ],
          buttons: [
            { text: "Aha... 😅", action: "next" },
            { text: "Fair point", action: "next" }
          ]
        },
        {
          type: "input",
          lines: [
            { text: "Takže tvým domácím úkolem je", speed: 80, variance: 40 },
            { text: "vytvořit tu jednu větu", speed: 60, variance: 30 },
            { text: "😋🍀🫵", speed: 120, variance: 60, emojiBounce: true }
          ],
          placeholder: "Napiš jednu větu o tom, co děláš...",
          buttons: [
            { text: "🔥", action: "end", primary: true }
          ]
        },
      ]
    }
  }

  getNekteraProcChapter() {
    return {
      id: "nektera_proc",
      name: "Některá proč...",
      scenes: [
        {
          type: "title",
          title: "Některá proč",
          lines: [
            { text: "...........", speed: 100, pauseAfter: 0 },
            { text: "Motice", speed: 70, strikethrough: "ce", corrected: "vace", pauseAfter: 1000 }
          ],
          pauseBefore: 500,
          buttons: [
            { text: "Proč jsi si musel zapamatovat zrovna moje gramatický chyby 😔", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Pojďme začít tím, že si doplníme pár pointů,", speed: 35 },
            { text: "protože nechat tam ten prázdnej papír", speed: 35 },
            { text: "jenom se třema mínusama a plusama", speed: 35 },
            { text: "bylo až moc funny.", speed: 35 },
            { text: "A to z nás ty milionáře neudělá 😎🫢", speed: 35, emojiBounce: true }
          ],
          
          buttons: [
            { text: "Bohužel ne 💸", action: "next" }
            
          ]
        },
        {
          type: "dual_list",
          title: "Motivace",
          positiveTitle: "➕ Pozitivní",
          negativeTitle: "➖ Negativní",
          positiveItems: [
            { text: "Peníze" },
            { text: "Svoboda (můžeš nakládat s časem, jak chceš)" },
            { text: "Respekt / vyšší společenský status" },
            { text: "Emoční úleva (pomsta, spravedlnost, splněný slib)" },
            { text: "Možnost následovat vnitřní touhu" }
          ],
          negativeItems: [
            { text: "Ztráta bydlení" },
            { text: "Nemožnost uživit se v budoucnu" },
            { text: "Ztráta úcty lidí, na kterých nám záleží" },
            { text: "(no more \"hrdí rodiče\" momenty)" },
            { text: "Samota" },
            { text: "Neschopnost zajistit rodinu" }
          ],
          buttons: [
            { text: "Pokračuj ▶️", action: "next", primary: true }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Myslím, že vím, na co ses snažila narazit:", speed: 45 },
            { text: "negativní motivátory jsou silnější než ty pozitivní.", speed: 45, bold: true, glow: true }
          ],
          buttons: [
            { text: "Pokračuj", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "V mém oblíbeném blogu jsem se dočetl,", speed: 45 },
            { text: "že úspěch je:", speed: 45, pauseAfter: 500 },
            { text: "10 % talent", speed: 60 },
            { text: "10 % úsilí", speed: 60 },
            { text: "70 % neskončit", speed: 60, big: true, gold: true, glow: true },
            { text: "a ještě 10 % něčeho,", speed: 60 },
            { text: "ale to už jsem zapomněl.", speed: 60 }
          ],
          buttons: [
            { text: "Pokračuj", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Jsme naivní, když si říkáme,", speed: 55 },
            { text: "jak budeme rich díky podnikání.", speed: 55, pauseAfter: 800 },
            { text: "Pravda je, že to bude těžký.", speed: 55 },
            { text: "Ale cokoliv co v životě děláš bude těžký.", speed: 45 },
            { text: "Jde jen o to vybrat si svoje těžký.", speed: 45, bold: true }
          ],
          buttons: [
            { text: "Okay......", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "\"Nechci pracovat v normálním jobu\"", instant: true, small: true, pauseAfter: 400 },
            { text: "není dost dobrý důvod.", speed: 45, pauseAfter: 600 },
            { text: "Jakmile člověk zjistí, že se věci zázračně nezlepší,", speed: 55 },
            { text: "vrátí se k tomu, co dělal předtím.", speed: 55 }
          ],
          buttons: [
            { text: "🤔", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Ten důvod musí odpovídat na otázku:", speed: 45, pauseAfter: 400 },
            { text: "\"Proč to nevzdáš?\"", speed: 45, huge: true, bold: true, orange: true, glow: true, pauseAfter: 1000 },
            { text: "Mít důvod, kterej ti nedovolí se vzdát,", speed: 55 },
            { text: "je to, co ti dá drive.", speed: 55 }
          ],
          buttons: [
            { text: "Deep 💡", action: "next" },
            { text: "A tvůj důvod?", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "U mě je to kombinace víc důvodů.", speed: 45, pauseAfter: 500 },
            { text: "Ale ten hlavní je,", speed: 45 },
            { text: "že ať se rozhodnu žít jakkoliv, tohle jsem zvážil jako nejlepší cestu.", speed: 45 },
            { text: "Dokud je tohle nejlepší alternativa, nemám potřebu dělat něco jiného.", speed: 45 }
          ],
          buttons: [
            { text: "Respect 🫡", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Síla negativních motivátorů nám ukazuje,", speed: 55 },
            { text: "že nejde o to, že chceme dosáhnout cíle,", speed: 55 },
            { text: "jde o to že musíme.", speed: 55, bold: true },
            { text: "nebo se tak minimálně cítíme: (musím vypadnout z týhle díry)", speed: 55 }
          ],
          buttons: [
            { text: "?", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Je to změna v chování.", speed: 45 },
            { text: "Jinak se chová ten, kdo to chce,", speed: 45 },
            { text: "a jinak ten, kdo nevidí jinou možnost než uspět.", speed: 45 }
          ],
          buttons: [
            { text: "All right 👍", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "(Doufám, že jsem to sformuloval all right,", small: true, speed: 35 },
            { text: "protože all left není tak cool.)", small: true, speed: 35, pauseAfter: 600 },
            { text: "No… nebyla to jedna věta 😄", speed: 45, emojiBounce: true },
            { text: "Nevadí. Zkusím to příště.", speed: 45 }
          ],
          buttons: [
            { text: "Haha dobrý 😂", action: "end" },
                   ]
        }
      ]
    }
  }

  getFreakyComixChapter() {
    return {
      id: "freaky_comix",
      name: "Freaky Comix",
      scenes: [
        {
          type: "text",
          lines: [
            { text: "řekl jsem ChatGPT", speed: 35 },
            { text: "ať udělá komix toho,", speed: 35 },
            { text: "co se stane když si dám kafe", speed: 35, pauseAfter: 500 },
            { text: "#MusímeZajítNaPárekVRohlikuANeNaKafe", speed: 35, bold: true, orange: true, glow: true }
          ],
          buttons: [
            { text: "Show me 👀", action: "next" }
            
          ]
        },
        {
          type: "comic",
          images: [
            "images/img1.png",
            "images/img2.png",
            "images/img3.png",
            "images/img4.png",
            "images/img5.png"
          ],
          buttons: [
            { text: "Haha nice 😂", action: "next" },
            { text: "To byl Horor💀", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Taky jsem mu vysvětlil,", speed: 45 },
            { text: "jak by se dali UMĚLECKY vylepšit ty tvoje oblíbený džíny", speed: 45 }
                 
          ],
          buttons: [
            { text: "Cože? 😳", action: "next" },
            
          ]
        },
        {
          type: "text",
          lines: [
            { text: "ale teda tohle je až moc goofy komix XDD", speed: 35, emojiBounce: true }
          ],
          buttons: [
            { text: "Show me! 🤣", action: "next" }
          ]
        },
        {
          type: "comic",
          chaos: true,
          confetti: true,
          images: [
            "images/img6.png",
            "images/img7.png",
            "images/img8.png",
            "images/img9.png",
            "images/img10.png"
          ],
          buttons: [
            { text: "TOHLE BYL HOROR", action: "next" },
            { text: "Umělecké dílo 🎨", action: "next" }
          ]
        },
        {
          type: "text",
          lines: [
            { text: "Za mě to teda bylo umělecký dílo", speed: 45, pauseAfter: 1200 },
            { text: "Teda až na to.....💀", speed: 45, emojiBounce: true, pauseAfter: 600 },
            { text: "ŽE ZE MĚ UDĚLAL ČLOVĚKO PSA !!!", small: true, speed: 40 }
          ],
          buttons: [
            { text: "Ukonči moje utrpení ", action: "end", primary: true },
            { text: "Actualy to nebylo tak strašný ", action: "end", primary: true },
          ]
        }
      ]
    }
  }
// ============================================
// NOVÉ CHAPTERY
// ============================================

getSiteVideoChapter() {
  return {
    id: "site_video",
    name: "Sítě Video",
    scenes: [
      {
        type: "title",
        title: "Sítě Video",
        emoji: "📡",
        lines: [
          { text: "V pátek jsme my tři", speed: 40 },
          { text: "(tedy já, Vu a Miro – celý pudinkový squad)", speed: 40, small: true },
          { text: "zůstali po škole.", speed: 40 },
          { text: "Abychom dodělali cvičení do sítí, protože učitelé se rozhodli že nás jinak nebudou klasifikovat.", speed: 40,pauseAfter: 600  },
         
        ],
        buttons: [
          { text: "🤔", action: "next" }
                ]
      },
      {
        type: "text",
        lines: [
          { text: "Já jsem tam byl jenom pofarmit známky.", speed: 40 },
          { text: "Reálně jsem nepřispěl skupině ani v nejmenším.", speed: 40, pauseAfter: 500 },
          { text: "Nebo teda…", speed: 35, pauseAfter: 400 },
          { text: "dělal jsem jim něco mezi", speed: 35 },
          { text: "motivátorem a roztleskávačkou,", speed: 35, bold: true },
          { text: "aby tam neusnuli. 💤", speed: 35, emojiBounce: true }
        ],
        buttons: [
          { text: "Haha nice 😂", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Mezitím co jsme čekali na učitele,", speed: 40 },
          { text: "tam přišli tři lidi.", speed: 40, pauseAfter: 500 },
          { text: "A z celý školy to byla zrovna", speed: 40 },
          { text: "moje oblíbená skupina ze sesterské třídy.", speed: 40, green: true, glow: true }
        ],
        buttons: [
          { text: "A pak? 👀", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Tak vzniklo toto videjko 📹", speed: 40, big: true, gold: true, glow: true },
          { text: "Tohle je tutorial", speed: 45 },
          { text: "jak dělat síťařinu.", speed: 45, bold: true, pauseAfter: 500 },
          { text: "Takže sleduj a uč se 😎", speed: 40, emojiBounce: true }
        ],
        buttons: [
          { text: "Ukaž! 🎬", action: "next" }
        ]
      },
      {
        type: "video",
        embedId: "PV2iaadxUy0",
        caption: "Tutorial: Jak dělat síťařinu 🔥",
        buttons: [
          { text: "Haha legenda 😂", action: "end" },
          { text: "Epic! 🔥", action: "end" }
        ]
      }
    ]
  }
}

getPudinkovyPribehChapter() {
  return {
    id: "pudink",
    name: "Pudinkový příběh",
    scenes: [
      {
        type: "title",
        title: "Pudinkový příběh",
        emoji: "🍮",
        lines: [
          { text: "Takže sestra mi donesla", speed: 40 },
          { text: "\"pudink\"", speed: 40, bold: true },
          { text: "...", speed: 100, pauseAfter: 500 }
        ],
        buttons: [
          { text: "A co se stalo? 🤔", action: "next" },
                  ]
      },
      {
        type: "image",
        src: "Image.jpg",
        alt: "Pudink",
        caption: "Tohle měl být pudink...",
        buttons: [
          { text: "Vypadá dobře! 😋", action: "next" },
          { text: "Hmm... 🤨", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Když jsem to nabral lžyčkou,", speed: 40 },
          { text: "tak jsem zjistil,", speed: 40 },
          { text: "že je to víc čokoládový mlíko", speed: 40 },
          { text: "než pudink 😬🥴", speed: 40, emojiBounce: true, shake: true }
        ],
        buttons: [
          { text: "LOL 😂", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Tak se musím zeptat:", speed: 45, pauseAfter: 500 },
          { text: "Umíš ty uvařit pudink??", speed: 45, big: true, orange: true, glow: true }
        ],
        buttons: [
          { text: "Ano! 😎", action: "next" },
          { text: "Jasně! 👍", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "To rád slyším! 🔥", speed: 40, green: true, glow: true },
          { text: "Tak to můžeme rovnou otestovat.", speed: 40 }
        ],
        buttons: [
          { text: "Pojďme na to! 💪", action: "next" }
        ]
      },
      {
        type: "pudding_game",
        title: "Pudink minihra",
        instructions: "Tvým úkolem přidat 99 pudinku",
        target: 99
      },
      {
        type: "text",
        lines: [
          { text: "Hmm, to vypadá dobře...", speed: 40, pauseAfter: 600 },
          { text: "Ale něco tomu chybí 😉", speed: 40 },
          { text: "Něco jako třešnička na dortu.", speed: 40, pauseAfter: 1600 },
          { text: "Co by to jen mohlo být........", speed: 35, pauseAfter: 2000 }
        ],
        buttons: [
          { text: "Hmm... 🤔", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Co myslíš???", speed: 40, pauseAfter: 2000 },
          { text: "Cože!?", speed: 30, instant: true, pauseAfter: 500 },
          { text: "Musíš to říct nahlas!", speed: 30, shake: true, pauseAfter: 2000 }
        ],
        buttons: [
          { text: "Už jsem to řekla nahlas !", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Pistácie?!", speed: 30, huge: true, red: true, shake: true, pauseAfter: 600 },
          { text: "Ejuu! 😖", speed: 35, emojiBounce: true },
          { text: "Fuj, víš jak by to chutnalo!?", speed: 40 },
          { text: "To by někoho mohlo otrávit! 😵🤢", speed: 40, emojiBounce: true, pauseAfter: 2000 },
          { text: "Správná odpověď je:", speed: 45, pauseAfter: 400 },
          { text: "přidat další pudink! 🤤", speed: 40, huge: true, gold: true, glow: true, emojiBounce: true }
        ],
        buttons: [
          { text: "Přidat pudink! 🍮", action: "next", primary: true }
        ]
      },
     
      {
        type: "celebration",
        confetti: true,
        lines: [
          { text: "PERFEKTNÍ! 🎉", huge: true, gold: true, glow: true },
          { text: "Tohle je mistrovské dílo! 🍮✨", big: true, green: true }
        ],
        buttons: [
          { text: "Děkuji! 😎", action: "end" }
        ]
      }
    ]
  }
}



getKonecChapter() {
  return {
    id: "main_end",
    name: "Konec",
    scenes: [
      {
        type: "title",
        title: "Konec",
        emoji: "🎉",
        lines: [
          { text: "Tak to vypadá,", speed: 40 },
          { text: "že jsi prošla celou gamesu! 🎮", speed: 40, gold: true, glow: true }
        ],
        buttons: [
          { text: "Yay! 🎉", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Nemůžu než pogratulovat 🥳", speed: 40, big: true, green: true, glow: true }
        ],
        buttons: [
          { text: "Díky! 😊", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Cílem této webovky bylo ukázat,", speed: 45 },
          { text: "že ty komunikační znalosti", speed: 45 },
          { text: "opravdu využívám.", speed: 45, bold: true, pauseAfter: 600 },
          { text: "Tato stránka má být příkladem", speed: 45 },
          { text: "toho nejdůležitějšího pravidla konverzace,", speed: 45 },
          { text: "a to je...", speed: 40, pauseAfter: 1000 }
        ],
        buttons: [
          { text: "A to je...? 🤔", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "🥁🥁🥁🥁🥁🥁🥁🥁🥁", speed: 100, pauseAfter: 1200 },
          { text: "POSLOUCHAT 💥🎉🎉", huge: true, gold: true, glow: true, shake: true, emojiBounce: true }
        ],
        buttons: [
          { text: "True! 💯", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Snažil jsem se tě v tom vlaku", speed: 45 },
          { text: "opravdu poslouchat,", speed: 45 },
          { text: "protože mě actually zajímáš.", speed: 45, green: true, pauseAfter: 600 },
          { text: "A taky protože když se bavím", speed: 45 },
          { text: "se někým zajímavým,", speed: 45 },
          { text: "tak je jednodušší trénovat tu konverzaci.", speed: 45 }
        ],
        buttons: [
          { text: "Ok....", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Když se teď podíváš na tu webovku,", speed: 45 },
          { text: "je něco, co jsem si nezapamatoval?", speed: 45, pauseAfter: 800 },
          { text: "Myslím, že jsem vše z té konverzace", speed: 45 },
          { text: "implementoval,", speed: 45 },
          { text: "takže cíl jsem nejspíš splnil 🥱", speed: 45, emojiBounce: true }
        ],
        buttons: [
          { text: "Splnil! 💯", action: "next" },
          { text: "Co teď? 🤔", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Co teď?", speed: 45, bold: true, pauseAfter: 500 },
          { text: "Tento týden dělám certifikát z databází, takže všechen čas dám tomu,", speed: 40, pauseAfter: 600 },
          { text: "Potom hned jak ho udělám, tak začnu číst tu knihu.", speed: 40 }
          
        ],
        buttons: [
          { text: "A pak? 😊", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "No a pak to bude ready", speed: 40 },
          { text: "zajet za tebou někam na dobrodružo! 🗺️", speed: 40, gold: true, glow: true, emojiBounce: true, pauseAfter: 600 },
          { text: "Kamarád co taky bydlí ve Čtyřkolech", speed: 40 },
          { text: "mi řekl, že mě rád uvidí.", speed: 40, pauseAfter: 1500 },
          { text: "Jak jsem slyšel,", speed: 40 },
          { text: "tobě nejvíc vyhovují soboty,", speed: 40 },
          { text: "takže bych v pátek nejspíš přespal u něho", speed: 40 },
          { text: "On by mi dal moudra", speed: 40 },
          { text: "a zvedl mi IQ na úroveň,", speed: 40 },
          { text: "takže až tě v sobotu uvidím,", speed: 40 },
          { text: "budu Předávat moudra za dva", speed: 40, bold: true }
        
        ],
        buttons: [
          { text: "Haha 😄", action: "next" }
        ]
      },
      
      {
        type: "text",
        lines: [
          { text: "Co ty teď?", speed: 45, big: true, orange: true, pauseAfter: 600 },
          { text: "Myslím, že bys ocenila tyto videa,", speed: 40 },
          { text: "protože jsme se o nich bavili.", speed: 40, pauseAfter: 500 },
          { text: "Vždycky je čas se učit něčemu novému,", speed: 40 },
          { text: "tak jen do toho 🔥🔥", speed: 40, emojiBounce: true }
        ],
        buttons: [
          { text: "Díky! 📚", action: "next" }
        ]
      },
      {
        type: "text",
        lines: [
          { text: "Držím palce se studiem! 🍀", speed: 40, green: true, glow: true, pauseAfter: 1000 },
          { text: "I když......", speed: 35, pauseAfter: 1200 },
          { text: "Bych tě radši držel za ruku 😏", speed: 35, bold: true, gold: true, glow: true, pauseAfter: 3500 },
          { text: "Hele, nemůžeš popřít, že tenhle rizz nebyl dobrej 😁😎", speed: 40 }
        ],
        buttons: [
          { text: "Smooth 😳", action: "next" },
          { text: "Haha 😄", action: "next" }
        ]
      },
      {
        type: "video",
        title: "region Beta",
        embedId: "tWH0pcCJp4c",
        description: "Toto video ti doporučuji jako první",
        startTime: 27
      },
      {
        type: "video",
        title: "Experimenty",
        embedId: "jntsKUT1Hkk",
        description: "A tohle jako druhé"
      },
      {
        type: "celebration",
        confetti: true,
        lines: [
          { text: "Tak čus! 👋", huge: true, gold: true, glow: true }
        ],
        buttons: [
          { text: "Čus! 👋", action: "end", primary: true }
        ]
      }
    ]
  }
}

  // Render pudding game
  async renderPuddingGame(scene) {
    // Game state
    let puddingCount = 0
    const target = scene.target || 99
    
    // Create game container
    const gameContainer = document.createElement("div")
    gameContainer.className = "pudding-game-container"
    gameContainer.style.textAlign = "center"
    gameContainer.style.padding = "2rem"
    gameContainer.style.background = "rgba(40, 40, 60, 0.6)"
    gameContainer.style.borderRadius = "12px"
    gameContainer.style.margin = "1rem 0"
    
    // Instructions
    const instructionEl = document.createElement("div")
    instructionEl.textContent = scene.instructions || "Přidej 99 pudinků!"
    instructionEl.style.fontSize = "1.3rem"
    instructionEl.style.marginBottom = "1rem"
    instructionEl.style.color = "#e0e0ff"
    gameContainer.appendChild(instructionEl)
    
    // Counter display
    const counterEl = document.createElement("div")
    counterEl.textContent = `${puddingCount}/${target}`
    counterEl.style.fontSize = "2rem"
    counterEl.style.fontWeight = "bold"
    counterEl.style.color = "#ff6b35"
    counterEl.style.marginBottom = "1rem"
    gameContainer.appendChild(counterEl)
    
    // Pudding container
    const puddingContainer = document.createElement("div")
    puddingContainer.className = "pudding-container"
    puddingContainer.style.position = "relative"
    puddingContainer.style.height = "200px"
    puddingContainer.style.overflow = "hidden"
    puddingContainer.style.marginBottom = "1rem"
    puddingContainer.style.background = "rgba(20, 20, 35, 0.3)"
    puddingContainer.style.borderRadius = "8px"
    gameContainer.appendChild(puddingContainer)
    
    // Button container
    const buttonContainer = document.createElement("div")
    buttonContainer.style.display = "flex"
    buttonContainer.style.gap = "1rem"
    buttonContainer.style.justifyContent = "center"
    buttonContainer.style.marginBottom = "1rem"
    buttonContainer.style.flexWrap = "wrap"
    
    // Add single pudding button
    const addButton = document.createElement("button")
    addButton.textContent = "Přidat pudink! 🍮"
    addButton.style.padding = "1rem 2rem"
    addButton.style.fontSize = "1.1rem"
    addButton.style.fontWeight = "bold"
    addButton.style.cursor = "pointer"
    addButton.style.border = "3px solid #ff6b35"
    addButton.style.background = "#ff6b35"
    addButton.style.color = "white"
    addButton.style.borderRadius = "12px"
    addButton.style.margin = "0 0.5rem"
    addButton.style.boxShadow = "0 4px 8px rgba(255, 107, 53, 0.3)"
    
    // Add 10 puddings button
    const addTenButton = document.createElement("button")
    addTenButton.textContent = "Přidat 10 pudinku 🍮🍮"
    addTenButton.style.padding = "1rem 2rem"
    addTenButton.style.fontSize = "1.1rem"
    addTenButton.style.fontWeight = "bold"
    addTenButton.style.cursor = "pointer"
    addTenButton.style.border = "3px solid #a855f7"
    addTenButton.style.background = "#a855f7"
    addTenButton.style.color = "white"
    addTenButton.style.borderRadius = "12px"
    addTenButton.style.margin = "0 0.5rem"
    addTenButton.style.boxShadow = "0 4px 8px rgba(168, 85, 247, 0.3)"
    
    buttonContainer.appendChild(addButton)
    buttonContainer.appendChild(addTenButton)
    gameContainer.appendChild(buttonContainer)
    
    // Status message
    const statusEl = document.createElement("div")
    statusEl.style.minHeight = "1.5rem"
    statusEl.style.color = "#a0a0c0"
    gameContainer.appendChild(statusEl)
    
    this.content.appendChild(gameContainer)
    
    // Add pudding function
    const addPudding = (count = 1) => {
      const remainingSpace = target - puddingCount
      const toAdd = Math.min(count, remainingSpace)
      
      if (toAdd <= 0) return
      
      for (let i = 0; i < toAdd; i++) {
        if (puddingCount < target) {
          puddingCount++
          counterEl.textContent = `${puddingCount}/${target}`
          
          // Create falling pudding emoji
          const pudding = document.createElement("div")
          pudding.textContent = "🍮"
          pudding.style.position = "absolute"
          pudding.style.fontSize = "2rem"
          pudding.style.left = Math.random() * 90 + "%"
          pudding.style.top = "-2rem"
          pudding.style.animation = `fall-down 2s linear forwards`
          puddingContainer.appendChild(pudding)
          
          // Remove pudding after animation
          setTimeout(() => {
            if (pudding.parentNode) {
              pudding.parentNode.removeChild(pudding)
            }
          }, 2000)
        }
      }
      
      // Update status and buttons
      if (puddingCount === target) {
        statusEl.textContent = "Dokončeno! 🎉"
        statusEl.style.color = "#4ade80"
        addButton.disabled = true
        addTenButton.disabled = true
        
        // Enable next button
        setTimeout(() => {
          const nextButton = document.createElement("button")
          nextButton.textContent = "Pokračovat ▶️"
          nextButton.className = "chapter-btn primary"
          nextButton.style.marginTop = "1rem"
          
          nextButton.addEventListener("click", () => {
            this.currentScene++
            this.playScene()
          })
          
          gameContainer.appendChild(nextButton)
          nextButton.classList.add("visible")
        }, 1000)
      } else if (puddingCount > target - 10) {
        statusEl.textContent = `Už jen ${target - puddingCount}! 🔥`
      } else {
        statusEl.textContent = `Přidáno: ${puddingCount} pudinků`
      }
      
      // Disable buttons if no space left
      if (puddingCount >= target) {
        addButton.disabled = true
      }
      // Disable +10 button if less than 10 spaces left
      if (puddingCount > target - 10) {
        addTenButton.disabled = true
      }
    }
    
    // Add click events
    // Add click events
    addButton.addEventListener("click", () => addPudding(1))
    addTenButton.addEventListener("click", () => addPudding(10))
    
    // Add keyboard support
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault()
        addPudding(1)
      } else if (e.code === "Enter") {
        e.preventDefault()
        addPudding(10)
      }
    }
    
    document.addEventListener("keydown", handleKeyPress)
    
    // Clean up event listener when scene ends
    const originalEndScene = this.endChapter.bind(this)
    this.endChapter = () => {
      document.removeEventListener("keydown", handleKeyPress)
      originalEndScene()
    }
  }
  

  
  // Render video
  async renderVideo(scene) {
    // Title
    if (scene.title) {
      const titleEl = document.createElement("div")
      titleEl.className = "chapter-line big"
      titleEl.textContent = scene.title
      titleEl.style.marginBottom = "1rem"
      titleEl.style.color = "#e0e0ff"
      this.content.appendChild(titleEl)
      
      await this.delay(200)
      titleEl.classList.add("visible")
    }
    
    // Description
    if (scene.description) {
      const descEl = document.createElement("div")
      descEl.className = "chapter-line"
      descEl.textContent = scene.description
      descEl.style.marginBottom = "1.5rem"
      descEl.style.color = "#a0a0c0"
      this.content.appendChild(descEl)
      
      await this.delay(200)
      descEl.classList.add("visible")
    }
    
    // Video container
    const videoContainer = document.createElement("div")
    videoContainer.style.position = "relative"
    videoContainer.style.width = "100%"
    videoContainer.style.maxWidth = "640px"
    videoContainer.style.margin = "0 auto 1.5rem"
    videoContainer.style.paddingTop = "56.25%" // 16:9 aspect ratio
    videoContainer.style.borderRadius = "12px"
    videoContainer.style.overflow = "hidden"
    videoContainer.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.4)"
    
    // iframe for YouTube
    const iframe = document.createElement("iframe")
    iframe.style.position = "absolute"
    iframe.style.top = "0"
    iframe.style.left = "0"
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.border = "none"
    
    // Generate YouTube embed URL
    const videoId = scene.embedId || scene.src?.split("v=")[1]?.split("&")[0] || ""
    
    if (videoId) {
      // Try embed first
      let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`
      
      // Add start time if specified
      if (scene.startTime) {
        embedUrl += `&start=${scene.startTime}`
      }
      
      iframe.src = embedUrl
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      iframe.allowFullscreen = true
      
      videoContainer.appendChild(iframe)
      this.content.appendChild(videoContainer)
      
      // Add fallback link button
      await this.delay(1000)
      const fallbackBtn = document.createElement("a")
      fallbackBtn.href = `https://youtu.be/${videoId}`
      fallbackBtn.target = "_blank"
      fallbackBtn.rel = "noopener noreferrer"
      fallbackBtn.className = "chapter-btn"
      fallbackBtn.textContent = "📺 Otevřít video na YouTube"
      fallbackBtn.style.marginTop = "1rem"
      fallbackBtn.style.display = "inline-block"
      
      this.content.appendChild(fallbackBtn)
      fallbackBtn.classList.add("visible")
    } else {
      // Fallback if no video ID
      const errorEl = document.createElement("div")
      errorEl.className = "chapter-line red"
      errorEl.textContent = "❌ Video není dostupné"
      errorEl.style.textAlign = "center"
      errorEl.style.margin = "2rem 0"
      this.content.appendChild(errorEl)
      errorEl.classList.add("visible")
    }
    
    await this.delay(300)
    videoContainer.style.opacity = "1"
    
    // Continue button
    await this.delay(1000)
    const continueBtn = document.createElement("button")
    continueBtn.className = "chapter-btn primary"
    continueBtn.textContent = "Pokračovat ▶️"
    continueBtn.style.marginTop = "1rem"
    
    continueBtn.addEventListener("click", () => {
      this.currentScene++
      this.playScene()
    })
    
    this.content.appendChild(continueBtn)
    
    await this.delay(200)
    continueBtn.classList.add("visible")
  }
  
  // Render dual list (positive/negative columns)
  async renderDualList(scene) {
    // Title
    if (scene.title) {
      const titleEl = document.createElement("div")
      titleEl.className = "chapter-line big"
      titleEl.textContent = scene.title
      titleEl.style.marginBottom = "1.5rem"
      titleEl.style.color = "#e0e0ff"
      titleEl.style.textAlign = "center"
      this.content.appendChild(titleEl)
      
      await this.delay(200)
      titleEl.classList.add("visible")
    }
    
    // Dual column container
    const dualContainer = document.createElement("div")
    dualContainer.style.display = "flex"
    dualContainer.style.gap = "2rem"
    dualContainer.style.justifyContent = "center"
    dualContainer.style.marginBottom = "2rem"
    dualContainer.style.flexWrap = "wrap"
    
    // Positive column
    const positiveColumn = document.createElement("div")
    positiveColumn.style.flex = "1"
    positiveColumn.style.minWidth = "250px"
    positiveColumn.style.maxWidth = "400px"
    
    const positiveTitle = document.createElement("div")
    positiveTitle.className = "chapter-line big green"
    positiveTitle.textContent = scene.positiveTitle || "Pozitivní"
    positiveTitle.style.marginBottom = "1rem"
    positiveTitle.style.textAlign = "center"
    positiveColumn.appendChild(positiveTitle)
    
    const positiveList = document.createElement("div")
    positiveList.className = "chapter-list"
    positiveList.style.display = "flex"
    positiveList.style.flexDirection = "column"
    positiveList.style.gap = "0.8rem"
    
    scene.positiveItems.forEach((item, index) => {
      const itemEl = document.createElement("div")
      itemEl.className = "chapter-list-item plus"
      itemEl.textContent = "→ " + item.text
      itemEl.style.padding = "0.8rem"
      itemEl.style.background = "rgba(40, 167, 69, 0.15)"
      itemEl.style.borderLeft = "3px solid #4ade80"
      itemEl.style.borderRadius = "6px"
      positiveList.appendChild(itemEl)
      
      setTimeout(() => {
        itemEl.classList.add("visible")
      }, index * 200)
    })
    
    positiveColumn.appendChild(positiveList)
    dualContainer.appendChild(positiveColumn)
    
    // Negative column
    const negativeColumn = document.createElement("div")
    negativeColumn.style.flex = "1"
    negativeColumn.style.minWidth = "250px"
    negativeColumn.style.maxWidth = "400px"
    
    const negativeTitle = document.createElement("div")
    negativeTitle.className = "chapter-line big red"
    negativeTitle.textContent = scene.negativeTitle || "Negativní"
    negativeTitle.style.marginBottom = "1rem"
    negativeTitle.style.textAlign = "center"
    negativeColumn.appendChild(negativeTitle)
    
    const negativeList = document.createElement("div")
    negativeList.className = "chapter-list"
    negativeList.style.display = "flex"
    negativeList.style.flexDirection = "column"
    negativeList.style.gap = "0.8rem"
    
    scene.negativeItems.forEach((item, index) => {
      const itemEl = document.createElement("div")
      itemEl.className = "chapter-list-item minus"
      itemEl.textContent = "→ " + item.text
      itemEl.style.padding = "0.8rem"
      itemEl.style.background = "rgba(239, 68, 68, 0.15)"
      itemEl.style.borderLeft = "3px solid #ef4444"
      itemEl.style.borderRadius = "6px"
      negativeList.appendChild(itemEl)
      
      setTimeout(() => {
        itemEl.classList.add("visible")
      }, index * 200 + 500)
    })
    
    negativeColumn.appendChild(negativeList)
    dualContainer.appendChild(negativeColumn)
    
    this.content.appendChild(dualContainer)
    
    // Animate columns
    await this.delay(300)
    positiveColumn.style.opacity = "1"
    negativeColumn.style.opacity = "1"
  }
}

// Export for use
window.ChapterManager = ChapterManager