/* ===================================================
   Student Performance Prediction — JavaScript
   ===================================================
   This file contains:
   1. Form validation
   2. Prediction algorithm (weighted formula)
   3. Performance classification
   4. Personalized suggestions generator
   5. Chart.js bar chart rendering
   6. Reset & sample-data helpers
   =================================================== */

// ──────────────────────────────────────────────
// DOM References
// ──────────────────────────────────────────────
const form         = document.getElementById('predictionForm');
const resetBtn     = document.getElementById('resetBtn');
const sampleBtn    = document.getElementById('sampleBtn');
const resultsCard  = document.getElementById('resultsCard');
const scoreCircle  = document.getElementById('scoreCircle');
const scoreValue   = document.getElementById('scoreValue');
const categoryBadge= document.getElementById('categoryBadge');
const progressBar  = document.getElementById('progressBar');
const suggestionsList = document.getElementById('suggestionsList');

// Chart.js instance (reused on each prediction)
let chartInstance = null;

// ──────────────────────────────────────────────
// Input field configuration for validation
// ──────────────────────────────────────────────
const FIELDS = [
  { id: 'attendance',  label: 'Attendance',            min: 0, max: 100 },
  { id: 'studyHours',  label: 'Study Hours',           min: 0, max: 16  },
  { id: 'prevMarks',   label: 'Previous Exam Marks',   min: 0, max: 100 },
  { id: 'assignment',  label: 'Assignment Completion',  min: 0, max: 100 },
  { id: 'sleepHours',  label: 'Sleep Hours',           min: 0, max: 16  },
  { id: 'extraHours',  label: 'Extracurricular Hours', min: 0, max: 12  },
];

// Default values shown when page loads or after reset
const DEFAULTS = { attendance: 75, studyHours: 4, prevMarks: 65, assignment: 70, sleepHours: 7, extraHours: 2 };

// Sample "demo student" values
const SAMPLE  = { attendance: 88, studyHours: 5, prevMarks: 72, assignment: 85, sleepHours: 7.5, extraHours: 1.5 };


// ──────────────────────────────────────────────
// 1.  FORM VALIDATION
// ──────────────────────────────────────────────

/**
 * Validates a single input field.
 * @param {Object} fieldCfg - Config object from FIELDS array.
 * @returns {boolean} true if valid.
 */
function validateField(fieldCfg) {
  const input  = document.getElementById(fieldCfg.id);
  const errEl  = document.getElementById('err-' + fieldCfg.id);
  const value  = input.value.trim();

  // Clear previous error
  errEl.textContent = '';
  input.classList.remove('input-error');

  // Empty check
  if (value === '') {
    errEl.textContent = `${fieldCfg.label} is required.`;
    input.classList.add('input-error');
    return false;
  }

  const num = parseFloat(value);

  // Numeric check
  if (isNaN(num)) {
    errEl.textContent = `Please enter a valid number.`;
    input.classList.add('input-error');
    return false;
  }

  // Range check
  if (num < fieldCfg.min || num > fieldCfg.max) {
    errEl.textContent = `Value must be between ${fieldCfg.min} and ${fieldCfg.max}.`;
    input.classList.add('input-error');
    return false;
  }

  return true;
}

/**
 * Validates all fields. Returns true only if every field passes.
 */
function validateAll() {
  let allValid = true;
  FIELDS.forEach(f => {
    if (!validateField(f)) allValid = false;
  });
  return allValid;
}


// ──────────────────────────────────────────────
// 2.  PREDICTION ALGORITHM
// ──────────────────────────────────────────────

