# KnowRisk Calculator Demo

A lightweight, modern calculator web application designed to perform standard mathematical operations with an intuitive user interface and keyboard support.

> **Project Purpose:** This repository serves as a demonstration and testing project for **KnowRisk** — specifically validating GitHub repository metadata retrieval, commit history analysis, and commit-level integrations through the GitHub REST API.

---

## Features

- **Core Mathematical Operations:** Addition (`+`), subtraction (`-`), multiplication (`×`), and division (`÷`).
- **Precision & Edge Case Handling:** Safe division-by-zero protection, accurate floating-point rounding, and prevention of consecutive decimal points or invalid expressions.
- **Dual Display:** Secondary display for tracking prior operands and operators alongside the active number.
- **Responsive Dark Mode UI:** Centered glassmorphic card design optimized across mobile, tablet, and desktop screens.
- **Full Keyboard Support:** Direct input via physical number keys, standard numpad, operator keys, Enter (`=`), Escape (`Clear`), and Backspace (`Delete`).

---

## Tech Stack

- **HTML5:** Semantic document markup.
- **CSS3:** Responsive CSS grid and flexbox layout, custom properties, modern dark theme aesthetics.
- **JavaScript (ES6+):** Pure vanilla JavaScript without external libraries or frameworks.

---

## How to Run Locally

No build tools, bundlers, or package managers are required.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/YogeshLambore/knowrisk-calculator-demo.git
   ```
2. Navigate into the project directory:
   ```bash
   cd knowrisk-calculator-demo
   ```
3. Open `index.html` directly in any modern web browser (Chrome, Firefox, Safari, Edge):
   - **Windows:** Double-click `index.html` or run `start index.html` in PowerShell/CMD.
   - **macOS:** Run `open index.html` in Terminal.
   - **Linux:** Run `xdg-open index.html` in Terminal.
   - Or serve with any static web server (e.g. `npx serve .` or VS Code Live Server).

---

## Integration Context for KnowRisk

This repository was specifically constructed with authentic sequential Git commits to facilitate testing KnowRisk's GitHub integration modules, including:
- Repository metadata ingestion (name, description, visibility, default branch).
- Commit tree tracking and chronological timeline verification.
- Code change diff inspection across incremental project milestones.
