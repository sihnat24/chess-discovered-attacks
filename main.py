from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'chess_discovered_attacks_2024'

LESSONS = [
    {
        "id": 1,
        "title": "Setting the Scene",
        "content": "A discovered attack occurs when a piece moves to reveal a hidden attack from a bishop, rook, or queen behind it.",
        "subtext": "This only applies to these three pieces, as they can span the whole board!",
        "type": "intro",
        "next": 2
    },
    {
        "id": 2,
        "title": "Anatomy of a Discovered Attack",
        "content": "A discovered attack has 3 components.",
        "components": [
            {"label": "Blocker", "color": "#5c3d8f", "desc": "the piece that moves, opening the line for the attacker behind it"},
            {"label": "Attacker", "color": "#e87c1e", "desc": "the bishop, rook, or queen that gains a new lane the moment the blocker clears"},
            {"label": "Target", "color": "#cc2200", "desc": "the piece threatened by the new lane of attack"}
        ],
        "type": "anatomy",
        "board": {
            "g8": "bQ", "b2": "wB", "c3": "wP"
        },
        "next": 3
    },
    {
        "id": 3,
        "title": "Watch It Play Out",
        "content": "When the bishop moves, the king will get checked AND the bishop attacks the queen!",
        "type": "animation",
        "board": {
            "b8": "bK", "g8": "bQ",
            "b2": "wB", "c3": "wP", "b1": "wR"
        },
        "next": 4
    },
    {
        "id": 4,
        "title": "Creating Two Attacks!",
        "content": "",
        "bullets": [
            "The blocking piece creates an attack by moving, but what if it ALSO lands on a threatening square?",
            "If you can create 2 attacks at once, you can guarantee the opponent loses some material!"
        ],
        "type": "double",
        "board": {
            "h8": "bQ", "b2": "wB", "c3": "wP", "b1": "wR"
        },
        "next": 5
    },
    {
        "id": 5,
        "title": "Do You See the Move?",
        "content": "Here, we can move the rook to create two threats at the same time. Do you see the move?",
        "type": "example",
        "board": {
            "d8": "bK", "a7": "bQ", "b6": "bP", "b5": "bN",
            "d4": "bP",
            "a8": "wR", "g2": "wR", "f1": "wB", "b1": "wK"
        },
        "next": 6
    },
    {
        "id": 6,
        "title": "After Rook to g7...",
        "content": "After rook to g7, black is unable to defend both the rook and bishop simultaneously!",
        "type": "reveal",
        "board": {
            "d8": "bK", "a7": "bQ", "b6": "bP", "b5": "bN",
            "d4": "bP",
            "a8": "wR", "g7": "wR", "f1": "wB", "b1": "wK"
        },
        "next": None
    }
]

