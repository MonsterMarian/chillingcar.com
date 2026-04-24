// Quiz state
let currentQuestionIndex = 0
let userAnswers = {}
let currentQuestions = []
let currentWork = "all" // Track current literary work
let currentCategories = ['genre', 'author', 'authorDetails', 'authorPeriod'] // Track selected categories
let wrongAnswers = new Map() // Track wrong answers
let showingWrongOnly = false // Track if we're showing only wrong answers
let lastAllQuestionsIndex = 0 // Track last position in all questions
let lastWrongQuestionsIndex = 0 // Track last position in wrong questions
let starredQuestions = new Set() // Track starred questions
let testMode = false // Track if we're in test mode

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
  if (el) {
    el.addEventListener(event, callback)
  }
}

// Render work selection buttons dynamically
function renderWorkButtons() {
  const container = document.getElementById("workButtonsContainer")
  if (!container) return

  container.innerHTML = ""
  
  // Add "All works" button first
  const allBtn = document.createElement("button")
  allBtn.id = "allWorksBtn"
  allBtn.className = "work-btn active"
  allBtn.textContent = "Všechna díla"
  allBtn.onclick = () => selectWork("all")
  container.appendChild(allBtn)

  // Add buttons for each work in literatureData
  Object.keys(literatureData).forEach(workKey => {
    const work = literatureData[workKey]
    const btn = document.createElement("button")
    btn.id = `${workKey}Btn`
    btn.className = "work-btn"
    btn.textContent = work.title
    btn.onclick = () => selectWork(workKey)
    container.appendChild(btn)
  })
}

// Event listeners
function setupEventListeners() {
  // Category checkboxes
  addSafeEventListener("genreCheckbox", "change", updateSelectedCategories)
  addSafeEventListener("authorCheckbox", "change", updateSelectedCategories)
  addSafeEventListener("authorDetailsCheckbox", "change", updateSelectedCategories)
  addSafeEventListener("authorPeriodCheckbox", "change", updateSelectedCategories)
  
  // Start test button
  addSafeEventListener("startTestBtn", "click", startTest)
  
  // Navigation buttons
  addSafeEventListener("allQuestionsBtn", "click", showAllQuestions)
  addSafeEventListener("wrongQuestionsBtn", "click", showWrongQuestions)
  addSafeEventListener("resetBtn", "click", resetQuiz)
  addSafeEventListener("backToSelectionBtn", "click", showWorkSelection)
  addSafeEventListener("nextBtn", "click", nextQuestion)
  addSafeEventListener("prevBtn", "click", prevQuestion)
  addSafeEventListener("starBtn", "click", toggleStarQuestion)
  addSafeEventListener("restartBtn", "click", restartQuiz)
}

// Show work selection screen
function showWorkSelection() {
  document.getElementById("quizContainer").classList.add("hidden")
  document.getElementById("controlsSection").classList.add("hidden")
  document.getElementById("completionScreen").classList.add("hidden")
  document.getElementById("workSelection").classList.remove("hidden")
  document.getElementById("categorySelection").classList.remove("hidden")
  
  currentWork = "all"
  currentCategories = ['genre', 'author', 'authorDetails', 'authorPeriod']
  
  document.querySelectorAll(".work-btn").forEach(btn => btn.classList.remove("active"))
  const allBtn = document.getElementById("allWorksBtn")
  if (allBtn) allBtn.classList.add("active")
  
  document.getElementById("genreCheckbox").checked = true
  document.getElementById("authorCheckbox").checked = true
  document.getElementById("authorDetailsCheckbox").checked = true
  document.getElementById("authorPeriodCheckbox").checked = true
}

// Select literary work
function selectWork(work) {
  currentWork = work
  document.querySelectorAll(".work-btn").forEach(btn => btn.classList.remove("active"))
  const activeBtn = document.getElementById(`${work}Btn`) || document.getElementById("allWorksBtn")
  if (activeBtn) activeBtn.classList.add("active")
}

// Update selected categories based on checkboxes
function updateSelectedCategories() {
  currentCategories = []
  if (document.getElementById("genreCheckbox").checked) currentCategories.push('genre')
  if (document.getElementById("authorCheckbox").checked) currentCategories.push('author')
  if (document.getElementById("authorDetailsCheckbox").checked) currentCategories.push('authorDetails')
  if (document.getElementById("authorPeriodCheckbox").checked) currentCategories.push('authorPeriod')
}

