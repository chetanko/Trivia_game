import { AnimatePresence, motion } from 'framer-motion';
import { FaCheck, FaEye, FaForward, FaXmark } from 'react-icons/fa6';

export default function QuestionModal({ game, onCorrect, onIncorrect, onReveal, onSkip }) {
  const question = game.activeQuestion;

  return (
    <AnimatePresence>
      {question ? (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          <motion.section
            className="question-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="question-title"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-marigold">
                  {game.stealFor ? 'Steal Chance' : 'Question'}
                </p>
                <h2 className="text-2xl font-black text-white md:text-4xl" id="question-title">
                  {game.teams[game.currentResponder].name}
                </h2>
              </div>
              {game.settings.timerEnabled ? (
                <div className="timer-pill" aria-live="polite">
                  {game.timerRemaining}s
                </div>
              ) : null}
            </div>

            {game.settings.timerEnabled ? (
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-marigold transition-all duration-500"
                  style={{ width: `${Math.max(0, (game.timerRemaining / game.settings.timerDuration) * 100)}%` }}
                />
              </div>
            ) : null}

            <p className="mt-6 text-3xl font-black leading-tight text-white md:text-5xl">{question.prompt}</p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {question.options.map((option) => {
                const isCorrect = game.answerVisible && option.key === question.correctAnswer;
                return (
                  <div key={option.key} className={`answer-option ${isCorrect ? 'answer-option-correct' : ''}`}>
                    <span>{option.key}</span>
                    <p>{option.text}</p>
                  </div>
                );
              })}
            </div>

            {game.answerVisible ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-lg bg-emerald-400/15 p-4 text-xl font-bold text-emerald-100"
              >
                Correct answer: {question.correctAnswer}
              </motion.p>
            ) : null}

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <button type="button" className="btn-success" onClick={onCorrect}>
                <FaCheck aria-hidden="true" />
                Correct
              </button>
              <button type="button" className="btn-danger" onClick={onIncorrect}>
                <FaXmark aria-hidden="true" />
                Incorrect
              </button>
              <button type="button" className="btn-secondary-dark" onClick={onReveal}>
                <FaEye aria-hidden="true" />
                Reveal Answer
              </button>
              <button type="button" className="btn-secondary-dark" onClick={onSkip}>
                <FaForward aria-hidden="true" />
                Skip Question
              </button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
