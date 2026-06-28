import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa6';
import QuizCard from '../components/QuizCard';
import UploadQuiz from '../components/UploadQuiz';
import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Library({ navigate, showUploadFirst = false }) {
  const { quizzes } = useGame();
  useDocumentTitle(showUploadFirst ? 'Upload Quiz' : 'Quiz Library');

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">{showUploadFirst ? 'Add questions' : 'Saved quizzes'}</p>
          <h1 className="page-title">{showUploadFirst ? 'Upload Quiz' : 'Quiz Library'}</h1>
        </div>
        <button type="button" className="btn-primary" onClick={() => navigate('setup')}>
          <FaPlus aria-hidden="true" />
          New Game
        </button>
      </section>

      {showUploadFirst ? <UploadQuiz /> : null}

      <section className={showUploadFirst ? 'mt-8' : ''}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="section-title">Library</h2>
          {!showUploadFirst ? (
            <button type="button" className="btn-secondary" onClick={() => navigate('upload')}>
              Upload Quiz
            </button>
          ) : null}
        </div>

        {quizzes.length === 0 ? (
          <div className="empty-state">
            <p className="text-2xl font-black">No quizzes yet</p>
            <button type="button" className="btn-primary mt-4" onClick={() => navigate('upload')}>
              Upload Quiz
            </button>
          </div>
        ) : (
          <motion.div layout className="grid gap-4 xl:grid-cols-2">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStart={(quizId) => navigate('setup', { quizId })} />
            ))}
          </motion.div>
        )}
      </section>

      {!showUploadFirst ? (
        <div className="mt-8">
          <UploadQuiz />
        </div>
      ) : null}
    </main>
  );
}
