const elementsDiv = document.getElementById('elements');
const board = document.getElementById('board');
const discoveredList = document.getElementById('list');
const resetButton = document.getElementById('reset');

let draggedElement = null;
let boardElements = [];

const baseElements = ["Feu", "Eau", "Terre", "Air"];
const emojis = {
    "Feu": "🔥", "Eau": "💧", "Terre": "🌍", "Air": "🌬️",
    "Vapeur": "💨", "Boue": "🪵", "Énergie": "⚡", "Lave": "🌋",
    "Pluie": "🌧️", "Plante": "🌱", "Cendre": "🪨", "Nuage": "☁️", "Pierre": "🪨"
};

const recipes = {
    "Feu+Eau": "Vapeur",
    "Eau+Terre": "Boue",
    "Air+Feu": "Énergie",
    "Terre+Feu": "Lave",
    "Air+Eau": "Pluie",
    "Terre+Eau": "Plante",
    "Plante+Feu": "Cendre",
    "Air+Pluie": "Nuage",
    "Lave+Eau": "Pierre"
};

const discovered = new Set(JSON.parse(localStorage.getItem("discovered")) || baseElements);

function createElementDiv(name) {
    const div = document.createElement('div');
    div.className = 'item';
    div.draggable = true;
    div.dataset.element = name;
    div.textContent = (emojis[name] || '') + ' ' + name;

    div.addEventListener('dragstart', () => {
        draggedElement = name;
    });

    elementsDiv.appendChild(div);
}

function updateDiscovered(name) {
    if (!discovered.has(name)) {
        discovered.add(name);
        localStorage.setItem("discovered", JSON.stringify(Array.from(discovered)));

        const li = document.createElement('li');
        li.textContent = (emojis[name] || '') + ' ' + name;
        discoveredList.appendChild(li);

        createElementDiv(name);
    }
}

function populateDiscoveredList() {
    discoveredList.innerHTML = '';
    discovered.forEach(el => {
        const li = document.createElement('li');
        li.textContent = (emojis[el] || '') + ' ' + el;
        discoveredList.appendChild(li);
    });
}

function populateElements() {
    elementsDiv.innerHTML = '';
    discovered.forEach(el => createElementDiv(el));
}

board.addEventListener('dragover', (e) => {
    e.preventDefault();
});

board.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedElement) {
        boardElements.push(draggedElement);

        const el = document.createElement('div');
        el.textContent = (emojis[draggedElement] || '') + ' ' + draggedElement;
        el.className = 'item';
        board.appendChild(el);

        if (boardElements.length >= 2) {
            const [el1, el2] = boardElements.slice(-2);
            const combo1 = `${el1}+${el2}`;
            const combo2 = `${el2}+${el1}`;
            const result = recipes[combo1] || recipes[combo2];
            if (result) {
                setTimeout(() => {
                    alert(`💥 Vous avez créé : ${result}`);
                    updateDiscovered(result);
                }, 100);
            }
        }
    }
});

resetButton.addEventListener('click', () => {
    localStorage.clear();
    discovered.clear();
    baseElements.forEach(e => discovered.add(e));
    populateDiscoveredList();
    populateElements();
    board.innerHTML = '<p>Déposez ici pour combiner</p>';
});

populateDiscoveredList();
populateElements();
