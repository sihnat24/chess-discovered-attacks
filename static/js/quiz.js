/**
 * short lil summary of quiz.js
 * handles all quiz page interactivity:
 * - renders the chessboard with clickable pieces for the active side
 * - submits the selected square as an answer via ajax and evaluates the response
 * - highlights the correct answer in green and a wrong pick in red
 * - handles hint toggle visibility and the board layout move list panel
 */

let answered = false;
let selectedSquare = null;

$(document).ready(function () {
    const boardEl = document.getElementById('chessboard');
    if (!boardEl || !QUESTION_DATA) return;

    // apply the saved board theme from localstorage before rendering the board
    const savedTheme = localStorage.getItem('boardTheme');
    if (savedTheme) {
        boardEl.classList.remove('theme-brown', 'theme-green', 'theme-blue', 'theme-highcontrast');
        boardEl.classList.add('theme-' + savedTheme);
        boardEl.dataset.theme = savedTheme;
    }

    // render the board and attach click handlers to all pieces on the active side
    renderBoard(boardEl, QUESTION_DATA.pieces, {
        clickable: 'w',
        onSquareClick: handleSquareClick
    });

    // populate the board layout panel with a grouped list of all pieces by color
    const { white, black } = buildMoveList(QUESTION_DATA.pieces);
    const moveListEl = document.getElementById('moveListContent');
    if (moveListEl) {
        let html = '<strong>White:</strong><br>';
        html += white.map(e => `<div class="move-list-item">${e}</div>`).join('');
        html += '<br><strong>Black:</strong><br>';
        html += black.map(e => `<div class="move-list-item">${e}</div>`).join('');
        moveListEl.innerHTML = html;
    }
});

function handleSquareClick(square, pieceData) {
    if (answered) return;

    selectedSquare = square;

    // visually mark the clicked square as selected with a border highlight
    const boardEl = document.getElementById('chessboard');
    selectSquare(boardEl, square);

    // clear any previously shown wrong feedback box before processing the new click
    $('#feedbackBox').hide().removeClass('feedback-wrong');

    // immediately submit the clicked square as the user's answer
    submitAnswer(square);
}

function submitAnswer(square) {
    if (answered) return;
    answered = true;

    $.ajax({
        url: SUBMIT_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ square: square }),
        success: function (resp) {
            const boardEl = document.getElementById('chessboard');

            if (resp.correct) {
                // highlight the correct square green and clear the selection marker
                highlightSquare(boardEl, square, 'sq-correct');
                clearHighlights(boardEl, 'sq-selected');

                showAnswerArea(true, '✓ Correct!', resp.explanation, resp.next_url);
            } else {
                // highlight the selected square red to show it was wrong
                highlightSquare(boardEl, square, 'sq-wrong');
                clearHighlights(boardEl, 'sq-selected');

                // show the wrong feedback message inline if the server returned one
                if (resp.wrong_feedback) {
                    $('#feedbackBox')
                        .addClass('feedback-wrong')
                        .text(resp.wrong_feedback)
                        .show();
                }

                // wait briefly so the user sees their wrong pick before the correct answer is revealed
                setTimeout(() => {
                    highlightSquare(boardEl, resp.correct_square, 'sq-correct');
                    showAnswerArea(false, '✗ Not quite!', resp.explanation, resp.next_url);
                }, 900);
            }
        },
        error: function () {
            answered = false;
            alert('Error submitting answer. Please try again.');
        }
    });
}

function showAnswerArea(correct, resultText, explanation, nextUrl) {
    const resultEl = document.getElementById('answerResult');
    const explEl = document.getElementById('explanationText');
    const nextBtn = document.getElementById('nextBtn');

    resultEl.textContent = resultText;
    resultEl.className = 'answer-result ' + (correct ? 'answer-correct' : 'answer-wrong');
    explEl.textContent = explanation;
    nextBtn.href = nextUrl;
    nextBtn.textContent = nextUrl.includes('results') ? 'See Results →' : 'Next Question →';

    $('#answerArea').fadeIn(300);
}

function toggleHint() {
    const hint = document.getElementById('hintText');
    const btn = document.getElementById('hintToggle');
    if (hint.style.display === 'none') {
        $(hint).slideDown(200);
        btn.textContent = 'Hide Hint';
    } else {
        $(hint).slideUp(200);
        btn.textContent = 'Hint';
    }
}

function toggleMoveList() {
    const panel = document.getElementById('moveListPanel');
    if (panel.style.display === 'none') {
        $(panel).slideDown(200);
    } else {
        $(panel).slideUp(200);
    }
}
