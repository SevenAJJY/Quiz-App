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
const preLoader = quizBox.querySelector('.pre-loader');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = resultBox.querySelector('.buttons-container .try-again');
const checkYourAnswer = resultBox.querySelector('.check-answer');


let qCount, counter, counterLine, timeOut;
let cSelected;
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
                cSelected = selectedCategory;
                createCircles();
                startTimer(timeValue);
                stratTimerLine(widthValue);
                // If Click On Submit Button
                nextBtn.onclick = function() {
                    if (qCount > currentIndex) {
                        // Get Right Answer
                        let correctAns = questions[currentIndex].right_anwser;
                        currentIndex++;
                        checkAnswer(correctAns);
                        addQuestions(questions[currentIndex], selectedCategory);
                        HandleCircles();
                        clearInterval(counter);
                        startTimer(timeValue);
                        clearInterval(counterLine);
                        stratTimerLine(widthValue);
                    }
                }
            }
        }
    }
    xhttp.open('GET', `questions/${selectedCategory}.questions.json`);
    xhttp.send();
}

tryAgainBtn.onclick = () => {
    window.location.reload();
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
}


function getCategoryName(name) {
    let catNameContainer = document.querySelector('.quiz-category div span');
    catNameContainer.innerHTML = name;
    return true;
}

function loaderButton(selectedCategory) {
    document.querySelector(".loader-btn").onclick = () => {
        nextBtn.innerHTML = "<div class='loader'></div>";
        timeOut = setTimeout(() => {
            // Quiz completed
            showResult(selectedCategory);
        }, 3000);
    }
}

function complatedQuiz(sCategory) {
    if (qCount == currentIndex) {
        optionList.parentElement.remove();
        timeCount.parentElement.remove();
        timeLine.remove();
        nextBtn.innerHTML = 'Show Result';
        nextBtn.classList.add('loader-btn');
        loaderButton(sCategory);
        clearTimeout(timeOut);
    }
}

function addQuestions(questions, selectedCategory) {

    if (questions != undefined) {
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
    // If Quiz Completed
    complatedQuiz(selectedCategory);
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
    const adviceText = resultBox.querySelector('.advice-text p');
    let sVal = 0;
    let eVal, progAcc;

    numQuestions[0].textContent = userScore;
    numQuestions[1].textContent = qCount;
    eVal = (userScore * 100) / qCount;
    adviceText.innerHTML = getAdvice(eVal);

    progAcc = setInterval(progEvent, 40);

    function progEvent() {
        progValue.textContent = `${sVal}%`;
        sVal++;
        circularProgress.style.background = `conic-gradient(var(--main-color) ${sVal * 3.6}deg, #ededed 0deg)`;
        if (sVal > eVal) {
            clearInterval(progAcc);
        }
    }

}

function getAdvice(accuracy) {
    let adv = "";
    if (accuracy < 50) {
        adv = "<strong>Bad!</strong> You must study much harder!";
    } else if (accuracy < 85) {
        adv = "<strong>Almost!</strong> Study a little more and take the test again!";
    } else {
        adv = "<strong>perfect!</strong> You can be proud of yourself!";
    }
    return adv;
}