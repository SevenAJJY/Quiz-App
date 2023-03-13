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
const preLoader = document.querySelector('.pre-loader');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = resultBox.querySelector('.buttons-container .try-again');
const checkYourAnswer = resultBox.querySelector('.check-answer');
const checkAnswerBox = document.querySelector('.checkAnswer-box');


const timeValue = 15;
let qCount, counter, counterLine, timeOut;
let cSelected;
let currentIndex = 0;
let userScore = 0;
let widthValue = 0;

window.addEventListener('load', () => {
    setTimeout(() => {
        preLoader.style.display = 'none';
        categoriesBox.classList.add('activeCat');
    }, 3000)
});



// If Start Quiz Button Clicked
buttonsStartQuiz.forEach((btn) => {
    btn.addEventListener('click', () => {
        infoBox.classList.add('activeInfo');
        categoriesBox.classList.add('hide');
        categoriesBox.classList.remove('activeCat');
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
            if (qCount > currentIndex) {
                nextBtn.click();
            }
        }
    }
}

function stratTimerLine(time) {
    const timeLineWidth = quizBox.offsetWidth;
    let timeout;
    if (timeLineWidth == 800) {
        timeout = 20;
    } else if (timeLineWidth == 650) {
        timeout = 24;
    } else if (timeLineWidth == 580) {
        timeout = 27;
    } else if (timeLineWidth == 450) {
        timeout = 35;
    } else if (timeLineWidth == 400) {
        timeout = 40;
    } else {
        timeout = 46;
    }
    console.log(timeout);

    counterLine = setInterval(timer, timeout);

    function timer() {
        time += 1;
        timeLine.style.width = `${time}px`;
        if (time > timeLineWidth) {
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
        circularProgress.style.background = `conic-gradient(var(--main-color) ${sVal * 3.6}deg, #d9d9d9  0deg)`;
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

tryAgainBtn.onclick = () => {
    window.location.reload();
}

/**
 * Style Switcher 
 */


const styleSwitcherToggle = () => {
    const styleSwitcher = document.querySelector('.js-style-switcher');
    const styleSwitcherToggler = document.querySelector('.js-style-switcher-toggler');

    styleSwitcherToggler.addEventListener('click', function() {
        styleSwitcher.classList.toggle('open');
        this.querySelector('i').classList.toggle("fa-times");
        this.querySelector('i').classList.toggle("fa-gear");
    });
}


const themeColor = () => {
    const hueSlider = document.querySelector('.js-hue-slider');
    const html = document.querySelector('html');

    const setHue = (value) => {
        html.style.setProperty('--hue', value);
        document.querySelector('.js-hue').textContent = value;
    }

    hueSlider.addEventListener("input", (e) => {
        setHue(e.target.value);
        window.localStorage.setItem('--HUE', e.target.value);
    });

    const slider = (value) => {
        hueSlider.value = value;
    }

    if (window.localStorage.getItem('--HUE') !== null) {
        setHue(window.localStorage.getItem('--HUE'));
        slider(window.localStorage.getItem('--HUE'));
    } else {
        const hue = getComputedStyle(html).getPropertyValue('--hue');
        setHue(hue);
        slider(hue.split(" ").join(""));
    }
}


const themeLightDark = () => {
    const darkModeCheckbox = document.querySelector('.js-dark-mode');

    const themeMode = () => {
        if (localStorage.getItem('theme-dark') !== "false") {
            document.body.classList.remove('t-dark');
        } else {
            document.body.classList.add('t-dark');
        }
    }

    darkModeCheckbox.addEventListener('click', function() {
        localStorage.setItem('theme-dark', this.checked);
        themeMode();
    });

    if (localStorage.getItem('theme-dark') !== null) {
        themeMode();
    }
    if (document.body.classList.contains('t-dark')) {
        darkModeCheckbox.checked = true;
    }
}

const themeImages = () => {
    const allImages = document.querySelectorAll('.themes img');
    const arrayAllImages = Array.from(allImages);

    arrayAllImages.forEach((img) => {
        img.addEventListener('click', () => {
            arrayAllImages.forEach((img) => {
                img.classList.remove('selected');
            });
            img.classList.add('selected');
            const imgSelected = document.querySelector('.themes .selected');

            localStorage.setItem('t-img', `${imgSelected.dataset.item}`);
            themeImage();

        });
    });

    const themeImage = () => {
        if (localStorage.getItem('t-img') !== null) {
            localStorage.removeItem('--HUE');
            document.body.className = `theme-${localStorage.getItem('t-img')}`;
            console.log(localStorage.getItem('t-img'));
            // console.log(document.querySelector(`[data-item="${localStorage.getItem('t-img')}"]`));
            document.querySelector(`[data-item="${localStorage.getItem('t-img')}"]`).classList.add('selected');
        }
    }

}

themeImages();
styleSwitcherToggle();
themeColor();
themeLightDark();