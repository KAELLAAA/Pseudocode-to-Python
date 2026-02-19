/* ============================================================
   PSEUDOPY — APP.JS
   Automated Code Generation System
   ============================================================ */

// ── State ──
let currentUser = null;
let currentPage = '';
let editingExerciseId = null;
let editingUserId = null;

// ── Seed Data ──
const DEFAULT_USERS = [
    { id: 'u1', fullName: 'Admin User', username: 'admin', email: 'admin@university.edu.ph', password: 'admin123', role: 'admin', status: 'active' },
    { id: 'u2', fullName: 'Prof. Santos', username: 'psantos', email: 'santos@university.edu.ph', password: 'pass123', role: 'instructor', status: 'active' },
    { id: 'u3', fullName: 'Maria Garcia', username: 'mgarcia', email: 'garcia@student.edu.ph', password: 'pass123', role: 'student', status: 'active' },
    { id: 'u4', fullName: 'Juan Reyes', username: 'jreyes', email: 'reyes@student.edu.ph', password: 'pass123', role: 'student', status: 'active' },
    { id: 'u5', fullName: 'Ana Cruz', username: 'acruz', email: 'cruz@student.edu.ph', password: 'pass123', role: 'student', status: 'active' },
    { id: 'u6', fullName: 'Carlos Mendoza', username: 'cmendoza', email: 'mendoza@student.edu.ph', password: 'pass123', role: 'student', status: 'active' },
    { id: 'u7', fullName: 'Prof. Rivera', username: 'privera', email: 'rivera@university.edu.ph', password: 'pass123', role: 'instructor', status: 'active' },
];

const DEFAULT_EXERCISES = [
    {
        id: 'ex1',
        title: 'Sum of Even Numbers',
        description: 'Write pseudocode that takes a list of numbers and computes the sum of all even numbers in the list. Display the result.',
        difficulty: 'easy',
        solution: 'BEGIN\n  SET numbers TO [2, 5, 8, 11, 14, 3, 6]\n  SET sum TO 0\n  FOR EACH num IN numbers DO\n    IF num MOD 2 = 0 THEN\n      SET sum TO sum + num\n    END IF\n  END FOR\n  DISPLAY "Sum of even numbers: " + sum\nEND',
        createdBy: 'u2',
        createdAt: '2026-02-15'
    },
    {
        id: 'ex2',
        title: 'Factorial Calculator',
        description: 'Write pseudocode to calculate the factorial of a given number N using a loop. Display each step of the computation.',
        difficulty: 'medium',
        solution: 'BEGIN\n  SET n TO 5\n  SET factorial TO 1\n  SET i TO 1\n  WHILE i <= n DO\n    SET factorial TO factorial * i\n    DISPLAY i + "! = " + factorial\n    SET i TO i + 1\n  END WHILE\n  DISPLAY "Final: " + n + "! = " + factorial\nEND',
        createdBy: 'u2',
        createdAt: '2026-02-16'
    },
    {
        id: 'ex3',
        title: 'FizzBuzz Classic',
        description: 'Write pseudocode for the classic FizzBuzz problem: for numbers 1 to 20, print "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both, or the number itself.',
        difficulty: 'medium',
        solution: 'BEGIN\n  FOR i FROM 1 TO 20 DO\n    IF i MOD 15 = 0 THEN\n      DISPLAY "FizzBuzz"\n    ELSE IF i MOD 3 = 0 THEN\n      DISPLAY "Fizz"\n    ELSE IF i MOD 5 = 0 THEN\n      DISPLAY "Buzz"\n    ELSE\n      DISPLAY i\n    END IF\n  END FOR\nEND',
        createdBy: 'u2',
        createdAt: '2026-02-17'
    },
    {
        id: 'ex4',
        title: 'Fibonacci Sequence',
        description: 'Write pseudocode to generate the first N numbers of the Fibonacci sequence and display them.',
        difficulty: 'hard',
        solution: 'BEGIN\n  SET n TO 10\n  SET a TO 0\n  SET b TO 1\n  DISPLAY a\n  DISPLAY b\n  SET i TO 2\n  WHILE i < n DO\n    SET temp TO a + b\n    DISPLAY temp\n    SET a TO b\n    SET b TO temp\n    SET i TO i + 1\n  END WHILE\nEND',
        createdBy: 'u7',
        createdAt: '2026-02-18'
    },
];

const DEFAULT_ACTIVITY = [
    { student: 'Maria Garcia', exercise: 'Sum of Even Numbers', status: 'Completed', score: '95%', time: '5 min ago' },
    { student: 'Juan Reyes', exercise: 'Factorial Calculator', status: 'In Progress', score: '—', time: '12 min ago' },
    { student: 'Ana Cruz', exercise: 'FizzBuzz Classic', status: 'Completed', score: '88%', time: '25 min ago' },
    { student: 'Carlos Mendoza', exercise: 'Sum of Even Numbers', status: 'Failed', score: '42%', time: '1 hr ago' },
    { student: 'Maria Garcia', exercise: 'Fibonacci Sequence', status: 'Completed', score: '100%', time: '2 hrs ago' },
    { student: 'Juan Reyes', exercise: 'Sum of Even Numbers', status: 'Completed', score: '78%', time: '3 hrs ago' },
];

