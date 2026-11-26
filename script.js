
// Cocktail database

let cocktails = [];

// HTML elements

const container = document.getElementById("cocktail-container");
const searchBar = document.getElementById("search-bar");
const noResults = document.getElementById("no-results");
const details = document.getElementById("cocktail-details");

// Load cocktails from JSON

async function loadCocktails() {
    try {
        const response = await fetch("./cocktails.json");

        if (!response.ok) {
            throw new Error("Unable to load cocktails");
        }

        cocktails = await response.json();

        const glassOrder = [
    "Martini",
    "Nick & Nora",
    "Coupe",
    "Rocks",
    "Highball",
    "Wine Glass",
    "Champagne Flute"
];

cocktails.sort((a, b) => {
    const indexA = glassOrder.includes(a.glass)
        ? glassOrder.indexOf(a.glass)
        : glassOrder.length;

    const indexB = glassOrder.includes(b.glass)
        ? glassOrder.indexOf(b.glass)
        : glassOrder.length;

    return indexA - indexB || a.name.localeCompare(b.name);
});

        displayCocktails(cocktails);

    } catch (error) {
        console.error(error);
        noResults.textContent = "Unable to load cocktails.";
        noResults.hidden = false;
    }
}

// Display cocktail cards

function displayCocktails(list) {

    container.innerHTML = "";

    noResults.hidden = list.length !== 0;

    list.forEach(cocktail => {

        const card = document.createElement("article");

        card.className = "cocktail-card";
        card.tabIndex = 0;

        card.innerHTML = `
            <img src="${cocktail.image}" alt="${cocktail.name}" loading="lazy">
            <h2>${cocktail.name}</h2>
            <p>${cocktail.category}</p>
        `;

        card.addEventListener("click", () => {
            showCocktail(cocktail);
        });

        card.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                showCocktail(cocktail);
            }
        });

        container.appendChild(card);
    });
}

// Display cocktail details

function showCocktail(cocktail) {

    document.getElementById("cocktail-image").src = cocktail.image;
    document.getElementById("cocktail-image").alt = cocktail.name;
    document.getElementById("cocktail-name").textContent = cocktail.name;
    document.getElementById("cocktail-category").textContent = cocktail.category;
    document.getElementById("cocktail-method").textContent = cocktail.method;

    const ingredients = document.getElementById("cocktail-ingredients");

    ingredients.innerHTML = "";

    cocktail.ingredients.forEach(ingredient => {

        const item = document.createElement("li");

        item.textContent = ingredient;

        ingredients.appendChild(item);
    });

    details.showModal();
}

// Search engine

searchBar.addEventListener("input", () => {

    const query = searchBar.value.toLowerCase().trim();

    const results = cocktails.filter(cocktail => {

        const searchableText = `
            ${cocktail.name}
            ${cocktail.category}
            ${cocktail.name === "Sour" ? "Whiskey Sour Amaretto Sour" : ""}
        `.toLowerCase();

        return searchableText.includes(query);
    });

    displayCocktails(results);
});

// Close cocktail details

document.getElementById("close-details").addEventListener("click", () => {
    details.close();
});

// Close when clicking outside

details.addEventListener("click", event => {
    if (event.target === details) {
        const rect = details.getBoundingClientRect();

        if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        ) {
            details.close();
        }
    }
});

// Initialize application

loadCocktails();
