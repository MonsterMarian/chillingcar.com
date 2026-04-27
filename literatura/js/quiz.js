// Quiz state
let currentQuestionIndex = 0
let userAnswers = {}
let currentQuestions = []
let selectedWorks = [] // Track multiple selected literary works
let currentMode = "literature" // "literature" or "theory"
let currentCategories = [] // Track selected literature categories
let theoryCategories = [] // Track selected theory categories

let wrongAnswers = new Map() 
let showingWrongOnly = false 
let lastAllQuestionsIndex = 0 
let lastWrongQuestionsIndex = 0 
let starredQuestions = new Set() 
let testMode = false 

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderWorkButtons()
  loadState()
  setupEventListeners()
  setupKeyboardShortcuts()
  showWorkSelection()
})

// Safe helper for adding event listeners
function addSafeEventListener(id, event, callback) {
  const el = document.getElementById(id)
  if (el) el.addEventListener(event, callback)
}

function safeSetText(id, text) {
  const el = document.getElementById(id)
  if (el) el.textContent = text
}

function safeToggleClass(id, className, force) {
  const el = document.getElementById(id)
  if (el) el.classList.toggle(className, force)
}

// Režimy (Literatura / Teorie)
function setMode(mode) {
  currentMode = mode;
  if (mode === 'literature') {
    safeToggleClass('modeLiteratureBtn', 'active', true);
    safeToggleClass('modeTheoryBtn', 'active', false);
    safeToggleClass('workSelection', 'hidden', false);
    safeToggleClass('literatureCheckboxes', 'hidden', false);
    safeToggleClass('theoryCheckboxes', 'hidden', true);
  } else {
    safeToggleClass('modeLiteratureBtn', 'active', false);
    safeToggleClass('modeTheoryBtn', 'active', true);
    safeToggleClass('workSelection', 'hidden', true);
    safeToggleClass('literatureCheckboxes', 'hidden', true);
    safeToggleClass('theoryCheckboxes', 'hidden', false);
  }
  updateSelectedCategories();
}

// Render work selection buttons dynamically
function renderWorkButtons() {
  const container = document.getElementById("workButtonsContainer")
  if (!container) return

  container.innerHTML = ""

  Object.keys(literatureData).forEach(workKey => {
    const work = literatureData[workKey]
    const btn = document.createElement("button")
    btn.id = `${workKey}Btn`
    btn.className = "work-btn"
    if (selectedWorks.includes(workKey)) btn.classList.add("active")
    btn.textContent = work.title
    btn.onclick = () => toggleWorkSelection(workKey)
    container.appendChild(btn)
  })
}

// Logika presetu
function selectPreset(workIdsArray) {
    selectedWorks = [...workIdsArray];
    renderWorkButtons();
}

function toggleWorkSelection(workId) {
    const index = selectedWorks.indexOf(workId);
    if (index > -1) {
        selectedWorks.splice(index, 1);
    } else {
        selectedWorks.push(workId);
    }
    renderWorkButtons();
}

// Event listeners
function setupEventListeners() {
  const litCats = ["genreCheckbox", "authorCheckbox", "authorDetailsCheckbox", "authorPeriodCheckbox", "plotCheckbox", "charactersCheckbox", "styleCheckbox"]
  litCats.forEach(id => addSafeEventListener(id, "change", updateSelectedCategories))
  
  const theoryCats = ["figuryCheckbox", "tropyCheckbox", "lexikologieCheckbox", "slovniDruhyCheckbox", "slovniZasobaCheckbox"]
  theoryCats.forEach(id => addSafeEventListener(id, "change", updateSelectedCategories))
  
  addSafeEventListener("startTestBtn", "click", startTest)
  
  const navButtons = [
    { id: "allQuestionsBtn", event: "click", callback: showAllQuestions },
    { id: "wrongQuestionsBtn", event: "click", callback: showWrongQuestions },
    { id: "resetBtn", event: "click", callback: resetQuiz },
    { id: "backToSelectionBtn", event: "click", callback: showWorkSelection },
    { id: "nextBtn", event: "click", callback: nextQuestion },
    { id: "prevBtn", event: "click", callback: prevQuestion },
    { id: "starBtn", event: "click", callback: toggleStarQuestion },
    { id: "restartBtn", event: "click", callback: restartQuiz }
  ]

  navButtons.forEach(btn => addSafeEventListener(btn.id, btn.event, btn.callback))
}

