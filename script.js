// Store the abilities and active filters
let allAbilities = [];
let activeFilters = {
    warband: 'All Warbands',
    cost: 'All Costs',
    grandAlliance: 'All Grand Alliances',
    runemark: 'All Runemarks'
};

// Fetch all the abilities on page load
window.onload = function() {
    fetchAbilities();
};

// Event listener for the search bar
document.getElementById('searchBar').addEventListener('input', searchAbilities);

// Dark mode functionality
const darkModeToggle = document.getElementById('darkModeToggle');
// Set dark mode default
if (darkModeToggle.checked) {
    document.body.classList.add('dark-mode');
}
// Event listener for the toggle switch
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Fetch abilities data from the JSON file
function fetchAbilities() {
    fetch('abilities.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('ERROR: NETWORK RESPONSE');
            }
            return response.json();
        })
        .then(data => {
            allAbilities = data; // Store fetched abilities
            populateDropdowns(allAbilities); // Populate filters dropdowns
            populateAbilities(allAbilities); // Populate abilities display
        })
        .catch(error => console.error('ERROR: CANNOT FETCH ABILITIES', error));
};

// Populate dropdowns from the JSON file
function populateDropdowns(abilities) {
    const warbandFilter = document.getElementById('warbandFilter');
    const costFilter = document.getElementById('costFilter');
    const grandAllianceFilter = document.getElementById('grandAllianceFilter');
    const runemarkFilter = document.getElementById('runemarkFilter');

    // Create sets to store unique filter values
    const warbands = new Set();
    const costs = new Set();
    const grandAlliances = new Set();
    const runes = new Set();

    // Collect unique values for each filter
    abilities.forEach(ability => {
        if (ability.warband) warbands.add(ability.warband);
        if (ability.cost) costs.add(ability.cost);
        if (ability.grand_alliance) grandAlliances.add(ability.grand_alliance);
        if (ability.runemarks) ability.runemarks.forEach(rune => runes.add(rune));
    });

    // Populate dropdowns with collected data
    populateDropdown(warbandFilter, warbands, 'warband');
    populateDropdown(costFilter, costs, 'cost');
    populateDropdown(grandAllianceFilter, grandAlliances, 'grandAlliance');
    populateDropdown(runemarkFilter, runes, 'runemark');
}

// Helper function to populate a dropdown
function populateDropdown(filterElement, dataSet, dataAttribute) {
    // Sort the data and create list items for each unique value
    Array.from(dataSet).sort().forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'dropdown-item';
        link.textContent = item;
        link.dataset[dataAttribute] = item;

        // Event listener for filtering dropdown
        link.addEventListener('click', (event) => {
            // Update selected filter
            activeFilters[dataAttribute] = event.target.dataset[dataAttribute]; 
            // Update filter text display
            updateFilterDisplay();
            // Filter abilities based on the selected values
            searchAbilities(allAbilities);
        });

        listItem.appendChild(link);
        filterElement.appendChild(listItem);
    });
}

// Populate abilities on the page
function populateAbilities(abilities) {
    const abilitiesContainer = document.getElementById('abilitiesContainer');
    const abilityCountDisplay = document.getElementById('abilityCount'); // Element to display the count
    abilitiesContainer.innerHTML = ''; // Clear container

    const warbandSections = {}; // Object to hold sections for each warband

    // Check if any abilities match the filters
    if (abilities.length === 0) {
        abilitiesContainer.innerHTML = '<p>No abilities match the selected filters or search.</p>'; // Updated message
    } else {
        // Update count display
        abilityCountDisplay.textContent = `Results: ${abilities.length}`; // Display the count

        // Loop through each ability and organize them by warband
        abilities.forEach(ability => {
            if (!warbandSections[ability.warband]) {
                const warbandSection = document.createElement("div");
                warbandSection.classList.add("warband-section");
                warbandSection.setAttribute("data-warband", ability.warband);
                warbandSection.innerHTML = `<h2>${ability.warband}</h2>`;
                abilitiesContainer.appendChild(warbandSection);
                warbandSections[ability.warband] = warbandSection; // Store the section in the map
            }

            const abilityDiv = createAbilityDiv(ability); // Create a div for the ability
            warbandSections[ability.warband].appendChild(abilityDiv); // Append ability div to the respective warband section
        });
    }
}

