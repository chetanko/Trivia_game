import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FaCopy, FaEye, FaPen, FaPlay, FaTrash } from 'react-icons/fa6';
import { useGame } from '../context/GameContext';

export default function QuizCard({ quiz, onStart }) {
  const { deleteQuiz, duplicateQuiz, renameQuiz } = useGame();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(quiz.name);

  function saveName(event) {
    event.preventDefault();
    renameQuiz(quiz.id, name);
    setIsRenaming(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${quiz.name}"?`)) {
      deleteQuiz(quiz.id);
    }
  }

  return (
    <motion.article layout className="quiz-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {isRenaming ? (
            <form className="flex gap-2" onSubmit={saveName}>
              <input className="input-field py-2" value={name} onChange={(event) => setName(event.target.value)} />
              <button type="submit" className="btn-primary px-4 py-2">
                Save
              </button>
            </form>
          ) : (
            <h3 className="truncate text-2xl font-black">{quiz.name}</h3>
          )}
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
            {quiz.questions.length} questions • {quiz.source}
          </p>
        </div>
        <button type="button" className="icon-button" aria-label={`Rename ${quiz.name}`} onClick={() => setIsRenaming(true)}>
          <FaPen aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from(new Set(quiz.questions.map((question) => question.topic))).slice(0, 4).map((topic) => (
          <span key={topic} className="tag">
            {topic}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <button type="button" className="btn-primary justify-center" onClick={() => onStart?.(quiz.id)}>
          <FaPlay aria-hidden="true" />
          Start
        </button>
        <button type="button" className="btn-secondary justify-center" onClick={() => setIsPreviewOpen(true)}>
          <FaEye aria-hidden="true" />
          Preview
        </button>
        <button type="button" className="btn-secondary justify-center" onClick={() => duplicateQuiz(quiz.id)}>
          <FaCopy aria-hidden="true" />
          Duplicate
        </button>
        <button type="button" className="btn-danger-soft justify-center" onClick={handleDelete}>
          <FaTrash aria-hidden="true" />
          Delete
        </button>
      </div>

      <AnimatePresence>
        {isPreviewOpen ? (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.section
              className="preview-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`preview-${quiz.id}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2 className="section-title" id={`preview-${quiz.id}`}>
                    {quiz.name}
                  </h2>
                </div>
                <button type="button" className="btn-secondary" onClick={() => setIsPreviewOpen(false)}>
                  Close
                </button>
              </div>
              <ol className="mt-6 space-y-4">
                {quiz.questions.slice(0, 10).map((question, index) => (
                  <li key={question.id} className="rounded-lg bg-slate-100 p-4 dark:bg-white/10">
                    <p className="font-black">
                      {index + 1}. {question.prompt}
                    </p>
                    <p className="mt-2 text-sm font-bold text-emerald-700 dark:text-emerald-200">
                      Answer {question.correctAnswer} • {question.topic} • {question.difficulty}
                    </p>
                  </li>
                ))}
              </ol>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
