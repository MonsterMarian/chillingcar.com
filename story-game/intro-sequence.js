// Intro Sequence Manager
class IntroSequence {
  constructor() {
    this.step = 0
    this.container = document.getElementById("introContainer")
    this.welcomeText = document.getElementById("welcomeText")
    this.questionText = document.getElementById("questionText")
    this.explanationText = document.getElementById("explanationText")
    this.parenthesisText = document.getElementById("parenthesisText")
    this.miniText = document.getElementById("miniText")
    this.miniWords = document.getElementById("miniWords")
    this.reasonTitle = document.getElementById("reasonTitle")
    this.reasonList = document.getElementById("reasonList")
    this.continueSection = document.getElementById("continueSection")
    this.continueButton = document.getElementById("continueButton")
    this.cutScene = document.getElementById("cutScene")
    this.personalReason = document.getElementById("personalReason")
    this.toneShiftText = document.getElementById("toneShiftText")
    this.emojiContainer = document.getElementById("emojiContainer")
    this.emImage = document.getElementById("emImage")
    this.finalButtonContainer = document.getElementById("finalButtonContainer")
    this.finalContinueButton = document.getElementById("finalContinueButton")

    this.isCutSceneActive = false
    this.isFinalLocked = false

    this.texts = {
      welcome: "Vítej v mojí MINI hře",
      question: "Ptáš se proč MINI a né mini?",
      explanation: "Protože MINI je skvělá zkratka",
      parenthesis: "(kterou jsem si teď vymyslel😏)",
      miniReveal: "MINI =",
      words: ["Mentálně", "I", "Násilně", "Intenzivní"],
      reasonTitle: "Proč jsem to vytvořil:",
      reasons: [
        "1️⃣ přišlo mi to funny",
        "2️⃣ Nevím kdy naposledy jsem si s někým promluvil o podnikání a něco se přiučil, takže tohle je moje díky 🥳🫡",
        "3️⃣ Přišlo mi to funny",
      ],
      personalReason: [
        "4️⃣ říkala jsi že už jsi dlouho nikomu číslo nedávala",
        "no já jsem podstěn tou výjimečnou situací",
        "a tak teď dělám taky něco co jsem dlouhou dobu (nikdy) neudělal",
      ],
      toneShift: "Ur welkam grl",
    }

    this.gameState = {
      currentLocation: "",
      currentScene: 0,
      completedLocations: [],
    }

    this.updateMapNodes = () => {
      console.log("Map nodes updated")
    }
  }

  async start() {
    await this.step1_emptyScreen()
    await this.step2_welcomeText()
    await this.step3_questionSlide()
    await this.step4_explanationFade()
    await this.step5_miniHighlight()
    await this.step6_reasonList()
    this.showContinueButton()
  }

  async step1_emptyScreen() {
    this.step = 1
    console.log("Step 1: Empty screen")
    const silenceDuration = 500 + Math.random() * 300
    await this.delay(silenceDuration)
  }

  async step2_welcomeText() {
    this.step = 2
    console.log("Step 2: Welcome text")

    const text = this.texts.welcome
    this.welcomeText.classList.add("visible")

    for (let i = 0; i < text.length; i++) {
      this.welcomeText.textContent += text[i]
      const baseDelay = 80
      const variance = Math.random() * 60 - 30
      const punctuationDelay = [",", ".", "?"].includes(text[i]) ? 200 : 0
      await this.delay(baseDelay + variance + punctuationDelay)
    }

    const caret = document.createElement("span")
    caret.className = "caret-blink"
    caret.textContent = "|"
    this.welcomeText.appendChild(caret)

    await this.delay(300)
    caret.remove()
    await this.delay(500)
  }

  async step3_questionSlide() {
    this.step = 3
    console.log("Step 3: Question slide")

    this.questionText.textContent = this.texts.question
    await this.delay(100)
    this.questionText.classList.add("visible")

    const miniIndex = this.texts.question.indexOf("MINI")
    if (miniIndex !== -1) {
      await this.delay(800)
      const beforeMini = this.texts.question.substring(0, miniIndex)
      const afterMini = this.texts.question.substring(miniIndex + 4)
      this.questionText.innerHTML = `${beforeMini}<span class="shake-mini">MINI</span>${afterMini}`
    }

    await this.delay(1000)
  }

  async step4_explanationFade() {
    this.step = 4
    console.log("Step 4: Explanation fade")

    this.explanationText.textContent = this.texts.explanation
    this.explanationText.style.fontSize = "1.8rem"
    this.explanationText.style.marginBottom = "0.5rem"

    await this.delay(800)

    this.parenthesisText.textContent = this.texts.parenthesis
    this.parenthesisText.classList.add("visible")

    await this.delay(1000)
  }

