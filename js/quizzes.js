let quizData = null;
let currentQuestion = 0;
let score = 0;
let answered = false;

const params = new URLSearchParams(window.location.search);
const quizId = (params.get("quiz") || "").trim();

function getElement(id) {
    return document.getElementById(id);
}

/* =========================================================
   SHUFFLE
========================================================= */

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        const temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }

    return array;
}

/* =========================================================
   SHOW LOADING
========================================================= */

function showLoading() {
    const questionText = getElement("questionText");
    const answersContainer = getElement("answersContainer");
    const questionCount = getElement("questionCount");
    const quizName = getElement("quizName");
    const nextButton = getElement("nextButton");

    if (quizName) {
        quizName.textContent = "Quiz Guru";
    }

    if (questionCount) {
        questionCount.textContent = "Loading...";
    }

    if (questionText) {
        questionText.textContent = "Loading quiz...";
    }

    if (answersContainer) {
        answersContainer.innerHTML = "";
    }

    if (nextButton) {
        nextButton.style.display = "none";
    }
}

/* =========================================================
   SHOW ERROR
========================================================= */

function showError(message) {
    const questionText = getElement("questionText");
    const answersContainer = getElement("answersContainer");
    const questionCount = getElement("questionCount");
    const quizName = getElement("quizName");
    const progressBar = getElement("progressBar");
    const nextButton = getElement("nextButton");

    if (quizName) {
        quizName.textContent = "Quiz Guru";
    }

    if (questionCount) {
        questionCount.textContent = "Quiz Error";
    }

    if (progressBar) {
        progressBar.style.width = "0%";
    }

    if (questionText) {
        questionText.textContent = "Unable to load this quiz.";
    }

    if (answersContainer) {
        answersContainer.innerHTML = `
            <div style="
                width:100%;
                padding:24px;
                border-radius:16px;
                background:#fff1f2;
                color:#991b1b;
                text-align:center;
                line-height:1.6;
            ">
                <strong>Something went wrong.</strong>
                <br>
                ${escapeHTML(message)}
                <br><br>
                <a
                    href="../index.html"
                    style="
                        display:inline-block;
                        padding:10px 18px;
                        border-radius:10px;
                        background:#111827;
                        color:white;
                        text-decoration:none;
                    "
                >
                    Back to Quizzes
                </a>
            </div>
        `;
    }

    if (nextButton) {
        nextButton.style.display = "none";
    }

    console.error("Quiz Guru:", message);
}

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   GET QUIZ DATA
========================================================= */

function getQuiz() {
    if (!quizData) {
        return null;
    }

    return quizData;
}

/* =========================================================
   LOAD QUIZ
========================================================= */

async function loadQuiz() {
    showLoading();

    try {
        const quizFiles = [
            "../data/quizzes.json",
            "../data/education.json",
            "../data/computer-it.json",
            "../data/science.json",
            "../data/general-knowledge.json"
        ];

        async function loadQuizFile(file) {
            const response = await fetch(
                new URL(file, document.baseURI),
                {
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Could not load " + file + "."
                );
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                return data;
            }

            if (
                data &&
                Array.isArray(data.quizzes)
            ) {
                return data.quizzes;
            }

            return [];
        }

        const quizArrays =
            await Promise.all(
                quizFiles.map(loadQuizFile)
            );

        const quizzes =
            quizArrays.flat();

        if (quizzes.length === 0) {
            throw new Error(
                "No quizzes were found."
            );
        }

        let selectedQuiz = null;

        /* -----------------------------------------------------
           FIND QUIZ BY URL ID
        ----------------------------------------------------- */

        if (quizId) {
            selectedQuiz = quizzes.find(function (quiz) {
                return (
                    String(quiz.id || "")
                        .trim()
                        .toLowerCase() ===
                    quizId.toLowerCase()
                );
            });

            if (!selectedQuiz) {
                throw new Error(
                    'Quiz "' + quizId + '" was not found.'
                );
            }
        } else {
            /*
             * If somebody opens quiz.html without ?quiz=...
             * use the first quiz instead of crashing.
             */
            selectedQuiz = quizzes[0];
        }

        /* -----------------------------------------------------
           CHECK QUESTIONS
        ----------------------------------------------------- */

        if (
            !selectedQuiz.questions ||
            !Array.isArray(selectedQuiz.questions) ||
            selectedQuiz.questions.length === 0
        ) {
            throw new Error(
                "This quiz does not contain any questions."
            );
        }

        /* -----------------------------------------------------
           PREPARE QUESTIONS
        ----------------------------------------------------- */

        const preparedQuestions =
            selectedQuiz.questions.map(function (question) {

                if (
                    !question ||
                    typeof question !== "object"
                ) {
                    return null;
                }

                if (
                    !question.question ||
                    !Array.isArray(question.options) ||
                    question.options.length === 0
                ) {
                    return null;
                }

                const correctAnswer =
                    Number(question.correctAnswer);

                if (
                    !Number.isInteger(correctAnswer) ||
                    correctAnswer < 0 ||
                    correctAnswer >= question.options.length
                ) {
                    return null;
                }

                const options =
                    question.options.map(function (
                        option,
                        index
                    ) {
                        return {
                            text: String(option),
                            isCorrect:
                                index === correctAnswer
                        };
                    });

                shuffleArray(options);

                return {
                    question: String(question.question),
                    options: options
                };
            }).filter(Boolean);

        if (preparedQuestions.length === 0) {
            throw new Error(
                "The quiz questions are not in the correct format."
            );
        }

        shuffleArray(preparedQuestions);

        quizData = {
            ...selectedQuiz,
            questions: preparedQuestions
        };

        currentQuestion = 0;
        score = 0;
        answered = false;

        showQuestion();

    } catch (error) {
        showError(error.message);
    }
}

