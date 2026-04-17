// Stufe 1: Einfaches Promise
function holeBrief(inhalt) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Brief geholt: "${inhalt}"`);
            resolve(inhalt);
        }, 1000);
    });
}

// Stufe 2: Promise Chaining - stempelBrief
function stempelBrief(brief) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const gestempelterBrief = brief + " [Gestempelt]";
            console.log(`Brief gestempelt: "${gestempelterBrief}"`);
            resolve(gestempelterBrief);
        }, 1000);
    });
}

// Stufe 2: Promise Chaining - versendeBrief
function versendeBrief(brief) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const versendeterBrief = brief + " -> Versendet!";
            console.log(`Brief versendet: "${versendeterBrief}"`);
            resolve(versendeterBrief);
        }, 1000);
    });
}

// Demo: Alle drei Funktionen mit .then() chaining
console.log("=== Prozess startet ===");
holeBrief("Hallo Welt")
    .then(brief => stempelBrief(brief))
    .then(brief => versendeBrief(brief))
    .then(ergebnis => {
        console.log("=== Finales Ergebnis ===");
        console.log(ergebnis);
    })
    .catch(error => {
        console.error(`Fehler: ${error}`);
    });
