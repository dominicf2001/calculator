function add(a, b) {
	return a + b;
};

function subtract(a, b) {
	return a - b;
};

function multiply(a, b) {
  return a * b;
};

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {  
    console.log(operator, a, b)
    
    if (operator == '+') return add(a,b);
    if (operator == '-') return subtract(a,b);
    if (operator == '*') return multiply(a,b);
    if (operator == '/') return divide(a,b);
}

const inputs = document.querySelectorAll('.input');
const result = document.querySelector('#result');
const operators = document.querySelectorAll('.operator');
const clear = document.querySelector('#clear');
const enter = document.querySelector('#enter');

let operandA = null;
let operandB = null;
let currentOperator = null;
let resultSignal = false;

function display(input) {
    if (result.textContent == '0' || resultSignal == true) {
        result.textContent = '';
        resultSignal = false;
    }
    result.textContent += input.textContent;
}

function initalizeNextIteration(operator) {
    operandB = null;
    currentOperator = operator;
    result.textContent = operandA;
    resultSignal = true;
}

function oper(operator) {
    if (operandA == null) {
        operandA = result.textContent;
        result.textContent = 0;
        currentOperator = operator;
    }
    else if (currentOperator == null ) {
        initalizeNextIteration(operator);
    }
    else {
        operandB = result.textContent; 
        operandA = operate(currentOperator, Number(operandA), Number(operandB));
        initalizeNextIteration(operator);
    }
}

inputs.forEach(input => {
    input.addEventListener('click', display.bind(null, input));
});

operators.forEach(operator => {
    operator.addEventListener('click', oper.bind(null, operator.textContent))
})

clear.addEventListener('click', () => {
    result.textContent = 0;
    operandA = null;
    operandB = null;
})

enter.addEventListener('click', () => {
    operandB = result.textContent;
    operandA = operate(currentOperator, Number(operandA), Number(operandB));
    initalizeNextIteration(null);
})