QUIZ_QUESTIONS = [
   {
    "id": 1,
    "category": "Identification",
    "title": "Identify the Decoy",
    "instructions": "White's move. Click on the piece that is the DECOY (blocker) — the piece that should move to reveal the hidden attacker.",
    "hint": "Look for pieces near open lanes to target pieces.",
    "answer_square": "e4",
    "wrong_message": "Not quite! That piece doesn't open up a line for a hidden attacker. Try looking for a piece blocking a rook, bishop, or queen.",
    "correct_message": "Correct! The knight on e4 is the decoy — moving it reveals the bishop on g2's long diagonal, attacking the rook on a8!",
    "board_theme": "green",
    "pieces": {
        "a8": "bR", "h8": "bR",
        "c7": "bP", "d7": "bP", "f7": "bP",
        "b6": "bB", "e6": "bP", "g6": "bP",
        "e8": "bK",
        "e4": "wN",
        "c3": "wB",
        "g3": "wQ",
        "a2": "wP", "b2": "wP", "c2": "wP", "e2": "wP", "h2": "wP",
        "c1": "wK", "g2": "wB"
        },
    "clickable": "w"
    },
    {
    "id": 2,
    "category": "Identification",
    "title": "Identify the Blocking Piece",
    "instructions": "White's move. Click on the piece that is the BLOCKING PIECE — the piece that should move to reveal the hidden attacker.",
    "hint": "Look for pieces near open lanes to target pieces.",
    "answer_square": "e2",
    "wrong_message": "Not quite! That piece doesn't open up a line for a hidden attacker. Try looking for a piece blocking a rook, bishop, or queen.",
    "correct_message": "Correct! The pawn on e2 is the blocking piece — moving it reveals the bishop on g2's diagonal, opening an attack!",
    "board_theme": "green",
    "pieces": {
        "d4":"bN",
        "a8": "bR", "h5": "bR",
        "c7": "bP", "d7": "bP", "f7": "bP",
        "b6": "bB", "e6": "bP", "g7": "bP",
        "e8": "bK",
        "d3": "wN",
        "b3": "wB",
        "d1": "wQ",
        "a2": "wP", "b2": "wP", "c2": "wP", "d2": "wP", "e2": "wP", "h2": "wP",
        "c1": "wK", "g3": "wB"
    },
    "clickable": "w"
},
    {
        "id": 3,
        "category": "Spot the Opponent's Attack",
        "title": "Spot the Opponent's Attack!",
        "instructions": "White's move. Black is setting up a discovered attack. Click the white piece that is the TARGET — the piece in danger.",
        "hint": "Which of your pieces are not defended?",
        "answer_square": "a1",
        "wrong_message": "Not quite! Look for a line of attack that is about to be opened up.",
        "correct_message": "Correct! The white king on a1 is the target — if black moves the knight on e5, the queen reveals an attack!",
        "board_theme": "brown",
        "pieces": {
            "a8": "bR", "d8": "bK", "h8": "bR",
            "b7": "bB", "e7": "bP", "f7": "bP",
            "a6": "bP", "b6": "bP", "c6": "bP", "f6": "bQ",
            "d5": "bP", "e5": "bN", "f5": "bN",
            "h4": "bP",

            "d3": "wP", "g2":"wP",
            "a3": "wP", "b3": "wN", "e3": "wP", "f3": "wP",
            "a2": "wP", "c2": "wB", "h2": "wP",
            "a1": "wK", "c1": "wQ", "d1": "wB", "g1": "wR"
        },
        "clickable": "w"
    },
        {
        "id": 4,
        "category": "Spot the Opponent's Attack",
        "title": "Spot the Opponent's Attack!",
        "instructions": "Black's move. White is threatening a discovered attack. Click the white piece you should move to create the discovered attack.",
        "hint": "Which white piece is blocking a long-range attacker from targeting a black piece?",
        "answer_square": "e5",
        "wrong_message": "Not quite! Look for a white piece that, when moved, reveals a long-range attacker behind it.",
        "correct_message": "Correct! The knight on e5 is the blocking piece — moving it reveals a devastating attack on black's position!",
        "board_theme": "green",
        "perspective": "black",
        "pieces": {
            "a8": "bR", "d8": "bR",
            "g8": "bK",
            "e7": "bB", "b7": "bB",
            "a7": "bP", "c7": "bP", "f7": "bP", "g7": "bP", "h7": "bP",
            "b6": "bP",
            "e5": "wN",
            "f4": "wP",
            "b3": "wB", "d3": "wN",
            "a2": "wP", "b2": "wP", "c2": "wP", "d2": "wP", "g2": "wP", "h2": "wP",
            "c1": "wK", "e1": "wQ", "f1": "wR"
        },
        "clickable": "w"
    },
   {
    "id": 5,
    "category": "Putting It Together",
    "title": "Putting It Together!",
    "instructions": "White's move. Find the white piece that creates a discovered attack — the moving piece should create one threat while revealing a second threat behind it.",
    "hint": "Can a knight move create two threats at once?",
    "answer_square": "c4",
    "wrong_message": "Not quite! Look for a piece whose move both attacks something AND reveals a long-range attacker behind it.",
    "correct_message": "Correct! Knight on c4 takes the knight on d6 — attacking the black queen on c8 — while revealing the bishop on b3, which now checks the black king on g8!",
    "board_theme": "green",
    "perspective": "white",
    "pieces": {
        "a8": "bR", "c8": "bQ", "d8": "bR",
        "g8": "bK",
        "e7": "bB", "b7": "bB",
        "a7": "bP", "c7": "bP", "f6": "bP", "g7": "bP", "h7": "bP",
        "b6": "bP", "d6": "bN",
        "c4": "wN",
        "f4": "wP",
        "b3": "wB", "d3": "wN",
        "a2": "wP", "b2": "wP", "c2": "wP", "d2": "wP", "g2": "wP", "h2": "wP",
        "c1": "wK", "e1": "wQ", "f1": "wR"
    },
    "clickable": "w"
},
]