function showQuestion() {
    const quiz = getQuiz();

    if (!quiz) {
        return;
    }

    const question =
        quiz.questions[currentQuestion];

    if (!question) {
        showResult();
        return;
    }

    answered = false;

    const quizName = getElement("quizName");
const questionCount = getElement("questionCount");
const questionText = getElement("questionText");
const answersContainer =
    getElement("answersContainer");
const nextButton = getElement("nextButton");

   if (quizName) {
    quizName.textContent =
        quiz.category ||
        quiz.title ||
        "Quiz";
}

if (questionCount) {
    questionCount.textContent =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        quiz.questions.length;
}

if (questionText) {
    questionText.textContent =
        question.question;
}

updateQuizProgress(
    currentQuestion,
    quiz.questions.length
);

    if (nextButton) {
        nextButton.style.display = "none";
        nextButton.textContent =
            currentQuestion ===
            quiz.questions.length - 1
                ? "Finish Quiz"
                : "Next Question →";
    }

    if (!answersContainer) {
        return;
    }

    answersContainer.innerHTML = "";

    question.options.forEach(function (
        option,
        index
    ) {
        const button =
            document.createElement("button");

        button.type = "button";
        button.className =
    "answer-btn";

        button.textContent =
            option.text;

        button.addEventListener(
            "click",
            function () {
                selectAnswer(index);
            }
        );

        answersContainer.appendChild(button);
    });
}

/* =========================================================
   SELECT ANSWER
========================================================= */

function selectAnswer(selectedIndex) {
    if (answered) {
        return;
    }

    const quiz = getQuiz();

    if (!quiz) {
        return;
    }

    const question =
        quiz.questions[currentQuestion];

    if (!question) {
        return;
    }

    answered = true;

    const buttons =
        document.querySelectorAll(
            "#answersContainer .answer-btn"
        );

    const correctIndex =
        question.options.findIndex(
            function (option) {
                return option.isCorrect;
            }
        );

    if (correctIndex === -1) {
        return;
    }

    if (buttons[correctIndex]) {
        buttons[correctIndex].classList.add(
            "correct"
        );
    }

    if (selectedIndex === correctIndex) {
        score++;
    } else if (buttons[selectedIndex]) {
        buttons[selectedIndex].classList.add(
            "wrong"
        );
    }

    buttons.forEach(function (button) {
        button.disabled = true;
    });

    const nextButton =
        getElement("nextButton");

    if (nextButton) {
        nextButton.style.display = "inline-flex";
    }
}

/* =========================================================
   NEXT QUESTION
========================================================= */

const nextButton =
    document.getElementById("nextButton");

if (nextButton) {
    nextButton.addEventListener(
        "click",
        function () {
            const quiz = getQuiz();

            if (!quiz || !answered) {
                return;
            }

            if (
                currentQuestion <
                quiz.questions.length - 1
            ) {
                currentQuestion++;
                showQuestion();
            } else {
                showResult();
            }
        }
    );
}

/* =========================================================
   PERFECT SCORE CELEBRATION
========================================================= */

