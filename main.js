// operation definitions

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
    if (operator == '+') return roundtoXdecimals(add(a,b), 8);
    if (operator == '-') return roundtoXdecimals(subtract(a,b), 8);
    if (operator == '*') return roundtoXdecimals(multiply(a,b), 8);
    if (operator == '/') return roundtoXdecimals(divide(a,b), 8);
}

function roundtoXdecimals(n, places) {
    return (Math.round(n * 10**places) / 10**places);
}

function checkIfOverflow(n) {
    if (String(n).length > 12) return 'overflow';
    else return n;
}


// cuts off unneeded leading numbers caused by floating-point estimation
function processPercentageDefault(percentage) {
    let firstNaturalNumber = false;
    let newPercentage = '';
    let cutoffIndex = null;

    for (let i = 0; i < percentage.length; i++) {
        let c = percentage.charAt(i);
        // check if iteration reached first natural number in order to signal when to cutoff leading numbers
        if (c > 0 && cutoffIndex == null) {
            let count = 0;
            for (char of percentage.slice(i)) {
                if (char == 9) {
                    count++;
                    if (count >=7) {
                        firstNaturalNumber = true;
                        cutoffIndex = i;
                        break;
                    }
                } else count = 0;
            }
            firstNaturalNumber = true;
        }

        // cuts off leading zeros or leading 9s, depending if there is a cutoffIndex that is not null
        if (firstNaturalNumber) {
            if (c == 0) {
                // cuts off unneeded decimal
                newPercentage = (newPercentage.length == 2)? newPercentage.slice(0,1) : newPercentage;
                
                return newPercentage;
            }
            else if (cutoffIndex != null) {
                    newPercentage += c;    
                    let cutoffChar = newPercentage.charAt(cutoffIndex);
                    let incrementedCutOffChar = String(Number(cutoffChar) + 1);
                    newPercentage = newPercentage.replace(cutoffChar, incrementedCutOffChar);
                    return newPercentage;
                }
        }
        newPercentage += c;
    }
    // cuts off unneeded decimal
    newPercentage = (newPercentage.length == 2)? newPercentage.slice(0,1) : newPercentage;
    
    return newPercentage;
}

function processPercentageWithE(percentage) {
    const arr = percentage.split('e');
    let beforeE = processPercentageDefault(arr[0]);
    if (beforeE.length > 9) beforeE = Math.round(beforeE);
    return beforeE + 'E' + arr[1];
}

function clearAll() {
    result.textContent = 0;
    operandA = null;
    operandB = null;
    currentOperator = null;
    resultSignal = false;
    isDecimal = false;
    operatorDisplay.textContent = '';
}

// selectors

const inputs = document.querySelectorAll('.input');
const result = document.querySelector('#result');
const operators = document.querySelectorAll('.operator');
const clear = document.querySelector('#clear');
const enter = document.querySelector('#enter');
const percent = document.querySelector('#percent');
const decimal = document.querySelector('#decimal');
const operatorDisplay = document.querySelector('#operator');
const sign = document.querySelector('#sign');

// global variables

let operandA = null;
let operandB = null;
let currentOperator = null;
let resultSignal = false;
let isDecimal = false;

// DOM manipulation

function display(input) {
    if (result.textContent == '0' || resultSignal == true || result.textContent == '-0') {
        
        result.textContent = '';
        resultSignal = false;
    }
    result.textContent += input.textContent;
}

function initalizeNextIteration(operator) {
    operandB = null;
    currentOperator = operator;
    result.textContent = checkIfOverflow(operandA);
    resultSignal = true;
    operatorDisplay.textContent = currentOperator;
    if (checkIfOverflow(operandA) == 'overflow') {
        result.textContent = 'overflow';
        setTimeout(clearAll, 1000);
    }
}

function oper(operator) {
    operatorDisplay.textContent = operator;
    isDecimal = false;
    if (operandA == null) {
        operandA = result.textContent;
        resultSignal = true;
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
    input.addEventListener('click', () => {
        if (result.textContent.length < 12) {
            if (input.textContent == '.') {
                if (isDecimal == true) return;
                else {
                    display(input);
                    isDecimal = true;
                };
            }
            else display(input);
        }
    });
});

operators.forEach(operator => {
    operator.addEventListener('click', oper.bind(null, operator.textContent))
})

clear.addEventListener('click', clearAll)

enter.addEventListener('click', () => {
    if (currentOperator == null) return; 
    operandB = result.textContent;
    operandA = operate(currentOperator, Number(operandA), Number(operandB));
    initalizeNextIteration(null);
})

percent.addEventListener('click', () => {
    let percentage = String(roundtoXdecimals(result.textContent * (1 / 100), 100));

    if (percentage.includes('e')) {
        percentage = processPercentageWithE(percentage);
        result.textContent = percentage;
    } 
    else {
        percentage = processPercentageDefault(percentage);
        result.textContent = percentage;
    }
})

sign.addEventListener('click', () => {
    if (resultSignal) return;
    if (result.textContent[0] != '-') result.textContent = '-'.concat(result.textContent);
    else result.textContent = result.textContent.replace('-', '');
})

