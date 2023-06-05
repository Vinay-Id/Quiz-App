fetch("./Assets/dataset.json")
  .then((response) => response.json())
  .then((data) => {
    useFetchedData(data);
  })
  .catch((error) => {
    console.error("fetching data failed:", error);
  });

function useFetchedData(dataset) {
  let chosenTopic = null;
  let questionIndex = 0;
  let userSelection = {};

  function showTopicSelection() {
    const topicList = document.getElementById("topic-list");
    topicList.innerHTML = "";
    for (const topic in dataset) {
      const li = document.createElement("button");
      li.textContent = topic;
      li.classList.add("category-button");
      topicList.appendChild(li);

      const storedTopics =
        JSON.parse(localStorage.getItem("selectedTopics")) || [];
      if (storedTopics.includes(topic)) {
        li.disabled = true;
        li.classList.add("blocked-button");
      } else {
        li.addEventListener("click", (e) => {
          const selectedTopic = e.target.textContent;
          storedTopics.push(selectedTopic);
          localStorage.setItem("selectedTopics", JSON.stringify(storedTopics));
          beginQuiz(selectedTopic);
        });
      }
    }

    document.getElementById("quiz").style.display = "none";
    document.getElementById("play-again-container").style.display = "none";
    document.getElementById("topic-selection").style.display = "block";
  }

  function beginQuiz(topic) {
    chosenTopic = topic;
    questionIndex = 0;
    userSelection = {};

    renderQuiz();
  }

  function renderQuiz() {
    const quizContainer = document.getElementById("quiz");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("optionsBox");
    const resultText = document.getElementById("result");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const playAgainContainer = document.getElementById("play-again-container");
    const playAgainBtn = document.getElementById("play-again-btn");

    const questions = dataset[chosenTopic];

    if (questionIndex >= 0 && questionIndex < questions.length) {
      const question = questions[questionIndex];

      questionText.textContent = question.question;
      optionsContainer.innerHTML = "";

      question.options.forEach((option, index) => {
        const div = document.createElement("div");
        div.classList.add("option");

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.value = option;
        radio.disabled = userSelection.hasOwnProperty(question.id);

        radio.addEventListener("change", () => {
          userSelection[question.id] = option;
        });

        const label = document.createElement("label");
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));

        div.appendChild(label);
        optionsContainer.appendChild(div);
      });

      resultText.textContent = "";
      nextBtn.style.display = "block";
      prevBtn.style.display = "block";
      playAgainContainer.style.display = "none";

      if (questionIndex === 0) {
        prevBtn.style.display = "none";
      }

      if (questionIndex === questions.length - 1) {
        nextBtn.textContent = "Submit";
      } else {
        nextBtn.textContent = "Next";
      }
    } else {
      const totalQuestions = questions.length;
      let correctAnswers = 0;

      for (const id in userSelection) {
        if (userSelection[id] === questions.find((q) => q.id == id).answer) {
          correctAnswers++;
        }
      }

      resultText.textContent = `Your score: ${correctAnswers} Correct  and  ${
        totalQuestions - correctAnswers
      } Incorrect.`;
      nextBtn.style.display = "none";
      prevBtn.style.display = "none";
      playAgainContainer.style.display = "block";
    }

    document.getElementById("topic-selection").style.display = "none";
    quizContainer.style.display = "block";
  }

  document.getElementById("next-btn").addEventListener("click", () => {
    questionIndex++;
    renderQuiz();
  });
  document.getElementById("prev-btn").addEventListener("click", () => {
    questionIndex--;
    renderQuiz();
  });
  document.getElementById("play-again-btn").addEventListener("click", () => {
    chosenTopic = null;
    questionIndex = 0;
    userSelection = {};
    showTopicSelection();
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    localStorage.removeItem("selectedTopics");
    showTopicSelection();
  });

  showTopicSelection();
}
