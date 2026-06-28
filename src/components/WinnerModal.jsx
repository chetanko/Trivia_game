import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { FaHouse, FaMedal, FaPlus, FaRotateRight } from 'react-icons/fa6';
import { playSoundEffect } from '../utils/sound';

export default function WinnerModal({ game, onPlayAgain, onNewGame, onHome }) {
  const isWinner = game.status === 'winner';
  const attempts = game.stats.correct + game.stats.incorrect;
  const accuracy = attempts === 0 ? 0 : Math.round((game.stats.correct / attempts) * 100);
  const winnerName = isWinner ? game.teams[game.result.winner].name : null;

  useEffect(() => {
    if (!isWinner) {
      return;
    }

    playSoundEffect('win', game.settings.soundEnabled);
    confetti({ particleCount: 180, spread: 80, origin: { y: 0.68 } });
  }, [game.settings.soundEnabled, isWinner]);

  if (!['winner', 'draw'].includes(game.status)) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <motion.section
        className="winner-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="winner-title"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
      >
        <FaMedal className={isWinner ? 'text-6xl text-marigold' : 'text-6xl text-skyroom'} aria-hidden="true" />
        <p className="eyebrow mt-3">{isWinner ? 'Winner' : 'Game Complete'}</p>
        <h2 className="mt-2 text-4xl font-black md:text-6xl" id="winner-title">
          {isWinner ? winnerName : game.result?.title || 'Draw'}
        </h2>
        {game.result?.message ? <p className="mt-3 text-lg text-slate-600 dark:text-slate-200">{game.result.message}</p> : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          <div className="winner-stat">
            <span>{game.stats.totalAsked}</span>
            <small>Asked</small>
          </div>
          <div className="winner-stat">
            <span>{game.stats.correct}</span>
            <small>Correct</small>
          </div>
          <div className="winner-stat">
            <span>{game.stats.incorrect}</span>
            <small>Incorrect</small>
          </div>
          <div className="winner-stat">
            <span>{accuracy}%</span>
            <small>Accuracy</small>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <button type="button" className="btn-primary justify-center" onClick={onPlayAgain}>
            <FaRotateRight aria-hidden="true" />
            Play Again
          </button>
          <button type="button" className="btn-secondary justify-center" onClick={onNewGame}>
            <FaPlus aria-hidden="true" />
            New Game
          </button>
          <button type="button" className="btn-secondary justify-center" onClick={onHome}>
            <FaHouse aria-hidden="true" />
            Home
          </button>
        </div>
      </motion.section>
    </div>
  );
}
