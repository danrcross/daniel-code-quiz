// declare global variables for HTML elements and DOM manipulation
var counter = document.getElementById("time-counter");
var mainpage = document.getElementById("main-page");
var beginQButton = document.getElementById("begin");
var nextQButton = document.getElementById("next");
var startquiz = document.getElementById("question-page");
var question = document.getElementById("quiz-question");
var li1El = document.getElementById("item1");
var li2El = document.getElementById("item2");
var li3El = document.getElementById("item3");
var li4El = document.getElementById("item4");
var finalscore = document.getElementById("finalscore");
var qResponseList = document.getElementById("response-items");
var feedback = document.getElementById("feedback");
var inCorrect = document.getElementById("in-correct");
var userInit = document.getElementById("initials");
var saveScoreButton = document.getElementById("savescore");
var scoreList = document.getElementById("scorelist");
var viewScoresButton = document.getElementById("score-link");
var scorePage = document.getElementById("score-page");
var scoreSection = document.getElementById("score");
var clearScoresButton = document.getElementById("clear-scores");
var scoreForm = document.getElementById("scoreform");

// create array of elements on question page (below)
var qSet = [question, li1El, li2El, li3El, li4El];

// defaults on load
var questionNum = 0;
var attemptScore = 0;
var timeleft = 60;

// declare variable for array to hold data from local storage
var highscores = [];

// 2 functions to get and set scores via localStorage
function getScores() {
    return JSON.parse(localStorage.getItem("scores"));
};

function setScores() {
    return localStorage.setItem("scores", JSON.stringify(highscores));
}
;
// "page opened" script: will refresh the high score list (pulled from local storage) and set the timer to 60, and display.
createHighScoreList()
resetTimer()

// create function that will set the "View High Scores" button to display "Back to Home" when pressed
function setToBack() {
    viewScoresButton.dataset.toggle = "back";
    viewScoresButton.innerHTML = "Back to Home";
};

// create function that will set the "Back to Home" button to display "View High Scores" when pressed
function setToView() {
    viewScoresButton.dataset.toggle = "view";
    viewScoresButton.innerHTML = "View High Scores";
};

// create function to reset the timer
function resetTimer() {
    timeleft = 60;
    counter.textContent = "Time: " + timeleft;
};

// create function to display the score list page: set score page to flex display, main page to no display
function displayScorePage() {
    scorePage.setAttribute("style", "display:flex");
    mainpage.setAttribute("style", "display:none");
};

// create function to display the main page: set main page to flex display, score page to no display, scoreSection to no display
function displayMainPage() {
    mainpage.setAttribute("style", "display:flex");
    scorePage.setAttribute("style", "display:none");
    scoreSection.setAttribute("style", "display:none");
}

// function will create a high score list using the data in local storage
function createHighScoreList() {
    // will set this variable's value to that of the data in local storage, but if that is undefined/empty, will set to an empty array
    var pullScores = (getScores()) || [];
    // clears whatever elements might be listed currently in the score list
    scoreList.innerHTML = "";
    // checks if there are any items in the array;
    if (pullScores.length > 0) {
        // if yes, 'highscores' array takes on what was pulled into 'pullScores';
        highscores = pullScores;

        // sorts these data from highest score to lowest score (descending order). 
        // If the second value is larger than the first, the returned difference will be a positive result, 
        // indicating that the second value should be listed before the first. 
        // Conversely, if the second value is smaller than the first, the result will be negative, 
        // indicating that the first value should be listed before the second.
        // Lastly, if they are equal, the difference will be 0. They will be listed in the order in which they appear in the original array.
        highscores.sort(function (firstHighscore, secondHighscore) {
            return secondHighscore.userscore - firstHighscore.userscore;
        });

        // creates a new ordered/numbered list item, for each item in array.
        for (var i = 0; i < highscores.length; i++) {
            var newLi = document.createElement('li');
            newLi.textContent = highscores[i].init + ": " + highscores[i].userscore;
            scoreList.appendChild(newLi);
        };

        // if there are no items in the array, a list item is created to indicate "Nothing to display!" Attributes are set to center this list item on the page.
    } else {
        var newLi = document.createElement('li')
        newLi.textContent = "Nothing to display!"
        scoreList.appendChild(newLi)
        scoreList.setAttribute("style", "padding-left:0")
        newLi.setAttribute("style", "display:flex; font-style:italic; list-style:none; text-indent:0")
    }
    return
}