// ── Init ──
function init() {
    if (!localStorage.getItem('pseudopy_users')) {
        localStorage.setItem('pseudopy_users', JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem('pseudopy_exercises')) {
        localStorage.setItem('pseudopy_exercises', JSON.stringify(DEFAULT_EXERCISES));
    }
    updateClock();
    setInterval(updateClock, 60000);

    // Update line count on editor input
    const editor = document.getElementById('pseudocode-editor');
    if (editor) {
        editor.addEventListener('input', () => {
            const lines = editor.value.split('\n').length;
            document.getElementById('line-count').textContent = lines + ' lines';
        });
    }
}

function updateClock() {
    const el = document.getElementById('topbar-time');
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' +
            now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

// ── LocalStorage Helpers ──
function getUsers() {
    return JSON.parse(localStorage.getItem('pseudopy_users') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('pseudopy_users', JSON.stringify(users));
}
function getExercises() {
    return JSON.parse(localStorage.getItem('pseudopy_exercises') || '[]');
}
function saveExercises(exercises) {
    localStorage.setItem('pseudopy_exercises', JSON.stringify(exercises));
}

// ── Toast Notifications ──
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


/* ============================================================
   AUTHENTICATION
   ============================================================ */

function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const role = document.querySelector('input[name="role"]:checked')?.value;

    if (!username || !password) {
        showToast('Please enter username and password.', 'error');
        return;
    }
    if (!role) {
        showToast('Please select a role.', 'error');
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password && u.role === role);

    if (!user) {
        showToast('Invalid credentials or role mismatch.', 'error');
        return;
    }

    currentUser = user;
    showToast(`Welcome back, ${user.fullName}!`, 'success');
    showApp();
}

function handleLogout() {
    currentUser = null;
    document.getElementById('app-layout').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    showToast('Signed out successfully.', 'info');
}

function showApp() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');

    // Update sidebar user info
    document.getElementById('sidebar-avatar').textContent = currentUser.fullName.charAt(0).toUpperCase();
    document.getElementById('sidebar-username').textContent = currentUser.fullName;
    const roleLabels = { student: 'Student', instructor: 'Instructor', admin: 'Administrator' };
    document.getElementById('sidebar-role').textContent = roleLabels[currentUser.role];

    // Show correct nav
    document.querySelectorAll('.sidebar-nav > div').forEach(el => el.classList.add('hidden'));
    document.getElementById(`nav-${currentUser.role}`).classList.remove('hidden');

    // Navigate to default page
    const defaults = {
        student: 'write-pseudocode',
        instructor: 'analytics',
        admin: 'manage-users'
    };
    navigateTo(defaults[currentUser.role]);
}


/* ============================================================
   NAVIGATION
   ============================================================ */

function navigateTo(pageId) {
    currentPage = pageId;

    // Hide all pages
    document.querySelectorAll('.page-view').forEach(el => el.classList.add('hidden'));

    // Show target page
    const page = document.getElementById(`page-${pageId}`);
    if (page) {
        page.classList.remove('hidden');
    }

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('onclick')?.includes(pageId)) {
            item.classList.add('active');
        }
    });

    // Update topbar title
    const titles = {
        'write-pseudocode': 'Write Pseudocode',
        'translate': 'Translate Pseudocode',
        'execute': 'Execute Code',
        'feedback': 'Feedback & Suggestions',
        'exercises-student': 'Exercises & Tasks',
        'analytics': 'Learning Analytics',
        'manage-exercises': 'Manage Exercises',
        'generate-code': 'Generate Python Code',
        'manage-users': 'Administer User Accounts',
        'admin-execute': 'Execute Code'
    };
    document.getElementById('topbar-title').textContent = titles[pageId] || 'Dashboard';

    // Load page-specific data
    if (pageId === 'analytics') loadAnalytics();
    if (pageId === 'manage-exercises') loadExercises();
    if (pageId === 'manage-users') loadUsers();
    if (pageId === 'exercises-student') loadStudentExercises();
}


/* ============================================================
   PSEUDOCODE → PYTHON TRANSLATION ENGINE
   ============================================================ */

function translatePseudocode() {
    const input = document.getElementById('pseudocode-editor').value;
    if (!input.trim()) {
        showToast('Please write some pseudocode first.', 'error');
        return;
    }

    const python = pseudocodeToPython(input);
    document.getElementById('python-output').value = python;

    const output = document.getElementById('console-output');
    output.className = 'output-content';
    output.textContent = '✅ Translation complete! Click "Run Code" to execute.';

    showToast('Pseudocode translated to Python successfully!', 'success');
}

function translateFromPage() {
    const input = document.getElementById('translate-input').value;
    if (!input.trim()) {
        showToast('Please write some pseudocode first.', 'error');
        return;
    }
    const python = pseudocodeToPython(input);
    document.getElementById('translate-output').value = python;
    showToast('Translation complete!', 'success');
}

function instructorTranslate() {
    const input = document.getElementById('instructor-pseudo-input').value;
    if (!input.trim()) {
        showToast('Please write some pseudocode first.', 'error');
        return;
    }
    const python = pseudocodeToPython(input);
    document.getElementById('instructor-python-output').value = python;
    showToast('Python code generated!', 'success');
}

