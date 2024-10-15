
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

    populateAbilities();
};

function toggleTheme() {
    const isDark = document.getElementById('themeToggle').checked;
    const theme = isDark ? darkTheme : lightTheme;
    Object.keys(theme).forEach(key => {
        document.body.style.setProperty(key, theme[key]);
    });
}
