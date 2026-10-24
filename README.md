# KnowRisk Calculator Demo

A lightweight, modern, and accessible calculator web application designed to perform standard mathematical operations with an intuitive user interface and keyboard support.

> **Project Purpose:** This repository serves as a real-world demonstration and verification project for **KnowRisk** — specifically validating GitHub repository metadata ingestion, commit history timeline analysis, and commit-level change tracking via the GitHub REST API.

---

## Features

- **Core Mathematical Operations:** Addition (`+`), subtraction (`-`), multiplication (`×`), and division (`÷`).
- **Input Validation & Safety:**
  - Prevents duplicate decimal points within a single operand.
  - Graceful division-by-zero protection (displays friendly `"Cannot divide by zero"` notice).
  - Floating-point precision normalization (resolving standard IEEE 754 precision artifacts such as `0.1 + 0.2 = 0.3`).
  - Digit length constraints to prevent UI overflow on mobile displays.
  - Seamless operator switching before entering secondary operands.
- **Dual Display:** Secondary display tracks prior operands and operations while active values remain prominent.
- **Localized Number Formatting:** Thousands separators automatically applied for readability.
- **Responsive Dark Theme UI:** Centered glassmorphic card design optimized for mobile, tablet, and desktop viewports.
- **Physical Keyboard Support:** Direct input via physical number keys, standard numpad, operator keys, Enter (`=`), Escape (`Clear`), and Backspace (`Delete`), complete with interactive button flash feedback.

---

## Keyboard Shortcuts Reference

| Key | Calculator Action |
| :--- | :--- |
| `0` – `9` | Input number |
| `.` | Input decimal point |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication (`×`) |
| `/` | Division (`÷`) |
| `Enter` or `=` | Compute result |
| `Backspace` | Delete last entered digit |
| `Escape` | Clear all (`C`) |
| `%` | Percentage calculation |

---

## Tech Stack

- **HTML5:** Semantic document markup with accessible ARIA labeling.
- **CSS3:** Modern CSS custom properties, Flexbox & Grid layouts, dark theme aesthetics, zero external frameworks.
- **JavaScript (ES6+):** Pure vanilla JavaScript without external libraries or build dependencies.

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

## Running Automated Tests

A lightweight automated test suite is included in `test.js` covering core arithmetic, decimal precision normalization, division-by-zero protection, and input validation without requiring third-party testing dependencies.

To execute the tests using Node.js:

```bash
node test.js
```

All 20 test cases will execute and output a summary report.

---

This repository was specifically constructed with authentic sequential Git commits to facilitate testing KnowRisk's GitHub integration modules, including:
- Repository metadata ingestion (name, description, visibility, default branch).
- Commit tree tracking and chronological timeline verification.
- Code change diff inspection across incremental project milestones.
- Validating genuine commit authorship and timestamp sequencing.