// Start test
function startTest() {
  if (currentCategories.length === 0) {
    alert("Vyberte alespoň jednu kategorii otázek.")
    return
  }
  
  currentQuestions = getLiteratureQuestions(currentWork, currentCategories)
  
  if (currentQuestions.length === 0) {
    alert("Pro vybrané nastavení nejsou dostupné žádné otázky.")
    return
  }
  
  document.getElementById("workSelection").classList.add("hidden")
  document.getElementById("categorySelection").classList.add("hidden")
  document.getElementById("controlsSection").classList.remove("hidden")
  document.getElementById("quizContainer").classList.remove("hidden")
  
  currentQuestionIndex = 0
  showingWrongOnly = false
  testMode = true
  
  document.getElementById("allQuestionsBtn").classList.add("active")
  document.getElementById("wrongQuestionsBtn").classList.remove("active")
  
  showQuestion()
}

// Show question
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
  document.getElementById("questionText").textContent = `${currentQuestionIndex + 1}. ${displayQuestion.question}`

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
  starBtn.classList.toggle("starred", starredQuestions.has(questionId))

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
  document.getElementById("prevBtn").disabled = currentQuestionIndex === 0
  document.getElementById("nextBtn").disabled = currentQuestionIndex >= currentQuestions.length - 1
}

function showAllQuestions() {
  if (showingWrongOnly) lastWrongQuestionsIndex = currentQuestionIndex
  currentQuestions = getLiteratureQuestions(currentWork, currentCategories)
  currentQuestionIndex = lastAllQuestionsIndex
  if (currentQuestionIndex >= currentQuestions.length) currentQuestionIndex = 0
  showingWrongOnly = false
  document.getElementById("allQuestionsBtn").classList.add("active")
  document.getElementById("wrongQuestionsBtn").classList.remove("active")
  showQuestion()
}

function showWrongQuestions() {
  if (!showingWrongOnly) lastAllQuestionsIndex = currentQuestionIndex
  
  let filteredWrongAnswers = []
  wrongAnswers.forEach((data, id) => {
    const question = data.question
    if (question && (currentWork === "all" || question.work === currentWork) && currentCategories.includes(question.category)) {
      filteredWrongAnswers.push(data)
    }
  })
  
  if (filteredWrongAnswers.length === 0) {
    alert("Nemáte žádné špatné odpovědi pro vybrané dílo a kategorie.")
    return
  }
  
  window.wrongAnswersData = filteredWrongAnswers
  currentQuestions = filteredWrongAnswers.map(item => item.question)
  currentQuestionIndex = 0
  showingWrongOnly = true
  document.getElementById("allQuestionsBtn").classList.remove("active")
  document.getElementById("wrongQuestionsBtn").classList.add("active")
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
  document.getElementById("questionCounter").textContent = `Otázka ${currentQuestionIndex + 1} z ${total}`
  document.getElementById("score").textContent = `Zodpovězeno: ${answered}/${total}`
}

function showCompletionScreen() {
  const total = currentQuestions.length
  const correct = currentQuestions.filter((q, idx) => {
    const ua = userAnswers[`${q.work}_${q.category}_${idx}`]
    return ua !== undefined && checkAnswer(ua, q.correct)
  }).length
  const pct = Math.round((correct / total) * 100)
  document.getElementById("quizContainer").classList.add("hidden")
  document.getElementById("completionScreen").classList.remove("hidden")
  document.getElementById("finalScore").textContent = `Dokončeno! Správně: ${correct}/${total} (${pct}%)`
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

// Import/Export
function exportTemplate() {
  const template = { works: { "example": { title: "Title", author: "Author", period: "Period", genre: "Genre", questions: { genre: [{ question: "Q", answers: ["A"], correct: [0] }] } } } }
  downloadJSON(template, "template.json")
}

function exportAllData() {
  downloadJSON({ works: literatureData }, "data.json")
}

function importDataFromFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      if (data.works) {
        Object.assign(literatureData, data.works)
        renderWorkButtons()
        alert("Importováno!")
      }
    } catch (err) { alert("Chyba!") }
  }
  reader.readAsText(file)
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"})
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
