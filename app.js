// تهيئة الأيقونات
lucide.createIcons();

// عرض تاريخ اليوم
document.getElementById('today-date').innerText = new Date().toLocaleDateString('ar-EG', {
  weekday: 'short',
  day: 'numeric',
  month: 'short'
});

// --- إدارة التبويب (Navigation) ---
const navTimer = document.getElementById('nav-timer');
const navTasks = document.getElementById('nav-tasks');
const viewTimer = document.getElementById('view-timer');
const viewTasks = document.getElementById('view-tasks');

navTimer.addEventListener('click', () => {
  viewTimer.classList.remove('hidden');
  viewTimer.classList.add('flex');
  viewTasks.classList.add('hidden');
  viewTasks.classList.remove('flex');
  
  navTimer.className = 'nav-btn flex flex-col items-center gap-1 text-indigo-400';
  navTasks.className = 'nav-btn flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300';
});

navTasks.addEventListener('click', () => {
  viewTasks.classList.remove('hidden');
  viewTasks.classList.add('flex');
  viewTimer.classList.add('hidden');
  viewTimer.classList.remove('flex');

  navTasks.className = 'nav-btn flex flex-col items-center gap-1 text-indigo-400';
  navTimer.className = 'nav-btn flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300';
});


// --- منطق المؤقت (Pomodoro Engine) ---
let timerInterval = null;
let totalTime = 25 * 60;
let timeRemaining = totalTime;
let isRunning = false;

const timerDisplay = document.getElementById('timer-display');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const modeWork = document.getElementById('mode-work');
const modeShort = document.getElementById('mode-short');
const progressRing = document.getElementById('progress-ring');
const timerLabel = document.getElementById('timer-label');

const CIRCUMFERENCE = 2 * Math.PI * 44; // 276.46

function updateDisplay() {
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  // تحديث شريط التقدم الدائري
  const offset = CIRCUMFERENCE - (timeRemaining / totalTime) * CIRCUMFERENCE;
  progressRing.style.strokeDashoffset = offset;
}

function startTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    btnStart.innerHTML = `<i data-lucide="play" class="w-5 h-5"></i> ابدأ`;
  } else {
    isRunning = true;
    btnStart.innerHTML = `<i data-lucide="pause" class="w-5 h-5"></i> إيقاف`;
    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        alert('انتهى الوقت!');
        btnStart.innerHTML = `<i data-lucide="play" class="w-5 h-5"></i> ابدأ`;
      }
    }, 1000);
  }
  lucide.createIcons();
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timeRemaining = totalTime;
  btnStart.innerHTML = `<i data-lucide="play" class="w-5 h-5"></i> ابدأ`;
  updateDisplay();
  lucide.createIcons();
}

modeWork.addEventListener('click', () => {
  modeWork.className = 'flex-1 py-2 rounded-lg transition-all bg-indigo-600 text-white';
  modeShort.className = 'flex-1 py-2 rounded-lg transition-all text-slate-400 hover:text-white';
  totalTime = 25 * 60;
  timerLabel.innerText = 'جلسة التركيز';
  resetTimer();
});

modeShort.addEventListener('click', () => {
  modeShort.className = 'flex-1 py-2 rounded-lg transition-all bg-indigo-600 text-white';
  modeWork.className = 'flex-1 py-2 rounded-lg transition-all text-slate-400 hover:text-white';
  totalTime = 5 * 60;
  timerLabel.innerText = 'استراحة قصيرة';
  resetTimer();
});

btnStart.addEventListener('click', startTimer);
btnReset.addEventListener('click', resetTimer);


// --- منطق قائمة المهام (To-Do List) مع LocalStorage ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('focusflow_tasks')) || [];

function saveTasks() {
  localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
}

function renderTasks() {
  todoList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between p-3 bg-slate-800 rounded-xl text-sm border border-slate-700/50';
    
    li.innerHTML = `
      <div class="flex items-center gap-3 cursor-pointer" onclick="toggleTask(${index})">
        <input type="checkbox" ${task.completed ? 'checked' : ''} class="w-4 h-4 accent-indigo-500 rounded">
        <span class="${task.completed ? 'task-done' : ''}">${task.text}</span>
      </div>
      <button onclick="deleteTask(${index})" class="text-slate-500 hover:text-rose-400 p-1">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    `;
    todoList.appendChild(li);
  });
  lucide.createIcons();
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
    todoInput.value = '';
  }
});

window.toggleTask = function(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
};

window.deleteTask = function(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
};

// التشغيل الابتدائي
updateDisplay();
renderTasks();