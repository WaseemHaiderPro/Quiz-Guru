/* =========================================================
   QUIZ GURU - TEST AVERAGE
========================================================= */

const TEST_AVERAGE_STORAGE_KEY = "quizGuruTestResults";

/* =========================================================
   GET SAVED TEST RESULTS
========================================================= */

function getTestResults() {
    try {
        const savedResults =
            localStorage.getItem(
                TEST_AVERAGE_STORAGE_KEY
            );

        if (!savedResults) {
            return [];
        }

        const results =
            JSON.parse(savedResults);

        if (!Array.isArray(results)) {
            return [];
        }

        return results.filter(function (result) {
            return (
                result &&
                typeof result.percentage === "number" &&
                Number.isFinite(result.percentage)
            );
        });

    } catch (error) {
        console.error(
            "Quiz Guru: Could not read test results.",
            error
        );

        return [];
    }
}

/* =========================================================
   SAVE TEST RESULT
========================================================= */

function saveTestResult(percentage) {
    const results = getTestResults();

    results.push({
        percentage: Number(percentage),
        date: new Date().toISOString()
    });

    try {
        localStorage.setItem(
            TEST_AVERAGE_STORAGE_KEY,
            JSON.stringify(results)
        );

        return true;

    } catch (error) {
        console.error(
            "Quiz Guru: Could not save test result.",
            error
        );

        return false;
    }
}

/* =========================================================
   CALCULATE TEST AVERAGE
========================================================= */

function getTestAverage() {
    const results = getTestResults();

    if (results.length === 0) {
        return 0;
    }

    const total =
        results.reduce(
            function (sum, result) {
                return sum + result.percentage;
            },
            0
        );

    return Math.round(
        total / results.length
    );
}

/* =========================================================
   GET NUMBER OF TESTS
========================================================= */

function getTestsTaken() {
    return getTestResults().length;
}

/* =========================================================
   UPDATE TEST AVERAGE DISPLAY
========================================================= */

function updateTestAverageDisplay() {
    const averageElement =
        document.getElementById(
            "testAverage"
        );

    const testsElement =
        document.getElementById(
            "testsTaken"
        );

    if (averageElement) {
        averageElement.textContent =
            getTestAverage() + "%";
    }

    if (testsElement) {
        testsElement.textContent =
            getTestsTaken() +
            (getTestsTaken() === 1
                ? " Test Taken"
                : " Tests Taken");
    }
}

/* =========================================================
   STARTUP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        updateTestAverageDisplay();
    }
);
