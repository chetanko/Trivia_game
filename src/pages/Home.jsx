import { motion } from 'framer-motion';
import { FaGear, FaPlay, FaTableCellsLarge, FaUpload } from 'react-icons/fa6';
import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Home({ navigate }) {
  const { activeGame, quizzes } = useGame();
  useDocumentTitle('Home');

  const actions = [
    { label: 'Start New Game', icon: FaPlay, page: 'setup', primary: true },
    { label: 'Quiz Library', icon: FaTableCellsLarge, page: 'library' },
    { label: 'Upload Quiz', icon: FaUpload, page: 'upload' },
    { label: 'Settings', icon: FaGear, page: 'settings' },
  ];

  return (
    <main className="page-shell">
      <section className="hero-layout">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="eyebrow">Teacher-led classroom game</p>
          <h1 className="hero-title">Classroom Trivia Tic-Tac-Toe</h1>
          <p className="hero-copy">
            Project the board, ask the question, and keep the whole room in one shared game.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  className={action.primary ? 'home-action-primary' : 'home-action'}
                  onClick={() => navigate(action.page)}
                >
                  <Icon aria-hidden="true" />
                  {action.label}
                </button>
              );
            })}
          </div>

          {activeGame?.status === 'playing' ? (
            <button type="button" className="mt-4 btn-secondary" onClick={() => navigate('game')}>
              Continue Current Game
            </button>
          ) : null}
        </motion.div>

        <motion.div
          className="classroom-snapshot"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          aria-label="Game preview"
        >
          <div className="snapshot-top">
            <span>Team X</span>
            <strong>{quizzes.length} quizzes ready</strong>
            <span>Team O</span>
          </div>
          <div className="snapshot-board">
            {['X', null, 'O', null, 'X', null, 'O', null, 'X'].map((mark, index) => (
              <div key={index} className="snapshot-cell">
                {mark}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
