
const darkTheme = {
    '--bg-color': '#121212',
    '--text-color': '#e0e0e0',
    '--heading-color': '#ffffff',
    '--container-bg': '#1e1e1e',
    '--border-color': '#333',
    '--ability-bg': '#2a2a2a'
};

const lightTheme = {
    '--bg-color': '#ffffff',
    '--text-color': '#000000',
    '--heading-color': '#333333',
    '--container-bg': '#f9f9f9',
    '--border-color': '#ddd',
    '--ability-bg': '#ffffff'
};

let allAbilities = []; // This will store the fetched abilities

window.onload = function() {
    const isDark = document.getElementById('themeToggle').checked;
    const theme = isDark ? darkTheme : lightTheme;
    Object.keys(theme).forEach(key => {
        document.body.style.setProperty(key, theme[key]);
    });

    fetchAbilities();  // Fetch and populate abilities from JSON

    // Add event listeners for the filters
    document.getElementById('costFilter').addEventListener('change', filterAbilities);
    document.getElementById('grandAllianceFilter').addEventListener('change', filterAbilities);
    document.getElementById('runemarkFilter').addEventListener('change', filterAbilities);
    document.getElementById('warbandFilter').addEventListener('change', filterAbilities);
};

function fetchAbilities() {
    fetch('abilities.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Abilities fetched:', data);  // Debug log
            allAbilities = data;
            populateAbilities(allAbilities);
            populateWarbandDropdown(allAbilities);
        })
        .catch(error => console.error('Error fetching abilities:', error));
}

function populateWarbandDropdown(abilities) {
    const warbandFilter = document.getElementById('warbandFilter');
    const warbands = new Set();

    abilities.forEach(ability => {
        console.log('Ability warband:', ability.warband);  // Debug log
        warbands.add(ability.warband);
    });

    warbandFilter.innerHTML = '<option value="all">All Warbands</option>';  // Reset and add default option

    warbands.forEach(warband => {
        if (warband) {  // Ensure warband is not empty or undefined
            const option = document.createElement('option');
            option.value = warband;
            option.textContent = warband;
            warbandFilter.appendChild(option);
        }
    });
    console.log('Warband dropdown populated:', warbands);  // Debug log
}

function toggleTheme() {
    const isDark = document.getElementById('themeToggle').checked;
    const theme = isDark ? darkTheme : lightTheme;
    Object.keys(theme).forEach(key => {
        document.body.style.setProperty(key, theme[key]);
    });
}