// add event listener (on click) to the viewScoresButton element.
viewScoresButton.addEventListener("click", function () {
    // if statement checks the status of the HTML attribute "data-toggle". If the button is set to its "View High Scores" function, the first snippet will execute.
    // otherwise, the second will.
    if (viewScoresButton.dataset.toggle === "view") {
        // executes createHighScoreList function; refreshes score list
        createHighScoreList();
        // changes function of button to "Back to Home"
        setToBack();
        // displays the score list page
        displayScorePage();
    } else {
        // changes function of button to "View High Scores"
        setToView();
        // displays the main page
        displayMainPage();
    };
});

// create function to clear/reset the high score list
function clearHighScores() {
    // if pressed, if statement double-checks with user to make sure user really wishes to clear the high score list.
    // if user presses "OK", if block will execute
    if (window.confirm("Are you sure you would like to clear the high scores?")) {
        // sets highscores array to empty
        highscores = [];
        // takes this empty array and sets it into local storage, replacing whatever might have been there before
        setScores();
        // refreshes the high score list
        createHighScoreList();
        // displays the high score page
        displayScorePage();
        // if user presses "cancel" in response to window.confirm dialog box, end this function
    } else {
        return;
    };
};

// add event listener to the clearScoresButton. will execute the clearHighScores function when clicked.
clearScoresButton.addEventListener("click", clearHighScores);

// add event listener to the "Begin Quiz" button; will execute the enclosed function
beginQButton.addEventListener("click", function () {
    // reset attempt score
    attemptScore = 0;
    // reset question number count
    questionNum = 0;
    // set question-page status attribute to "active"
    startquiz.dataset.status = "active";
    // these two lines remove main page from view, and displays the quiz question elements
    mainpage.setAttribute("style", "display:none");
    startquiz.setAttribute("style", "display:flex");
    // change state of "View High Scores"  button
    setToBack();
    // begin the timer countdown function
    beginCountdown();
    // sets the first set of questions and answers to display on page
    // iterating through each HTML element of the qSet array one-by-one, the content of each element selected therein will be filled with data stored within the custom attributes called "data-q1"
    for (i = 0; i < qSet.length; i++) {
        qSet[i].innerHTML = qSet[i].dataset.q1
    };
});

// create function to begin countdown
function beginCountdown() {
    // interval called 'countdown' will execute the enclosed anonymous function every second (1000ms).
    var countdown = setInterval(function () {
        // decrements time by 1 each time function is executed
        timeleft--;
        // displays new time value
        counter.textContent = "Time: " + timeleft;
        // if the time left is equal to 0, or less in the case that the quiz is ended with an incorrect response and the time value exceeds zero in the negative;
        // OR if the question limit is reached, i.e. the question-page status attribute is toggled to "inactive":
        if ((timeleft <= 0) || (startquiz.dataset.status === "inactive")) {
            // clear the interval assigned to 'countdown'
            clearInterval(countdown);
            // add timeleft value to final score
            attemptScore += timeleft;
            // remove quiz questions from view
            startquiz.setAttribute("style", "display:none");
            // remove feedback from view
            feedback.setAttribute("style", "display:none");
            // remove scoreSection from view
            scoreSection.setAttribute("style", "display:flex");
            // set text content of final score to "Your score: " followed by user's score
            finalscore.textContent = "Your score: " + attemptScore;
            // refresh the high score list
            createHighScoreList();
            // display the score page below the user's score/feedback/submission form
            displayScorePage();
            // reset the timer to 60
            resetTimer();
        }
        // this condition would follow from the "Back to Home" button being pressed during the quiz. 
        if (viewScoresButton.dataset.toggle === "view") {
            // remove the feedback from view
            feedback.setAttribute("style", "display:none");
            // remove quiz from view
            startquiz.setAttribute("style", "display:none");
            // stop the countdown
            clearInterval(countdown);
            // reset the timer
            resetTimer();
        }
    }, 1000);
};

