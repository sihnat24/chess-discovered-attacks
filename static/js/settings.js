/**
 * settings.js
 * handles the chessboard settings modal — lets users pick a board color theme,
 * previews swatches, and persists the choice to localstorage and the flask session
 */

let pendingTheme = localStorage.getItem('boardTheme') || 'brown';

function openSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
    // mark the currently active theme swatch as selected when opening the modal
    document.querySelectorAll('.theme-swatch').forEach(sw => {
        sw.classList.toggle('selected', sw.dataset.theme === pendingTheme);
    });
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function selectTheme(theme) {
    pendingTheme = theme;
    document.querySelectorAll('.theme-swatch').forEach(sw => {
        sw.classList.toggle('selected', sw.dataset.theme === theme);
    });
}

function saveSettings() {
    localStorage.setItem('boardTheme', pendingTheme);

    // Apply to all boards on the page immediately
    document.querySelectorAll('.chessboard').forEach(board => {
        board.classList.remove('theme-brown', 'theme-green', 'theme-blue', 'theme-highcontrast');
        board.classList.add('theme-' + pendingTheme);
        board.dataset.theme = pendingTheme;
    });

    // Also save to Flask session
    $.ajax({
        url: '/settings/save',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ theme: pendingTheme })
    });

    closeSettings();
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeSettings();
        });
    }

    // Apply saved theme on page load
    const saved = localStorage.getItem('boardTheme');
    if (saved) {
        document.querySelectorAll('.chessboard').forEach(board => {
            board.classList.remove('theme-brown', 'theme-green', 'theme-blue', 'theme-highcontrast');
            board.classList.add('theme-' + saved);
        });
    }
});
