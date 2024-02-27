var counter = document.getElementById("time-counter")
var mainpage= document.getElementById("main-page");
var beginQButton = document.getElementById("begin")
var nextQButton = document.getElementById("next")
var startquiz = document.getElementById("question-page")
var question = document.getElementById("quiz-question")
var li1El = document.getElementById("item1")
var li2El = document.getElementById("item2")
var li3El = document.getElementById("item3")
var li4El = document.getElementById("item4")
var qSet = [question, li1El, li2El, li3El, li4El]
var finalscore= document.getElementById("finalscore")
var questionNum= 0
var attemptScore=0

var qResponseList=document.querySelector("#response-items")
var feedback= document.getElementById("feedback")
var inCorrect=document.getElementById("in-correct")


var timeleft=60
function beginCountdown(){
    var countdown = setInterval(function () {
    timeleft--;
    counter.textContent = "Time: " + timeleft;
    if (timeleft===0||questionNum===10) {
        clearInterval(countdown);
        startquiz.setAttribute("style", "display:none");
        feedback.setAttribute("style", "display:none");
        score.setAttribute("style", "display:flex");
        finalscore.innerHTML= "Your score: " + attemptScore 
        timeleft=60;
    }
    
    
}, 100)
}

beginQButton.addEventListener("click", function(){
    mainpage.setAttribute("style", "display:none");
    beginCountdown();
    startquiz.setAttribute("style", "display:flex")
    questionNum=0;
    for (i=0; i<qSet.length; i++) {
        qSet[i].innerHTML=qSet[i].dataset.q1
    }   
})

function nextQuestion () {
    questionNum++;
    var qAttr;
    if (questionNum<10|| timeleft>0){
        for (i=0; i<qSet.length; i++) {  
            qAttr= [qSet[i].dataset.q1, qSet[i].dataset.q2, qSet[i].dataset.q3];     
            qSet[i].innerHTML= qAttr[questionNum]
        };
    } else {
        feedback.setAttribute("style", "display:none")
    }

}

qResponseList.addEventListener ("click", function(event){
    var element= event.target;
    console.log(event.target)
    var answerArray= [question.dataset.q1a, question.dataset.q2a, question.dataset.q3a]
    var answer= answerArray[questionNum]
    if (element.textContent===answer) {        
        inCorrect.innerHTML=inCorrect.dataset.correct
        attemptScore++;
    }else {
        inCorrect.innerHTML=inCorrect.dataset.incorrect + " Correct answer: " + answer;
    }
    feedback.setAttribute("style", "display:flex")
    nextQuestion()
})