/**
 * Calculates predicted marks using a weighted formula.
 *
 * Formula:
 *   Predicted = (0.35 × prevMarks)
 *             + (0.20 × attendance)
 *             + (0.20 × studyScore)
 *             + (0.15 × assignment)
 *             + (0.10 × sleepScore)
 *
 * Where:
 *   studyScore = min(100, (studyHours / 8) × 100)
 *   sleepScore = min(100, (sleepHours / 8) × 100)
 *
 * IMPORTANT: This is an illustrative weighted formula, NOT a trained
 * or scientifically validated machine learning model.
 *
 * @param {Object} inputs - { attendance, studyHours, prevMarks, assignment, sleepHours }
 * @returns {number} Predicted marks clamped between 0 and 100, rounded.
 */
function predictPerformance(inputs) {
  const { attendance, studyHours, prevMarks, assignment, sleepHours } = inputs;

  // Convert study and sleep hours into 0–100 scores
  const studyScore = Math.min(100, (studyHours / 8) * 100);
  const sleepScore = Math.min(100, (sleepHours / 8) * 100);

  // Weighted sum
  let predicted = (0.35 * prevMarks)
                + (0.20 * attendance)
                + (0.20 * studyScore)
                + (0.15 * assignment)
                + (0.10 * sleepScore);

  // Clamp to 0–100 and round
  predicted = Math.round(Math.max(0, Math.min(100, predicted)));

  return predicted;
}


// ──────────────────────────────────────────────
// 3.  PERFORMANCE CLASSIFICATION
// ──────────────────────────────────────────────

/**
 * Returns the performance category and its CSS class.
 * @param {number} marks - Predicted marks (0–100).
 * @returns {{ label: string, cssClass: string }}
 */
function classifyPerformance(marks) {
  if (marks >= 85) return { label: '🌟 Excellent',          cssClass: 'cat-excellent' };
  if (marks >= 70) return { label: '👍 Good',               cssClass: 'cat-good' };
  if (marks >= 50) return { label: '📊 Average',            cssClass: 'cat-average' };
  return               { label: '⚠️ Needs Improvement',   cssClass: 'cat-needs' };
}


// ──────────────────────────────────────────────
// 4.  SUGGESTIONS GENERATOR
// ──────────────────────────────────────────────

/**
 * Generates up to 3 personalized suggestions based on the student's inputs.
 * @param {Object} inputs - All six input values.
 * @param {number} predicted - The predicted marks.
 * @returns {string[]} Array of suggestion strings.
 */
function generateSuggestions(inputs, predicted) {
  const tips = [];

  // Attendance
  if (inputs.attendance < 75) {
    tips.push('📌 Your attendance is below 75%. Try to attend more classes — regular participation can significantly boost understanding and scores.');
  }

  // Study hours
  if (inputs.studyHours < 3) {
    tips.push('📖 You are studying less than 3 hours daily. Gradually increase to 4–6 hours with focused study sessions using techniques like the Pomodoro method.');
  } else if (inputs.studyHours < 5) {
    tips.push('📖 Aim for 5+ hours of focused study daily. Break sessions into 25-minute blocks with 5-minute breaks for better retention.');
  }

  // Assignment completion
  if (inputs.assignment < 70) {
    tips.push('📝 Complete more of your assignments — they reinforce concepts and often contribute directly to your final grade.');
  }

  // Sleep
  if (inputs.sleepHours < 6) {
    tips.push('😴 You are getting less than 6 hours of sleep. Adequate rest (7–8 hours) improves memory consolidation and exam readiness.');
  }

  // Extracurricular balance
  if (inputs.extraHours > 4) {
    tips.push('⚖️ You spend over 4 hours on extracurricular activities daily. While important, consider balancing them with more study time during exam periods.');
  }

  // Previous marks gap
  if (inputs.prevMarks < 50) {
    tips.push('🎯 Your previous marks are below 50. Focus on revising weak topics, and consider seeking extra help from teachers or peers.');
  }

  // General encouragement if doing well
  if (tips.length === 0) {
    tips.push('🎉 Great job! Your inputs look solid. Keep up the consistent effort and maintain a balanced routine.');
    tips.push('💡 Consider practicing previous years\' question papers to further sharpen your exam skills.');
    tips.push('🤝 Help classmates with difficult topics — teaching others is one of the best ways to deepen your own understanding.');
  }

  // Return at most 3 suggestions
  return tips.slice(0, 3);
}