  async step5_miniHighlight() {
    this.step = 5
    console.log("Step 5: MINI highlight")

    this.miniText.textContent = this.texts.miniReveal
    this.miniText.style.opacity = "1"

    this.miniText.classList.add("thump")
    await this.delay(400)
    this.miniText.classList.remove("thump")

    await this.delay(300)

    for (let i = 0; i < this.texts.words.length; i++) {
      const word = this.texts.words[i]
      const wordElement = document.createElement("div")
      wordElement.className = "word-typewriter"
      wordElement.textContent = word
      wordElement.style.display = "block"
      wordElement.style.margin = "0.5rem 0"
      wordElement.style.fontSize = "2rem"

      this.miniWords.appendChild(wordElement)

      switch (i) {
        case 0:
          await this.typewriterWord(wordElement, word, 100)
          wordElement.classList.add("micro-shake")
          break

        case 1:
          wordElement.style.opacity = "1"
          wordElement.style.transform = "translateY(0)"
          await this.delay(200)
          break

        case 2:
          await this.typewriterWord(wordElement, word, 120)
          wordElement.classList.add("hard-shake")
          wordElement.classList.add("glitch-effect")
          wordElement.setAttribute("data-text", word)
          break

        case 3:
          await this.typewriterWord(wordElement, word, 180)
          this.container.classList.add("slow-zoom")
          break
      }

      await this.delay(400)
    }

    await this.delay(1000)
  }

  async step6_reasonList() {
    this.step = 6
    console.log("Step 6: Reason list")

    this.reasonTitle.textContent = this.texts.reasonTitle
    this.reasonTitle.style.opacity = "1"
    this.reasonTitle.style.fontSize = "1.6rem"
    this.reasonTitle.style.marginBottom = "1rem"
    this.reasonTitle.style.textAlign = "center"

    await this.delay(500)

    this.reasonList.innerHTML = ""
    this.reasonList.style.display = "block"

    for (let i = 0; i < this.texts.reasons.length; i++) {
      const reason = this.texts.reasons[i]
      const reasonElement = document.createElement("div")
      reasonElement.className = "list-item"
      reasonElement.style.padding = "1rem"
      reasonElement.style.margin = "0.5rem 0"
      reasonElement.style.borderRadius = "8px"
      reasonElement.style.backgroundColor = "rgba(255, 107, 53, 0.1)"

      this.reasonList.appendChild(reasonElement)

      switch (i) {
        case 0:
          reasonElement.textContent = reason
          reasonElement.classList.add("bounce-in")
          reasonElement.style.opacity = "1"
          reasonElement.style.transform = "translateY(0)"
          await this.delay(1000)
          break

        case 1:
          await this.typewriterWord(reasonElement, reason, 40)
          const emojiMatch = reason.match(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/u)
          if (emojiMatch) {
            const emoji = emojiMatch[0]
            const textWithoutEmoji = reason.replace(emoji, "")
            reasonElement.innerHTML = `${textWithoutEmoji} <span class="emoji-jump">${emoji}</span>`
            this.createConfetti(reasonElement)
          }
          break

        case 2:
          await this.delay(1500)
          reasonElement.textContent = reason
          reasonElement.style.opacity = "1"
          reasonElement.style.transform = "translateY(0)"
          break
      }

      await this.delay(800)
    }

    await this.delay(1500)
  }

  showContinueButton() {
    console.log("Showing continue button")
    this.continueSection.style.opacity = "1"

    this.continueButton.addEventListener("click", () => {
      if (!this.isCutSceneActive && !this.isFinalLocked) {
        this.triggerCutScene()
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !this.isCutSceneActive && !this.isFinalLocked) {
        this.triggerCutScene()
      }
    })
  }

  async triggerCutScene() {
    if (this.isCutSceneActive || this.isFinalLocked) return

    this.isCutSceneActive = true
    console.log("Triggering cut-scene")

    this.hideAllTextInstantly()
    await this.delay(500)

    this.cutScene.style.display = "block"

    await this.displayPersonalReason()
    await this.delay(1200)
    await this.displayToneShift()
    await this.delay(2000)
    await this.revealImage()
    await this.showFinalButton()
    this.lockInteractionExceptFinal()
  }

  hideAllTextInstantly() {
    const elementsToHide = [
      this.welcomeText,
      this.questionText,
      this.explanationText,
      this.parenthesisText,
      this.miniText,
      this.miniWords,
      this.reasonTitle,
      this.reasonList,
      this.continueSection,
    ]

    elementsToHide.forEach((el) => {
      if (el) el.style.display = "none"
    })
  }

