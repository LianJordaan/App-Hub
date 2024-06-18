function getXP(level) {
    if (level > 0 && level <= 16) {
        return level * level + (6 * level);
    } else if (level <= 31) {
        return (2.5 * (level * level)) - (40.5 * level) + 360;
    } else {
        return (4.5 * (level * level)) - (162.5 * level) + 2220;
    }
}

function calculateXP() {
    const levelInput = document.getElementById("levelInput").value;
    const level = parseInt(levelInput);
    if (!isNaN(level) && level > 0) {
        const xp = getXP(level);
        document.getElementById("result").textContent = `Total XP needed: ${xp}`;
    } else {
        document.getElementById("result").textContent = "Please enter a valid level.";
    }
}

function generateTable() {
    const maxLevelInput = document.getElementById("maxLevelInput").value || 50;
    const maxLevel = parseInt(maxLevelInput);
    const maxRowsPerColumn = 5; // Maximum number of rows per column
    if (!isNaN(maxLevel) && maxLevel > 0) {
        let tableHTML = '<div class="xp-table-grid">';
        const columns = Math.ceil(maxLevel / maxRowsPerColumn);
        for (let col = 0; col < columns; col++) {
            tableHTML += '<div class="xp-table-column"><table><tr><th>Level</th><th>XP</th></tr>';
            for (let row = 0; row < maxRowsPerColumn; row++) {
                const level = col * maxRowsPerColumn + row + 1;
                if (level > maxLevel) break;
                const xp = getXP(level);
                tableHTML += `<tr><td>${level}</td><td>${xp}</td></tr>`;
            }
            tableHTML += '</table></div>';
        }
        tableHTML += '</div>';
        document.getElementById("xpTable").innerHTML = tableHTML;
    } else {
        document.getElementById("xpTable").textContent = "Please enter a valid max level.";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Set default values
    document.getElementById("levelInput").value = 1;
    document.getElementById("maxLevelInput").value = 50;

    // Trigger initial calculations
    calculateXP();
    generateTable();
});