@app.route('/')
def home():
    session.clear()
    return render_template('home.html')

@app.route('/start', methods=['POST'])
def start():
    session['started_at'] = datetime.now().isoformat()
    session['quiz_answers'] = {}
    session['lesson_visits'] = {}
    return redirect(url_for('learn', lesson_num=1))

@app.route('/learn/<int:lesson_num>')
def learn(lesson_num):
    if lesson_num < 1 or lesson_num > len(LESSONS):
        return redirect(url_for('home'))
    lesson = LESSONS[lesson_num - 1]
    visits = session.get('lesson_visits', {})
    visits[str(lesson_num)] = datetime.now().isoformat()
    session['lesson_visits'] = visits
    session.modified = True
    return render_template('learn.html', lesson=lesson, lesson_num=lesson_num, total=len(LESSONS))

@app.route('/quiz')
def quiz_home():
    return render_template('quiz_home.html')

@app.route('/quiz/<int:q_num>')
def quiz(q_num):
    if q_num < 1 or q_num > len(QUIZ_QUESTIONS):
        return redirect(url_for('quiz_results'))
    question = QUIZ_QUESTIONS[q_num - 1]
    return render_template('quiz.html', question=question, q_num=q_num, total=len(QUIZ_QUESTIONS))

@app.route('/quiz/<int:q_num>/answer', methods=['POST'])
def submit_answer(q_num):
    data = request.get_json()
    selected_square = data.get('square')
    selected_piece = data.get('piece')
    question = QUIZ_QUESTIONS[q_num - 1]
    correct = (selected_square == question['answer_square'])

    answers = session.get('quiz_answers', {})
    answers[str(q_num)] = {
        'selected_square': selected_square,
        'selected_piece': selected_piece,
        'correct': correct,
        'timestamp': datetime.now().isoformat(),
        'category': question['category']
    }
    session['quiz_answers'] = answers
    session.modified = True

    return jsonify({
        'correct': correct,
        'message': question['correct_message'] if correct else question['wrong_message'],
        'answer_square': question['answer_square']
    })

@app.route('/results')
def quiz_results():
    answers = session.get('quiz_answers', {})
    categories = {}
    for q in QUIZ_QUESTIONS:
        cat = q['category']
        if cat not in categories:
            categories[cat] = {'correct': 0, 'total': 0}
        categories[cat]['total'] += 1
        ans = answers.get(str(q['id']))
        if ans and ans.get('correct'):
            categories[cat]['correct'] += 1

    total_correct = sum(v['correct'] for v in categories.values())
    total_questions = len(QUIZ_QUESTIONS)
    pct = total_correct / total_questions if total_questions else 0

    if pct == 1.0:
        feedback = "Perfect score! You've mastered discovered attacks. Your opponent won't know what hit them!"
    elif pct >= 0.8:
        feedback = "Great work! You have a solid grasp of discovered attacks. Review any missed questions and you'll be unstoppable."
    elif pct >= 0.6:
        feedback = "Not bad! Your identification score shows the core concepts are clicking. When you're ready, revisit the 'Putting It Together' section and give it another shot."
    elif pct >= 0.4:
        feedback = "Good start! The concepts are there but need reinforcement. Try going back through the lessons and focus on the anatomy section."
    else:
        feedback = "Keep practicing! Discovered attacks take time to see. Go back through the learning section and look for the blocker–attacker–target pattern."

    return render_template('results.html',
        categories=categories,
        total_correct=total_correct,
        total_questions=total_questions,
        feedback=feedback
    )

if __name__ == '__main__':
    app.run(debug=True)