  async displayPersonalReason() {
    console.log("Displaying personal reason")

    this.personalReason.innerHTML = ""
    this.personalReason.style.opacity = "1"

    for (let i = 0; i < this.texts.personalReason.length; i++) {
      const line = this.texts.personalReason[i]
      const lineElement = document.createElement("div")
      lineElement.className = "personal-reason-line"
      lineElement.textContent = line

      this.personalReason.appendChild(lineElement)
      await this.typewriterWord(lineElement, line, 35)
      await this.delay(300)
    }
  }

  async displayToneShift() {
    console.log("Displaying tone shift")
    this.toneShiftText.textContent = this.texts.toneShift
    this.toneShiftText.classList.add("fade-in-dry")
  }

  async revealImage() {
    console.log("Revealing image")

    this.emojiContainer.style.opacity = "1"
    await this.delay(500)

    this.emImage.style.display = "block"
    this.emImage.classList.add("image-fade-in")
  }

  async showFinalButton() {
    console.log("Showing final button")

    this.finalButtonContainer.style.display = "block"
    this.finalButtonContainer.style.opacity = "1"

    const handleClick = () => {
      console.log("Final button clicked - proceeding to map")
      this.proceedToMap()
    }

    this.finalContinueButton.addEventListener("click", handleClick)

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        console.log("Enter pressed - proceeding to map")
        this.proceedToMap()
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    console.log("Final button ready")
  }

  lockInteractionExceptFinal() {
    console.log("Locking interaction")
    this.isFinalLocked = true
  }

  proceedToMap() {
    console.log("=== PROCEEDING TO MAP ===")

    this.isFinalLocked = true

    const introScreen = document.getElementById("introScreen")
    const mapScreen = document.getElementById("mapScreen")

    mapScreen.style.display = "block"
    mapScreen.style.opacity = "0"

    introScreen.style.transition = "opacity 0.5s ease"
    introScreen.style.opacity = "0"

    setTimeout(() => {
      introScreen.classList.remove("active")
      introScreen.style.display = "none"

      mapScreen.classList.add("active")
      mapScreen.style.transition = "opacity 0.5s ease"
      mapScreen.style.opacity = "1"

      console.log("Map screen activated")

      // Ensure "start" is marked as completed
      if (typeof window.gameState !== "undefined" && 
          Array.isArray(window.gameState.completedLocations)) {
        // Add "start" to completed locations if not already there
        if (!window.gameState.completedLocations.includes("start")) {
          window.gameState.completedLocations.push("start")
          console.log("Marked 'start' as completed")
        }
      } else {
        // Initialize game state if it doesn't exist
        window.gameState = {
          currentLocation: "start",
          currentScene: 0,
          completedLocations: ["start"]
        }
        console.log("Game state initialized with start completed")
      }

      setTimeout(() => {
        if (typeof window.updateMapNodes === "function") {
          window.updateMapNodes()
          console.log("Map nodes updated")
        }
      }, 100)
    }, 500)
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async typewriterWord(element, text, speed = 100, variance = 40) {
    element.textContent = ""
    element.style.opacity = "1"
    element.style.transform = "translateY(0)"

    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i]
      const randomVariance = Math.random() * variance - (variance / 2)
      const punctuationDelay = [",", ".", "?", "!"].includes(text[i]) ? 150 : 0
      await this.delay(speed + randomVariance + punctuationDelay)
    }
  }

  createConfetti(parentElement) {
    const rect = parentElement.getBoundingClientRect()
    const container = document.getElementById("introContainer")

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement("div")
      particle.className = "confetti-particle"
      particle.style.left = rect.left + Math.random() * rect.width + "px"
      particle.style.top = rect.top + "px"
      particle.style.backgroundColor = ["#ff6b35", "#f7931e", "#ff9a8b"][Math.floor(Math.random() * 3)]

      container.appendChild(particle)

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      }, 2000)
    }
  }
}

// Note: Automatic DOMContentLoaded listener removed to prevent double execution
// Intro sequence is now controlled by game-init.js

// Global function to start intro sequence manually
window.startIntroSequence = () => {
  const introScreen = document.getElementById("introScreen")
  const mapScreen = document.getElementById("mapScreen")
  
  // Hide map and show intro
  if (mapScreen) {
    mapScreen.style.display = "none"
    mapScreen.classList.remove("active")
  }
  
  if (introScreen) {
    introScreen.style.display = "block"
    introScreen.classList.add("active")
    introScreen.style.opacity = "1"
  }
  
  // Start intro sequence
  const intro = new IntroSequence()
  intro.start()
  
  return intro
}
