document.addEventListener("DOMContentLoaded", updateForm);
const form = document.getElementById("form");
const questionInput = document.getElementById("question-input");
const shuffleBtn = document.getElementById("shuffle");
const submitBtn = document.getElementById("submit");
const explanation = document.getElementById("explanation");
const questionArray = [];

function updateForm() {
  form.addEventListener("submit", onClickingSubmit);
  shuffleBtn.addEventListener("click", onClickingShuffle);
}

function onClickingSubmit(event) {
  event.preventDefault();
  const id = 1;
  const question = questionInput.value;
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
  const options = Array.from(answerOptions).map((option, index) => ({
    text: option.value,
    isCorrect: radios[index].checked,
  }));
  const explanationValue = explanation.value;
  const item = {
    id: id,
    question: question,
    options: options,
    explanation: explanationValue,
  };

  questionArray.push(item);
  console.log(questionArray);
  //to clear the form
  questionInput.value = "";
  explanation.value = "";
  answerOptions.forEach((option) => (option.value = ""));
  radios.forEach((radio) => (radio.checked = false));
}

function onClickingShuffle(event) {
  event.preventDefault();
  const answersContainer = document.getElementById("answers");
  const options = Array.from(
    answersContainer.getElementsByClassName("answer-option")
  );
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    answersContainer.appendChild(options[j]);
  }
}
