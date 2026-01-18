// Game State
window.gameState = {
  currentLocation: "start",
  currentScene: 0,
  completedLocations: [], // Start is not completed until user finishes intro
}

// Save game state to localStorage
function saveGameState() {
  try {
    localStorage.setItem('storyGameState', JSON.stringify(window.gameState))
  } catch (e) {
    console.warn('Failed to save game state:', e)
  }
}

// Load game state from localStorage
function loadGameState() {
  try {
    const saved = localStorage.getItem('storyGameState')
    if (saved) {
      const parsed = JSON.parse(saved)
      window.gameState = {
        ...window.gameState,
        ...parsed
      }
      return true
    }
  } catch (e) {
    console.warn('Failed to load game state:', e)
  }
  return false
}

// Restart game function
function restartGame() {
  // Clear localStorage
  localStorage.removeItem('storyGameState')
  
  // Reset gameState to initial values
  window.gameState = {
    currentLocation: "start",
    currentScene: 0,
    completedLocations: []
  }
  
  // Reload the page to trigger fresh start
  location.reload()
}

// Make restartGame globally available
window.restartGame = restartGame

// Auto-save when game state changes
function setupAutoSave() {
  // Override gameState setters to auto-save
  const originalState = { ...window.gameState }
  
  Object.defineProperty(window, 'gameState', {
    get() {
      return originalState
    },
    set(newState) {
      Object.assign(originalState, newState)
      saveGameState()
    }
  })
  
  // Also save when completing locations
  const originalCompletedLocations = [...originalState.completedLocations]
  Object.defineProperty(originalState, 'completedLocations', {
    get() {
      return originalCompletedLocations
    },
    set(newLocations) {
      originalCompletedLocations.splice(0, originalCompletedLocations.length, ...newLocations)
      saveGameState()
    }
  })
  
  // Save on specific events
  const originalPush = Array.prototype.push
  originalCompletedLocations.push = function(...items) {
    const result = originalPush.apply(this, items)
    saveGameState()
    return result
  }
}

// Chapter Manager instance
let chapterManager = null

// Update map nodes based on game state
window.updateMapNodes = () => {
  const nodes = document.querySelectorAll(".location-node")
  const completed = window.gameState.completedLocations

  nodes.forEach((node) => {
    const location = node.dataset.location
    const statusEl = node.querySelector(".node-status")

    // Reset classes
    node.classList.remove("completed", "available", "locked")

    if (completed.includes(location)) {
      node.classList.add("completed")
      if (statusEl) statusEl.textContent = "Dokončeno"
    } else if (isAvailable(location)) {
      node.classList.add("available")
      if (statusEl) statusEl.textContent = "Dostupné"
    } else {
      node.classList.add("locked")
      if (statusEl) statusEl.textContent = "Zamčeno"
    }
  })

  // Update bottom navigation buttons
  updateBottomButtons()
}

// Check if location is available
function isAvailable(location) {
  const completed = window.gameState.completedLocations

  switch (location) {
    case "start":
      return true
    case "napoleon":
      return completed.includes("start")
    case "jednou_vetou":
      return completed.includes("napoleon")
    case "freaky_comix":
      return completed.includes("jednou_vetou")
    case "nektera_proc":
      return completed.includes("freaky_comix")
    case "site_video":
      return completed.includes("nektera_proc")
    case "pudinkovy_pribeh":
      return completed.includes("site_video")
    case "konec":
      return completed.includes("pudinkovy_pribeh")
    default:
      return false
  }
}

