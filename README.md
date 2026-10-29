# 🎓 Student Performance Prediction Using Machine Learning

A beginner-friendly college mini-project that predicts a student's expected academic performance using a simple weighted formula inspired by machine learning concepts.

> **⚠️ Important Disclaimer:** This project uses an **illustrative weighted prediction formula**, NOT a trained or scientifically validated machine learning model. It was not trained on real student data and does not claim any particular accuracy. It is purely an educational demonstration.

---

## 📋 Project Overview

This is a **static web application** that runs entirely in the browser. A student enters their academic details and the tool estimates predicted marks out of 100, classifies performance, and provides personalized improvement suggestions.

### Features

- 📊 **Instant Performance Prediction** — enter 6 inputs and get estimated marks
- 🏷️ **Performance Classification** — Excellent / Good / Average / Needs Improvement
- 📈 **Bar Chart** — visual comparison of previous marks vs. predicted marks (Chart.js)
- 💡 **Personalized Suggestions** — actionable tips based on each student's inputs
- 📱 **Responsive Design** — works on desktop, tablet, and mobile
- 🔘 **Sample Data Button** — quickly fill the form with demo values
- ♻️ **Reset Button** — restore default values instantly

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling & responsive layout |
| Vanilla JavaScript | Prediction logic, validation, DOM updates |
| Chart.js (CDN) | Bar chart visualization |

No frameworks, build tools, databases, APIs, or backend servers are required.

---

## 📂 Project Structure

```
student-performance-prediction/
├── index.html      ← Main HTML page
├── style.css       ← Stylesheet
├── script.js       ← Prediction logic & interactivity
├── README.md       ← This file
└── .nojekyll       ← Tells GitHub Pages to skip Jekyll
```

---

## 🧮 Prediction Formula

```
Predicted Marks = (0.35 × Previous Marks)
                + (0.20 × Attendance)
                + (0.20 × Study Score)
                + (0.15 × Assignment Completion)
                + (0.10 × Sleep Score)
```

Where:
- **Study Score** = min(100, (Study Hours / 8) × 100)
- **Sleep Score** = min(100, (Sleep Hours / 8) × 100)

The result is rounded and clamped to 0–100.

**Extracurricular hours** are used to generate contextual suggestions and do not directly reduce the predicted score.

---

## 🚀 How to Run Locally

1. Download or clone this project folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge).
3. That's it — no server or installation needed!

---

## 🌐 Deploy on GitHub Pages

1. Create a new repository on GitHub (e.g., `student-performance-prediction`).
2. Upload all project files (`index.html`, `style.css`, `script.js`, `README.md`, `.nojekyll`) to the repository root.
3. Go to **Settings → Pages**.
4. Under **Source**, select **Deploy from a branch**.
5. Select the **main** branch and **/ (root)** folder, then click **Save**.
6. Wait 1–2 minutes. Your site will be live at:

```
https://YOUR-USERNAME.github.io/student-performance-prediction/
```

---

## 🎤 Presenting to Faculty

> "This project demonstrates how a weighted prediction formula — inspired by supervised machine learning regression — can estimate student academic performance. The user enters six factors: attendance, study hours, previous marks, assignment completion, sleep hours, and extracurricular activities. The system calculates a predicted score, classifies the result, and provides personalized improvement tips. It's built entirely with HTML, CSS, and JavaScript, runs in the browser, and can be deployed on GitHub Pages without any backend."

---

## ❓ Viva Questions & Answers

### Q1. What type of machine learning concept does this project demonstrate?
**A:** It demonstrates a **weighted linear regression concept**. Each input factor is multiplied by a weight that represents its assumed importance, and the weighted sum produces the prediction. In a real ML system, these weights would be learned from data through training.

### Q2. Why did you choose these particular weights?
**A:** The weights are **illustrative estimates** based on common academic intuition — past marks are the strongest predictor (35%), while attendance and study effort share 20% each, assignments contribute 15%, and sleep contributes 10%. In a real project, these weights would be determined by training on actual student data.

### Q3. How does the system classify performance?
**A:** Based on the predicted marks:
- 85–100 → Excellent
- 70–84 → Good
- 50–69 → Average
- Below 50 → Needs Improvement

### Q4. Why doesn't the extracurricular hours input affect the predicted score?
**A:** We intentionally chose not to penalize extracurricular activities in the score because they have positive developmental benefits. Instead, if a student spends more than 4 hours daily on extracurriculars, the system suggests balancing time during exam periods.

### Q5. Can this project be improved with real machine learning?
**A:** Yes. We could collect real student data, train a regression model (e.g., Linear Regression, Random Forest) using Python's scikit-learn, export the trained weights, and use them in the JavaScript prediction function. We could also add more features like socioeconomic background, course difficulty, and teacher quality.

---

## 📄 License

This project is created for educational purposes. Feel free to use, modify, and share it.