function showWorkSelection() {
  safeToggleClass("quizContainer", "hidden", true)
  safeToggleClass("controlsSection", "hidden", true)
  safeToggleClass("completionScreen", "hidden", true)
  
  setMode(currentMode)
}

// Update selected categories
function updateSelectedCategories() {
  currentCategories = []
  theoryCategories = []
  
  const litCheckMap = {
    genreCheckbox: 'genre', authorCheckbox: 'author', 
    authorDetailsCheckbox: 'authorDetails', authorPeriodCheckbox: 'authorPeriod',
    plotCheckbox: 'plot', charactersCheckbox: 'characters', styleCheckbox: 'style'
  }
  
  for (const [id, key] of Object.entries(litCheckMap)) {
      const el = document.getElementById(id);
      if (el && el.checked) currentCategories.push(key);
  }

  const theoryCheckMap = {
      figuryCheckbox: 'figury', tropyCheckbox: 'tropy', lexikologieCheckbox: 'lexikologie',
      slovniDruhyCheckbox: 'slovniDruhy', slovniZasobaCheckbox: 'slovniZasoba'
  }
  
  for (const [id, key] of Object.entries(theoryCheckMap)) {
      const el = document.getElementById(id);
      if (el && el.checked) theoryCategories.push(key);
  }
}

function startTest() {
  if (currentMode === 'literature' && selectedWorks.length === 0) {
      alert("Vyberte alespoň jedno dílo.");
      return;
  }
  
  if (currentMode === 'literature' && currentCategories.length === 0) {
    alert("Vyberte alespoň jednu kategorii otázek.");
    return;
  }
  
  if (currentMode === 'theory' && theoryCategories.length === 0) {
      alert("Vyberte alespoň jeden okruh teorie.");
      return;
  }
  
  if (currentMode === 'literature') {
      currentQuestions = getLiteratureQuestions(selectedWorks, currentCategories);
  } else {
      currentQuestions = getTheoryQuestions(theoryCategories);
  }
  
  if (currentQuestions.length === 0) {
    alert("Pro vybrané nastavení nejsou dostupné žádné otázky.")
    return
  }
  
  safeToggleClass("workSelection", "hidden", true)
  safeToggleClass("categorySelection", "hidden", true)
  safeToggleClass("controlsSection", "hidden", false)
  safeToggleClass("quizContainer", "hidden", false)
  
  currentQuestionIndex = 0
  showingWrongOnly = false
  testMode = true
  
  safeToggleClass("allQuestionsBtn", "active", true)
  safeToggleClass("wrongQuestionsBtn", "active", false)
  
  showQuestion()
}

