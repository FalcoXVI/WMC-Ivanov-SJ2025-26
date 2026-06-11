"use strict";

const API_URL = "https://countriesnow.space/api/v0.1/countries/capital";
const STORAGE_KEY = "capitals_game_v1";

const state = {
    allCountries: [],
    currentCountry: null,
    history: [], // Array von { country, correctCapital, userAnswer, isCorrect }
    isFlipped: false
};

async function initGame() {
    loadState();
    registerEvents();

    // UI initial auf Lade-Zustand setzen
    render();

    if (state.allCountries.length === 0) {
        await fetchCountries();
    }

    if (!state.currentCountry && state.allCountries.length > 0) {
        pickRandomCountry();
    }

    render();
}

async function fetchCountries() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();

        if (json.error) throw new Error(json.msg);

        // Filtere Länder heraus, die keine Hauptstadt haben
        const validCountries = json.data.filter(c => c.capital && c.capital.trim().length > 0 && c.name);

        state.allCountries = validCountries.map(c => ({
            name: c.name,
            capital: c.capital
        }));

    } catch (error) {
        console.error("Fehler beim Laden der API:", error);
        alert("Länder konnten nicht geladen werden.");
    }
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
        const parsed = JSON.parse(saved);
        if (parsed.history) state.history = parsed.history;
    } catch (e) {
        console.error(e);
    }
}

function saveState() {
    const toSave = {
        history: state.history
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

function pickRandomCountry() {
    if (state.allCountries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * state.allCountries.length);
    state.currentCountry = state.allCountries[randomIndex];
    state.isFlipped = false;
}

function checkAnswer(event) {
    event.preventDefault();
    if (state.isFlipped || !state.currentCountry) return;

    const inputEl = document.getElementById("user-input");
    const userAnswer = inputEl.value.trim();
    if (!userAnswer) return;

    const correctCapital = state.currentCountry.capital;

    // Tolerante Überprüfung: Groß-/Kleinschreibung ignorieren
    const isCorrect = userAnswer.toLowerCase() === correctCapital.toLowerCase();

    state.history.push({
        country: state.currentCountry.name,
        correctCapital: correctCapital,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString()
    });

    state.isFlipped = true;
    saveState();
    render();
}

function nextQuestion() {
    pickRandomCountry();
    document.getElementById("user-input").value = "";
    render();
}

function downloadJSON() {
    if (state.history.length === 0) {
        alert("Du hast noch keine Fragen beantwortet!");
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "meine_antworten.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function resetGame() {
    if (confirm("Möchtest du wirklich alle Statistiken löschen und neu starten?")) {
        state.history = [];
        saveState();
        nextQuestion();
    }
}

function render() {
    const total = state.history.length;
    const correctCount = state.history.filter(h => h.isCorrect).length;
    const accuracy = total === 0 ? 0 : Math.round((correctCount / total) * 100);

    // Update Header Stats
    document.getElementById("accuracy").textContent = `${accuracy}%`;
    document.getElementById("correct").textContent = correctCount;
    document.getElementById("total-answered").textContent = total;
    document.getElementById("stat-total").textContent = total;

    document.getElementById("counter").innerHTML = `Frage <span id="current">${total + 1}</span>`;

    const cardEl = document.getElementById("card");
    const frontText = document.getElementById("country-name");
    const resultMessage = document.getElementById("result-message");
    const correctCapEl = document.getElementById("correct-capital");
    const formEl = document.getElementById("answer-form");
    const nextRow = document.getElementById("next-row");

    if (state.currentCountry) {
        frontText.textContent = state.currentCountry.name;
    } else {
        frontText.textContent = "Lade...";
    }

    if (state.isFlipped) {
        cardEl.classList.add("flipped");
        const lastAnswer = state.history[state.history.length - 1];

        if (lastAnswer.isCorrect) {
            resultMessage.innerHTML = "Richtig! 🎉";
            resultMessage.style.color = "var(--success)";
        } else {
            resultMessage.innerHTML = `Falsch! Du sagtest "${lastAnswer.userAnswer}".`;
            resultMessage.style.color = "var(--danger)";
        }
        correctCapEl.textContent = state.currentCountry.capital;

        formEl.style.display = "none";
        nextRow.style.display = "flex";

        // Auto-Focus auf den "Nächste Frage" Button nach dem Umdrehen (hilft bei Tastaturbedienung)
        setTimeout(() => document.getElementById("btn-next").focus(), 300);
    } else {
        cardEl.classList.remove("flipped");
        formEl.style.display = "flex";
        nextRow.style.display = "none";
        // Auto-Focus fürs nächste Eingabefeld (kleiner Timeout wegen CSS Animation)
        setTimeout(() => document.getElementById("user-input").focus(), 300);
    }
}

function registerEvents() {
    document.getElementById("answer-form").addEventListener("submit", checkAnswer);
    document.getElementById("btn-next").addEventListener("click", nextQuestion);
    document.getElementById("btn-download").addEventListener("click", downloadJSON);
    document.getElementById("btn-reset").addEventListener("click", resetGame);
}

// Start
initGame();