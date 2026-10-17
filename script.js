const SUBJECTS = [
    { code: "MIL", name: "Media & Information Literacy", icon: "fa-photo-film", color: "bg-purple-500" },
    { code: "CPAR", name: "Contemporary Philippine Arts from the Regions", icon: "fa-palette", color: "bg-pink-500" },
    { code: "UCSP", name: "Understanding Culture, Society & Politics", icon: "fa-users", color: "bg-amber-500" },
    { code: "PEH", name: "Physical Education & Health", icon: "fa-heart-pulse", color: "bg-emerald-500" },
    { code: "PR2", name: "Practical Research 2", icon: "fa-microscope", color: "bg-blue-500" },
    { code: "DRRR", name: "Disaster Readiness & Risk Reduction", icon: "fa-shield-halved", color: "bg-red-500" },
    { code: "PHYSICS", name: "General Physics 1", icon: "fa-atom", color: "bg-indigo-500" },
    { code: "BIOLOGY", name: "General Biology 1", icon: "fa-dna", color: "bg-teal-500" },
    { code: "CLE", name: "Christian Living Education", icon: "fa-book-open", color: "bg-sky-500" }
];

let isTeacherAuthenticated = false;
let timerInterval = null;
let timerSecondsLeft = 25 * 60;
let isTimerRunning = false;

let subjectData = JSON.parse(localStorage.getItem('study_subject_uploads')) || {
    MIL: [], CPAR: [], UCSP: [], PEH: [], PR2: [], DRRR: [], PHYSICS: [], BIOLOGY: [], CLE: []
};

let deadlines = JSON.parse(localStorage.getItem('study_deadlines')) || [
    { id: 1, title: "PR2 Chapter 1 Draft", date: "Tomorrow" },
    { id: 2, title: "General Physics Quiz 2", date: "In 3 Days" }
];

let studyGoals = JSON.parse(localStorage.getItem('study_goals')) || [
    { id: 1, text: "Finish 2 Module Readings", completed: false },
    { id: 2, text: "Solve Physics Problem Set", completed: true },
    { id: 3, text: "Review Research Chapter Notes", completed: false }
];

document.addEventListener('DOMContentLoaded', () => {
    renderSubjects();
    renderTeacherSubjectOptions();
    renderDeadlines();
    renderGoals();
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        updateThemeUI(false);
    } else {
        document.documentElement.classList.add('dark');
        updateThemeUI(true);
    }
});

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);
}

function updateThemeUI(isDark) {
    const themeIcon = document.getElementById('themeIcon');
    const sidebarThemeIcon = document.getElementById('sidebarThemeIcon');
    const themeTextLabel = document.getElementById('themeTextLabel');
    if (isDark) {
        if (themeIcon) themeIcon.className = "fa-solid fa-sun text-amber-300";
        if (sidebarThemeIcon) sidebarThemeIcon.className = "fa-solid fa-sun text-amber-300";
        if (themeTextLabel) themeTextLabel.innerText = "Light Mode";
    } else {
        if (themeIcon) themeIcon.className = "fa-solid fa-moon text-slate-700";
        if (sidebarThemeIcon) sidebarThemeIcon.className = "fa-solid fa-moon text-slate-700";
        if (themeTextLabel) themeTextLabel.innerText = "Dark Mode";
    }
}

// Custom Toast Notification
function showToast(message, title = "Notification", isError = false) {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast) return;

    toastTitle.innerText = title;
    toastMessage.innerText = message;

    if (isError) {
        toastIcon.className = "w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0";
        toastIcon.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
    } else {
        toastIcon.className = "w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0";
        toastIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
    }

    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 3000);
}

// Security PIN Auth
function promptTeacherAccess() {
    if (isTeacherAuthenticated) {
        toggleModal('teacherModal');
    } else {
        toggleModal('pinAuthModal');
    }
}

function handlePinSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('teacherPinInput');
    if (input.value === "2026") {
        isTeacherAuthenticated = true;
        input.value = '';
        toggleModal('pinAuthModal');
        toggleModal('teacherModal');
        showToast("Teacher Access unlocked!", "Access Granted");
    } else {
        input.value = '';
        showToast("Incorrect PIN Code! Access Denied.", "Security Alert", true);
    }
}

