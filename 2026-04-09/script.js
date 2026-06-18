import persons from "./person.json" with { type: "json" };
console.log(persons);

// "id": 6,
// "name": "Sophie Dubois",
// "groesse": 168,
// "geburtsdatum": "1994-03-10",
// "herkunft": "Frankreich",
// "gewicht": 59.5 -->

function renderPersons() {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";
    for (const person of persons) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${person.id}</td>
            <td>${person.name}</td>
            <td>${person.groesse}</td>
            <td>${person.geburtsdatum}</td>
            <td>${person.herkunft}</td>
            <td>${person.gewicht}</td>
        `;
        tbody.appendChild(tr);
    }
}

const sortState = {
    id: 1,
    name: 1,
    groesse: 1,
    geburtsdatum: 1,
    herkunft: 1,
    gewicht: 1
};

const thId = document.querySelector("#id");
thId.addEventListener("click", () => {
    console.log("id clicked!!");
    sortState.id *= -1;
    persons.sort((a, b) => (a.id - b.id) * sortState.id);
    renderPersons();
});

const thName = document.querySelector("#name");
thName.addEventListener("click", () => {
    console.log("name clicked!!");
    sortState.name *= -1;
    persons.sort((a, b) => a.name.localeCompare(b.name) * sortState.name);
    renderPersons();
});

const thHeight = document.querySelector("#groesse");
thHeight.addEventListener("click", () => {
    console.log("height clicked!!");
    sortState.groesse *= -1;
    persons.sort((a, b) => (a.groesse - b.groesse) * sortState.groesse);
    renderPersons();
});

const thBirthday = document.querySelector("#geburtsdatum");
thBirthday.addEventListener("click", () => {
    console.log("birthday clicked!!");
    sortState.geburtsdatum *= -1;
    persons.sort((a, b) => a.geburtsdatum.localeCompare(b.geburtsdatum) * sortState.geburtsdatum);
    renderPersons();
});

const thOrigin = document.querySelector("#herkunft");
thOrigin.addEventListener("click", () => {
    console.log("origin clicked!!");
    sortState.herkunft *= -1;
    persons.sort((a, b) => a.herkunft.localeCompare(b.herkunft) * sortState.herkunft);
    renderPersons();
});

const thWeight = document.querySelector("#gewicht");
thWeight.addEventListener("click", () => {
    console.log("weight clicked!!");
    sortState.gewicht *= -1;
    persons.sort((a, b) => (a.gewicht - b.gewicht) * sortState.gewicht);
    renderPersons();
});


window.renderPersons = renderPersons;
renderPersons();