document.addEventListener("DOMContentLoaded", function () {

    const params =
        new URLSearchParams(window.location.search);

    const categoryName =
        (params.get("category") || "").trim();

    const categoryTitle =
        document.getElementById("categoryTitle");

    const categoryLabel =
        document.getElementById("categoryLabel");

    const quizGrid =
        document.getElementById("categoryQuizGrid");


    if (!categoryName) {

        categoryTitle.textContent =
            "Category Not Found";

        quizGrid.innerHTML =
            "<p>No category was selected.</p>";

        return;
    }


    categoryTitle.textContent =
        categoryName;

    categoryLabel.textContent =
        categoryName.toUpperCase();


    /*
     * Select the correct quiz files for the category.
     */

    let quizFiles = [];


    if (
        categoryName.toLowerCase() ===
        "general knowledge"
    ) {

        quizFiles = [
            "../data/quizzes.json",
            "../data/general-knowledge.json"
        ];

    } else if (
        categoryName.toLowerCase() ===
        "education"
    ) {

        quizFiles = [
            "../data/quizzes.json",
            "../data/education.json"
        ];

    } else if (
        categoryName.toLowerCase() ===
        "computer & it"
    ) {

        quizFiles = [
            "../data/quizzes.json",
            "../data/computer-it.json"
        ];

    } else if (
        categoryName.toLowerCase() ===
        "science"
    ) {

        quizFiles = [
            "../data/quizzes.json",
            "../data/science.json"
        ];

    } else if (
        categoryName.toLowerCase() ===
        "mind & brain"
    ) {

        quizFiles = [
            "../data/quizzes.json"
        ];

    } else {

        quizFiles = [
            "../data/quizzes.json"
        ];

    }


    /*
     * Load one quiz file.
     */

    function loadQuizFile(file) {

        return fetch(file, {
            cache: "no-store"
        })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Could not load " + file
                );

            }

            return response.json();

        })

        .then(function (data) {

            /*
             * New JSON format:
             *
             * [
             *     { ... }
             * ]
             */

            if (Array.isArray(data)) {
                return data;
            }


            /*
             * Old JSON format:
             *
             * {
             *     "quizzes": [
             *         { ... }
             *     ]
             * }
             */

            if (
                data &&
                Array.isArray(data.quizzes)
            ) {

                return data.quizzes;
            }


            return [];

        });

    }


    /*
     * Load all files for this category.
     */

    Promise.all(
        quizFiles.map(loadQuizFile)
    )

    .then(function (quizArrays) {

        const allQuizzes =
            quizArrays.flat();


        const selectedCategory =
            categoryName
                .trim()
                .toLowerCase();


        const quizzes =
            allQuizzes.filter(function (quiz) {

                if (!quiz || !quiz.category) {
                    return false;
                }

                return (
                    String(quiz.category)
                        .trim()
                        .toLowerCase() ===
                    selectedCategory
                );

            });


        quizGrid.innerHTML = "";


        /*
         * No quizzes found.
         */

        if (quizzes.length === 0) {

            quizGrid.innerHTML =
                "<p>No quizzes available in this category yet.</p>";

            return;
        }


        /*
         * Create one card for every quiz.
         */

        quizzes.forEach(function (quiz) {

            const card =
                document.createElement("article");


            card.className =
                "quiz-card";


            const questionCount =
                Array.isArray(quiz.questions)
                    ? quiz.questions.length
                    : 0;


            card.innerHTML =

                "<div class='quiz-icon'>🧠</div>" +

                "<p class='quiz-category'>" +
                    escapeHTML(quiz.category) +
                "</p>" +

                "<h3>" +
                    escapeHTML(quiz.title) +
                "</h3>" +

                "<p>" +
                    escapeHTML(
                        quiz.description || ""
                    ) +
                "</p>" +

                "<div class='quiz-meta'>" +

                    "<span>" +
                        questionCount +
                        " Questions" +
                    "</span> " +

                    "<span>" +
                        escapeHTML(
                            quiz.difficulty || "Quiz"
                        ) +
                    "</span>" +

                "</div>" +

                "<a href='quiz.html?quiz=" +
                    encodeURIComponent(quiz.id) +
                    "' class='start-btn'>" +

                    "Start Quiz" +

                "</a>";


            quizGrid.appendChild(card);

        });

    })

    .catch(function (error) {

        console.error(
            "Category quiz loading error:",
            error
        );


        quizGrid.innerHTML =
            "<p>Unable to load quizzes.</p>";

    });


    /*
     * Safely display quiz text.
     */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

});