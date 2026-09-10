/* =========================================================
   QUIZ GURU
   GLOBAL QUIZ SEARCH
   Loads quizzes from multiple JSON files
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAGE ELEMENTS
    ===================================================== */

    const searchInput =
        document.getElementById("quizSearch");

    const clearButton =
        document.getElementById("quizSearchClear");

    const resultsInfo =
        document.getElementById("searchResultsInfo");

    const quizGrid =
        document.querySelector(
            "#quizzes .quiz-grid"
        );


    /* =====================================================
       STOP IF SEARCH DOES NOT EXIST
    ===================================================== */

    if (
        !searchInput ||
        !quizGrid
    ) {
        return;
    }


    /* =====================================================
       SAVE ORIGINAL HOMEPAGE CARDS
    ===================================================== */

    const originalQuizHTML =
        quizGrid.innerHTML;


    /* =====================================================
       ALL QUIZZES
    ===================================================== */

    let allQuizzes = [];


    /* =====================================================
       QUIZ DATA FILES

       IMPORTANT:
       quizzes.json = OLD QUIZZES
       education.json = EDUCATION
       computer-it.json = COMPUTER & IT
       science.json = SCIENCE
    ===================================================== */

    const quizFiles = [
    "data/quizzes.json",
    "data/education.json",
    "data/computer-it.json",
    "data/science.json",
    "data/general-knowledge.json"
];


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(text) {

        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       GET QUIZ ICON
    ===================================================== */

    function getQuizIcon(category) {

        const name =
            String(category || "")
                .toLowerCase();


        if (
            name.includes("mind") ||
            name.includes("brain")
        ) {

            return {
                icon: "🧠",
                className: "blue-icon"
            };

        }


        if (
            name.includes("quick")
        ) {

            return {
                icon: "⚡",
                className: "orange-icon"
            };

        }


        if (
            name.includes("science")
        ) {

            return {
                icon: "🔬",
                className: "orange-icon"
            };

        }


        if (
            name.includes("computer") ||
            name.includes("technology") ||
            name.includes("tech") ||
            name.includes("it")
        ) {

            return {
                icon: "💻",
                className: "cyan-icon"
            };

        }


        if (
            name.includes("education")
        ) {

            return {
                icon: "📚",
                className: "green-icon"
            };

        }


        if (
            name.includes("exam")
        ) {

            return {
                icon: "🎯",
                className: "red-icon"
            };

        }


        return {
            icon: "🌍",
            className: "purple-icon"
        };

    }


    /* =====================================================
       QUESTION COUNT
    ===================================================== */

    function getQuestionCount(quiz) {

        if (
            Array.isArray(
                quiz.questions
            )
        ) {

            return quiz.questions.length;

        }


        if (
            quiz.questionCount
        ) {

            return quiz.questionCount;

        }


        return 0;

    }


    /* =====================================================
       CREATE SEARCH RESULT CARD
    ===================================================== */

    function createQuizCard(quiz) {

        const quizIcon =
            getQuizIcon(
                quiz.category
            );


        const questionCount =
            getQuestionCount(
                quiz
            );


        const category =
            quiz.category ||
            "QUIZ";


        const title =
            quiz.title ||
            "Untitled Quiz";


        const description =
            quiz.description ||
            "Test your knowledge with this quiz.";


        const quizID =
            quiz.id ||
            "";


        return `

            <article
                class="quiz-card search-quiz-card"
            >

                <div class="card-top">

                    <div
                        class="quiz-icon ${quizIcon.className}"
                    >

                        <span>
                            ${quizIcon.icon}
                        </span>

                    </div>


                    <span class="difficulty easy">
                        QUIZ
                    </span>

                </div>


                <span class="card-category">
                    ${escapeHTML(category)}
                </span>


                <h3>
                    ${escapeHTML(title)}
                </h3>


                <p>
                    ${escapeHTML(description)}
                </p>


                <div class="card-meta">

                    <span>

                        <b>
                            ${questionCount}
                        </b>

                        Questions

                    </span>


                    <span>
                        ${escapeHTML(category)}
                    </span>

                </div>


                <a
                    href="pages/quiz.html?quiz=${encodeURIComponent(quizID)}"
                    class="card-button"
                >

                    Start Quiz

                    <span>
                        →
                    </span>

                </a>

            </article>

        `;

    }


    /* =====================================================
       SEARCH QUIZ
    ===================================================== */

    function quizMatches(
        quiz,
        query
    ) {

        const title =
            String(
                quiz.title || ""
            ).toLowerCase();


        const category =
            String(
                quiz.category || ""
            ).toLowerCase();


        const description =
            String(
                quiz.description || ""
            ).toLowerCase();


        let questionsText =
            "";


        if (
            Array.isArray(
                quiz.questions
            )
        ) {

            questionsText =
                quiz.questions
                    .map(
                        function (
                            question
                        ) {

                            const questionText =
                                String(
                                    question.question ||
                                    question.text ||
                                    ""
                                );


                            let options =
                                "";


                            if (
                                Array.isArray(
                                    question.options
                                )
                            ) {

                                options =
                                    question.options.join(
                                        " "
                                    );

                            }


                            return (
                                questionText +
                                " " +
                                options
                            );

                        }
                    )
                    .join(" ")
                    .toLowerCase();

        }


        const searchableText =
            title +
            " " +
            category +
            " " +
            description +
            " " +
            questionsText;


        return searchableText.includes(
            query
        );

    }


    /* =====================================================
       SHOW SEARCH RESULTS
    ===================================================== */

    function showSearchResults(
        results
    ) {

        if (
            results.length === 0
        ) {

            quizGrid.innerHTML = `

                <div class="search-empty">

                    <h3>
                        No quizzes found
                    </h3>

                    <p>
                        Try searching for another quiz,
                        topic or category.
                    </p>

                </div>

            `;

            return;

        }


        quizGrid.innerHTML =
            results
                .map(
                    createQuizCard
                )
                .join("");

    }


    /* =====================================================
       PERFORM SEARCH
    ===================================================== */

    function performSearch() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        /* =================================================
           EMPTY SEARCH
        ================================================= */

        if (!query) {

            quizGrid.innerHTML =
                originalQuizHTML;


            if (
                resultsInfo
            ) {

                resultsInfo.textContent =
                    "";

            }


            if (
                clearButton
            ) {

                clearButton.style.display =
                    "none";

            }


            return;

        }


        /* =================================================
           SHOW CLEAR BUTTON
        ================================================= */

        if (
            clearButton
        ) {

            clearButton.style.display =
                "flex";

        }


        /* =================================================
           SEARCH ALL JSON QUIZZES
        ================================================= */

        const results =
            allQuizzes.filter(
                function (
                    quiz
                ) {

                    return quizMatches(
                        quiz,
                        query
                    );

                }
            );


        showSearchResults(
            results
        );


        /* =================================================
           RESULT MESSAGE
        ================================================= */

        if (
            resultsInfo
        ) {

            if (
                results.length === 0
            ) {

                resultsInfo.innerHTML =
                    `No quizzes found for <strong>${escapeHTML(
                        searchInput.value.trim()
                    )}</strong>`;

            }

            else {

                resultsInfo.innerHTML =
                    `Showing <strong>${results.length}</strong> ` +
                    (
                        results.length === 1
                            ? "quiz"
                            : "quizzes"
                    ) +
                    ` matching <strong>${escapeHTML(
                        searchInput.value.trim()
                    )}</strong>`;

            }

        }

    }


    /* =====================================================
       SEARCH WHILE TYPING
    ===================================================== */

    searchInput.addEventListener(
        "input",
        function () {

            performSearch();

        }
    );


    /* =====================================================
   ENTER KEY
===================================================== */

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            performSearch();


            /* =============================================
               AUTO SCROLL TO FIRST SEARCH RESULT
            ============================================= */

            setTimeout(
                function () {

                    const firstResult =
                        quizGrid.querySelector(
                            ".search-quiz-card"
                        );


                    if (firstResult) {

                        const headerOffset = 100;

                        const elementPosition =
                            firstResult.getBoundingClientRect().top +
                            window.pageYOffset;

                        const scrollPosition =
                            elementPosition -
                            headerOffset;


                        window.scrollTo({
                            top: scrollPosition,
                            behavior: "smooth"
                        });

                    } else {

                        /* =================================
                           NO RESULTS
                        ================================= */

                        quizGrid.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                },
                100
            );

        }

    }
);


    /* =====================================================
       CLEAR BUTTON
    ===================================================== */

    if (
        clearButton
    ) {

        clearButton.addEventListener(
            "click",
            function () {

                searchInput.value =
                    "";

                performSearch();

                searchInput.focus();

            }
        );

    }


    /* =====================================================
       LOAD ONE JSON FILE
    ===================================================== */

    async function loadQuizFile(
        file
    ) {

        const response =
            await fetch(
                file,
                {
                    cache: "no-store"
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Could not load " +
                file
            );

        }


        const data =
            await response.json();


        if (
            Array.isArray(data)
        ) {

            return data;

        }


        if (
            data &&
            Array.isArray(
                data.quizzes
            )
        ) {

            return data.quizzes;

        }


        return [];

    }


    /* =====================================================
       LOAD ALL QUIZ FILES
    ===================================================== */

    Promise.all(
        quizFiles.map(
            loadQuizFile
        )
    )

        .then(
            function (
                quizArrays
            ) {

                allQuizzes =
                    quizArrays.flat();


                console.log(
                    "Quiz search ready:",
                    allQuizzes.length,
                    "quizzes loaded from all JSON files."
                );

            }
        )

        .catch(
            function (
                error
            ) {

                console.error(
                    "Quiz search error:",
                    error
                );

            }
        );

});