// this is what happens when a response to a question is given by user
function nextQuestion() {
    // a variable is set to later hold an array of the various sets of HTML element attributes that correspond to quiz questions.
    var qAttr;
    // if the question number is less than 5, or the time left is greater than 0, then the quiz is still active.
    // if the quiz is still active, we want this iteration to play out.
    if (questionNum < 5 || timeleft > 0) {
        // (this one is pretty abstract...)
        // this for-loop will set the value of qAttr to: this array of the various 'qSet' of HTML element attributes that correspond to quiz questions.
        // each qSet is given a variable 'i' as its index, so each iteration will choose a new item in this array.
        // the content of each element in the qSet array will be set according to the current question number.
        // for example, if we are on questionNum 2, the index [2] would correspond to the attribute 'data-q3', or qSet[i].dataset.q3 in the qAttr array.
        // the line after would then fill in the content of each element with its corresponding dataset.q3 contents.
        for (i = 0; i < qSet.length; i++) {
            qAttr = [qSet[i].dataset.q1, qSet[i].dataset.q2, qSet[i].dataset.q3, qSet[i].dataset.q4, qSet[i].dataset.q5];
            qSet[i].innerHTML = qAttr[questionNum]
        };
        // this condition is met if the quiz is no longer active
    } else {
        // function ended
        return;
    }
}

// add event listener to the ordered list of responses for each quiz question
qResponseList.addEventListener("click", function (event) {
    // set this variable 'element' to the target of the 'click' event, i.e. whatever the user clicks on
    var element = event.target;
    // create an array data, containing a list of the correct answers to each question
    var answerArray = [question.dataset.q1a, question.dataset.q2a, question.dataset.q3a, question.dataset.q4a, question.dataset.q5a];
    // create a variable for the current answer of the currently-displayed question
    var answer = answerArray[questionNum];
    // will execute if the condition if user responds correctly: the response clicked is equivalent to the correct answer 
    if (element.textContent === answer) {
        // set background color of feedback to custom green (green indicates good/correct)
        inCorrect.setAttribute("style", "background-color:var(--gogreen");
        // displays text "Correct!", stored in the "data-correct" attribute of HTML element, followed by "+5 points!"
        inCorrect.innerHTML = inCorrect.dataset.correct + "  +5 points!";
        // adds 5 points to user's running score
        attemptScore += 5;
    // condition met if user does not respond correctly: the response clicked is not equivalent to the correct answer
    } else {
        // set background color to red (indicates incorrect/bad)
        inCorrect.setAttribute("style", "background-color:var(--red)");
        // displays text "Incorrect!", stored in the attribute "data-incorrect" of the HTML element, followed by "-5 points!"
        inCorrect.innerHTML = inCorrect.dataset.incorrect + "  -5 seconds!";
        // subtracts 5 seconds from user's running quiz timer
        timeleft -= 5;
    }
    // checks if user is responding to last question. if not (questionNum<4),
    if (questionNum < 4) {
        // question number goes up by 1
        questionNum++;
        // feedback is displayed
        feedback.setAttribute("style", "display:flex");
        // nextQuestion function is executed, loads next question
        nextQuestion();
    // condition is met if user has responded to last question. (questionNum would be === 4, so above condition would not be met)
    } else {
        // set the quiz status to inactive, as last question was answered
        startquiz.dataset.status = "inactive";
        // remove quiz from view
        startquiz.setAttribute("style", "display:none");
        // display feedback. will display momentarily, until aborted by ending of countdown function.
        feedback.setAttribute("style", "display:flex");
        return;
    };
})

// add event listener to the save score button; will be executed when clicked.
saveScoreButton.addEventListener("click", function (event) {
    // prevent default browser action of refresh when form is submitted.
    event.preventDefault();
    // set variable to hold two key-value pairs: one for the user's final score, one for the users initials (which are input and submitted)
    var scoreInit = {
        userscore: attemptScore,
        init: initials.value
    };
    // add this key-value pair to the array "highscores"
    highscores.push(scoreInit);
    // save the "highscores" in local storage, stringified in JSON format containing the newly added data
    setScores();
    // refresh high score list
    createHighScoreList();
    // display new high score list
    displayScorePage();
    // clear the initial input field
    userInit.value = "";
    // reset attempt score for good measure
    attemptScore = 0;
    // remove the score/initial form from view so it cannot be resubmitted or accessed.
    scoreForm.setAttribute("style", "display:none");
    return;
});