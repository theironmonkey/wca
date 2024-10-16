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
        .then(response => response.json())
        .then(data => {
            allAbilities = data; // Store all abilities for filtering
            populateAbilities(allAbilities);
            populateWarbandDropdown(allAbilities);
        })
        .catch(error => console.error('Error fetching abilities:', error));
}

function populateAbilities(abilities) {
    const abilitiesContainer = document.getElementById('abilitiesContainer');
    abilitiesContainer.innerHTML = '';  // Clear container

    abilities.forEach(ability => {
        const abilityDiv = document.createElement('div');
        abilityDiv.className = 'ability';

        // Create and append the ability name
        const abilityTitle = document.createElement('h3');
        abilityTitle.textContent = ability.name;

        // Create and append the ability description
        const abilityDesc = document.createElement('p');
        abilityDesc.textContent = ability.description;

        // Create and append the cost
        const abilityCost = document.createElement('p');
        abilityCost.textContent = `Cost: ${ability.cost}`;
        abilityCost.className = 'cost';

        // Create and append the warband
        const abilityWarband = document.createElement('p');
        abilityWarband.textContent = `Warband: ${ability.warband}`;
        abilityWarband.className = 'warband';

        // Create and append the runemarks
        const abilityRunemarks = document.createElement('p');
        abilityRunemarks.textContent = `Runemarks: ${ability.runemarks.length > 0 ? ability.runemarks.join(', ') : 'None'}`;
        abilityRunemarks.className = 'runemarks';

        // Append all elements to the abilityDiv
        abilityDiv.appendChild(abilityTitle);
        abilityDiv.appendChild(abilityDesc);
        abilityDiv.appendChild(abilityCost);
        abilityDiv.appendChild(abilityWarband);
        abilityDiv.appendChild(abilityRunemarks);

        // Append the abilityDiv to the container
        abilitiesContainer.appendChild(abilityDiv);
    });
}

function populateWarbandDropdown(abilities) {
    const warbandFilter = document.getElementById('warbandFilter');
    const warbands = new Set();  // Use a Set to avoid duplicates

    abilities.forEach(ability => {
        warbands.add(ability.warband);
    });

    warbandFilter.innerHTML = '<option value="all">All Warbands</option>';  // Reset and add default option

    warbands.forEach(warband => {
        const option = document.createElement('option');
        option.value = warband;
        option.textContent = warband;
        warbandFilter.appendChild(option);
    });
}

function filterAbilities() {
    const selectedCost = document.getElementById('costFilter').value;
    const selectedAlliance = document.getElementById('grandAllianceFilter').value;
    const selectedRunemark = document.getElementById('runemarkFilter').value;
    const selectedWarband = document.getElementById('warbandFilter').value;

    let filteredAbilities = allAbilities;

    // Filter by cost
    if (selectedCost !== 'all') {
        filteredAbilities = filteredAbilities.filter(ability => ability.cost === selectedCost);
    }

    // Filter by grand alliance
    if (selectedAlliance !== 'all') {
        filteredAbilities = filteredAbilities.filter(ability => ability.grand_alliance === selectedAlliance);
    }

    // Filter by runemark
    if (selectedRunemark !== 'all') {
        filteredAbilities = filteredAbilities.filter(ability => ability.runemarks.includes(selectedRunemark));
    }

    // Filter by warband
    if (selectedWarband !== 'all') {
        filteredAbilities = filteredAbilities.filter(ability => ability.warband === selectedWarband);
    }

    // Repopulate the abilities based on the filters
    populateAbilities(filteredAbilities);
}
