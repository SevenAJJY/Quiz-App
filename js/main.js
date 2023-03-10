// Getting All Required Elements
const categoriesBox = document.querySelector('.categories-box');
const infoBox = document.querySelector('.info-box');
const quizBox = document.querySelector('.quiz-box');
const buttonsStartQuiz = document.querySelectorAll('.quiz-footer button');
const exitBtn = document.querySelector('.info-footer .exit');
const continueBtn = document.querySelector('.info-footer .start');
const allRadioButton = document.querySelectorAll('input[type="radio"]');
const answerSpan = document.querySelector('.answer span');

let selectedCategory;

// If Start Quiz Button Clicked
buttonsStartQuiz.forEach((btn) => {
    btn.addEventListener('click', () => {
        infoBox.classList.add('activeInfo');
        categoriesBox.classList.add('hide');
        selectedCategory = btn.dataset.category;
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

allRadioButton.forEach((rd) => {
    rd.addEventListener('click', () => {
        allRadioButton.forEach((rd) => {
            rd.nextElementSibling.classList.remove('checked')
            if (rd.checked) {
                rd.nextElementSibling.classList.add('checked');
            }
        });
    });
});

function getQuestions() {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText !== "") {
                let questions = JSON.parse(this.responseText);
                console.log(questions);
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

// TODO:: create function to get Questions tomorrow