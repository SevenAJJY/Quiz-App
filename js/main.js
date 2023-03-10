// Getting All Required Elements
const categoriesBox = document.querySelector('.categories-box');
const infoBox = document.querySelector('.info-box');
const quizBox = document.querySelector('.quiz-box');
const buttonsStartQuiz = document.querySelectorAll('.quiz-footer button');
const exitBtn = document.querySelector('.info-footer .exit');
const continueBtn = document.querySelector('.info-footer .start');
const allRadioButton = document.querySelectorAll('input[name="question"]');
const answerSpan = document.querySelector('.answer span');
const questionTitle = document.querySelector('.question span');
const optionList = document.querySelector('.option-list');
const nextBtn = document.querySelector('.submit-button .next-btn');
const spans = document.querySelector('.spans');

let qCount;
let currentIndex = 0;

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
                nextBtn.onclick = function() {
                    currentIndex++;
                    addQuestions(questions[currentIndex]);
                    HandleCircles();
                }
            }
        }
    }
    xhttp.open('GET', `questions/${selectedCategory}.questions.json`);
    xhttp.send();
}

function getCategoryName(name) {
    let catNameContainer = document.querySelector('.quiz-category div span');
    catNameContainer.innerHTML = name;
}

function addQuestions(questions) {
    if (qCount > currentIndex) {
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
            console.log(span);
            span.className = 'on';
        }
    });
}