function showQuestion() {
  if (currentQuestionIndex >= currentQuestions.length) {
    showCompletionScreen()
    return
  }

  const question = currentQuestions[currentQuestionIndex]
  const questionId = `${question.work || "unknown"}_${question.category || "unknown"}_${currentQuestionIndex}`

  let userAnswer = userAnswers[questionId]
  let displayQuestion = {...question, answers: [...question.answers]}
  
  if (showingWrongOnly && window.wrongAnswersData) {
    const wrongAnswerData = window.wrongAnswersData[currentQuestionIndex]
    if (wrongAnswerData) {
      userAnswer = wrongAnswerData.userAnswer
      if (wrongAnswerData.originalAnswers) displayQuestion.answers = [...wrongAnswerData.originalAnswers]
      if (wrongAnswerData.correct) displayQuestion.correct = [...wrongAnswerData.correct]
    }
  }

  const hasAnswered = userAnswer !== undefined
  safeSetText("questionText", `${currentQuestionIndex + 1}. ${displayQuestion.question}`)

  const answersContainer = document.getElementById("answersContainer")
  answersContainer.innerHTML = ""

  const isMultipleChoice = displayQuestion.correct.length > 1

  displayQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button")
    button.className = "answer-option"
    button.textContent = answer

    if (hasAnswered) {
      button.classList.add("disabled")
      const isCorrect = displayQuestion.correct.includes(index)
      const wasSelected = Array.isArray(userAnswer) ? userAnswer.includes(index) : userAnswer === index
      
      if (wasSelected && !isCorrect) button.classList.add("incorrect")
      if (isCorrect) button.classList.add("correct")
    } else {
      if (isMultipleChoice) {
        button.addEventListener("click", (event) => toggleMultipleAnswer(index, questionId, event))
        if (userAnswer && Array.isArray(userAnswer) && userAnswer.includes(index)) button.classList.add("selected")
      } else {
        button.addEventListener("click", () => selectAnswer(index, questionId))
      }
    }
    answersContainer.appendChild(button)
  })

  if (isMultipleChoice && !hasAnswered) {
    const submitBtn = document.createElement("button")
    submitBtn.id = "submitBtn"
    submitBtn.className = "nav-btn"
    submitBtn.textContent = "Odeslat odpověď"
    submitBtn.style.marginTop = "15px"
    submitBtn.addEventListener("click", () => submitMultipleAnswer(questionId))
    answersContainer.appendChild(submitBtn)
  }

  const feedbackEl = document.getElementById("feedback")
  if (hasAnswered) {
    const isCorrect = checkAnswer(userAnswer, displayQuestion.correct)
    feedbackEl.className = `feedback ${isCorrect ? "correct" : "incorrect"}`
    feedbackEl.textContent = isCorrect ? "✓ Správně!" : "✗ Špatně! Správná odpověď je zvýrazněna zeleně."
    
    if (!isCorrect && !showingWrongOnly) {
      wrongAnswers.set(questionId, {
        question: question,
        userAnswer: userAnswer,
        originalAnswers: [...question.answers],
        correct: [...question.correct]
      })
      saveWrongAnswersState()
    } else if (isCorrect && !showingWrongOnly) {
      wrongAnswers.delete(questionId)
      saveWrongAnswersState()
    }
  } else {
    feedbackEl.className = "feedback hidden"
  }

  const starBtn = document.getElementById("starBtn")
  if (starBtn) starBtn.classList.toggle("starred", starredQuestions.has(questionId))

  updateNavigationButtons()
  updateStats()
}

function toggleMultipleAnswer(index, questionId, event) {
  if (!userAnswers[questionId]) userAnswers[questionId] = []
  const answers = userAnswers[questionId]
  const idx = answers.indexOf(index)
  if (idx > -1) answers.splice(idx, 1)
  else answers.push(index)
  event.target.classList.toggle('selected')
}

function submitMultipleAnswer(questionId) {
  if (!userAnswers[questionId] || userAnswers[questionId].length === 0) {
    alert("Vyberte alespoň jednu odpověď.")
    return
  }
  saveState()
  showQuestion()
}

function selectAnswer(index, questionId) {
  userAnswers[questionId] = index
  saveState()
  showQuestion()
}

function checkAnswer(userAnswer, correctAnswers) {
  if (Array.isArray(userAnswer)) {
    if (userAnswer.length !== correctAnswers.length) return false
    return userAnswer.every((a) => correctAnswers.includes(a))
  }
  return correctAnswers.includes(userAnswer)
}

function toggleStarQuestion() {
  const question = currentQuestions[currentQuestionIndex]
  const questionId = `${question.work || "unknown"}_${question.category || "unknown"}_${currentQuestionIndex}`
  if (starredQuestions.has(questionId)) starredQuestions.delete(questionId)
  else starredQuestions.add(questionId)
  saveStarredQuestionsState()
  showQuestion()
}

function nextQuestion() {
  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++
    showQuestion()
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--
    showQuestion()
  }
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevBtn")
  if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0
  
  const nextBtn = document.getElementById("nextBtn")
  if (nextBtn) nextBtn.disabled = currentQuestionIndex >= currentQuestions.length - 1
}

