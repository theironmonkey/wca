
const lightTheme = {
    '--bg-color': '#f4f4f9',
    '--text-color': '#333',
    '--heading-color': '#333',
    '--container-bg': '#fff',
    '--border-color': '#ddd',
    '--ability-bg': '#f9f9f9'
};

const darkTheme = {
    '--bg-color': '#121212',
    '--text-color': '#f4f4f9',
    '--heading-color': '#f4f4f9',
    '--container-bg': '#1e1e1e',
    '--border-color': '#444',
    '--ability-bg': '#2c2c2c'
};

window.onload = function() {
    const isDark = document.getElementById('themeToggle').checked;
    const theme = isDark ? darkTheme : lightTheme;
    Object.keys(theme).forEach(key => {
        document.body.style.setProperty(key, theme[key]);
    });

    fetchAbilities();  // Fetch and populate abilities from JSON
};

function toggleTheme() {
    const isDark = document.getElementById('themeToggle').checked;
    const theme = isDark ? darkTheme : lightTheme;
    Object.keys(theme).forEach(key => {
        document.body.style.setProperty(key, theme[key]);
    });
}

function fetchAbilities() {
    fetch('abilities.json')
        .then(response => response.json())
        .then(data => populateAbilities(data))
        .catch(error => console.error('Error fetching abilities:', error));
}

function populateAbilities(abilities) {
    const abilitiesContainer = document.getElementById('abilitiesContainer');
    abilitiesContainer.innerHTML = '';  // Clear container

    abilities.forEach(ability => {
        const abilityDiv = document.createElement('div');
        abilityDiv.className = 'ability';

        const abilityTitle = document.createElement('h3');
        abilityTitle.textContent = ability.name;

        const abilityDesc = document.createElement('p');
        abilityDesc.textContent = ability.description;

        const abilityCost = document.createElement('p');
        abilityCost.textContent = `Cost: ${ability.cost}`;
        abilityCost.className = 'cost';

        abilityDiv.appendChild(abilityTitle);
        abilityDiv.appendChild(abilityDesc);
        abilityDiv.appendChild(abilityCost);

        abilitiesContainer.appendChild(abilityDiv);
    });
}
