import { useEffect, useMemo, useState } from 'react';
import { FaClock, FaPlay, FaShuffle, FaVolumeHigh } from 'react-icons/fa6';
import { DEFAULT_SETTINGS, useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const TIMER_OPTIONS = [10, 20, 30, 60];

export default function Setup({ navigate, initialQuizId }) {
  const { quizzes, settings, startGame } = useGame();
  useDocumentTitle('New Game Setup');

  const firstQuizId = initialQuizId || quizzes[0]?.id || '';
  const [teamXName, setTeamXName] = useState('Team X');
  const [teamOName, setTeamOName] = useState('Team O');
  const [quizId, setQuizId] = useState(firstQuizId);
  const [timerEnabled, setTimerEnabled] = useState(settings.timerEnabled ?? DEFAULT_SETTINGS.timerEnabled);
  const [timerDuration, setTimerDuration] = useState(settings.timerDuration ?? DEFAULT_SETTINGS.timerDuration);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled);
  const [stealEnabled, setStealEnabled] = useState(settings.stealEnabled ?? DEFAULT_SETTINGS.stealEnabled);
  const [shuffleEnabled, setShuffleEnabled] = useState(settings.shuffleQuestions ?? DEFAULT_SETTINGS.shuffleQuestions);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialQuizId) {
      setQuizId(initialQuizId);
    }
  }, [initialQuizId]);

  const selectedQuiz = useMemo(() => quizzes.find((quiz) => quiz.id === quizId), [quizId, quizzes]);

  function handleSubmit(event) {
    event.preventDefault();
    const result = startGame({
      quizId,
      teamXName,
      teamOName,
      timerEnabled,
      timerDuration,
      soundEnabled,
      stealEnabled,
      shuffleQuestions: shuffleEnabled,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate('game');
  }

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">New Game</p>
          <h1 className="page-title">Setup</h1>
        </div>
        <button type="button" className="btn-secondary" onClick={() => navigate('library')}>
          Quiz Library
        </button>
      </section>

      <form className="setup-grid" onSubmit={handleSubmit}>
        <section className="surface-panel">
          <h2 className="section-title">Teams</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="form-label">
              Team X Name
              <input className="input-field" value={teamXName} onChange={(event) => setTeamXName(event.target.value)} />
            </label>
            <label className="form-label">
              Team O Name
              <input className="input-field" value={teamOName} onChange={(event) => setTeamOName(event.target.value)} />
            </label>
          </div>
        </section>

        <section className="surface-panel">
          <h2 className="section-title">Quiz</h2>
          {quizzes.length === 0 ? (
            <div className="empty-state mt-5">
              <p className="font-black">No quizzes available</p>
              <button type="button" className="btn-primary mt-4" onClick={() => navigate('upload')}>
                Upload Quiz
              </button>
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              <label className="form-label">
                Choose quiz
                <select className="input-field" value={quizId} onChange={(event) => setQuizId(event.target.value)}>
                  {quizzes.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.name}
                    </option>
                  ))}
                </select>
              </label>
              {selectedQuiz ? (
                <div className="rounded-lg bg-slate-100 p-4 font-bold text-slate-700 dark:bg-white/10 dark:text-slate-100">
                  {selectedQuiz.questions.length} questions ready
                </div>
              ) : null}
            </div>
          )}
        </section>

        <section className="surface-panel lg:col-span-2">
          <h2 className="section-title">Options</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="toggle-card">
              <input type="checkbox" checked={timerEnabled} onChange={(event) => setTimerEnabled(event.target.checked)} />
              <FaClock aria-hidden="true" />
              <span>Timer</span>
            </label>
            <label className="toggle-card">
              <input type="checkbox" checked={soundEnabled} onChange={(event) => setSoundEnabled(event.target.checked)} />
              <FaVolumeHigh aria-hidden="true" />
              <span>Sound</span>
            </label>
            <label className="toggle-card">
              <input type="checkbox" checked={stealEnabled} onChange={(event) => setStealEnabled(event.target.checked)} />
              <span className="font-black">S</span>
              <span>Steal</span>
            </label>
            <label className="toggle-card">
              <input type="checkbox" checked={shuffleEnabled} onChange={(event) => setShuffleEnabled(event.target.checked)} />
              <FaShuffle aria-hidden="true" />
              <span>Shuffle</span>
            </label>
          </div>

          {timerEnabled ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {TIMER_OPTIONS.map((duration) => (
                <button
                  key={duration}
                  type="button"
                  className={timerDuration === duration ? 'segmented-active' : 'segmented'}
                  onClick={() => setTimerDuration(duration)}
                >
                  {duration}s
                </button>
              ))}
            </div>
          ) : null}
        </section>

        {error ? <p className="rounded-lg bg-red-100 p-4 font-bold text-red-800 lg:col-span-2">{error}</p> : null}

        <button type="submit" className="btn-primary justify-center py-5 text-xl lg:col-span-2" disabled={quizzes.length === 0}>
          <FaPlay aria-hidden="true" />
          Start Game
        </button>
      </form>
    </main>
  );
}
