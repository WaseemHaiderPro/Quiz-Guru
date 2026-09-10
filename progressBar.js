window.updateQuizProgress = function (currentQuestion, totalQuestions) {
    const progressBar = document.getElementById("progressBar");

    if (!progressBar || !totalQuestions) {
        return;
    }

    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    progressBar.style.width = progress + "%";
};