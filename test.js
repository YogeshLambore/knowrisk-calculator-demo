/**
 * KnowRisk Calculator Demo - Automated Test Suite
 * Tests core arithmetic, decimal precision, division-by-zero protection,
 * and input validation without requiring third-party testing libraries.
 */

const assert = require('assert');
const Calculator = require('./script.js');

function helperInput(calculator, str) {
  for (const char of str) {
    if (char === '+' || char === '-' || char === '−' || char === '×' || char === '*' || char === '÷' || char === '/') {
      calculator.chooseOperation(char);
    } else if (char === '=') {
      calculator.compute();
    } else {
      calculator.appendNumber(char);
    }
  }
}

let passed = 0;
let total = 0;

function runTest(description, testFn) {
  total++;
  try {
    const calc = new Calculator();
    testFn(calc);
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('Running KnowRisk Calculator Test Suite...\n');

// 1. Core Arithmetic Operations
console.log('Category: Core Arithmetic Operations');
runTest('Addition: adds positive integers correctly (5 + 7 = 12)', (calc) => {
  calc.appendNumber('5');
  calc.chooseOperation('+');
  calc.appendNumber('7');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '12');
  assert.strictEqual(calc.isErrorState, false);
});

runTest('Subtraction: computes difference including negative result (3 - 10 = -7)', (calc) => {
  calc.appendNumber('3');
  calc.chooseOperation('-');
  calc.appendNumber('1');
  calc.appendNumber('0');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '-7');
});

runTest('Multiplication: calculates product accurately (6 × 9 = 54)', (calc) => {
  calc.appendNumber('6');
  calc.chooseOperation('×');
  calc.appendNumber('9');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '54');
});

runTest('Multiplication: handles alternate asterisk operator (8 * 4 = 32)', (calc) => {
  calc.appendNumber('8');
  calc.chooseOperation('*');
  calc.appendNumber('4');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '32');
});

runTest('Division: divides cleanly (48 ÷ 6 = 8)', (calc) => {
  calc.appendNumber('4');
  calc.appendNumber('8');
  calc.chooseOperation('÷');
  calc.appendNumber('6');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '8');
});

runTest('Chained operations: evaluates sequential calculations (5 + 5 + 5 = 15)', (calc) => {
  calc.appendNumber('5');
  calc.chooseOperation('+');
  calc.appendNumber('5');
  calc.chooseOperation('+'); // Triggers intermediate compute to 10
  assert.strictEqual(calc.previousOperand, '10');
  calc.appendNumber('5');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '15');
});

// 2. Decimals and Precision Normalization
console.log('\nCategory: Decimals & Precision Normalization');
runTest('Decimal arithmetic: computes fractional numbers (0.5 + 0.25 = 0.75)', (calc) => {
  calc.appendNumber('.');
  calc.appendNumber('5');
  calc.chooseOperation('+');
  calc.appendNumber('0');
  calc.appendNumber('.');
  calc.appendNumber('2');
  calc.appendNumber('5');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '0.75');
});

runTest('Decimal validation: prevents duplicate decimal points (5..2 -> 5.2)', (calc) => {
  calc.appendNumber('5');
  calc.appendNumber('.');
  calc.appendNumber('.');
  calc.appendNumber('2');
  assert.strictEqual(calc.currentOperand, '5.2');
});

runTest('Floating point normalization: avoids IEEE 754 precision artifacts (0.1 + 0.2 = 0.3)', (calc) => {
  calc.appendNumber('0');
  calc.appendNumber('.');
  calc.appendNumber('1');
  calc.chooseOperation('+');
  calc.appendNumber('0');
  calc.appendNumber('.');
  calc.appendNumber('2');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '0.3');
});

runTest('Percentage: calculates percentage of current operand (50% = 0.5)', (calc) => {
  calc.appendNumber('5');
  calc.appendNumber('0');
  calc.applyPercent();
  assert.strictEqual(calc.currentOperand, '0.5');
});

// 3. Division by Zero Protection
console.log('\nCategory: Division by Zero & Error Recovery');
runTest('Division by zero: displays friendly error notice and flags error state', (calc) => {
  calc.appendNumber('9');
  calc.chooseOperation('÷');
  calc.appendNumber('0');
  calc.compute();
  assert.strictEqual(calc.currentOperand, 'Cannot divide by zero');
  assert.strictEqual(calc.isErrorState, true);
});

runTest('Division by zero recovery: typing a number clears error state and starts fresh', (calc) => {
  calc.appendNumber('9');
  calc.chooseOperation('÷');
  calc.appendNumber('0');
  calc.compute();
  assert.strictEqual(calc.isErrorState, true);
  calc.appendNumber('4');
  assert.strictEqual(calc.currentOperand, '4');
  assert.strictEqual(calc.isErrorState, false);
});

runTest('Division by zero recovery: Clear button resets calculator from error state', (calc) => {
  calc.appendNumber('9');
  calc.chooseOperation('/');
  calc.appendNumber('0');
  calc.compute();
  calc.clear();
  assert.strictEqual(calc.currentOperand, '0');
  assert.strictEqual(calc.isErrorState, false);
});

// 4. Input Validation & Edge Cases
console.log('\nCategory: Input Validation & Edge Cases');
runTest('Input validation: rejects non-numeric and invalid characters', (calc) => {
  calc.appendNumber('x');
  calc.appendNumber('!');
  calc.appendNumber(null);
  assert.strictEqual(calc.currentOperand, '0');
});

runTest('Input validation: rejects unsupported operations', (calc) => {
  calc.appendNumber('7');
  calc.chooseOperation('^');
  assert.strictEqual(calc.operation, undefined);
  assert.strictEqual(calc.previousOperand, '');
});

runTest('Leading zero handling: prevents redundant leading zeros (000 -> 0)', (calc) => {
  calc.appendNumber('0');
  calc.appendNumber('0');
  calc.appendNumber('0');
  assert.strictEqual(calc.currentOperand, '0');
});

runTest('Trailing decimal normalization: strips trailing dot when operator chosen (8. + 2 = 10)', (calc) => {
  calc.appendNumber('8');
  calc.appendNumber('.');
  calc.chooseOperation('+');
  assert.strictEqual(calc.previousOperand, '8');
  calc.appendNumber('2');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '10');
});

runTest('Operator switching: allows changing operator before entering second operand', (calc) => {
  calc.appendNumber('5');
  calc.chooseOperation('+');
  calc.chooseOperation('×');
  assert.strictEqual(calc.operation, '×');
  calc.appendNumber('4');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '20');
});

runTest('Delete action: removes last digit and handles single-digit / negative numbers', (calc) => {
  calc.appendNumber('1');
  calc.appendNumber('2');
  calc.appendNumber('3');
  calc.delete();
  assert.strictEqual(calc.currentOperand, '12');
  calc.delete();
  assert.strictEqual(calc.currentOperand, '1');
  calc.delete();
  assert.strictEqual(calc.currentOperand, '0');
});

runTest('Clear action: resets all state back to initial clean baseline', (calc) => {
  calc.appendNumber('5');
  calc.chooseOperation('+');
  calc.appendNumber('3');
  calc.clear();
  assert.strictEqual(calc.currentOperand, '0');
  assert.strictEqual(calc.previousOperand, '');
  assert.strictEqual(calc.operation, undefined);
  assert.strictEqual(calc.isErrorState, false);
});

console.log(`\nTest Summary: ${passed}/${total} tests passed.\n`);

if (passed !== total) {
  process.exit(1);
}
