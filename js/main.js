// Getting All Required Elements
const categoriesBox = document.querySelector('.categories-box');
const infoBox = document.querySelector('.info-box');
const quizBox = document.querySelector('.quiz-box');
const buttonsStartQuiz = document.querySelectorAll('.quiz-footer button');
const exitBtn = document.querySelector('.info-footer .exit');
const continueBtn = document.querySelector('.info-footer .start');
const answerSpan = document.querySelector('.answer span');
const questionTitle = document.querySelector('.question span');
const optionList = document.querySelector('.option-list');
const nextBtn = document.querySelector('.submit-button .next-btn');
const spans = document.querySelector('.spans');
const timeCount = quizBox.querySelector('.time-sec');
const timeLine = quizBox.querySelector('.time-line');
const timeOff = quizBox.querySelector('.time-text');
const resultBox = document.querySelector('.result-box');


let qCount, counter, counterLine;
let currentIndex = 0;
let userScore = 0;
const timeValue = 15;
let widthValue = 0;

// If Start Quiz Button Clicked
buttonsStartQuiz.forEach((btn) => {
    btn.addEventListener('click', () => {
        infoBox.classList.add('activeInfo');
        categoriesBox.classList.add('hide');
        continueBtn.setAttribute('onclick', `continueButton("${btn.dataset.category}")`)
    });
});


exitBtn.onclick = () => {
    infoBox.classList.remove('activeInfo');
    categoriesBox.classList.remove('hide');
}

function continueButton(selectedCategory) {
    quizBox.classList.add('activeQuiz');
    infoBox.classList.remove('activeInfo');
    getQuestions(selectedCategory);
}


function getQuestions(selectedCategory) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText !== "") {
                let questions = JSON.parse(this.responseText);
                qCount = questions.length;
                // Add Question
                addQuestions(questions[currentIndex]);
                getCategoryName(selectedCategory);
                createCircles();
                startTimer(timeValue);
                stratTimerLine(widthValue);
                // If Click On Submit Button

                nextBtn.onclick = function() {
                    if (qCount - 1 > currentIndex) {
                        // Get Right Answer
                        let correctAns = questions[currentIndex].right_anwser;
                        currentIndex++;
                        checkAnswer(correctAns);
                        addQuestions(questions[currentIndex]);
                        HandleCircles();
                        clearInterval(counter);
                        startTimer(timeValue);
                        clearInterval(counterLine);
                        stratTimerLine(widthValue);
                    } else {
                        // Quiz completed
                        showResult(selectedCategory);
                    }
                }
            }
        }
    }
    xhttp.open('GET', `questions/${selectedCategory}.questions.json`);
    xhttp.send();
}


function checkAnswer(correctAns) {
    let answers = document.querySelectorAll('[name="question"]');
    let theChoosenAnswer;

    answers.forEach((answer) => {
        if (answer.checked) {
            theChoosenAnswer = answer.dataset.answer;
        }
    });
    console.log(correctAns);
    console.log(theChoosenAnswer);
    if (correctAns == theChoosenAnswer) {
        userScore++;
    }
}


function getCategoryName(name) {
    let catNameContainer = document.querySelector('.quiz-category div span');
    catNameContainer.innerHTML = name;
    return name;
}

function addQuestions(questions) {
    // Remove Previous Question
    questionTitle.textContent = '';
    optionList.innerHTML = '';
    questionTitle.textContent = questions.question;
    let i = 1;
    while (i <= 4) {
        let mainLabel = document.createElement('label');
        mainLabel.className = 'answer';
        mainLabel.htmlFor = `answer_${i}`;
        let input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'question');
        input.setAttribute('id', `answer_${i}`);
        input.dataset.answer = questions[`answer_${i}`];
        // Make first option checked
        if (i === 1) {
            input.setAttribute('checked', true);
        }
        let span = document.createElement('span');
        let spanText = document.createTextNode(questions[`answer_${i}`]);
        span.appendChild(spanText);
        mainLabel.appendChild(input);
        mainLabel.appendChild(span);
        // Append All Divs To Answers Area
        optionList.appendChild(mainLabel);
        i++;
    }

}

function createCircles() {
    for (let i = 1; i <= qCount; i++) {
        let span = document.createElement('span');
        if (i == 1) {
            span.className = 'current';
        }
        spans.appendChild(span);
    }
}

function HandleCircles() {
    let allSpans = document.querySelectorAll('.spans span');
    let arrayOfSpans = Array.from(allSpans);
    arrayOfSpans.forEach((span, index) => {
        if (index === currentIndex) {
            span.className = 'current';
        }
        if (index < currentIndex) {
            span.className = 'on';
        }
    });
}

function startTimer(time) {
    counter = setInterval(timer, 1000);

    function timer() {
        timeCount.textContent = time < 10 ? `0${time}` : time;
        if (time < 5) {
            timeCount.style.backgroundColor = 'red';
        } else {
            timeCount.style.backgroundColor = 'var(--main-color)';
        }
        time--;
        if (time < 0) {
            timeOff.textContent = 'Time Off';
            clearInterval(counter);
            nextBtn.click();
        }
    }
}

function stratTimerLine(time) {
    counterLine = setInterval(timer, 20);

    function timer() {
        time += 1;
        timeLine.style.width = `${time}px`;
        if (time > 800) {
            clearInterval(counterLine);
        }
    }
}

function showResult(selectedCategory) {
    quizBox.classList.remove('activeQuiz');
    resultBox.classList.add('activeResult');
    const catName = resultBox.querySelector('h3 span');
    catName.textContent = `${selectedCategory}!`;
    calcAccuracy();
}

function calcAccuracy() {
    const progValue = resultBox.querySelector('.prog-value');
    const circularProgress = resultBox.querySelector('.circular-progress');
    const numQuestions = resultBox.querySelectorAll('.prog-accuracy .qCount span');
    numQuestions[0].textContent = userScore;
    numQuestions[1].textContent = qCount;
    let accuracy = (userScore * 100) / qCount;
    progValue.textContent = `${accuracy}%`;
    circularProgress.style.background = `conic-gradient(var(--main-color) ${accuracy * 3.6}deg, #ededed 0deg)`;
}

// TODO:: Check Number of question and calcAccuracy;