function celebratePerfectScore() {
    const existing =
        document.getElementById(
            "perfectScoreOverlay"
        );

    if (existing) {
        existing.remove();
    }

    const overlay =
        document.createElement("div");

    overlay.id =
        "perfectScoreOverlay";

    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.background =
        "rgba(0,0,0,0.75)";
    overlay.style.padding = "20px";

    overlay.innerHTML = `
        <div style="
            max-width:500px;
            width:100%;
            background:white;
            border-radius:24px;
            padding:40px 24px;
            text-align:center;
            box-shadow:0 20px 60px rgba(0,0,0,.3);
        ">
            <div style="
                font-size:64px;
                margin-bottom:15px;
            ">
                🏆
            </div>

            <h2 style="
                margin:0 0 12px;
                font-size:32px;
            ">
                Perfect Score!
            </h2>

            <p style="
                margin:0;
                font-size:18px;
                line-height:1.6;
                color:#555;
            ">
                Amazing! You answered every question correctly.
            </p>

            <button
                id="closePerfectScore"
                type="button"
                style="
                    margin-top:25px;
                    padding:12px 24px;
                    border:0;
                    border-radius:12px;
                    background:#111827;
                    color:white;
                    cursor:pointer;
                    font-size:16px;
                "
            >
                See My Result
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeButton =
        document.getElementById(
            "closePerfectScore"
        );

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            function () {
                overlay.remove();
            }
        );
    }
}

/* =========================================================
   SHOW RESULT
========================================================= */

function showResult() {
    const quiz = getQuiz();

    if (!quiz) {
        return;
    }

    const total =
        quiz.questions.length;

    const percentage =
        Math.round(
            (score / total) * 100
        );
saveTestResult(percentage);
updateTestAverageDisplay();

saveTestResult(percentage);

    const quizName =
        getElement("quizName");

    const questionCount =
        getElement("questionCount");

    const questionText =
        getElement("questionText");

    const answersContainer =
        getElement("answersContainer");

    const progressBar =
        getElement("progressBar");

    const nextButton =
        getElement("nextButton");

    if (quizName) {
        quizName.textContent =
            quiz.category ||
            quiz.title ||
            "Quiz";
    }

    if (questionCount) {
        questionCount.textContent =
            "Quiz Complete";
    }

    if (progressBar) {
        updateQuizProgress(
    quiz.questions.length - 1,
    quiz.questions.length
);
    }

    if (questionText) {
        questionText.textContent =
            "Your Quiz Result";
    }

    if (nextButton) {
        nextButton.style.display = "none";
    }

    if (!answersContainer) {
        return;
    }

    answersContainer.innerHTML = `
        <div style="
            width:100%;
            text-align:center;
            padding:30px 20px;
        ">
            <div style="
                font-size:56px;
                margin-bottom:15px;
            ">
                ${
                    percentage === 100
                        ? "🏆"
                        : percentage >= 70
                            ? "🎉"
                            : percentage >= 40
                                ? "👍"
                                : "💪"
                }
            </div>

            <h2 style="
                margin:0 0 10px;
                font-size:30px;
            ">
                ${percentage}%
            </h2>

            <p style="
                margin:0 0 8px;
                font-size:20px;
            ">
                You scored
                <strong>${score}</strong>
                out of
                <strong>${total}</strong>
            </p>

            <p style="
                margin:0;
                color:#666;
                line-height:1.6;
            ">
                ${
                    percentage === 100
                        ? "Perfect score! Excellent work!"
                        : percentage >= 70
                            ? "Great job! Keep it up!"
                            : percentage >= 40
                                ? "Good effort! You can do even better."
                                : "Keep practicing and try again!"
                }
            </p>

            <div style="
                display:flex;
                gap:12px;
                justify-content:center;
                flex-wrap:wrap;
                margin-top:25px;
            ">
                <button
                    type="button"
                    id="restartQuizButton"
                    style="
                        padding:12px 22px;
                        border:0;
                        border-radius:12px;
                        background:#111827;
                        color:white;
                        cursor:pointer;
                        font-size:16px;
                    "
                >
                    Restart Quiz
                </button>

                <a
                    href="../index.html"
                    style="
                        display:inline-flex;
                        align-items:center;
                        padding:12px 22px;
                        border-radius:12px;
                        background:#e5e7eb;
                        color:#111827;
                        text-decoration:none;
                        font-size:16px;
                    "
                >
                    Back to Quizzes
                </a>
            </div>
        </div>
    `;

    const restartButton =
        document.getElementById(
            "restartQuizButton"
        );

    if (restartButton) {
        restartButton.addEventListener(
            "click",
            function () {
                window.location.reload();
            }
        );
    }

    if (percentage === 100) {
        celebratePerfectScore();
    }
}

/* =========================================================
   START
========================================================= */

loadQuiz();