function renderSubjects() {
    const grid = document.getElementById('subjectsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    SUBJECTS.forEach(subj => {
        const uploads = subjectData[subj.code] || [];
        const count = uploads.length;
        const card = document.createElement('div');
        card.className = "glass-card rounded-3xl p-5 shadow-sm transition cursor-pointer flex flex-col justify-between group";
        card.onclick = () => openSubjectModal(subj.code);
        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between mb-3">
                    <span class="p-2.5 rounded-2xl ${subj.color} text-white shadow-sm text-sm">
                        <i class="fa-solid ${subj.icon}"></i>
                    </span>
                    <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${count > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}">
                        ${count} ${count === 1 ? 'item' : 'items'}
                    </span>
                </div>
                <h3 class="font-bold text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">${subj.name}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">${subj.code}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                <span>${count > 0 ? 'View Uploaded Files' : 'No uploads yet'}</span>
                <i class="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openSubjectModal(code) {
    const subj = SUBJECTS.find(s => s.code === code);
    const uploads = subjectData[code] || [];
    document.getElementById('modalSubjectCode').innerText = subj.code;
    document.getElementById('modalSubjectTitle').innerText = subj.name;
    const container = document.getElementById('modalSubjectContent');
    container.innerHTML = '';
    if (uploads.length === 0) {
        container.innerHTML = `
            <div class="py-12 text-center space-y-3">
                <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl border border-slate-200 dark:border-slate-700">
                    <i class="fa-solid fa-folder-open"></i>
                </div>
                <h4 class="font-bold text-slate-800 dark:text-slate-200 text-base">No posted materials yet</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Your teacher has not uploaded any activities or lectures for ${subj.name} yet.
                </p>
            </div>
        `;
    } else {
        uploads.forEach((item, index) => {
            const itemCard = document.createElement('div');
            itemCard.className = "p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 backdrop-blur-md";
            itemCard.innerHTML = `
                <div class="flex items-start justify-between gap-2">
                    <div class="space-y-1">
                        <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 uppercase">${item.type}</span>
                        <h4 class="font-bold text-sm text-slate-900 dark:text-white">${item.title}</h4>
                    </div>
                    <span class="text-[10px] text-slate-400 shrink-0">${item.date}</span>
                </div>
                ${item.description ? `<p class="text-xs text-slate-600 dark:text-slate-300">${item.description}</p>` : ''}
                <div class="flex flex-wrap gap-3 pt-1 text-[11px]">
                    ${item.deadline ? `<span class="text-red-500 font-bold"><i class="fa-solid fa-calendar-day"></i> Due: ${item.deadline}</span>` : ''}
                </div>
                <div class="pt-2 flex justify-between items-center">
                    <a href="${item.link}" target="_blank" class="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1">
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> Open Material
                    </a>
                    ${isTeacherAuthenticated ? `<button onclick="deleteUpload('${code}',${index})" class="text-[11px] text-red-500 hover:underline">Delete Material</button>` : ''}
                </div>
            `;
            container.appendChild(itemCard);
        });
    }
    toggleModal('subjectDetailModal');
}

function handleTeacherUpload(event) {
    event.preventDefault();
    const subjectCode = document.getElementById('uploadSubjectCode').value;
    const type = document.getElementById('uploadType').value;
    const title = document.getElementById('uploadTitle').value.trim();
    const link = document.getElementById('uploadLink').value.trim();
    const deadline = document.getElementById('uploadDeadline').value;
    const description = document.getElementById('uploadDescription').value.trim();
    
    const newUpload = {
        type,
        title,
        link,
        deadline,
        description,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    if (!subjectData[subjectCode]) subjectData[subjectCode] = [];
    subjectData[subjectCode].unshift(newUpload);
    localStorage.setItem('study_subject_uploads', JSON.stringify(subjectData));

    if (deadline) {
        deadlines.push({ id: Date.now(), title: `${subjectCode}: ${title}`, date: deadline });
        localStorage.setItem('study_deadlines', JSON.stringify(deadlines));
        renderDeadlines();
    }

    document.getElementById('teacherUploadForm').reset();
    toggleModal('teacherModal');
    renderSubjects();
    showToast(`Successfully posted content to ${subjectCode}!`, "Module Updated");
}

function deleteUpload(code, index) {
    if (confirm("Are you sure you want to delete this resource?")) {
        subjectData[code].splice(index, 1);
        localStorage.setItem('study_subject_uploads', JSON.stringify(subjectData));
        renderSubjects();
        openSubjectModal(code);
        showToast("Material removed successfully.", "Deleted");
    }
}

function renderTeacherSubjectOptions() {
    const select = document.getElementById('uploadSubjectCode');
    if (!select) return;
    select.innerHTML = '';
    SUBJECTS.forEach(subj => {
        const opt = document.createElement('option');
        opt.value = subj.code;
        opt.innerText = `${subj.code} - ${subj.name}`;
        select.appendChild(opt);
    });
}

// Goals
function renderGoals() {
    const container = document.getElementById('goalsListContainer');
    const badge = document.getElementById('goalCountText');
    if (!container) return;
    container.innerHTML = '';
    let completedCount = studyGoals.filter(g => g.completed).length;
    if (badge) badge.innerText = `${completedCount}/${studyGoals.length} Done`;

    studyGoals.forEach((goal, index) => {
        const div = document.createElement('div');
        div.className = "flex items-center justify-between p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs";
        div.innerHTML = `
            <label class="flex items-center gap-2 cursor-pointer flex-1">
                <input type="checkbox" ${goal.completed ? 'checked' : ''} onchange="toggleGoal(${index})" class="w-4 h-4 rounded text-amber-600 font-medium">
                <span class="${goal.completed ? 'line-through text-slate-400' : 'font-medium text-slate-700 dark:text-slate-200'}">${goal.text}</span>
            </label>
            <button onclick="deleteGoal(${index})" class="text-slate-400 hover:text-red-500"><i class="fa-solid fa-trash-can text-[11px]"></i></button>
        `;
        container.appendChild(div);
    });
}

function toggleGoal(index) {
    studyGoals[index].completed = !studyGoals[index].completed;
    localStorage.setItem('study_goals', JSON.stringify(studyGoals));
    renderGoals();
}

function handleAddGoal(e) {
    e.preventDefault();
    const input = document.getElementById('newGoalInput');
    if (!input.value.trim()) return;
    studyGoals.push({ id: Date.now(), text: input.value.trim(), completed: false });
    localStorage.setItem('study_goals', JSON.stringify(studyGoals));
    input.value = '';
    renderGoals();
    showToast("New daily goal added!", "Goal Tracker");
}

function deleteGoal(index) {
    studyGoals.splice(index, 1);
    localStorage.setItem('study_goals', JSON.stringify(studyGoals));
    renderGoals();
}

// Deadlines
function renderDeadlines() {
    const container = document.getElementById('deadlinesList');
    if (!container) return;
    container.innerHTML = '';
    deadlines.forEach(item => {
        const div = document.createElement('div');
        div.className = "p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs backdrop-blur-md";
        div.innerHTML = `
            <span class="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[140px]">${item.title}</span>
            <span class="text-[10px] font-bold text-red-500 shrink-0">${item.date}</span>
        `;
        container.appendChild(div);
    });
}

// Focus Timer
function setTimerPreset(minutes) {
    document.getElementById('timerMinutesInput').value = minutes;
    updateTimerFromInput();
}

function updateTimerFromInput() {
    let minutes = parseInt(document.getElementById('timerMinutesInput').value) || 25;
    if (!isTimerRunning) {
        timerSecondsLeft = minutes * 60;
        document.getElementById('timerSeconds').innerText = '00';
    }
}

function toggleTimer() {
    const btn = document.getElementById('startTimerBtn');
    const status = document.getElementById('timerStatus');
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        btn.innerHTML = `<i class="fa-solid fa-play"></i> Start`;
        status.innerText = "Paused";
    } else {
        isTimerRunning = true;
        btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
        status.innerText = "Focusing...";
        timerInterval = setInterval(() => {
            if (timerSecondsLeft > 0) {
                timerSecondsLeft--;
                const mins = Math.floor(timerSecondsLeft / 60);
                const secs = timerSecondsLeft % 60;
                document.getElementById('timerMinutesInput').value = mins;
                document.getElementById('timerSeconds').innerText = secs < 10 ? '0' + secs : secs;
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                showToast("Focus Session Complete! Take a break.", "Timer Finished");
                resetTimer();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    document.getElementById('startTimerBtn').innerHTML = `<i class="fa-solid fa-play"></i> Start`;
    document.getElementById('timerStatus').innerText = "Ready";
    updateTimerFromInput();
}

// Calcu
function switchCalcMode(mode) {}
function calcAppend(val) {
    let screen = document.getElementById('calcScreen');
    screen.innerText = screen.innerText === "0" ? val : screen.innerText + val;
}
function calcClear() { document.getElementById('calcScreen').innerText = "0"; }
function calcCompute() {
    try { document.getElementById('calcScreen').innerText = eval(document.getElementById('calcScreen').innerText); }
    catch { document.getElementById('calcScreen').innerText = "Error"; }
}

// UI Controls
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('translate-x-full');
    document.getElementById('sidebarOverlay').classList.toggle('hidden');
}

function toggleModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden');
}
