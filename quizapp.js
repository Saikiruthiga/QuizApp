document.addEventListener("DOMContentLoaded", updateForm);
const form = document.getElementById("form");
const shuffleBtn = document.getElementById("shuffle");
//const submitBtn = document.getElementById("submit");
const questionArray = [];
let id = 0;

function updateForm() {
  form.addEventListener("submit", onClickingSubmit);
  shuffleBtn.addEventListener("click", onClickingShuffle);
}

function onClickingSubmit(event) {
  event.preventDefault();
  const question = form.querySelector("[type='text']").value;
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
  const explanationValue = form.querySelector("input[id='explanation']").value;
  id++;
  const item = {
    id: id,
    question: question,
    options: options,
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
    (option) => option.querySelector("input").value
  );
  const values = valuesOriginal.map((value) => value.toLowerCase);
  const radios = options.map((option) =>
    option.querySelector("input[type='radio']:checked")
  );
  console.log(radios);
  if (values.includes("") || radios.every((radio) => radio === null)) {
    alert("Please fill all the option field and select which one is correct");
    return;
  } else {
    if (new Set(values).size !== values.length) {
      alert("Please give unique option");
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
function displayQuestion(item) {
  const question = document.getElementById("quizquestions question");
  console.log(questionArray);
}
