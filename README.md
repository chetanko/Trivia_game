# Classroom Trivia Tic-Tac-Toe

A production-ready, teacher-led classroom game for smart boards and projectors. Students answer verbally while the teacher controls every action from one shared screen.

## Features

- React + Vite single-page app with no backend.
- Tailwind CSS responsive classroom interface with light and dark modes.
- React Context API state management.
- Local Storage persistence for quizzes, settings, and active games.
- CSV uploads with PapaParse and Excel uploads with SheetJS.
- Quiz validation for missing columns, empty questions, empty options, and invalid correct answers.
- 3 x 3 tic-tac-toe gameplay with optional timer, sound effects, question shuffling, and steal chances.
- Winner/draw screens with statistics and confetti.
- Offline-first service worker cache after the first load.

## Install

```bash
npm install
npm run dev
```

The dev server will print a local URL, usually `http://127.0.0.1:5173/`.

## Scripts

```bash
npm run dev       # start local development
npm run build     # production build
npm run preview   # preview production build
npm test          # run Vitest tests
```

## Quiz Format

Supported uploads: `.csv` and `.xlsx`.

Uploads are limited to 2 MB. This keeps classroom imports fast and reduces exposure to parser-heavy files.

Required columns:

```csv
Question,Option A,Option B,Option C,Option D,Correct Answer,Topic,Difficulty
What is 2+2?,3,4,5,6,B,Math,Easy
Capital of India?,Mumbai,Delhi,Chennai,Kolkata,B,Geography,Easy
```

Sample files:

- `public/samples/classroom-sample-quiz.csv`
- `public/samples/classroom-sample-quiz.xlsx`

## Folder Structure

```text
src/
├── components/
├── context/
├── data/
├── hooks/
├── pages/
├── test/
├── utils/
├── App.jsx
├── main.jsx
└── styles.css
```

## Deploy To Vercel

1. Push the project to GitHub.
2. Create a new Vercel project from the repository.
3. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

No environment variables or backend services are required.

## Security Note

`npm audit --omit=dev` currently reports high-severity advisories in `xlsx` with no available upstream fix. SheetJS is included because Excel upload support was a project requirement. The app parses teacher-selected local files only, validates the format, and rejects quiz files larger than 2 MB.
