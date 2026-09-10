/* =========================================================
   QUIZ GURU
   PROFESSIONAL DARK MODE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("themeToggle");

    if (!button) {
        return;
    }


    /* =====================================================
       DARK MODE STYLES
    ===================================================== */

    const darkModeStyles = document.createElement("style");

    darkModeStyles.id = "quizGuruDarkModeStyles";

    darkModeStyles.textContent = `

        /* =================================================
           DARK MODE PAGE
        ================================================= */

        body.dark-mode {
            background: #0f172a !important;
            color: #cbd5e1 !important;
        }


        /* HEADER */

        body.dark-mode .site-header {
            background: #111827 !important;
            border-bottom: 1px solid #273449 !important;
        }


        body.dark-mode .brand-name {
            color: #f8fafc !important;
        }


        body.dark-mode .main-nav a {
            color: #94a3b8 !important;
        }


        body.dark-mode .main-nav a.active,
        body.dark-mode .main-nav a:hover {
            color: #635bff !important;
        }


        /* SEARCH */

        body.dark-mode .search-section {
            background: #0f172a !important;
        }


        body.dark-mode .quiz-search {
            background: #172033 !important;
            border-color: #334155 !important;
        }


        body.dark-mode .quiz-search input {
            background: transparent !important;
            color: #f8fafc !important;
        }


        body.dark-mode .quiz-search input::placeholder {
            color: #7c8aa3 !important;
        }


        /* QUIZ SECTION */

        body.dark-mode .quizzes-section {
            background: #0f172a !important;
        }


        body.dark-mode .section-header h2 {
            color: #f8fafc !important;
        }


        body.dark-mode .section-header p {
            color: #94a3b8 !important;
        }


        /* QUIZ CARDS */

        body.dark-mode .quiz-card {
            background: #172033 !important;
            border-color: #2b3648 !important;
        }


        body.dark-mode .quiz-card h3 {
            color: #f8fafc !important;
        }


        body.dark-mode .quiz-card > p {
            color: #94a3b8 !important;
        }


        body.dark-mode .card-meta {
            border-top-color: #2b3648 !important;
        }


        body.dark-mode .card-meta span {
            color: #94a3b8 !important;
        }


        /* CATEGORY SECTION */

        body.dark-mode .categories-section {
            background: #111827 !important;
        }


        body.dark-mode .category-card {
            background: #172033 !important;
            border-color: #2b3648 !important;
        }


        body.dark-mode .category-card h3 {
            color: #f8fafc !important;
        }


        body.dark-mode .category-card p {
            color: #94a3b8 !important;
        }


        /* WHY SECTION */

        body.dark-mode .why-section {
            background: #0f172a !important;
        }


        body.dark-mode .why-heading h2 {
            color: #f8fafc !important;
        }


        body.dark-mode .why-heading > p {
            color: #94a3b8 !important;
        }


        body.dark-mode .feature-item h3 {
            color: #f8fafc !important;
        }


        body.dark-mode .feature-item p {
            color: #94a3b8 !important;
        }


        /* ABOUT */

        body.dark-mode .about-section {
            background: #111827 !important;
        }


        /* TEST AVERAGE */

        body.dark-mode .test-average-float {
            background: #172033 !important;
            border-color: #2b3648 !important;
        }


        /* SEARCH EMPTY */

        body.dark-mode .search-empty {
            background: #172033 !important;
            border-color: #2b3648 !important;
        }


        body.dark-mode .search-empty h3 {
            color: #f8fafc !important;
        }


        /* =================================================
           PROFESSIONAL THEME TOGGLE
        ================================================= */

        .theme-toggle {
            width: 58px;
            height: 34px;

            padding: 0;
            margin: 0;

            border: 1px solid #d9dce5;
            border-radius: 999px;

            background: #f1f3f8;

            display: inline-flex;
            align-items: center;
            justify-content: center;

            position: relative;

            cursor: pointer;

            appearance: none;
            -webkit-appearance: none;

            box-sizing: border-box;

            box-shadow:
                0 2px 6px rgba(16, 24, 40, 0.08),
                inset 0 1px 1px rgba(255, 255, 255, 0.8);

            transition:
                background 0.25s ease,
                border-color 0.25s ease,
                box-shadow 0.25s ease,
                transform 0.2s ease;
        }


        .theme-toggle:hover {
            transform: translateY(-1px);

            border-color: #c7cad6;

            box-shadow:
                0 5px 14px rgba(16, 24, 40, 0.12),
                inset 0 1px 1px rgba(255, 255, 255, 0.9);
        }


        .theme-toggle:active {
            transform: translateY(0);
        }


        .theme-toggle:focus-visible {
            outline: none;

            box-shadow:
                0 0 0 3px rgba(99, 91, 255, 0.18),
                0 5px 14px rgba(16, 24, 40, 0.12);
        }


        /* TOGGLE TRACK */

        .theme-toggle-track {
            position: relative;

            display: block;

            width: 100%;
            height: 100%;
        }


        /* ICONS */

        .theme-toggle-icon {
            position: absolute;

            top: 50%;

            width: 18px;
            height: 18px;

            display: flex;
            align-items: center;
            justify-content: center;

            transform: translateY(-50%);

            font-size: 13px;
            line-height: 1;

            z-index: 1;

            pointer-events: none;

            transition:
                opacity 0.25s ease,
                color 0.25s ease;
        }


        .theme-toggle-moon {
            left: 7px;

            color: #667085;

            opacity: 1;
        }


        .theme-toggle-sun {
            right: 7px;

            color: #f79009;

            opacity: 0.35;
        }


        /* SLIDING KNOB */

        .theme-toggle-knob {
            position: absolute;

            top: 3px;
            left: 3px;

            width: 26px;
            height: 26px;

            border-radius: 50%;

            background: #ffffff;

            box-shadow:
                0 2px 6px rgba(16, 24, 40, 0.18),
                0 1px 2px rgba(16, 24, 40, 0.08);

            z-index: 2;

            transition:
                left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.25s ease;
        }


        /* =================================================
           DARK MODE TOGGLE
        ================================================= */

        body.dark-mode .theme-toggle {
            background: #1e293b;

            border-color: #334155;

            box-shadow:
                0 2px 8px rgba(0, 0, 0, 0.25),
                inset 0 1px 1px rgba(255, 255, 255, 0.04);
        }


        body.dark-mode .theme-toggle:hover {
            border-color: #475569;

            box-shadow:
                0 5px 16px rgba(0, 0, 0, 0.32);
        }


        body.dark-mode .theme-toggle-moon {
            color: #a5b4fc;

            opacity: 0.35;
        }


        body.dark-mode .theme-toggle-sun {
            color: #fbbf24;

            opacity: 1;
        }


        body.dark-mode .theme-toggle-knob {
            left: 29px;

            background: #ffffff;

            box-shadow:
                0 2px 8px rgba(0, 0, 0, 0.35);
        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 650px) {

            .theme-toggle {
                width: 54px;
                height: 32px;
            }


            .theme-toggle-knob {
                width: 24px;
                height: 24px;

                top: 3px;
                left: 3px;
            }


            body.dark-mode .theme-toggle-knob {
                left: 27px;
            }

        }

    `;


    document.head.appendChild(darkModeStyles);


    /* =====================================================
       BUILD PROFESSIONAL TOGGLE
    ===================================================== */

    button.innerHTML = `
        <span class="theme-toggle-track">

            <span class="theme-toggle-icon theme-toggle-moon">
                ☾
            </span>

            <span class="theme-toggle-icon theme-toggle-sun">
                ☀
            </span>

            <span class="theme-toggle-knob"></span>

        </span>
    `;


    /* =====================================================
       UPDATE ACCESSIBILITY STATE
    ===================================================== */

    function updateThemeButton() {

        const isDark =
            document.body.classList.contains("dark-mode");

        if (isDark) {

            button.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

            button.setAttribute(
                "title",
                "Switch to light mode"
            );

        }
        else {

            button.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            button.setAttribute(
                "title",
                "Switch to dark mode"
            );

        }

    }


    /* =====================================================
       LOAD SAVED MODE
    ===================================================== */

    const savedTheme =
        localStorage.getItem("quizGuruTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    }
    else {

        document.body.classList.remove("dark-mode");

    }


    updateThemeButton();


    /* =====================================================
       BUTTON CLICK
    ===================================================== */

    button.addEventListener("click", function () {

        const darkMode =
            document.body.classList.toggle("dark-mode");


        if (darkMode) {

            localStorage.setItem(
                "quizGuruTheme",
                "dark"
            );

        }
        else {

            localStorage.setItem(
                "quizGuruTheme",
                "light"
            );

        }


        updateThemeButton();

    });

});