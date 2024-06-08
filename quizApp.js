document.addEventListener("DOMContentLoaded", updateForm);
const form = document.getElementById("form");
const shuffleBtn = form.querySelector("button[type='button']");
const searchBtn = document.getElementById("search-input");
const startBtn = document.getElementById("start");
const questionArray = [];
let id = 0;
let item;
const audio = new Audio("game_music.mp3");
audio.preload = "auto";

function updateForm() {
  startBtn.addEventListener("click", startQuiz);
  form.addEventListener("submit", onClickingSubmit);
  shuffleBtn.addEventListener("click", onClickingShuffle);
  searchBtn.addEventListener("keypress", searchQuestion);
}
const scores = [0, 0];
function addScore(playerBtn, playerIndex, increment) {
  return () => {
    scores[playerIndex] += increment;
    playerBtn.innerText = `${playerBtn.innerText.split(": ")[0]} : ${
      scores[playerIndex]
    }`;
    const numInput = document.getElementById(`num-input-${playerIndex}`);
    numInput.value = scores[playerIndex];
    if (scores[playerIndex] >= 10) {
      audio.play();
      const icons = document.querySelectorAll("i");
      icons.forEach((icon) => icon.classList.add("remove-style"));
    }
  };
}

function startQuiz() {
  const player1 = document.getElementById("player1");
  const player2 = document.getElementById("player2");
  let div = document.getElementById("player-details");
  div.innerHTML = "";

  if (player1.value === "" || player2.value === "") {
    const p = document.createElement("p");
    p.innerText = "Please provide the players name";
    div.appendChild(p);
  } else {
    const players = [player1.value, player2.value];
    const playerButtons = [];

    players.forEach((player, index) => {
      const playerContainer = document.createElement("div");
      div.appendChild(playerContainer);
      playerContainer.className = "player-container";

      const playerBtn = document.createElement("button");
      playerBtn.innerText = `${player} : 0`;
      playerBtn.classList.add(`scorebtn-${index}`);
      playerContainer.appendChild(playerBtn);
      playerButtons.push(playerBtn);

      const correctIcon = document.createElement("i");
      correctIcon.className = `fa fa-check-circle scorebtn-${index}`;
      correctIcon.id = `icon-correct${index}`;
      playerContainer.appendChild(correctIcon);

      const wrongIcon = document.createElement("i");
      wrongIcon.className = `fa fa-times-circle scorebtn-${index}`;
      wrongIcon.id = `icon-wrong${index}`;
      playerContainer.appendChild(wrongIcon);

      const numInput = document.createElement("input");
      numInput.type = "number";
      numInput.id = `num-input-${index}`;
      numInput.value = 0;
      playerContainer.appendChild(numInput);
    });
    playerButtons.forEach((playerBtn, index) => {
      const correctIcon = document.getElementById(`icon-correct${index}`);
      const wrongIcon = document.getElementById(`icon-wrong${index}`);
      correctIcon.addEventListener("click", addScore(playerBtn, index, 1));
      wrongIcon.addEventListener(
        "click",
        addScore(playerButtons[1 - index], 1 - index, 1)
      );
    });
  }
}

function onClickingSubmit(event) {
  event.preventDefault();
  const question = form.querySelector("[type='text']").value.toLowerCase();

  const answerOptions = document.querySelectorAll(
    ".answer-option input[type='text']"
  );
  const radios = document.querySelectorAll(
    ".answer-option input[type = 'radio']"
  );
  if (question.length > 140) {
    alert("your quention length should not exceed 140 characters");
    return;
  }
  const optionsOriginal = Array.from(answerOptions).map((option, index) => ({
    text: option.value,
    isCorrect: radios[index].checked,
  }));
  const options = optionsOriginal.map((option) => option.text.toLowerCase());
  const explanationValue = form.querySelector("input[id='explanation']").value;
  id++;
  if (new Set(options).size !== options.length) {
    alert("please give unique values");
    return;
  }
  if (questionArray.some((item) => item.question === question)) {
    alert("This question already available in our list");
    return;
  } else
    item = {
      id: id,
      question: question,
      options: optionsOriginal,
      explanation: explanationValue,
    };

  questionArray.push(item);
  form.reset();
  displayQuestion(item);
}

function onClickingShuffle(event) {
  event.preventDefault();
  const answerOptions = document.querySelectorAll(".answer-option");
  const options = Array.from(answerOptions);
  const valuesOriginal = options.map(
    (option) => option.querySelector("input[type='text']").value
  );
  const values = valuesOriginal.map((value) => value.toLowerCase());
  const radios = options.map((option) =>
    option.querySelector("input[type='radio']:checked")
  );
  if (values.includes("") || radios.every((radio) => radio === null)) {
    alert("Please fill all the option field and select which one is correct");
    return;
  } else {
    if (new Set(values).size !== values.length) {
      alert("Please give unique option");
      return;
    } else {
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      const container = document.getElementById("answers");
      options.forEach((option) => container.appendChild(option));
    }
  }
}
function displayQuestion(item, append = false) {
  const section = document.getElementById("quiz-questions");
  if (!append) {
    section.innerHTML = "";
  }
  const question = document.createElement("div");
  section.appendChild(question);
  const p = document.createElement("p");
  p.innerText = item.question;
  question.appendChild(p);
  item.options.forEach((option) => {
    const optionBtn = document.createElement("button");
    optionBtn.classList.add("btnList");
    optionBtn.innerText = option.text;
    optionBtn.dataset.correct = option.isCorrect;
    question.appendChild(optionBtn);
    optionBtn.addEventListener("click", (event) =>
      checkAnswer(event, question)
    );
  });
  const solutionBtn = document.createElement("button");
  question.appendChild(solutionBtn);
  solutionBtn.classList.add("solutionbtn");
  solutionBtn.innerText = "Solution";
  solutionBtn.dataset.explanation = item.explanation;
  solutionBtn.addEventListener("click", revealSolution);
  const showbtn = document.querySelector("#show");
  showbtn.addEventListener("click", showAllQuestions);
}
function showAllQuestions() {
  const section = document.getElementById("quiz-questions");
  section.innerHTML = "";
  questionArray.forEach((question) => displayQuestion(question, true));
}

function revealSolution(event) {
  const button = event.target;
  const explanation = button.dataset.explanation;
  const p = document.createElement("p");
  p.innerText = explanation;
  button.parentNode.appendChild(p);
  if (button) {
    button.disabled = true;
  }
}

function checkAnswer(event, question) {
  const btnSelected = event.target;
  const isCorrect = btnSelected.dataset.correct === "true";
  const buttons = question.querySelectorAll("button");
  buttons.forEach((button) => {
    if (button !== btnSelected) {
      button.disabled = true;
    }
  });
  if (isCorrect) {
    btnSelected.classList.add("correct");
  } else {
    btnSelected.classList.add("in-correct");
  }
}
function searchQuestion(event) {
  //console.log(questionArray);
  const string = event.target.value.toLowerCase();
  const filteredQuestion = questionArray.filter((item) => {
    const question = item.question.includes(string);
    const options = item.options.some((item) => item.text.includes(string));
    const explanation = item.explanation.includes(string);
    return question || options || explanation;
  });
  //console.log(filteredQuestion);
  const section = document.getElementById("quiz-questions");
  section.innerHTML = "";
  if (filteredQuestion.length > 0) {
    filteredQuestion.forEach((item) => {
      displayQuestion(item, true);
    });
  } else {
    const div = document.createElement("div");
    div.innerText = `There is no question available with the text - "${string}"`;
    section.appendChild(div);
  }
}