function createAbilityDiv(ability) {
    const abilityDiv = document.createElement("div");
    abilityDiv.classList.add("card", "mb-3", "hover-shadow"); // Add custom hover-shadow class

    // Populate the ability div with its details
    abilityDiv.innerHTML = `
        <div class="card-body">
            
            <div class="row">
                <div class="col border-end pe-2">
                    <h5 class="card-title">${ability.name ?? 'Information unavailable'}</h5>
                    <p class="description card-text">${ability.description ?? 'Information unavailable'}</p>
                </div>
                <div class="col-auto d-flex flex-column align-items-end"> <!-- Right column with auto width --> 
                    <p class="grand_alliance card-text mb-1"><b>Grand Alliance:</b> ${ability.grand_alliance ?? 'Information unavailable'}</p>
                    <p class="runemarks card-text mb-1"><b>Runemarks:</b> ${ability.runemarks?.length > 0 ? ability.runemarks.join(", ") : 'none'}</p>
                    <p class="cost card-text mb-1"><b>Cost:</b> ${ability.cost ?? 'Information unavailable'}</p>
                </div>
            </div>
        </div>
    `;

    return abilityDiv; // Return the newly created element
}

// Function to handle search and filtering
function searchAbilities() {
    // Get the current value of the search bar
    const query = document.getElementById('searchBar').value.trim().toLowerCase();

    // Filter abilities based on active filters and the search query
    const results = filterAbilities(allAbilities, query); // Pass the search query here

    // Populate the abilities container with the results
    populateAbilities(results); // Call with the filtered results based on search and filters
}

// Modify the filterAbilities function to accept the search query
function filterAbilities(abilities, searchQuery) {
    const { warband, cost, grandAlliance, runemark } = activeFilters;

    // Normalize the search query
    const normalizedSearchQuery = searchQuery ? searchQuery.trim().toLowerCase() : '';
    const isSearchValid = normalizedSearchQuery.length > 0; // Check if the search query is not empty

    return abilities.filter(ability => {
        // Check if ability matches the selected filters
        const matchesWarband = (warband === 'All Warbands' || ability.warband === warband);
        const matchesCost = (cost === 'All Costs' || ability.cost === cost);
        const matchesGrandAlliance = (grandAlliance === 'All Grand Alliances' || ability.grand_alliance === grandAlliance);
        const matchesRunemark = (runemark === 'All Runemarks' || (ability.runemarks && ability.runemarks.includes(runemark)));

        // Prepare for search filtering
        const abilityName = ability.name ? ability.name.toLowerCase() : '';
        const abilityWarband = ability.warband ? ability.warband.toLowerCase() : '';
        const abilityDescription = ability.description ? ability.description.toLowerCase() : '';
        const abilityCost = ability.cost ? ability.cost.toLowerCase() : '';
        const abilityGrandAlliance = ability.grand_alliance ? ability.grand_alliance.toLowerCase() : '';
        const abilityRunemarks = ability.runemarks ? ability.runemarks.join(' ').toLowerCase() : '';

        // Determine if ability matches search terms using AND operation
        const matchesSearch = isSearchValid ? 
            normalizedSearchQuery.split(/\s+/).every(term =>
                abilityName.includes(term) ||
                abilityWarband.includes(term) ||
                abilityDescription.includes(term) ||
                abilityCost.includes(term) ||
                abilityGrandAlliance.includes(term) ||
                abilityRunemarks.includes(term)
            ) : true; // If no search, consider it a match

        // Return true only if it matches all filters AND the search (if applicable)
        return matchesWarband && matchesCost && matchesGrandAlliance && matchesRunemark && (isSearchValid ? matchesSearch : true);
    });
}






// Update active filters text display
function updateFilterDisplay() {
    const filtersDisplay = document.getElementById("filtersDisplay");
    const appliedFilters = []; // Array to hold active filters for display
    // Loop through active filters to display the text
    for (const [key, value] of Object.entries(activeFilters)) {
        if (value !== 'All Warbands' && value !== 'All Costs' && value !== 'All Grand Alliances' && value !== 'All Runemarks') {
            appliedFilters.push(`${key}: ${value}`);
        }
    }
    // Update the filter text display
    filtersDisplay.textContent = appliedFilters.length ? appliedFilters.join(', ') : 'None';
}

// Clear filters button
function clearFilters() {
    // Reset the active filters
    activeFilters = {
        warband: 'All Warbands',
        cost: 'All Costs',
        grandAlliance: 'All Grand Alliances',
        runemark: 'All Runemarks'
    };
    // Clear the filters text display
    updateFilterDisplay();
    // Clear the search bar
    document.getElementById('searchBar').value = '';
    // Repopulate the abilities without any filters
    populateAbilities(allAbilities);
}