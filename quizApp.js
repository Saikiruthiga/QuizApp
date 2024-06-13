document.addEventListener("DOMContentLoaded", updateForm);
const form = document.getElementById("form");
const shuffleBtn = form.querySelector("button[type='button']");
const searchBtn = document.getElementById("search-input");
const startBtn = document.getElementById("start");
const questionArray = [];
let item;
let id = 0;
const audio = new Audio("game_music.mp3");
audio.preload = "auto";

function updateForm() {
  startBtn.addEventListener("click", startQuiz);
  form.addEventListener("submit", onClickingSubmit);
  shuffleBtn.addEventListener("click", onClickingShuffle);
  searchBtn.addEventListener("keypress", searchQuestion);
  alpha.addEventListener("click", () => doSorting("alpha"));
  random.addEventListener("click", () => doSorting("random"));
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

  item.forEach((ques) => {
    const question = document.createElement("div");
    section.appendChild(question);

    const p = document.createElement("p");
    p.className = "question";
    p.innerText = ques.question;
    question.appendChild(p);

    ques.options.forEach((option) => {
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
    solutionBtn.classList.add("solution-button");
    solutionBtn.innerText = "Solution";
    solutionBtn.dataset.explanation = ques.explanation;
    solutionBtn.addEventListener("click", revealSolution);
  });
}

const alpha = document.getElementById("alpha");
const random = document.getElementById("random");

function doSorting(type) {
  const section = document.getElementById("quiz-questions");
  const questions = Array.from(section.getElementsByClassName("question"));
  if (questions.length === 0) {
    section.innerText = `Please click on "show all questions" button to display the questions and then select sorting type`;
    return;
  }
  let sortedQuestions;
  if (type === "alpha") {
    sortedQuestions = questions.sort((a, b) =>
      a.innerText.localeCompare(b.innerText)
    );
  }
  if (type === "random") {
    sortedQuestions = questions.sort(() => Math.random() - 0.5);
  }
  section.innerHTML = "";
  sortedQuestions.forEach((question) =>
    section.appendChild(question.parentElement)
  );
}

const showbtn = document.querySelector("#show");
showbtn.addEventListener("click", showAllQuestions);

function showAllQuestions() {
  const section = document.getElementById("quiz-questions");
  section.innerHTML = "";
  fetch(
    "https://raw.githubusercontent.com/Saikiruthiga/Saikiruthiga.github.io/main/sample/quiz.json"
  )
    .then((res) => res.json())
    .then((question) => displayQuestion(question, true))
    .catch((error) => console.log(error))
    .finally(() => console.log("done"));
  displayQuestion(questionArray, true);
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
  const buttons = question.querySelectorAll(".btnList");

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

fetch(
  "https://raw.githubusercontent.com/Saikiruthiga/Saikiruthiga.github.io/main/sample/quiz.json"
)
  .then((res) => res.json())
  .then((data) => {
    const search = document.getElementById("search-input");
    search.addEventListener("keypress", (event) => searchQuestion(event, data));
  })
  .catch((error) => console.log(error))
  .finally(() => console.log("done"));

function searchQuestion(event, data) {
  const string = event.target.value.toLowerCase();
  const section = document.getElementById("quiz-questions");
  section.innerHTML = "";

  const filteredQuestion = (data || []).filter((item) => {
    const question = item.question.toLowerCase().includes(string);
    const options = item.options.some((item) =>
      item.text.toLowerCase().includes(string)
    );
    const explanation = item.explanation.toLowerCase().includes(string);
    return question || options || explanation;
  });

  const filteredQuestion1 = questionArray.filter((item) => {
    const question = item.question.toLowerCase().includes(string);
    const options = item.options.some((item) =>
      item.text.toLowerCase().includes(string)
    );
    const explanation = item.explanation.toLowerCase().includes(string);
    return question || options || explanation;
  });

  if (filteredQuestion.length > 0) {
    filteredQuestion.forEach((item) => {
      displayQuestion(Array(item), true);
    });
    return;
  }
  if (filteredQuestion1.length > 0) {
    filteredQuestion1.forEach((item) => {
      displayQuestion(Array(item), true);
    });
    return;
  }
  {
    const div = document.createElement("div");
    div.innerText = `There is no question available with the text - "${string}"`;
    section.appendChild(div);
    return;
  }
}
