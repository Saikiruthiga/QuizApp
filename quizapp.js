const quizQuestion = [
  {
    id: 1,
    question: "What is the capital of Denmark?",
    options: [
      { text: "Berlin", isCorrect: false },
      { text: "Copenhagen", isCorrect: true },
      { text: "Madrid", isCorrect: false },
      { text: "Rome", isCorrect: false },
    ],
    explanation: "Copenhagen is the capital of Denmark.",
  },
  {
    id: 2,
    question: "What is the capital of India?",
    options: [
      { text: "Delhi", isCorrect: true },
      { text: "Tamil Nadu", isCorrect: false },
      { text: "hyderabad", isCorrect: false },
      { text: "Mumbai", isCorrect: false },
    ],
    explanation: "Delhi is the capital of Denmark.",
  },
  {
    id: 3,
    question: "What is the currency used in Denmark?",
    options: [
      { text: "Kroner", isCorrect: true },
      { text: "Pound", isCorrect: false },
      { text: "Dollar", isCorrect: false },
      { text: "Rupees", isCorrect: false },
    ],
    explanation: "Kroner is the currency of Denmark.",
  },
  {
    id: 4,
    question:
      "The quick brown fox jumps over the lazy dog near the riverbank, where the sunlight glistens on the water and the gentle breeze rustles through the tall grass and trees?",
    options: [
      { text: "Kroner", isCorrect: true },
      { text: "Pound", isCorrect: false },
      { text: "Dollar", isCorrect: false },
      { text: "Rupees", isCorrect: false },
    ],
    explanation: "Kroner is the currency of Denmark.",
  },
];
//creating form and styling the form
const form = document.createElement("form");
document.body.appendChild(form);
form.style.alignItems = "center";
form.style.margin = "2%";

//creating div element for question and answers
for (let i = 0; i < quizQuestion.length; i++) {
  if (quizQuestion[i].question.length < 140) {
    const divQuestion = document.createElement("div");
    divQuestion.setAttribute("id", "question - " + quizQuestion[i].id);
    form.appendChild(divQuestion);
    divQuestion.innerText =
      quizQuestion[i].id + " . " + quizQuestion[i].question;

    const divAnswers = document.createElement("div");
    divAnswers.setAttribute("id", "answers");
    divQuestion.appendChild(divAnswers);

    for (let j = 0; j < quizQuestion[i].options.length; j++) {
      const button = document.createElement("button");
      button.setAttribute("class", "btnoptions");
      button.innerText = quizQuestion[i].options[j].text;
      button.isCorrect = quizQuestion[i].options[j].isCorrect;

      divAnswers.appendChild(button);
      button.style.display = "block";
      button.addEventListener("click", uponClicking);
    }

    // creating button for randomize the options
    buttonRandom = document.createElement("button");
    buttonRandom.innerText = "Shuffle";
    divAnswers.appendChild(buttonRandom);
    buttonRandom.style.borderRadius = "40%";
    buttonRandom.addEventListener("click", shuffleOptions);

    //creating p element for explanation
    const explanation = document.createElement("p");
    explanation.setAttribute("class", "explanation");
    explanation.innerText = quizQuestion[i].explanation;
    divAnswers.appendChild(explanation);
    explanation.style.display = "none";
  } else {
    alert(`Question no.${quizQuestion[i].id} exceed 140 characters`);
  }
}

function uponClicking(event) {
  event.preventDefault();
  const buttons = event.target.parentElement.querySelectorAll(".btnoptions");
  const currentQuestion = event.target.closest("div[id^='question']");
  const questionId = currentQuestion.id.split("-")[1];
  const quizItem = quizQuestion.find((q) => q.id == questionId);
  const selectedButton = event.target;

  for (let button of buttons) {
    if (button.isCorrect) {
      button.style.backgroundColor = "MediumSeaGreen";
    } else if (button === selectedButton) {
      button.style.backgroundColor = "IndianRed";
    } else {
      button.style.backgroundColor = "";
    }
    button.removeEventListener("click", uponClicking);
  }
  const explanation = currentQuestion.querySelector(".explanation");
  explanation.innerText = quizItem.explanation;
  explanation.style.display = "block";
}

function shuffleOptions(event) {
  event.preventDefault();
  const buttons = event.target.parentElement.querySelectorAll(".btnoptions");
  const buttonOptions = Array.from(buttons).map((button) => button.innerText); // eg:["berlin","copenhagen","madrid","rome"]
  for (let i = buttonOptions.length - 1; i > 0; i--) {
    //swap method
    const j = Math.floor(Math.random() * (i + 1));
    [buttonOptions[i], buttonOptions[j]] = [buttonOptions[j], buttonOptions[i]];
  }
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].innerText = buttonOptions[i];
  }
}