// Update bottom navigation buttons based on available routes
function updateBottomButtons() {
  const mainButton = document.getElementById("mainRouteButton")
  const bonusButton = document.getElementById("bonusRouteButton")
  
  if (!mainButton || !bonusButton) return
  
  // Hide both buttons initially
  mainButton.style.display = "none"
  bonusButton.style.display = "none"
  
  const completed = window.gameState.completedLocations
  
  // Check for available main route locations
  let nextMainLocation = null
  const mainRouteOrder = ["start", "napoleon", "jednou_vetou", "nektera_proc", "konec"]
  
  for (let i = 0; i < mainRouteOrder.length - 1; i++) {
    const currentLoc = mainRouteOrder[i]
    const nextLoc = mainRouteOrder[i + 1]
    
    if (completed.includes(currentLoc) && !completed.includes(nextLoc) && isAvailable(nextLoc)) {
      nextMainLocation = nextLoc
      break
    }
  }
  
  // Check for available bonus locations
  let availableBonusLocation = null
  const bonusLocations = [
    { id: "freaky_comix", unlocksAfter: "jednou_vetou" },
    { id: "site_video", unlocksAfter: "nektera_proc" },
    { id: "pudinkovy_pribeh", unlocksAfter: "site_video" }
  ]
  
  for (const bonus of bonusLocations) {
    if (completed.includes(bonus.unlocksAfter) && !completed.includes(bonus.id) && isAvailable(bonus.id)) {
      availableBonusLocation = bonus.id
      break
    }
  }
  
  // Show main button if available
  if (nextMainLocation) {
    const locationNames = {
      "napoleon": "Napoleon",
      "jednou_vetou": "Jednou větou",
      "nektera_proc": "Některá proč...",
      "konec": "Konec"
    }
    
    mainButton.querySelector(".button-text").textContent = locationNames[nextMainLocation] || nextMainLocation
    mainButton.onclick = () => travelToLocation(nextMainLocation)
    mainButton.style.display = "flex"
  }
  
  // Show bonus button if available
  if (availableBonusLocation) {
    const locationNames = {
      "freaky_comix": "Freaky Comix"
    }
    
    bonusButton.querySelector(".button-text").textContent = locationNames[availableBonusLocation] || availableBonusLocation
    bonusButton.onclick = () => travelToLocation(availableBonusLocation)
    bonusButton.style.display = "flex"
  }
}

// Travel to a location (starts the chapter)
function travelToLocation(location) {
  if (!chapterManager) {
    chapterManager = new window.ChapterManager()
  }
  
  chapterManager.startChapter(location)
}

// Handle node clicks
function setupNodeClicks() {
  const nodes = document.querySelectorAll(".location-node")

  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      if (!node.classList.contains("available")) return

      const location = node.dataset.location
      if (location === "start") return // Start is just a marker

      // Start the chapter
      if (!chapterManager) {
        chapterManager = new window.ChapterManager()
      }

      chapterManager.startChapter(location)
    })
  })
}

// Create background effects
function createEmbers() {
  const container = document.getElementById("emberContainer")
  if (!container) return

  for (let i = 0; i < 15; i++) {
    const ember = document.createElement("div")
    ember.className = "ember-particle"
    ember.style.left = Math.random() * 100 + "%"
    ember.style.setProperty("--duration", 8 + Math.random() * 8 + "s")
    ember.style.setProperty("--drift", Math.random() * 40 - 20 + "px")
    ember.style.animationDelay = Math.random() * 10 + "s"
    container.appendChild(ember)
  }
}

function createStars() {
  const container = document.getElementById("starsContainer")
  if (!container) return

  for (let i = 0; i < 50; i++) {
    const star = document.createElement("div")
    star.className = "star"
    star.style.left = Math.random() * 100 + "%"
    star.style.top = Math.random() * 100 + "%"
    star.style.setProperty("--duration", 2 + Math.random() * 3 + "s")
    star.style.animationDelay = Math.random() * 3 + "s"
    container.appendChild(star)
  }
}

// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  createEmbers()
  createStars()
  
  // Load saved game state
  const hasSavedState = loadGameState()
  
  // Setup auto-save
  setupAutoSave()
  
  // Check if user has completed the intro
  const hasCompletedStart = window.gameState.completedLocations.includes("start")
  
  if (hasCompletedStart) {
    // User has completed intro - show map directly
    const introScreen = document.getElementById("introScreen")
    const mapScreen = document.getElementById("mapScreen")
    
    if (introScreen) {
      introScreen.style.display = "none"
      introScreen.classList.remove("active")
    }
    
    if (mapScreen) {
      mapScreen.style.display = "block"
      mapScreen.classList.add("active")
      mapScreen.style.opacity = "1"
    }
    
    // Setup node clicks
    setTimeout(() => {
      setupNodeClicks()
      
      // Update map to reflect saved state
      window.updateMapNodes()
    }, 100)
  } else {
    // User hasn't completed intro - start intro sequence automatically
    setTimeout(() => {
      if (typeof window.startIntroSequence === "function") {
        window.startIntroSequence()
      } else {
        console.warn("Intro sequence function not found")
        // Fallback to showing map
        const introScreen = document.getElementById("introScreen")
        const mapScreen = document.getElementById("mapScreen")
        
        if (introScreen) introScreen.style.display = "none"
        if (mapScreen) {
          mapScreen.style.display = "block"
          mapScreen.classList.add("active")
          mapScreen.style.opacity = "1"
        }
        
        setTimeout(() => {
          setupNodeClicks()
          window.updateMapNodes()
        }, 100)
      }
    }, 500)
  }
})
