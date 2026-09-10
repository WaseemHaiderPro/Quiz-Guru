const quizFiles = [
    "../data/quizzes.json",
    "../data/education.json",
    "../data/computer-it.json",
    "../data/science.json",
    "../data/general-knowledge.json"
];

async function loadAllQuizzes() {
    const grid = document.getElementById("allQuizzesGrid");

    if (!grid) {
        return;
    }

    try {
        const responses = await Promise.all(
            quizFiles.map(file =>
                fetch(file, { cache: "no-store" })
            )
        );

        const data = await Promise.all(
            responses.map(response => {
                if (!response.ok) {
                    throw new Error("Failed to load quiz data.");
                }

                return response.json();
            })
        );

        const quizzes = [];

        data.forEach(item => {
            if (Array.isArray(item)) {
                quizzes.push(...item);
            } else if (item && Array.isArray(item.quizzes)) {
                quizzes.push(...item.quizzes);
            }
        });

        if (quizzes.length === 0) {
            grid.innerHTML = `
                <p>
                    No quizzes found.
                </p>
            `;
            return;
        }

        grid.innerHTML = "";

        quizzes.forEach(quiz => {
            const card = document.createElement("a");

            card.className = "quiz-card";
            card.href =
                `quiz.html?id=${encodeURIComponent(quiz.id)}`;

            card.innerHTML = `
                <div class="quiz-card-icon">
                    ${quiz.icon || "🧠"}
                </div>

                <div class="quiz-card-content">

                    <span class="quiz-card-category">
                        ${quiz.category || "General Knowledge"}
                    </span>

                    <h3>
                        ${quiz.title || "Untitled Quiz"}
                    </h3>

                    <p>
                        ${quiz.description || ""}
                    </p>

                    <div class="quiz-card-meta">
                        <span>
                            ${Array.isArray(quiz.questions)
                                ? quiz.questions.length
                                : 0} Questions
                        </span>
                    </div>

                </div>
            `;

            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading quizzes:", error);

        grid.innerHTML = `
            <p>
                Unable to load quizzes. Please refresh the page.
            </p>
        `;
    }
}

document.addEventListener("DOMContentLoaded", loadAllQuizzes);
