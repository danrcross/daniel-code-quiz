//declare variables for HTML elements and DOM manipulation
var counter = document.getElementById("time-counter")
var mainpage = document.getElementById("main-page");
var beginQButton = document.getElementById("begin")
var nextQButton = document.getElementById("next")
var startquiz = document.getElementById("question-page")
var question = document.getElementById("quiz-question")
var li1El = document.getElementById("item1")
var li2El = document.getElementById("item2")
var li3El = document.getElementById("item3")
var li4El = document.getElementById("item4")
var qSet = [question, li1El, li2El, li3El, li4El]
var finalscore = document.getElementById("finalscore")
var qResponseList = document.getElementById("response-items")
var feedback = document.getElementById("feedback")
var inCorrect = document.getElementById("in-correct")
var userInit = document.getElementById("initials")
var saveScoreButton = document.getElementById("savescore")
var scoreList = document.getElementById("scorelist")
var viewScoresButton = document.getElementById("score-link")
var scorePage = document.getElementById("score-page")
var scoreSection = document.getElementById("score")
var clearScoresButton = document.getElementById("clear-scores")
var scoreForm= document.getElementById("scoreform")


//localStorage items

//defaults

var questionNum = 0
var attemptScore = 0
var timeleft = 60

//declare arrays and fill in with local storage
var highscores = [];

//functions to get and set scores via localStorage
function getScores() {
    return JSON.parse(localStorage.getItem("scores"))
}

function setScores() {
    return localStorage.setItem("scores", JSON.stringify(highscores))
}

//need to change this
function createHighScoreList() {
    var pullScores = (getScores()) || []
    scoreList.innerHTML=""
    if (pullScores.length > 0) {
        highscores = pullScores
        highscores.sort(function (firstHighscore, secondHighscore) {
            return secondHighscore.userscore - firstHighscore.userscore
        })
        for (var i = 0; i < highscores.length; i++) {
            var newLi = document.createElement('li')
            newLi.textContent = highscores[i].init + ": " + highscores[i].userscore
            scoreList.appendChild(newLi)
        }
    } else {
        var newLi = document.createElement('li')
        newLi.textContent = "Nothing to display!"
        scoreList.appendChild(newLi)
        scoreList.setAttribute("style", "padding-left:0")
        newLi.setAttribute("style", "display:flex; font-style:italic; list-style:none; text-indent:0")
        console.log("this if is working")
    }
    return
}


//page opened script:
createHighScoreList()
counter.textContent = "Time: " + timeleft;

function setToBack(){
    viewScoresButton.dataset.toggle = "back"
    viewScoresButton.innerHTML = "Back to Home"
    attemptScore=0  
}

function setToView(){
    viewScoresButton.dataset.toggle = "view"
    viewScoresButton.innerHTML = "View High Scores"
    mainpage.setAttribute("style", "display:flex");
    scorePage.setAttribute("style", "display:none")
}

viewScoresButton.addEventListener("click", function () {
    createHighScoreList()
    scoreSection.setAttribute("style", "display:none")
    scoreForm.setAttribute("style", "display:flex")
    if (viewScoresButton.dataset.toggle === "view") {
        setToBack()       
        displayScorePage()
    } else {
        setToView()
    }
})

function displayScorePage() {
    scorePage.setAttribute("style", "display:flex");
    viewScoresButton.setAttribute("style", "display:flex")
    viewScoresButton.dataset.toggle = "back"
    viewScoresButton.innerHTML = "Back to Home"
    mainpage.setAttribute("style", "display:none");
}

function clearHighScores() {

    if (window.confirm("Are you sure you would like to clear the high scores?")) {
        highscores = []
        setScores()
        createHighScoreList()
        displayScorePage()
    } else {
        return
    }
}

clearScoresButton.addEventListener("click", clearHighScores)
//first event: quiz begin is clicked
beginQButton.addEventListener("click", function () {
    mainpage.setAttribute("style", "display:none");
    setToBack()
    startquiz.setAttribute("style", "display:flex");
    beginCountdown();
    questionNum = 0;
    for (i = 0; i < qSet.length; i++) {
        qSet[i].innerHTML = qSet[i].dataset.q1
    }
})

//countdown begins when begin button is pressed
function beginCountdown() {
    var countdown = setInterval(function () {
        counter.textContent = "Time: " + timeleft;
        timeleft--;
        //
        if (timeleft <= 0 || questionNum >= 5) {
            clearInterval(countdown);
            attemptScore += timeleft;
            startquiz.setAttribute("style", "display:none");
            feedback.setAttribute("style", "display:none");
            scoreSection.setAttribute("style", "display:flex");
            finalscore.textContent= "Your score: " + attemptScore
            createHighScoreList()
            displayScorePage()
            timeleft = 60;
            counter.textContent = "Time: " + timeleft;
        }
        if (viewScoresButton.dataset.toggle === "view") {
            feedback.setAttribute("style", "display:none");
            startquiz.setAttribute("style", "display:none");
            clearInterval(countdown)
            attemptScore=0
            timeleft=60
            counter.textContent = "Time: " + timeleft;
        }
    }, 1000)
}
//this is what happens when a response to a question is given by user
function nextQuestion() {
    var qAttr;
    if (questionNum < 5 || timeleft > 0) {
        for (i = 0; i < qSet.length; i++) {
            qAttr = [qSet[i].dataset.q1, qSet[i].dataset.q2, qSet[i].dataset.q3, qSet[i].dataset.q4, qSet[i].dataset.q5];
            qSet[i].innerHTML = qAttr[questionNum]
        };
    } else {
        startquiz.setAttribute("style", "display:none")
        feedback.setAttribute("style", "display:none")
    }
}

qResponseList.addEventListener("click", function (event) {    
    var element = event.target;
    console.log(event.target)
    var answerArray = [question.dataset.q1a, question.dataset.q2a, question.dataset.q3a, question.dataset.q4a, question.dataset.q5a]
    var answer = answerArray[questionNum]
    if (element.textContent === answer) {
        inCorrect.setAttribute("style", "background-color:var(--gogreen")
        inCorrect.innerHTML = inCorrect.dataset.correct + "  +5 points!"
        attemptScore += 5;

    } else {
        inCorrect.setAttribute("style", "background-color:var(--red)")
        inCorrect.innerHTML = inCorrect.dataset.incorrect + "  -5 seconds!"
        timeleft -= 5
    }
    questionNum++;
    feedback.setAttribute("style", "display:flex")
    nextQuestion()
})

//lastly, here I will add an event listener to the save button
saveScoreButton.addEventListener("click", function (event) {
    event.preventDefault();
    var scoreInit = {
        userscore: attemptScore,
        init: initials.value
    }
    console.log(scoreInit)
    highscores.push(scoreInit)
    setScores()
    console.log(getScores())
    createHighScoreList()
    displayScorePage()
    userInit.value = ""
    attemptScore = 0
    scoreForm.setAttribute("style", "display:none")
    return
})




//make an event listener for view high scores element


//want to create distinct functions for "display main page," or "display score page"