/**
 * Core Translation Engine
 * Converts structured pseudocode into valid Python.
 */
function pseudocodeToPython(pseudocode) {
    const lines = pseudocode.split('\n');
    const pythonLines = [];
    let indentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Skip empty lines
        if (!line) {
            pythonLines.push('');
            continue;
        }

        // Skip BEGIN / END (top-level block markers)
        if (/^BEGIN$/i.test(line)) continue;
        if (/^END$/i.test(line)) continue;

        // ── Comments ──
        if (line.startsWith('//') || line.startsWith('#')) {
            pythonLines.push(indent(indentLevel) + '# ' + line.replace(/^\/\/\s*|^#\s*/, ''));
            continue;
        }

        // ── END blocks (reduce indent BEFORE writing) ──
        if (/^END\s+(IF|FOR|WHILE|FUNCTION|PROCEDURE)/i.test(line)) {
            indentLevel = Math.max(0, indentLevel - 1);
            continue;
        }

        // ── ELSE IF ──
        if (/^ELSE\s+IF\s+(.+)\s+THEN$/i.test(line)) {
            indentLevel = Math.max(0, indentLevel - 1);
            const match = line.match(/^ELSE\s+IF\s+(.+)\s+THEN$/i);
            const cond = translateCondition(match[1]);
            pythonLines.push(indent(indentLevel) + `elif ${cond}:`);
            indentLevel++;
            continue;
        }

        // ── ELSE ──
        if (/^ELSE$/i.test(line)) {
            indentLevel = Math.max(0, indentLevel - 1);
            pythonLines.push(indent(indentLevel) + 'else:');
            indentLevel++;
            continue;
        }

        // ── IF ... THEN ──
        if (/^IF\s+(.+)\s+THEN$/i.test(line)) {
            const match = line.match(/^IF\s+(.+)\s+THEN$/i);
            const cond = translateCondition(match[1]);
            pythonLines.push(indent(indentLevel) + `if ${cond}:`);
            indentLevel++;
            continue;
        }

        // ── FOR EACH ... IN ... DO ──
        if (/^FOR\s+EACH\s+(\w+)\s+IN\s+(.+)\s+DO$/i.test(line)) {
            const match = line.match(/^FOR\s+EACH\s+(\w+)\s+IN\s+(.+)\s+DO$/i);
            pythonLines.push(indent(indentLevel) + `for ${match[1]} in ${translateExpr(match[2])}:`);
            indentLevel++;
            continue;
        }

        // ── FOR i FROM x TO y DO ──
        if (/^FOR\s+(\w+)\s+FROM\s+(.+)\s+TO\s+(.+)\s+DO$/i.test(line)) {
            const match = line.match(/^FOR\s+(\w+)\s+FROM\s+(.+)\s+TO\s+(.+)\s+DO$/i);
            const start = translateExpr(match[2]);
            const end = translateExpr(match[3]);
            pythonLines.push(indent(indentLevel) + `for ${match[1]} in range(${start}, ${end} + 1):`);
            indentLevel++;
            continue;
        }

        // ── WHILE ... DO ──
        if (/^WHILE\s+(.+)\s+DO$/i.test(line)) {
            const match = line.match(/^WHILE\s+(.+)\s+DO$/i);
            const cond = translateCondition(match[1]);
            pythonLines.push(indent(indentLevel) + `while ${cond}:`);
            indentLevel++;
            continue;
        }

        // ── FUNCTION / PROCEDURE ──
        if (/^(FUNCTION|PROCEDURE)\s+(\w+)\s*\((.*)?\)$/i.test(line)) {
            const match = line.match(/^(FUNCTION|PROCEDURE)\s+(\w+)\s*\((.*)?\)$/i);
            const params = match[3] ? match[3].trim() : '';
            pythonLines.push(indent(indentLevel) + `def ${match[2]}(${params}):`);
            indentLevel++;
            continue;
        }

        // ── RETURN ──
        if (/^RETURN\s+(.+)$/i.test(line)) {
            const match = line.match(/^RETURN\s+(.+)$/i);
            pythonLines.push(indent(indentLevel) + `return ${translateExpr(match[1])}`);
            continue;
        }

        // ── CALL ──
        if (/^CALL\s+(\w+)\s*\((.*)?\)$/i.test(line)) {
            const match = line.match(/^CALL\s+(\w+)\s*\((.*)?\)$/i);
            const args = match[2] ? translateExpr(match[2]) : '';
            pythonLines.push(indent(indentLevel) + `${match[1]}(${args})`);
            continue;
        }

        // ── SET ... TO ... ──
        if (/^SET\s+(\w+)\s+TO\s+(.+)$/i.test(line)) {
            const match = line.match(/^SET\s+(\w+)\s+TO\s+(.+)$/i);
            pythonLines.push(indent(indentLevel) + `${match[1]} = ${translateExpr(match[2])}`);
            continue;
        }

        // ── DISPLAY / PRINT / OUTPUT ──
        if (/^(DISPLAY|PRINT|OUTPUT)\s+(.+)$/i.test(line)) {
            const match = line.match(/^(DISPLAY|PRINT|OUTPUT)\s+(.+)$/i);
            const expr = translateExpr(match[2]);
            // Handle string concatenation with non-string values → use f-string or str()
            pythonLines.push(indent(indentLevel) + `print(${expr})`);
            continue;
        }

        // ── INPUT ──
        if (/^(INPUT|READ)\s+(\w+)$/i.test(line)) {
            const match = line.match(/^(INPUT|READ)\s+(\w+)$/i);
            pythonLines.push(indent(indentLevel) + `${match[2]} = input()`);
            continue;
        }

        if (/^(INPUT|READ)\s+(\w+)\s+WITH\s+PROMPT\s+"(.+)"$/i.test(line)) {
            const match = line.match(/^(INPUT|READ)\s+(\w+)\s+WITH\s+PROMPT\s+"(.+)"$/i);
            pythonLines.push(indent(indentLevel) + `${match[2]} = input("${match[3]}")`);
            continue;
        }

        // ── INCREMENT / DECREMENT ──
        if (/^INCREMENT\s+(\w+)$/i.test(line)) {
            const match = line.match(/^INCREMENT\s+(\w+)$/i);
            pythonLines.push(indent(indentLevel) + `${match[1]} += 1`);
            continue;
        }
        if (/^DECREMENT\s+(\w+)$/i.test(line)) {
            const match = line.match(/^DECREMENT\s+(\w+)$/i);
            pythonLines.push(indent(indentLevel) + `${match[1]} -= 1`);
            continue;
        }

        // ── APPEND ... TO ... ──
        if (/^APPEND\s+(.+)\s+TO\s+(\w+)$/i.test(line)) {
            const match = line.match(/^APPEND\s+(.+)\s+TO\s+(\w+)$/i);
            pythonLines.push(indent(indentLevel) + `${match[2]}.append(${translateExpr(match[1])})`);
            continue;
        }

        // ── Fallback: treat as comment ──
        pythonLines.push(indent(indentLevel) + `# ${line}`);
    }

    return pythonLines.join('\n');
}

function indent(level) {
    return '    '.repeat(level);
}

function translateCondition(cond) {
    return cond
        .replace(/\bAND\b/gi, 'and')
        .replace(/\bOR\b/gi, 'or')
        .replace(/\bNOT\b/gi, 'not')
        .replace(/\bMOD\b/gi, '%')
        .replace(/\b(\w+)\s*=\s*(?!=)/g, (match, varName) => {
            // Only replace = with == if it's a comparison context
            // Check if it's not an assignment
            return `${varName} == `;
        })
        .replace(/\s*<>\s*/g, ' != ')
        .replace(/\bTRUE\b/gi, 'True')
        .replace(/\bFALSE\b/gi, 'False')
        .replace(/\bNULL\b/gi, 'None')
        .trim();
}

function translateExpr(expr) {
    return expr
        .replace(/\bMOD\b/gi, '%')
        .replace(/\bTRUE\b/gi, 'True')
        .replace(/\bFALSE\b/gi, 'False')
        .replace(/\bNULL\b/gi, 'None')
        .replace(/\bAND\b/gi, 'and')
        .replace(/\bOR\b/gi, 'or')
        .replace(/\bNOT\b/gi, 'not')
        .trim();
}


/* ============================================================
   CODE EXECUTION (via Skulpt)
   ============================================================ */

function executePython() {
    const code = document.getElementById('python-output').value;
    if (!code.trim()) {
        showToast('No Python code to execute. Translate first!', 'error');
        return;
    }
    runPythonCode(code, 'console-output');
}

function executeFromTranslate() {
    const code = document.getElementById('translate-output').value;
    if (!code.trim()) {
        showToast('No Python code to execute.', 'error');
        return;
    }
    runPythonCode(code, 'translate-console');
}

function executeFromExecPage() {
    const code = document.getElementById('execute-editor').value;
    if (!code.trim()) {
        showToast('Please enter some Python code.', 'error');
        return;
    }
    runPythonCode(code, 'execute-console');
}

function instructorExecute() {
    const code = document.getElementById('instructor-python-output').value;
    if (!code.trim()) {
        showToast('No code to execute. Generate first!', 'error');
        return;
    }
    runPythonCode(code, 'instructor-console');
}

function adminExecute() {
    const code = document.getElementById('admin-execute-editor').value;
    if (!code.trim()) {
        showToast('Please enter Python code to execute.', 'error');
        return;
    }
    runPythonCode(code, 'admin-console');
}

function runPythonCode(code, outputElementId) {
    const outputEl = document.getElementById(outputElementId);
    outputEl.textContent = '';
    outputEl.className = 'output-content';

    // Clean the code: handle string concatenation with + for mixed types
    // Replace "string" + variable patterns to use str() for safety
    let cleanCode = code.replace(/print\((.+)\)/g, (match, content) => {
        // If content has + concatenation mixing strings and variables, wrap vars in str()
        if (content.includes('+') && content.includes('"')) {
            const parts = content.split('+').map(p => {
                p = p.trim();
                if (!p.startsWith('"') && !p.startsWith("'") && !p.match(/^str\(/)) {
                    return `str(${p})`;
                }
                return p;
            });
            return `print(${parts.join(' + ')})`;
        }
        return match;
    });

    if (typeof Sk === 'undefined') {
        outputEl.textContent = '⚠️ Skulpt library not loaded. Please check your internet connection.\n\nFalling back to static analysis...\n\n';
        outputEl.textContent += simulateExecution(code);
        outputEl.className = 'output-content';
        return;
    }

    let outputText = '';

    Sk.configure({
        output: function (text) {
            outputText += text;
            outputEl.textContent = outputText;
        },
        read: function (x) {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
                throw "File not found: '" + x + "'";
            }
            return Sk.builtinFiles["files"][x];
        },
        __future__: Sk.python3
    });

    Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, cleanCode, true);
    }).then(function () {
        if (!outputText.trim()) {
            outputEl.textContent = '✅ Code executed successfully (no output).';
        }
        outputEl.className = 'output-content';
        showToast('Code executed successfully!', 'success');
    }).catch(function (err) {
        outputEl.textContent = '❌ Error: ' + err.toString();
        outputEl.className = 'output-content error';
        showToast('Runtime error occurred.', 'error');
    });
}

