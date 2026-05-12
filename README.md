
# Group Members

Severin Ihnat | sihnat24


# Spotting Discovered Attacks in Chess

An interactive web app for learning and practicing the chess tactic of **discovered attacks** — built as a UI Design project at Columbia University.

---

## What It Is

A guided, two-part learning experience:

1. **Learn** — a 6-step lesson sequence that introduces the concept, breaks down the anatomy of a discovered attack, animates a live example, and walks through a real position.
2. **Quiz** — 5 interactive board puzzles across three difficulty tiers where the user clicks the correct piece on a live chessboard to demonstrate understanding.

---

## Features

### Lesson Module
- **Step-by-step progression** through 6 lesson types: intro, anatomy, animation, double-attack, example, and reveal.
- **Interactive anatomy board** — toggle between bishop, rook, and queen to see how each creates a discovered attack, with colored square highlights and SVG arrows.
- **Animated boards** — play and reset piece movements to watch attacks unfold in real time.
- **Progress dot bar** tracking position within the lesson sequence.
- **Session tracking** — lesson visit timestamps stored server-side.

### Quiz Module
- **Three question categories**: Identification, Spot the Opponent's Attack, and Putting It Together.
- **Click-to-select** piece interaction with legal move previews (dots for empty squares, rings for captures).
- **3-attempt system** with attempt pip indicators; reveals the correct answer and explanation after all attempts are used.
- **Peek button** on the feedback popup to temporarily dismiss it and inspect the board.
- **Hint system** — collapsible hint text per question.
- **Board piece list sidebar** listing all pieces by position.
- **Flippable board perspective** — some questions are shown from Black's point of view.

### Results Page
- Score breakdown by category with color-coded pills (green / orange / red).
- Performance-based feedback message tailored to the user's score.

### UI / Design
- Consistent 4-color scheme (tan, dark brown, light tan, dark tan) across all pages.
- Monospace typography (`Courier Prime`, `Space Mono`) for a retro chess aesthetic.
- Responsive layout — boards and panels reflow for mobile screens (≤ 600px).
- Chess pieces rendered with Unicode symbols, styled with text-stroke for contrast.
- Bootstrap 5 grid for layout; all custom styles in a single `base.html` `<style>` block.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python / Flask |
| Templating | Jinja2 |
| Frontend | Vanilla JS, jQuery |
| Styling | Bootstrap 5, custom CSS variables |
| Session state | Flask server-side sessions |

---

## Project Structure

```
chess-discovered-attacks/
├── main.py                  # Flask app, lesson/quiz data, all routes
├── requirements.txt         # flask>=2.3.0
├── templates/
│   ├── base.html            # Shared layout, CSS, board renderer, shared JS
│   ├── home.html            # Landing page with Learn / Quiz entry cards
│   ├── learn.html           # Lesson view (6 lesson types)
│   ├── quiz_home.html       # Quiz category selection
│   ├── quiz.html            # Interactive quiz board
│   └── results.html         # Score summary and feedback
└── static/
    ├── css/style.css
    └── js/
        ├── chessboard.js    # Board rendering utilities
        ├── learn.js         # Lesson-specific interactions
        ├── quiz.js          # Quiz interaction and submission logic
        └── settings.js      # User preferences (board theme)
```

---

## Running Locally

```bash
pip install -r requirements.txt
python main.py
```

Then open `http://localhost:5000` in your browser.

---

## Lesson Sequence

| # | Title | Type |
|---|---|---|
| 1 | Setting the Scene | Intro text |
| 2 | Anatomy of a Discovered Attack | Interactive board with role labels |
| 3 | Watch It Play Out | Animated board |
| 4 | Creating Two Attacks! | Double-threat animation |
| 5 | Do You See the Move? | Static example position |
| 6 | After Rook to g7... | Reveal with arrows |

## Quiz Question Categories

| Category | Questions | Description |
|---|---|---|
| Identification | 2 | Click the blocking piece on the board |
| Spot the Opponent's Attack | 2 | Find the white piece that is in danger from Black's hidden threat |
| Putting It Together | 1 | Find the move that creates two simultaneous threats |