function showAllQuestions() {
  if (showingWrongOnly) lastWrongQuestionsIndex = currentQuestionIndex
  
  if (currentMode === 'literature') {
      currentQuestions = getLiteratureQuestions(selectedWorks, currentCategories);
  } else {
      currentQuestions = getTheoryQuestions(theoryCategories);
  }
  
  currentQuestionIndex = lastAllQuestionsIndex
  if (currentQuestionIndex >= currentQuestions.length) currentQuestionIndex = 0
  showingWrongOnly = false
  safeToggleClass("allQuestionsBtn", "active", true)
  safeToggleClass("wrongQuestionsBtn", "active", false)
  showQuestion()
}

function showWrongQuestions() {
  if (!showingWrongOnly) lastAllQuestionsIndex = currentQuestionIndex
  
  let filteredWrongAnswers = []
  wrongAnswers.forEach((data, id) => {
    const question = data.question
    if (question) {
        if (currentMode === 'literature' && selectedWorks.includes(question.work) && currentCategories.includes(question.category)) {
            filteredWrongAnswers.push(data)
        } else if (currentMode === 'theory' && question.work === 'theory' && theoryCategories.includes(question.category)) {
            filteredWrongAnswers.push(data)
        }
    }
  })
  
  if (filteredWrongAnswers.length === 0) {
    alert("Nemáte žádné špatné odpovědi pro vybrané nastavení.")
    return
  }
  
  window.wrongAnswersData = filteredWrongAnswers
  currentQuestions = filteredWrongAnswers.map(item => item.question)
  currentQuestionIndex = 0
  showingWrongOnly = true
  safeToggleClass("allQuestionsBtn", "active", false)
  safeToggleClass("wrongQuestionsBtn", "active", true)
  showQuestion()
}

function resetQuiz() {
  if (confirm("Opravdu chcete resetovat odpovědi?")) {
    userAnswers = {}
    wrongAnswers = new Map()
    currentQuestionIndex = 0
    localStorage.removeItem("quizAnswers")
    localStorage.removeItem("quizWrongQuestions")
    showAllQuestions()
  }
}

function restartQuiz() {
  currentQuestionIndex = 0
  userAnswers = {}
  showingWrongOnly = false
  showQuestion()
}

function updateStats() {
  const total = currentQuestions.length
  const answered = currentQuestions.filter((q, idx) => userAnswers[`${q.work}_${q.category}_${idx}`] !== undefined).length
  safeSetText("questionCounter", `Otázka ${currentQuestionIndex + 1} z ${total}`)
  safeSetText("score", `Zodpovězeno: ${answered}/${total}`)
}

function showCompletionScreen() {
  const total = currentQuestions.length
  const correct = currentQuestions.filter((q, idx) => {
    const ua = userAnswers[`${q.work}_${q.category}_${idx}`]
    return ua !== undefined && checkAnswer(ua, q.correct)
  }).length
  const pct = Math.round((correct / total) * 100)
  
  safeToggleClass("quizContainer", "hidden", true)
  safeToggleClass("completionScreen", "hidden", false)
  safeSetText("finalScore", `Dokončeno! Správně: ${correct}/${total} (${pct}%)`)
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') prevQuestion()
    if (e.key === 'ArrowRight' || e.key === 'd') nextQuestion()
    if (e.key === 's' || e.key === ',') toggleStarQuestion()
  })
}

// Persistence
function saveState() { localStorage.setItem("quizAnswers", JSON.stringify(userAnswers)) }
function saveWrongAnswersState() { localStorage.setItem("quizWrongQuestions", JSON.stringify(Array.from(wrongAnswers.entries()))) }
function saveStarredQuestionsState() { localStorage.setItem("quizStarredQuestions", JSON.stringify(Array.from(starredQuestions))) }

function loadState() {
  const savedAnswers = localStorage.getItem("quizAnswers")
  if (savedAnswers) userAnswers = JSON.parse(savedAnswers)
  
  const savedWrong = localStorage.getItem("quizWrongQuestions")
  if (savedWrong) wrongAnswers = new Map(JSON.parse(savedWrong))
  
  const savedStarred = localStorage.getItem("quizStarredQuestions")
  if (savedStarred) starredQuestions = new Set(JSON.parse(savedStarred))
}