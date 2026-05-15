"use strict";

// ============================================================
// 1. KONSTANTEN
// ============================================================

const STORAGE_KEY = "lernkarten_v1";

const DEFAULT_CARDS = [
    { front: "Hauptstadt von Österreich", back: "Wien" },
    { front: "Hauptstadt von Deutschland", back: "Berlin" },
    { front: "Hauptstadt von Frankreich", back: "Paris" },
    { front: "Hauptstadt von Japan",      back: "Tokio" },
    { front: "Hauptstadt von Brasilien",  back: "Brasília" },
];

// ============================================================
// 2. STATE
// ============================================================

const state = {
    cards:        [...DEFAULT_CARDS],
    currentIndex: 0,
    isFlipped:    false,
    score: {
        correct: 0,
        wrong:   0,
    },
};

// ============================================================
// 3. STATE LADEN
// ============================================================

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    state.cards        = parsed.cards;
    state.currentIndex = parsed.currentIndex;
    state.score        = parsed.score;
    // isFlipped wird bewusst nicht gespeichert → startet immer ungedreht
}

// ============================================================
// 4. STATE SPEICHERN
// ============================================================

function saveState() {
    const toSave = {
        cards:        state.cards,
        currentIndex: state.currentIndex,
        score:        state.score,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

// ============================================================
// 5. RENDER  (DOM-Modifikation)
// ============================================================

function render() {
    const card    = state.cards[state.currentIndex];
    const hasCard = state.cards.length > 0;

    // Score anzeigen
    document.getElementById("correct").textContent = state.score.correct;
    document.getElementById("wrong").textContent   = state.score.wrong;

    // Karten-Inhalt setzen
    document.getElementById("front-text").textContent = hasCard
        ? card.front
        : "Keine Karten vorhanden. Füge oben eine hinzu!";

    document.getElementById("back-text").textContent = hasCard ? card.back : "";

    // Zähler
    document.getElementById("current").textContent = hasCard ? state.currentIndex + 1 : 0;
    document.getElementById("total").textContent   = state.cards.length;

    // Flip-Zustand: CSS-Klasse hinzufügen oder entfernen
    const cardEl = document.getElementById("card");
    cardEl.classList.toggle("flipped", state.isFlipped);

    // Buttons aktivieren / deaktivieren
    document.getElementById("btn-flip").disabled    = !hasCard;
    document.getElementById("btn-correct").disabled = !state.isFlipped;
    document.getElementById("btn-wrong").disabled   = !state.isFlipped;
    document.getElementById("btn-prev").disabled    = state.currentIndex <= 0;
    document.getElementById("btn-next").disabled    = state.currentIndex >= state.cards.length - 1;

    // Kartenliste aufbauen
    const list = document.getElementById("card-list");
    list.innerHTML = "";

    state.cards.forEach((c, index) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.innerHTML = `<strong>${c.front}</strong> &rarr; ${c.back}`;

        const btn = document.createElement("button");
        btn.textContent = "Löschen";
        btn.className   = "delete-btn";
        btn.dataset.index = index;

        li.appendChild(span);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

// ============================================================
// 6. HANDLER
// ============================================================

function onFlip() {
    if (state.cards.length === 0) return;
    state.isFlipped = !state.isFlipped;
    render(); // kein saveState – isFlipped wird nicht gespeichert
}

function onCorrect() {
    state.score.correct++;
    goToNextCard();
}

function onWrong() {
    state.score.wrong++;
    goToNextCard();
}

function goToNextCard() {
    state.isFlipped = false;
    if (state.currentIndex < state.cards.length - 1) {
        state.currentIndex++;
    } else {
        state.currentIndex = 0; // am Ende → wieder von vorne
    }
    saveState();
    render();
}

function onPrev() {
    if (state.currentIndex > 0) {
        state.currentIndex--;
        state.isFlipped = false;
        saveState();
        render();
    }
}

function onNext() {
    if (state.currentIndex < state.cards.length - 1) {
        state.currentIndex++;
        state.isFlipped = false;
        saveState();
        render();
    }
}

function onAddCard(event) {
    event.preventDefault();

    const front = document.getElementById("input-front").value.trim();
    const back  = document.getElementById("input-back").value.trim();

    if (!front || !back) return;

    state.cards.push({ front, back });
    state.currentIndex = state.cards.length - 1;
    state.isFlipped    = false;

    saveState();
    render();
    event.target.reset();
}

function onDeleteCard(event) {
    // Event Delegation: nur auf Löschen-Buttons reagieren
    if (!event.target.classList.contains("delete-btn")) return;

    const index = parseInt(event.target.dataset.index);
    state.cards.splice(index, 1);

    if (state.currentIndex >= state.cards.length) {
        state.currentIndex = Math.max(0, state.cards.length - 1);
    }

    state.isFlipped = false;
    saveState();
    render();
}

function onReset() {
    state.score.correct = 0;
    state.score.wrong   = 0;
    state.currentIndex  = 0;
    state.isFlipped     = false;
    saveState();
    render();
}

// ============================================================
// 7. EVENTS REGISTRIEREN
// ============================================================

function registerEvents() {
    // Karte umdrehen (Button UND Klick auf die Karte selbst)
    document.getElementById("btn-flip").addEventListener("click", onFlip);
    document.getElementById("card-container").addEventListener("click", onFlip);

    // Bewertung
    document.getElementById("btn-correct").addEventListener("click", onCorrect);
    document.getElementById("btn-wrong").addEventListener("click", onWrong);

    // Navigation
    document.getElementById("btn-prev").addEventListener("click", onPrev);
    document.getElementById("btn-next").addEventListener("click", onNext);

    // Formular
    document.getElementById("add-form").addEventListener("submit", onAddCard);

    // Löschen (Event Delegation auf der Liste)
    document.getElementById("card-list").addEventListener("click", onDeleteCard);

    // Punkte zurücksetzen
    document.getElementById("btn-reset").addEventListener("click", onReset);
}

// ============================================================
// 8. INITIALISIERUNG
// ============================================================

loadState();
registerEvents();
render();
