/**
 * learn.js
 * handles the learn page boards — renders static illustration boards for each lesson
 * and manages the attacker-type toggle on lesson 2
 */

// static piece positions used to render demo boards in each lesson
const LESSON_BOARDS = {
    2: {
        Bishop: [
            { square: 'b2', piece: 'B', color: 'w' },
            { square: 'b5', piece: 'P', color: 'w' },  // blocker
            { square: 'g7', piece: 'k', color: 'b' },
        ],
        Rook: [
            { square: 'b1', piece: 'R', color: 'w' },
            { square: 'b4', piece: 'N', color: 'w' },  // blocker
            { square: 'b8', piece: 'k', color: 'b' },
        ],
        Queen: [
            { square: 'a1', piece: 'Q', color: 'w' },
            { square: 'd4', piece: 'P', color: 'w' },  // blocker
            { square: 'h8', piece: 'k', color: 'b' },
        ],
    },
    3: [
        { square: 'b8', piece: 'k', color: 'b' },
        { square: 'f6', piece: 'q', color: 'b' },
        { square: 'b5', piece: 'B', color: 'w' },  // blocker bishop
        { square: 'b1', piece: 'R', color: 'w' },  // hidden attacker
    ],
    4: [
        { square: 'h8', piece: 'q', color: 'b' },
        { square: 'a5', piece: 'N', color: 'w' },  // blocker (was on b3)
        { square: 'b2', piece: 'B', color: 'w' },  // hidden attacker
    ],
};

$(document).ready(function () {
    if (typeof LESSON_DATA === 'undefined') return;

    const boardEl = document.getElementById('learnBoard');
    if (!boardEl || !LESSON_DATA.has_board) return;

    // apply the saved board theme from localstorage before rendering
    const savedTheme = localStorage.getItem('boardTheme');
    if (savedTheme) {
        boardEl.classList.remove('theme-brown', 'theme-green', 'theme-blue', 'theme-highcontrast');
        boardEl.classList.add('theme-' + savedTheme);
    }

    const pieces = LESSON_BOARDS[LESSON_NUM];
    if (!pieces) return;

    if (LESSON_NUM === 2) {
        // lesson 2 uses a toggle board; initialize it with the bishop example by default
        renderBoard(boardEl, pieces['Bishop'], { clickable: null });
    } else if (Array.isArray(pieces)) {
        renderBoard(boardEl, pieces, { clickable: null });
    }
});

function togglePiece(pieceName, btn) {
    // update the active state on toggle buttons to reflect the currently selected piece type
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const boardEl = document.getElementById('learnBoard');
    if (!boardEl) return;

    const pieces = LESSON_BOARDS[2];
    if (pieces && pieces[pieceName]) {
        renderBoard(boardEl, pieces[pieceName], { clickable: null });
    }
}
