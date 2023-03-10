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
// const timeLine = quizBox.querySelector('.time-line');
const timeOff = quizBox.querySelector('.time-text');

let qCount, counter;
let currentIndex = 0;
let userScore = 0;
const timeValue = 15;

// If Start Quiz Button Clicked
buttonsStartQuiz.forEach((btn) => {
    btn.addEventListener('click', () => {
        infoBox.classList.add('activeInfo');
        categoriesBox.classList.add('hide');
        getQuestions(btn.dataset.category);
    });
});


exitBtn.onclick = () => {
    infoBox.classList.remove('activeInfo');
    categoriesBox.classList.remove('hide');
}

continueBtn.onclick = () => {
    quizBox.classList.add('activeQuiz');
    infoBox.classList.remove('activeInfo');
}


// allRadioButton.forEach((rd) => {
//     rd.addEventListener('click', () => {
//         allRadioButton.forEach((rd) => {
//             rd.nextElementSibling.classList.remove('checked')
//             if (rd.checked) {
//                 rd.nextElementSibling.classList.add('checked');
//             }
//         });
//     });
// });

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
                // If Click On Submit Button

                nextBtn.onclick = function() {
                    // Get Right Answer
                    let correctAns = questions[currentIndex].right_anwser;
                    console.log(correctAns);
                    currentIndex++;
                    checkAnswer(correctAns);
                    addQuestions(questions[currentIndex]);
                    HandleCircles();
                    clearInterval(counter);
                    startTimer(timeValue);
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

    if (correctAns == theChoosenAnswer) {
        userScore++;
    }
    console.log(userScore);
}


function getCategoryName(name) {
    let catNameContainer = document.querySelector('.quiz-category div span');
    catNameContainer.innerHTML = name;
}

function addQuestions(questions) {
    if (qCount > currentIndex) {
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
}

function createCircles() {
    for (let i = 1; i <= qCount; i++) {
        let span = document.createElement('span');
        if (i == 1) {
            span.className = 'on';
        }
        spans.appendChild(span);
    }
}

function HandleCircles() {
    let allSpans = document.querySelectorAll('.spans span');
    let arrayOfSpans = Array.from(allSpans);
    arrayOfSpans.forEach((span, index) => {
        if (index === currentIndex) {
            span.className = 'on';
        }
    });
}

function startTimer(time) {
    counter = setInterval(timer, 1000);

    function timer() {
        timeCount.textContent = time < 10 ? `0${time}` : time;
        time--;
        if (time < 0) {
            timeOff.textContent = 'Time Off';
            clearInterval(counter);
        }
    }
}