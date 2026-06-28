import { useEffect } from 'react';
import { FaHouse, FaPlus } from 'react-icons/fa6';
import Board from '../components/Board';
import QuestionModal from '../components/QuestionModal';
import ScoreBoard from '../components/ScoreBoard';
import WinnerModal from '../components/WinnerModal';
import { useGame } from '../context/GameContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { evaluateSelectedOption } from '../utils/answerSelection';
import { playSoundEffect } from '../utils/sound';

export default function Game({ navigate }) {
  const {
    activeGame,
    clearActiveGame,
    decrementTimer,
    markAnswer,
    playAgain,
    revealAnswer,
    selectCell,
    skipQuestion,
  } = useGame();

  useDocumentTitle(activeGame ? activeGame.quizName : 'Game');

  useEffect(() => {
    if (!activeGame?.activeQuestion || !activeGame.settings.timerEnabled || activeGame.timerRemaining <= 0) {
      return undefined;
    }

    const timerId = window.setInterval(decrementTimer, 1000);
    return () => window.clearInterval(timerId);
  }, [activeGame?.activeQuestion, activeGame?.settings.timerEnabled, activeGame?.timerRemaining, decrementTimer]);

  if (!activeGame) {
    return (
      <main className="page-shell">
        <section className="empty-state">
          <p className="text-3xl font-black">No active game</p>
          <button type="button" className="btn-primary mt-5" onClick={() => navigate('setup')}>
            Start New Game
          </button>
        </section>
      </main>
    );
  }

  function handleCorrect() {
    playSoundEffect('correct', activeGame.settings.soundEnabled);
    markAnswer(true);
  }

  function handleIncorrect() {
    playSoundEffect('incorrect', activeGame.settings.soundEnabled);
    markAnswer(false);
  }

  function handleSelectOption(optionKey) {
    const isCorrect = evaluateSelectedOption(activeGame.activeQuestion, optionKey);
    playSoundEffect(isCorrect ? 'correct' : 'incorrect', activeGame.settings.soundEnabled);
    markAnswer(isCorrect);
  }

  function handlePlayAgain() {
    playAgain();
    navigate('game');
  }

  function handleNewGame() {
    clearActiveGame();
    navigate('setup');
  }

  function handleHome() {
    navigate('home');
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <div>
          <p className="eyebrow">{activeGame.quizName}</p>
          <h1 className="text-3xl font-black md:text-5xl">Classroom Trivia Tic-Tac-Toe</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => navigate('home')}>
            <FaHouse aria-hidden="true" />
            Home
          </button>
          <button type="button" className="btn-primary" onClick={handleNewGame}>
            <FaPlus aria-hidden="true" />
            New Game
          </button>
        </div>
      </header>

      <section className="game-layout">
        <Board game={activeGame} onSelectCell={selectCell} />
        <ScoreBoard game={activeGame} />
      </section>

      <QuestionModal
        game={activeGame}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        onReveal={revealAnswer}
        onSkip={skipQuestion}
        onSelectOption={handleSelectOption}
      />
      <WinnerModal game={activeGame} onPlayAgain={handlePlayAgain} onNewGame={handleNewGame} onHome={handleHome} />
    </main>
  );
}