// ──────────────────────────────────────────────
// 5.  CHART RENDERING (Chart.js)
// ──────────────────────────────────────────────

/**
 * Creates or updates the bar chart comparing previous marks and predicted marks.
 * @param {number} prevMarks - Student's previous exam marks.
 * @param {number} predicted - Predicted marks.
 */
function renderChart(prevMarks, predicted) {
  const ctx = document.getElementById('comparisonChart').getContext('2d');

  // Destroy existing chart to avoid stacking
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Previous Marks', 'Predicted Marks'],
      datasets: [{
        label: 'Marks out of 100',
        data: [prevMarks, predicted],
        backgroundColor: ['#4361ee', '#7209b7'],
        borderColor: ['#3a0ca3', '#560bad'],
        borderWidth: 2,
        borderRadius: 8,
        maxBarThickness: 80,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20 }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.parsed.y + ' / 100';
            }
          }
        }
      }
    }
  });
}


// ──────────────────────────────────────────────
// 6.  UI UPDATE — Show Results
// ──────────────────────────────────────────────

/**
 * Reads form inputs, runs prediction, and updates the results UI.
 */
function showResults() {
  // Gather input values
  const inputs = {
    attendance:  parseFloat(document.getElementById('attendance').value),
    studyHours:  parseFloat(document.getElementById('studyHours').value),
    prevMarks:   parseFloat(document.getElementById('prevMarks').value),
    assignment:  parseFloat(document.getElementById('assignment').value),
    sleepHours:  parseFloat(document.getElementById('sleepHours').value),
    extraHours:  parseFloat(document.getElementById('extraHours').value),
  };

  // Run prediction
  const predicted = predictPerformance(inputs);
  const category  = classifyPerformance(predicted);

  // Update score circle
  scoreValue.textContent = predicted;

  // Update score circle border colour based on category
  const borderColors = {
    'cat-excellent': '#06d6a0',
    'cat-good':      '#4361ee',
    'cat-average':   '#fca311',
    'cat-needs':     '#ef476f',
  };
  scoreCircle.style.borderColor = borderColors[category.cssClass] || '#4361ee';

  // Update category badge
  categoryBadge.textContent = category.label;
  categoryBadge.className = 'category-badge ' + category.cssClass;

  // Update progress bar
  progressBar.style.width = predicted + '%';

  // Generate suggestions
  const suggestions = generateSuggestions(inputs, predicted);
  suggestionsList.innerHTML = '';
  suggestions.forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    suggestionsList.appendChild(li);
  });

  // Render chart
  renderChart(inputs.prevMarks, predicted);

  // Show results card
  resultsCard.style.display = 'block';

  // Smooth scroll to results on mobile
  resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ──────────────────────────────────────────────
// 7.  HELPER — Fill Form
// ──────────────────────────────────────────────

/**
 * Sets form field values from an object.
 * @param {Object} values - Key/value pairs matching input IDs.
 */
function fillForm(values) {
  Object.keys(values).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.value = values[key];
  });

  // Clear any existing validation errors
  FIELDS.forEach(f => {
    document.getElementById('err-' + f.id).textContent = '';
    document.getElementById(f.id).classList.remove('input-error');
  });
}


// ──────────────────────────────────────────────
// 8.  EVENT LISTENERS
// ──────────────────────────────────────────────

// Form submission — predict
form.addEventListener('submit', function (e) {
  e.preventDefault();               // prevent page reload
  if (validateAll()) {
    showResults();
  }
});

// Reset button — restore defaults and hide results
resetBtn.addEventListener('click', function () {
  fillForm(DEFAULTS);
  resultsCard.style.display = 'none';
});

// Sample data button — fill with demo values
sampleBtn.addEventListener('click', function () {
  fillForm(SAMPLE);
});
