const buttonGrid = document.getElementsByClassName("buttonGrid")[0];
buttonGrid.addEventListener("click", (event) => {
    if (event.target.nodeName !== 'BUTTON') {
        return;
    }
    if (event.target.classList.contains("operator")) {
        handleOperator(event.target.innerText);
        return;
    }
    if (event.target.classList.contains("number")) {
        handleNumber(event.target.innerText);
        return;
    }
    if (event.target.className === "AC") {
        clear();
        return;
    };
    if (event.target.className === "backspace") {
        backspace();
        return;
    };
    if (event.target.className === "decimal") {
        floatize();
        return;
    }
    if (event.target.className === "equal") {
        operate();
        return;
    }
});
const display = document.getElementsByClassName("expression")[0];
const historyDisplay = document.getElementsByClassName("history")[0];
let expressionStack = ["0"];
let history = [" "," "];
let justOperated = false;

const roundFactor = 1e10;
const round = (num) => Math.round(num * roundFactor) / roundFactor;

const subtract = (x, y) => parseFloat(x) - parseFloat(y);
const add = (x, y) => parseFloat(x) + parseFloat(y) ;
const multiply = (x, y) => parseFloat(x) * parseFloat(y) ;
const divide = (x, y) => parseFloat(x) / parseFloat(y);
const modulo = (x, y) => parseFloat(x) % parseFloat(y) ;

function operate() {
    let lastNum = expressionStack.slice(-1)[0];
    if (Number.isNaN((parseFloat(lastNum)))) {
        return;
    }
    history.shift();
    history.push(expressionStack.join(" ") + " = ");
    //first pass do all multiplication, division, and modulo
    for (let i = 0; i < expressionStack.length; i++ ){
        if (expressionStack[i] === "*") {
            expressionStack[i - 1] = multiply(expressionStack[i - 1], expressionStack[i + 1]);
            expressionStack.splice(i, 2);
            i--;
        }
        else if (expressionStack[i] == "/") {
            if (expressionStack[i + 1] === "0") { //division by 0
                expressionStack = ["0"];
                display.innerText = "NaN";
                return;
            }
            expressionStack[i - 1] = divide(expressionStack[i - 1], expressionStack[i + 1]);
            expressionStack.splice(i, 2);
            i--;
        }
        else if (expressionStack[i] === "%") {
            expressionStack[i - 1] = modulo(expressionStack[i - 1], expressionStack[i + 1]);
            expressionStack.splice(i, 2);
            i--;
        }
    }
    //second pass do all addition and subtraction
    for (let i = 0; i < expressionStack.length; i++) {
        if (expressionStack[i] === "+") {
            expressionStack[i-1] = add(expressionStack[i-1], expressionStack[i+1]);
            expressionStack.splice(i, 2);
            i--;
        }
        else if (expressionStack[i] == "-") {
            expressionStack[i-1] = subtract(expressionStack[i-1], expressionStack[i+1]);
            expressionStack.splice(i, 2);
            i--;
        }
    }
    //rounds number to 15th decimal
    expressionStack[0] = round(expressionStack[0]);
    history[1] += expressionStack[0];
    updateHistory();
    updateDisplay();
    justOperated = true;
}
function handleNumber(num) {
    let lastNum = expressionStack.slice(-1)[0];
    // check if lastNum is a number or a decimal point
    if (!Number.isNaN((parseFloat(lastNum))) || lastNum === ".") {
        if (expressionStack[0] === "0" || justOperated) {
            expressionStack[0] = num;
            justOperated = false;
        }
        else {
            expressionStack.pop();
            expressionStack.push(lastNum + num);
        }
    }
    else {
        expressionStack.push(num);
    }
    updateDisplay();
}
function handleOperator(op) {
    let lastNum = expressionStack.slice(-1)[0];
    if (!Number.isNaN((parseFloat(lastNum)))) {
        expressionStack.push(op);
    }
    else {
        expressionStack.pop();
        expressionStack.push(op);
    }
    updateDisplay();
}
function clear() {
    expressionStack = ["0"];
    history = ["Hi there", "I'm a calculator"];
    updateDisplay();
    updateHistory();
}
function backspace() {
    let last = expressionStack.pop();
    if (last.length > 1) {
        expressionStack.push(last.slice(0, -1));
    }
    else if (expressionStack.length === 0) {
        expressionStack.push("0");
    }
    updateDisplay();
}
function floatize() {
    let lastNum = expressionStack.slice(-1)[0];
    // check if lastNum is a "number" and doesn't have a decimal pop and push new "number" with .
    if (!Number.isNaN((parseFloat(lastNum))) && !lastNum.includes(".")) {
        lastNum += ".";
        expressionStack.pop();
        expressionStack.push(lastNum);
    }
    //if lastNum is not a "number", push a .
    else {
        expressionStack.push(".");
    }
    updateDisplay();
}
function updateDisplay() {
    let expression = expressionStack.join(" ");
    display.innerText = expression;
}
function updateHistory() {
    historyDisplay.innerText = history.join("\n");
}