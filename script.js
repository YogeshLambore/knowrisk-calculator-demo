/**
 * KnowRisk Calculator Demo - Core Logic & Keyboard Integration
 */

class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  delete() {
    if (this.shouldResetScreen) {
      this.clear();
      return;
    }
    if (this.currentOperand === '0') return;
    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
      case '−':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          this.currentOperand = 'Error';
          this.previousOperand = '';
          this.operation = undefined;
          this.shouldResetScreen = true;
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
  }

  applyPercent() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    this.currentOperand = (current / 100).toString();
  }

  updateDisplay() {
    this.currentOperandElement.innerText = this.currentOperand;
    if (this.operation != null && this.previousOperand !== '') {
      this.previousOperandElement.innerText = `${this.previousOperand} ${this.operation}`;
    } else {
      this.previousOperandElement.innerText = '';
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const previousOperandElement = document.getElementById('previousOperand');
  const currentOperandElement = document.getElementById('currentOperand');
  const calculator = new Calculator(previousOperandElement, currentOperandElement);

  // Keypad click handlers
  const keypad = document.querySelector('.keypad-grid');
  keypad.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;

    if (target.dataset.number) {
      calculator.appendNumber(target.dataset.number);
      calculator.updateDisplay();
      return;
    }

    if (target.dataset.operator) {
      calculator.chooseOperation(target.dataset.operator);
      calculator.updateDisplay();
      return;
    }

    const action = target.dataset.action;
    switch (action) {
      case 'clear':
        calculator.clear();
        calculator.updateDisplay();
        break;
      case 'delete':
        calculator.delete();
        calculator.updateDisplay();
        break;
      case 'decimal':
        calculator.appendNumber('.');
        calculator.updateDisplay();
        break;
      case 'percent':
        calculator.applyPercent();
        calculator.updateDisplay();
        break;
      case 'calculate':
        calculator.compute();
        calculator.updateDisplay();
        break;
    }
  });

  // Physical Keyboard Support
  window.addEventListener('keydown', (event) => {
    const key = event.key;

    if (!isNaN(key) && key !== ' ') {
      calculator.appendNumber(key);
      calculator.updateDisplay();
    } else if (key === '.') {
      calculator.appendNumber('.');
      calculator.updateDisplay();
    } else if (key === '+' || key === '-') {
      calculator.chooseOperation(key);
      calculator.updateDisplay();
    } else if (key === '*') {
      calculator.chooseOperation('×');
      calculator.updateDisplay();
    } else if (key === '/') {
      event.preventDefault(); // Prevent browser search shortcut
      calculator.chooseOperation('÷');
      calculator.updateDisplay();
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      calculator.compute();
      calculator.updateDisplay();
    } else if (key === 'Backspace') {
      calculator.delete();
      calculator.updateDisplay();
    } else if (key === 'Escape') {
      calculator.clear();
      calculator.updateDisplay();
    } else if (key === '%') {
      calculator.applyPercent();
      calculator.updateDisplay();
    }
  });
});
