/**
 * KnowRisk Calculator Demo - Core Logic & Keyboard Integration
 * Enhanced with input validation, precision rounding, and keyboard feedback.
 */

class Calculator {
  constructor(previousOperandElement = null, currentOperandElement = null) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.MAX_DIGITS = 14;
    this.VALID_OPERATORS = ['+', '-', '−', '×', '*', '÷', '/'];
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.isErrorState = false;
  }

  delete() {
    if (this.isErrorState) {
      this.clear();
      return;
    }
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
    if (number == null) return;
    const numberStr = number.toString();
    // Validate single character input: digit or decimal point
    if (!/^[0-9.]$/.test(numberStr)) return;

    if (this.isErrorState) {
      this.clear();
    }
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }

    // Decimal validation: prevent duplicate decimal points
    if (numberStr === '.') {
      if (this.currentOperand.includes('.')) return;
      if (this.currentOperand === '' || this.currentOperand === '0') {
        this.currentOperand = '0.';
        return;
      }
    }

    // Prevent redundant leading zeros
    if (this.currentOperand === '0' && numberStr === '0') {
      return;
    }

    // Prevent number overflow exceeding display bounds
    const cleanLength = this.currentOperand.replace(/[-.]/g, '').length;
    if (cleanLength >= this.MAX_DIGITS) return;

    if (this.currentOperand === '0' && numberStr !== '.') {
      this.currentOperand = numberStr;
    } else {
      this.currentOperand = this.currentOperand.toString() + numberStr;
    }
  }

  chooseOperation(operation) {
    if (this.isErrorState || !operation) return;
    if (!this.VALID_OPERATORS.includes(operation)) return;

    // Normalize trailing decimal if present
    if (this.currentOperand.endsWith('.')) {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }

    // Allow switching operator if user hasn't typed next operand yet
    if (this.shouldResetScreen && this.previousOperand !== '') {
      this.operation = operation;
      return;
    }

    if (this.currentOperand === '') return;

    if (this.previousOperand !== '') {
      this.compute();
      if (this.isErrorState) return;
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
  }

  compute() {
    if (this.isErrorState || !this.operation || this.previousOperand === '') return;

    // Normalize trailing decimal if present
    if (this.currentOperand.endsWith('.')) {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }

    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) {
      this.currentOperand = 'Invalid input';
      this.previousOperand = '';
      this.operation = undefined;
      this.isErrorState = true;
      this.shouldResetScreen = true;
      return;
    }

    let computation;
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
        // Explicit division by zero protection
        if (current === 0) {
          this.currentOperand = 'Cannot divide by zero';
          this.previousOperand = '';
          this.operation = undefined;
          this.isErrorState = true;
          this.shouldResetScreen = true;
          return;
        }
        computation = prev / current;
        break;
      default:
        this.currentOperand = 'Error';
        this.previousOperand = '';
        this.operation = undefined;
        this.isErrorState = true;
        this.shouldResetScreen = true;
        return;
    }

    // Guard against non-finite results (overflow or invalid computation)
    if (!isFinite(computation) || isNaN(computation)) {
      this.currentOperand = 'Overflow error';
      this.previousOperand = '';
      this.operation = undefined;
      this.isErrorState = true;
      this.shouldResetScreen = true;
      return;
    }

    // Correct floating point precision issues (e.g. 0.1 + 0.2 = 0.3)
    computation = this.formatPrecision(computation);

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
  }

  applyPercent() {
    if (this.isErrorState) return;
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    const result = this.formatPrecision(current / 100);
    if (!isFinite(result)) {
      this.currentOperand = 'Overflow error';
      this.isErrorState = true;
      this.shouldResetScreen = true;
      return;
    }
    this.currentOperand = result.toString();
    this.shouldResetScreen = true;
  }

  formatPrecision(num) {
    if (!isFinite(num)) return num;
    // Round to 12 decimal places to avoid IEEE 754 precision artifacts
    return parseFloat(num.toPrecision(12));
  }

  formatDisplayNumber(numberStr) {
    if (this.isErrorState) return numberStr;
    if (!numberStr) return '';

    const stringNumber = numberStr.toString();
    const isNegative = stringNumber.startsWith('-');
    const [integerDigits, decimalDigits] = stringNumber.split('.');
    const parsedInteger = parseFloat(integerDigits);

    let integerDisplay = '';
    if (isNaN(parsedInteger)) {
      integerDisplay = '';
    } else {
      integerDisplay = parsedInteger.toLocaleString('en', { maximumFractionDigits: 0 });
      if (isNegative && !integerDisplay.startsWith('-')) {
        integerDisplay = `-${integerDisplay}`;
      }
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    if (!this.currentOperandElement || !this.previousOperandElement) return;

    if (this.isErrorState) {
      this.currentOperandElement.innerText = this.currentOperand;
      this.currentOperandElement.style.fontSize = '1.35rem';
      this.previousOperandElement.innerText = '';
    } else {
      this.currentOperandElement.style.fontSize = '';
      this.currentOperandElement.innerText = this.formatDisplayNumber(this.currentOperand);
      if (this.operation != null && this.previousOperand !== '') {
        this.previousOperandElement.innerText = `${this.formatDisplayNumber(this.previousOperand)} ${this.operation}`;
      } else {
        this.previousOperandElement.innerText = '';
      }
    }
  }
}

// Visual button flash for keyboard accessibility
function flashButton(selector) {
  if (typeof document === 'undefined') return;
  const btn = document.querySelector(selector);
  if (btn) {
    btn.classList.add('is-pressed');
    setTimeout(() => btn.classList.remove('is-pressed'), 120);
  }
}

// Initialize on DOM ready (in browser environment)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previousOperand');
    const currentOperandElement = document.getElementById('currentOperand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Keypad click handlers
    const keypad = document.querySelector('.keypad-grid');
    if (keypad) {
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
    }

    // Physical Keyboard Support
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (event) => {
        const key = event.key;

        if (!isNaN(key) && key !== ' ') {
          calculator.appendNumber(key);
          calculator.updateDisplay();
          flashButton(`button[data-number="${key}"]`);
        } else if (key === '.') {
          calculator.appendNumber('.');
          calculator.updateDisplay();
          flashButton('button[data-action="decimal"]');
        } else if (key === '+') {
          calculator.chooseOperation('+');
          calculator.updateDisplay();
          flashButton('button[data-action="add"]');
        } else if (key === '-') {
          calculator.chooseOperation('-');
          calculator.updateDisplay();
          flashButton('button[data-action="subtract"]');
        } else if (key === '*') {
          calculator.chooseOperation('×');
          calculator.updateDisplay();
          flashButton('button[data-action="multiply"]');
        } else if (key === '/') {
          event.preventDefault(); // Prevent browser search quick-find
          calculator.chooseOperation('÷');
          calculator.updateDisplay();
          flashButton('button[data-action="divide"]');
        } else if (key === 'Enter' || key === '=') {
          event.preventDefault();
          calculator.compute();
          calculator.updateDisplay();
          flashButton('button[data-action="calculate"]');
        } else if (key === 'Backspace') {
          calculator.delete();
          calculator.updateDisplay();
          flashButton('button[data-action="delete"]');
        } else if (key === 'Escape') {
          calculator.clear();
          calculator.updateDisplay();
          flashButton('button[data-action="clear"]');
        } else if (key === '%') {
          calculator.applyPercent();
          calculator.updateDisplay();
          flashButton('button[data-action="percent"]');
        }
      });
    }
  });
}

// Export for Node.js test environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Calculator;
}