/**
 * Fallback simulation when Skulpt isn't available
 */
function simulateExecution(code) {
    const lines = code.split('\n');
    let output = '';
    for (const line of lines) {
        const match = line.match(/print\((.+)\)/);
        if (match) {
            let val = match[1].trim();
            // Very basic evaluation of string literals
            if (val.startsWith('"') || val.startsWith("'")) {
                val = val.replace(/^["']|["']$/g, '');
                output += val + '\n';
            } else {
                output += `[expression: ${val}]\n`;
            }
        }
    }
    return output || '(no print statements detected)';
}


/* ============================================================
   FEEDBACK & SUGGESTIONS
   ============================================================ */

function analyzePseudocode() {
    const input = document.getElementById('feedback-input').value;
    if (!input.trim()) {
        showToast('Please paste some pseudocode to analyze.', 'error');
        return;
    }

    const feedback = generateFeedback(input);
    renderFeedback(feedback);
    showToast('Analysis complete!', 'success');
}

function generateFeedback(pseudocode) {
    const feedback = [];
    const lines = pseudocode.split('\n');
    const trimmedLines = lines.map(l => l.trim()).filter(l => l);

    // Check for BEGIN/END structure
    const hasBegin = trimmedLines.some(l => /^BEGIN$/i.test(l));
    const hasEnd = trimmedLines.some(l => /^END$/i.test(l));

    if (hasBegin && hasEnd) {
        feedback.push({ type: 'success', icon: '✅', text: '<strong>Good structure:</strong> Your pseudocode has proper BEGIN/END blocks.' });
    } else {
        if (!hasBegin) feedback.push({ type: 'warning', icon: '⚠️', text: '<strong>Missing BEGIN:</strong> Start your pseudocode with a BEGIN statement for clarity.' });
        if (!hasEnd) feedback.push({ type: 'warning', icon: '⚠️', text: '<strong>Missing END:</strong> End your pseudocode with an END statement.' });
    }

    // Check IF/END IF balance
    const ifCount = trimmedLines.filter(l => /^IF\s/i.test(l)).length;
    const endIfCount = trimmedLines.filter(l => /^END\s+IF$/i.test(l)).length;
    if (ifCount > endIfCount) {
        feedback.push({ type: 'error', icon: '❌', text: `<strong>Syntax Error:</strong> Found ${ifCount} IF statement(s) but only ${endIfCount} END IF. Check your IF blocks.` });
    } else if (ifCount > 0 && ifCount === endIfCount) {
        feedback.push({ type: 'success', icon: '✅', text: `<strong>IF blocks balanced:</strong> ${ifCount} IF/END IF pair(s) are properly matched.` });
    }

    // Check FOR/END FOR balance
    const forCount = trimmedLines.filter(l => /^FOR\s/i.test(l)).length;
    const endForCount = trimmedLines.filter(l => /^END\s+FOR$/i.test(l)).length;
    if (forCount > endForCount) {
        feedback.push({ type: 'error', icon: '❌', text: `<strong>Syntax Error:</strong> Found ${forCount} FOR loop(s) but only ${endForCount} END FOR.` });
    } else if (forCount > 0 && forCount === endForCount) {
        feedback.push({ type: 'success', icon: '✅', text: `<strong>FOR loops balanced:</strong> ${forCount} FOR/END FOR pair(s) properly matched.` });
    }

    // Check WHILE/END WHILE balance
    const whileCount = trimmedLines.filter(l => /^WHILE\s/i.test(l)).length;
    const endWhileCount = trimmedLines.filter(l => /^END\s+WHILE$/i.test(l)).length;
    if (whileCount > endWhileCount) {
        feedback.push({ type: 'error', icon: '❌', text: `<strong>Syntax Error:</strong> Found ${whileCount} WHILE loop(s) but only ${endWhileCount} END WHILE.` });
    } else if (whileCount > 0 && whileCount === endWhileCount) {
        feedback.push({ type: 'success', icon: '✅', text: `<strong>WHILE loops balanced:</strong> ${whileCount} WHILE/END WHILE pair(s) properly matched.` });
    }

    // Check for DISPLAY usage
    const displayCount = trimmedLines.filter(l => /^(DISPLAY|PRINT|OUTPUT)\s/i.test(l)).length;
    if (displayCount > 0) {
        feedback.push({ type: 'success', icon: '✅', text: `<strong>Output statements:</strong> Found ${displayCount} DISPLAY/PRINT statement(s).` });
    } else {
        feedback.push({ type: 'warning', icon: '💡', text: '<strong>Suggestion:</strong> Consider adding DISPLAY statements to show your results.' });
    }

    // Check for variable declarations
    const setCount = trimmedLines.filter(l => /^SET\s/i.test(l)).length;
    if (setCount > 0) {
        feedback.push({ type: 'success', icon: '✅', text: `<strong>Variables:</strong> Found ${setCount} variable assignment(s) using SET.` });
    }

    // Check indentation consistency
    const indentedLines = lines.filter(l => l.match(/^\s+/));
    if (indentedLines.length > 0) {
        feedback.push({ type: 'success', icon: '✅', text: '<strong>Indentation:</strong> Your code uses indentation, which improves readability.' });
    } else if (lines.length > 3) {
        feedback.push({ type: 'warning', icon: '💡', text: '<strong>Suggestion:</strong> Add indentation inside blocks (IF, FOR, WHILE) for better readability.' });
    }

    // Overall quality score
    const errors = feedback.filter(f => f.type === 'error').length;
    const warnings = feedback.filter(f => f.type === 'warning').length;
    const successes = feedback.filter(f => f.type === 'success').length;

    let quality = 'Excellent';
    let qualityType = 'success';
    if (errors > 0) { quality = 'Needs Fixing'; qualityType = 'error'; }
    else if (warnings > 2) { quality = 'Fair'; qualityType = 'warning'; }
    else if (warnings > 0) { quality = 'Good'; qualityType = 'success'; }

    feedback.unshift({
        type: qualityType,
        icon: qualityType === 'success' ? '🏆' : qualityType === 'warning' ? '📊' : '🔧',
        text: `<strong>Overall Quality: ${quality}</strong> — ${successes} passed, ${warnings} suggestion(s), ${errors} error(s). Total: ${trimmedLines.length} lines of pseudocode.`
    });

    return feedback;
}

function renderFeedback(feedback) {
    const container = document.getElementById('feedback-results');
    container.innerHTML = feedback.map(f => `
    <div class="feedback-item ${f.type}">
      <span class="fb-icon">${f.icon}</span>
      <span class="fb-text">${f.text}</span>
    </div>
  `).join('');
}


/* ============================================================
   EXERCISES MANAGEMENT (Instructor)
   ============================================================ */

function loadExercises() {
    const exercises = getExercises();
    const container = document.getElementById('exercises-list');

    if (exercises.length === 0) {
        container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">📋</div>
        <h3>No Exercises Yet</h3>
        <p>Create your first exercise to get started.</p>
      </div>`;
        return;
    }

    container.innerHTML = exercises.map(ex => `
    <div class="exercise-card">
      <div class="ex-header">
        <span class="ex-title">${ex.title}</span>
        <span class="ex-difficulty ${ex.difficulty}">${ex.difficulty}</span>
      </div>
      <p class="ex-desc">${ex.description}</p>
      <div class="ex-meta">
        <span>📅 ${ex.createdAt}</span>
      </div>
      <div class="ex-actions">
        <button class="btn btn-secondary btn-sm" onclick="editExercise('${ex.id}')">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteExercise('${ex.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

function loadStudentExercises() {
    const exercises = getExercises();
    const container = document.getElementById('student-exercises-list');

    if (exercises.length === 0) {
        container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">📝</div>
        <h3>No Exercises Available</h3>
        <p>Your instructor hasn't created any exercises yet.</p>
      </div>`;
        return;
    }

    container.innerHTML = exercises.map(ex => `
    <div class="exercise-card">
      <div class="ex-header">
        <span class="ex-title">${ex.title}</span>
        <span class="ex-difficulty ${ex.difficulty}">${ex.difficulty}</span>
      </div>
      <p class="ex-desc">${ex.description}</p>
      <div class="ex-meta">
        <span>📅 ${ex.createdAt}</span>
      </div>
      <div class="ex-actions">
        <button class="btn btn-primary btn-sm" style="width:auto" onclick="attemptExercise('${ex.id}')">📝 Start Exercise</button>
      </div>
    </div>
  `).join('');
}

function attemptExercise(id) {
    const exercises = getExercises();
    const ex = exercises.find(e => e.id === id);
    if (!ex) return;

    // Load the exercise into the pseudocode editor
    document.getElementById('pseudocode-editor').value = '';
    document.getElementById('python-output').value = '';
    navigateTo('write-pseudocode');
    showToast(`Exercise loaded: ${ex.title}. Write your pseudocode!`, 'info');
}

function openExerciseModal(id = null) {
    editingExerciseId = id;
    const modal = document.getElementById('exercise-modal');
    const title = document.getElementById('exercise-modal-title');

    if (id) {
        const exercises = getExercises();
        const ex = exercises.find(e => e.id === id);
        if (ex) {
            title.textContent = 'Edit Exercise';
            document.getElementById('ex-title').value = ex.title;
            document.getElementById('ex-desc').value = ex.description;
            document.getElementById('ex-difficulty').value = ex.difficulty;
            document.getElementById('ex-solution').value = ex.solution || '';
        }
    } else {
        title.textContent = 'New Exercise';
        document.getElementById('ex-title').value = '';
        document.getElementById('ex-desc').value = '';
        document.getElementById('ex-difficulty').value = 'medium';
        document.getElementById('ex-solution').value = '';
    }

    modal.classList.remove('hidden');
}

function closeExerciseModal() {
    document.getElementById('exercise-modal').classList.add('hidden');
    editingExerciseId = null;
}

function saveExercise() {
    const title = document.getElementById('ex-title').value.trim();
    const desc = document.getElementById('ex-desc').value.trim();
    const difficulty = document.getElementById('ex-difficulty').value;
    const solution = document.getElementById('ex-solution').value.trim();

    if (!title || !desc) {
        showToast('Please fill in the title and description.', 'error');
        return;
    }

    const exercises = getExercises();

    if (editingExerciseId) {
        const idx = exercises.findIndex(e => e.id === editingExerciseId);
        if (idx >= 0) {
            exercises[idx] = { ...exercises[idx], title, description: desc, difficulty, solution };
        }
        showToast('Exercise updated successfully!', 'success');
    } else {
        exercises.push({
            id: 'ex' + Date.now(),
            title,
            description: desc,
            difficulty,
            solution,
            createdBy: currentUser?.id || 'unknown',
            createdAt: new Date().toISOString().split('T')[0]
        });
        showToast('Exercise created successfully!', 'success');
    }

    saveExercises(exercises);
    closeExerciseModal();
    loadExercises();
}

function editExercise(id) {
    openExerciseModal(id);
}

function deleteExercise(id) {
    if (!confirm('Are you sure you want to delete this exercise?')) return;
    let exercises = getExercises();
    exercises = exercises.filter(e => e.id !== id);
    saveExercises(exercises);
    loadExercises();
    showToast('Exercise deleted.', 'info');
}


/* ============================================================
   USER MANAGEMENT (Admin)
   ============================================================ */

function loadUsers() {
    const users = getUsers();
    const tbody = document.getElementById('users-table-body');

    // Update stats
    document.getElementById('stat-total-users').textContent = users.length;
    document.getElementById('stat-total-students').textContent = users.filter(u => u.role === 'student').length;
    document.getElementById('stat-total-instructors').textContent = users.filter(u => u.role === 'instructor').length;
    document.getElementById('stat-total-admins').textContent = users.filter(u => u.role === 'admin').length;

    const badgeClasses = { student: 'badge-student', instructor: 'badge-instructor', admin: 'badge-admin' };
    const roleLabels = { student: 'Student', instructor: 'Instructor', admin: 'Admin' };

    tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="avatar-sm">${u.fullName.charAt(0)}</div>
          <div>
            <div style="font-weight:600;color:var(--text-primary)">${u.fullName}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">@${u.username}</div>
          </div>
        </div>
      </td>
      <td>${u.email}</td>
      <td><span class="badge ${badgeClasses[u.role]}">${roleLabels[u.role]}</span></td>
      <td><span class="badge ${u.status === 'active' ? 'badge-active' : 'badge-inactive'}">${u.status}</span></td>
      <td>
        <div style="display:flex;gap:0.5rem">
          <button class="btn btn-ghost btn-sm" onclick="editUser('${u.id}')">✏️</button>
          <button class="btn btn-ghost btn-sm" onclick="deleteUser('${u.id}')" ${u.id === currentUser?.id ? 'disabled title="Cannot delete yourself"' : ''}>🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openUserModal(id = null) {
    editingUserId = id;
    const modal = document.getElementById('user-modal');
    const title = document.getElementById('user-modal-title');

    if (id) {
        const users = getUsers();
        const user = users.find(u => u.id === id);
        if (user) {
            title.textContent = 'Edit User';
            document.getElementById('user-fullname').value = user.fullName;
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-password').value = user.password;
            document.getElementById('user-role-select').value = user.role;
        }
    } else {
        title.textContent = 'Add New User';
        document.getElementById('user-fullname').value = '';
        document.getElementById('user-username').value = '';
        document.getElementById('user-email').value = '';
        document.getElementById('user-password').value = '';
        document.getElementById('user-role-select').value = 'student';
    }

    modal.classList.remove('hidden');
}

function closeUserModal() {
    document.getElementById('user-modal').classList.add('hidden');
    editingUserId = null;
}

function saveUser() {
    const fullName = document.getElementById('user-fullname').value.trim();
    const username = document.getElementById('user-username').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const password = document.getElementById('user-password').value.trim();
    const role = document.getElementById('user-role-select').value;

    if (!fullName || !username || !email || !password) {
        showToast('Please fill in all fields.', 'error');
        return;
    }

    const users = getUsers();

    // Check for duplicate username (excluding current user if editing)
    const dup = users.find(u => u.username === username && u.id !== editingUserId);
    if (dup) {
        showToast('Username already exists!', 'error');
        return;
    }

    if (editingUserId) {
        const idx = users.findIndex(u => u.id === editingUserId);
        if (idx >= 0) {
            users[idx] = { ...users[idx], fullName, username, email, password, role };
        }
        showToast('User updated successfully!', 'success');
    } else {
        users.push({
            id: 'u' + Date.now(),
            fullName,
            username,
            email,
            password,
            role,
            status: 'active'
        });
        showToast('User created successfully!', 'success');
    }

    saveUsers(users);
    closeUserModal();
    loadUsers();
}

function editUser(id) {
    openUserModal(id);
}

function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    if (id === currentUser?.id) {
        showToast('You cannot delete your own account!', 'error');
        return;
    }
    let users = getUsers();
    users = users.filter(u => u.id !== id);
    saveUsers(users);
    loadUsers();
    showToast('User deleted.', 'info');
}


/* ============================================================
   ANALYTICS (Instructor)
   ============================================================ */

function loadAnalytics() {
    renderSubmissionsChart();
    renderErrorsChart();
    renderActivityTable();
}

function renderSubmissionsChart() {
    const container = document.getElementById('chart-submissions');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [12, 19, 8, 25, 32, 15, 28];
    const max = Math.max(...values);

    container.innerHTML = values.map((v, i) => {
        const height = (v / max) * 220;
        const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#6366f1', '#8b5cf6'];
        return `<div class="chart-bar" style="height:${height}px;background:${colors[i]}">
      <span class="bar-value">${v}</span>
      <span class="bar-label">${days[i]}</span>
    </div>`;
    }).join('');
}

function renderErrorsChart() {
    const container = document.getElementById('chart-errors');
    const types = ['Syntax', 'Logic', 'Missing END', 'Indent', 'Type', 'Other'];
    const values = [35, 22, 18, 12, 8, 5];
    const max = Math.max(...values);
    const colors = ['#ef4444', '#f59e0b', '#f97316', '#eab308', '#84cc16', '#6b7280'];

    container.innerHTML = values.map((v, i) => {
        const height = (v / max) * 220;
        return `<div class="chart-bar" style="height:${height}px;background:${colors[i]}">
      <span class="bar-value">${v}%</span>
      <span class="bar-label">${types[i]}</span>
    </div>`;
    }).join('');
}

function renderActivityTable() {
    const tbody = document.getElementById('activity-table-body');
    const statusBadges = {
        'Completed': '<span class="badge badge-active">Completed</span>',
        'In Progress': '<span class="badge badge-student">In Progress</span>',
        'Failed': '<span class="badge badge-inactive">Failed</span>'
    };

    tbody.innerHTML = DEFAULT_ACTIVITY.map(a => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="avatar-sm">${a.student.charAt(0)}</div>
          <span style="font-weight:500;color:var(--text-primary)">${a.student}</span>
        </div>
      </td>
      <td>${a.exercise}</td>
      <td>${statusBadges[a.status] || a.status}</td>
      <td style="font-weight:600;color:${a.score === '100%' ? 'var(--success)' : 'var(--text-primary)'}">${a.score}</td>
      <td style="color:var(--text-muted)">${a.time}</td>
    </tr>
  `).join('');
}


/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

function clearEditor() {
    document.getElementById('pseudocode-editor').value = '';
    document.getElementById('python-output').value = '';
    document.getElementById('console-output').textContent = 'Editor cleared. Ready for new pseudocode.';
    document.getElementById('console-output').className = 'output-content';
    document.getElementById('line-count').textContent = '0 lines';
}

function clearOutput() {
    document.getElementById('console-output').textContent = 'Output cleared.';
    document.getElementById('console-output').className = 'output-content';
}

function copyPython() {
    const code = document.getElementById('python-output').value;
    if (!code) {
        showToast('No code to copy.', 'error');
        return;
    }
    copyText(code);
}

function copyTranslateOutput() {
    const code = document.getElementById('translate-output').value;
    if (!code) {
        showToast('No code to copy.', 'error');
        return;
    }
    copyText(code);
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard!', 'success');
    });
}

function downloadPython() {
    const code = document.getElementById('python-output').value;
    if (!code) {
        showToast('No code to download.', 'error');
        return;
    }
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pseudopy_output.py';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Python file downloaded!', 'success');
}

// ── Init on Load ──
document.addEventListener('DOMContentLoaded', init);


/* ============================================================
   MOBILE SIDEBAR (PWA / Responsive)
   ============================================================ */

function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('hidden');
    document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('mobile-open');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
}

// Override navigateTo to auto-close sidebar on mobile
const _originalNavigateTo = navigateTo;
navigateTo = function (pageId) {
    _originalNavigateTo(pageId);
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 1024) {
        closeMobileSidebar();
    }
};

/* ============================================================
   PWA INSTALL PROMPT
   ============================================================ */

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Install prompt available');
});

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((result) => {
            if (result.outcome === 'accepted') {
                showToast('PseudoPy installed as an app!', 'success');
            }
            deferredPrompt = null;
        });
    }
}

// Handle iOS standalone (already installed)
if (window.navigator.standalone === true) {
    document.body.classList.add('ios-standalone');
}

