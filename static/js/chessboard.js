/**
 * THIS WAS CREATED USING some prompting from claude for help!
 * renders an interactive chessboard from a list of piece objects.
 * handles square clicks, highlight overlays, and the move list panel.
 */

// unicode chess piece map: maps piece letter codes to their unicode symbols
const PIECE_UNICODE = {
    // white pieces use uppercase letters
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    // black pieces use lowercase letters
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

// normalization map for alternate piece codes used in older prototype data
const PIECE_NORMALIZE = {
    'd': 'K',  // King alternate used in prototype
};

/**
 * convert algebraic square notation (e.g. "e4") to [col 0-7, row 0-7]
 * col: a=0 ... h=7
 * row: 1=0 ... 8=7
 */
function squareToColRow(sq) {
    const col = sq.charCodeAt(0) - 'a'.charCodeAt(0); // 0-7
    const row = parseInt(sq[1]) - 1;                    // 0-7
    return [col, row];
}

/**
 * render a chessboard into the given container element.
 * @param {HTMLElement} container  - the .chessboard div to populate
 * @param {Array}       pieces     - array of {square, piece, color} objects describing the position
 * @param {Object}      options    - { clickable: 'w'|'b'|'all'|null, onSquareClick: fn(square, pieceObj) }
 */
function renderBoard(container, pieces, options = {}) {
    container.innerHTML = '';

    const theme = container.dataset.theme || 'brown';

    // build a square-keyed map for fast piece lookup during rendering
    const pieceMap = {};
    for (const p of pieces) {
        pieceMap[p.square] = p;
    }

    // render rank 8 down to rank 1 so the board reads top-to-bottom from white's perspective
    for (let rank = 8; rank >= 1; rank--) {
        // rank label: numeric label on the left side of each row
        const rankLabel = document.createElement('div');
        rankLabel.className = 'board-rank-label';
        rankLabel.textContent = rank;
        container.appendChild(rankLabel);

        // loop through all 8 files (a through h) to build each square in the row
        for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
            const file = String.fromCharCode('a'.charCodeAt(0) + fileIdx);
            const squareName = file + rank;

            const sq = document.createElement('div');
            sq.className = 'board-square';
            sq.dataset.square = squareName;

            // determine whether this square is light or dark based on file + rank parity
            const isLight = (fileIdx + rank) % 2 === 1;
            sq.classList.add(isLight ? 'sq-light' : 'sq-dark');

            // if a piece occupies this square, render its unicode symbol with appropriate color styling
            const pieceData = pieceMap[squareName];
            if (pieceData) {
                const span = document.createElement('span');
                let pieceChar = pieceData.piece;
                // convert any alternate piece codes to standard notation before lookup
                if (PIECE_NORMALIZE[pieceChar]) pieceChar = PIECE_NORMALIZE[pieceChar];
                // uppercase = white piece, lowercase = black piece
                if (pieceData.color === 'w') {
                    pieceChar = pieceChar.toUpperCase();
                } else {
                    pieceChar = pieceChar.toLowerCase();
                }
                span.textContent = PIECE_UNICODE[pieceChar] || '?';
                span.className = pieceData.color === 'w' ? 'piece-white' : 'piece-black';
                span.dataset.pieceType = pieceChar;
                sq.appendChild(span);

                // attach a click handler if this piece's color matches the clickable option
                const clickable = options.clickable;
                if (clickable === 'w' && pieceData.color === 'w') {
                    sq.style.cursor = 'pointer';
                    sq.addEventListener('click', () => {
                        if (options.onSquareClick) options.onSquareClick(squareName, pieceData);
                    });
                } else if (clickable === 'b' && pieceData.color === 'b') {
                    sq.style.cursor = 'pointer';
                    sq.addEventListener('click', () => {
                        if (options.onSquareClick) options.onSquareClick(squareName, pieceData);
                    });
                } else if (clickable === 'all') {
                    sq.style.cursor = 'pointer';
                    sq.addEventListener('click', () => {
                        if (options.onSquareClick) options.onSquareClick(squareName, pieceData);
                    });
                }
            }

            container.appendChild(sq);
        }
    }
}

/**
 * highlight a single square by adding a css class to it.
 * @param {HTMLElement} boardEl
 * @param {string} square  e.g. "e4"
 * @param {string} cls     css class to add (e.g. sq-correct, sq-wrong, sq-selected)
 */
function highlightSquare(boardEl, square, cls) {
    const sq = boardEl.querySelector(`[data-square="${square}"]`);
    if (sq) sq.classList.add(cls);
}

/**
 * remove all highlights of a given css class from every square on the board.
 */
function clearHighlights(boardEl, cls) {
    boardEl.querySelectorAll('.' + cls).forEach(el => el.classList.remove(cls));
}

/**
 * apply the "selected" highlight to a square, clearing any previously selected square first.
 */
function selectSquare(boardEl, square) {
    clearHighlights(boardEl, 'sq-selected');
    highlightSquare(boardEl, square, 'sq-selected');
}

/**
 * build a text move list from the pieces array, grouped by color into white and black arrays.
 */
function buildMoveList(pieces) {
    const white = [];
    const black = [];
    for (const p of pieces) {
        let char = p.piece;
        if (PIECE_NORMALIZE[char]) char = PIECE_NORMALIZE[char];
        const unicode = PIECE_UNICODE[p.color === 'w' ? char.toUpperCase() : char.toLowerCase()] || char;
        const entry = `${unicode} ${p.square}`;
        if (p.color === 'w') white.push(entry);
        else black.push(entry);
    }
    return { white, black };
}

/**
 * apply a saved board theme to all chessboard elements on the page.
 */
function applyBoardTheme(theme) {
    document.querySelectorAll('.chessboard').forEach(board => {
        // strip all existing theme classes before applying the new one
        board.classList.remove('theme-brown', 'theme-green', 'theme-blue', 'theme-highcontrast');
        board.classList.add('theme-' + theme);
        board.dataset.theme = theme;
    });
}

// on load, apply the saved board theme from localstorage if one was previously set
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('boardTheme');
    if (savedTheme) applyBoardTheme(savedTheme);
});
