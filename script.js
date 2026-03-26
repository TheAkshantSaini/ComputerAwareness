let questions = [];
let filtered = [];
let currentIndex = 0;
let timerInterval;
let seconds = 0;

let score = 0;
let attempted = 0;
let answered = false;

// Load JSON
fetch("CSquestions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadChapters();
  });

// Load chapters
function loadChapters() {
  let chapters = [...new Set(questions.map(q => q.chapter))];
  let container = document.getElementById("chapters");

  container.innerHTML = "";

  chapters.forEach(ch => {
    let btn = document.createElement("button");
    btn.innerText = ch;
    btn.onclick = () => startQuiz(ch);
    container.appendChild(btn);
  });
}

// Start quiz
function startQuiz(chapter) {
  document.getElementById("home").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  if (chapter === "random") {
    filtered = [...questions];
    document.getElementById("chapterName").innerText = "Random Mode";
  } else {
    filtered = questions.filter(q => q.chapter === chapter);
    document.getElementById("chapterName").innerText = chapter;
  }

  shuffle(filtered);
  currentIndex = 0;
  seconds = 0;
  score = 0;
  attempted = 0;

  updateScore();
  startTimer();
  loadQuestion();
}

// Load question
function loadQuestion() {
  answered = false;

  let q = filtered[currentIndex];

  document.getElementById("questionBox").innerText = q.question;
  document.getElementById("qno").innerText = "Q " + q.Q_no;

  updateProgress();

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    if (q["option_" + i]) {
      let div = document.createElement("div");
      div.classList.add("option");
      div.innerText = q["option_" + i];
      div.onclick = () => checkAnswer(div, i, q.answer);
      optionsDiv.appendChild(div);
    }
  }
}

// Check answer
function checkAnswer(selectedDiv, selected, correct) {
  if (answered) return;
  answered = true;

  attempted++;

  let options = document.querySelectorAll(".option");

  options.forEach((opt, index) => {
    opt.style.pointerEvents = "none";

    if (index + 1 === correct) {
      opt.classList.add("correct");
    }
  });

  if (selected === correct) {
    score++;
  } else {
    selectedDiv.classList.add("wrong");
  }

  updateScore();
}

// Next question
function nextQuestion() {
  currentIndex++;

  if (currentIndex >= filtered.length) {
    alert(`Quiz Finished!\nScore: ${score}/${attempted}`);
    goBack();
  } else {
    loadQuestion();
  }
}

// Update progress bar
function updateProgress() {
  let percent = ((currentIndex) / filtered.length) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

// Update score UI
function updateScore() {
  document.getElementById("score").innerText = score;
  document.getElementById("attempted").innerText = attempted;
}

// Shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Timer
function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    seconds++;
    let min = String(Math.floor(seconds / 60)).padStart(2, '0');
    let sec = String(seconds % 60).padStart(2, '0');
    document.getElementById("timer").innerText = `${min}:${sec}`;
  }, 1000);
}

// Back
function goBack() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("home").style.display = "block";

  clearInterval(timerInterval);

  currentIndex = 0;
  filtered = [];
  score = 0;
  attempted = 0;
}
