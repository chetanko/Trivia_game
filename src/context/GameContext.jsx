import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { sampleQuizzes } from '../data/sampleQuizzes';
import { checkWinner, isDraw } from '../utils/checkWinner';
import { loadFromStorage, removeFromStorage, saveToStorage } from '../utils/localStorage';
import { shuffleQuestions } from '../utils/shuffleQuestions';

const GameContext = createContext(null);

const QUIZZES_KEY = 'classroom-trivia:quizzes';
const SETTINGS_KEY = 'classroom-trivia:settings';
const ACTIVE_GAME_KEY = 'classroom-trivia:active-game';

export const DEFAULT_SETTINGS = {
  theme: 'light',
  timerEnabled: false,
  timerDuration: 30,
  soundEnabled: true,
  stealEnabled: true,
  shuffleQuestions: true,
};

function createId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getOtherTeam(team) {
  return team === 'X' ? 'O' : 'X';
}

function normalizeName(value, fallback) {
  return value?.trim() || fallback;
}

function closeQuestion(state, nextTeam = state.currentTeam) {
  return {
    ...state,
    currentTeam: nextTeam,
    selectedCell: null,
    activeQuestion: null,
    currentResponder: null,
    stealFor: null,
    answerVisible: false,
    timerRemaining: state.settings.timerDuration,
  };
}

function openNextQuestion(state, selectedCell, responder) {
  const question = state.questionQueue[state.questionCursor];

  if (!question) {
    return {
      ...closeQuestion(state),
      status: 'draw',
      result: {
        type: 'no-questions',
        title: 'No Questions Left',
        message: 'The quiz ran out of questions before the board was completed.',
      },
    };
  }

  return {
    ...state,
    selectedCell,
    activeQuestion: question,
    currentResponder: responder,
    stealFor: responder === state.currentTeam ? null : responder,
    answerVisible: false,
    questionCursor: state.questionCursor + 1,
    timerRemaining: state.settings.timerDuration,
    stats: {
      ...state.stats,
      totalAsked: state.stats.totalAsked + 1,
    },
  };
}

function buildGameState(quiz, config) {
  const shouldShuffle = Boolean(config.shuffleQuestions);
  const questionQueue = shouldShuffle ? shuffleQuestions(quiz.questions) : [...quiz.questions];

  return {
    id: createId('game'),
    quizId: quiz.id,
    quizName: quiz.name,
    createdAt: new Date().toISOString(),
    status: 'playing',
    result: null,
    board: Array(9).fill(null),
    winningCombination: [],
    teams: {
      X: { mark: 'X', name: normalizeName(config.teamXName, 'Team X'), score: 0 },
      O: { mark: 'O', name: normalizeName(config.teamOName, 'Team O'), score: 0 },
    },
    currentTeam: 'X',
    selectedCell: null,
    activeQuestion: null,
    currentResponder: null,
    stealFor: null,
    answerVisible: false,
    questionQueue,
    questionCursor: 0,
    settings: {
      timerEnabled: Boolean(config.timerEnabled),
      timerDuration: Number(config.timerDuration) || 30,
      soundEnabled: Boolean(config.soundEnabled),
      stealEnabled: Boolean(config.stealEnabled),
      shuffleQuestions: shouldShuffle,
    },
    stats: {
      totalAsked: 0,
      correct: 0,
      incorrect: 0,
      skipped: 0,
    },
  };
}

function resolveCorrectAnswer(state) {
  const responder = state.currentResponder;
  const updatedBoard = [...state.board];
  updatedBoard[state.selectedCell] = responder;

  const winnerResult = checkWinner(updatedBoard);
  const updatedState = {
    ...state,
    board: updatedBoard,
    teams: {
      ...state.teams,
      [responder]: {
        ...state.teams[responder],
        score: state.teams[responder].score + 1,
      },
    },
    stats: {
      ...state.stats,
      correct: state.stats.correct + 1,
    },
  };

  if (winnerResult.winner) {
    return {
      ...closeQuestion(updatedState),
      status: 'winner',
      winningCombination: winnerResult.combination,
      result: {
        type: 'winner',
        winner: winnerResult.winner,
        title: `${state.teams[winnerResult.winner].name} Wins!`,
      },
    };
  }

  if (isDraw(updatedBoard)) {
    return {
      ...closeQuestion(updatedState),
      status: 'draw',
      result: {
        type: 'draw',
        title: 'It is a Draw!',
        message: 'Every cell is filled and no team made three in a row.',
      },
    };
  }

  return closeQuestion(updatedState, getOtherTeam(state.currentTeam));
}

function resolveIncorrectAnswer(state) {
  const updatedStats = {
    ...state.stats,
    incorrect: state.stats.incorrect + 1,
  };

  if (state.settings.stealEnabled && state.currentResponder === state.currentTeam) {
    const stealingTeam = getOtherTeam(state.currentTeam);
    return {
      ...state,
      currentResponder: stealingTeam,
      stealFor: stealingTeam,
      answerVisible: false,
      timerRemaining: state.settings.timerDuration,
      stats: updatedStats,
    };
  }

  return closeQuestion({ ...state, stats: updatedStats }, getOtherTeam(state.currentTeam));
}

export function GameProvider({ children }) {
  const [quizzes, setQuizzes] = useState(() => loadFromStorage(QUIZZES_KEY, sampleQuizzes));
  const [settings, setSettings] = useState(() => loadFromStorage(SETTINGS_KEY, DEFAULT_SETTINGS));
  const [activeGame, setActiveGame] = useState(() => loadFromStorage(ACTIVE_GAME_KEY, null));

  useEffect(() => {
    saveToStorage(QUIZZES_KEY, quizzes);
  }, [quizzes]);

  useEffect(() => {
    saveToStorage(SETTINGS_KEY, settings);
  }, [settings]);

  useEffect(() => {
    if (activeGame) {
      saveToStorage(ACTIVE_GAME_KEY, activeGame);
      return;
    }

    removeFromStorage(ACTIVE_GAME_KEY);
  }, [activeGame]);

  const addQuiz = useCallback((quizInput) => {
    const now = new Date().toISOString();
    const quiz = {
      id: createId('quiz'),
      name: normalizeName(quizInput.name, 'Untitled Quiz'),
      source: quizInput.source || 'Uploaded file',
      questions: quizInput.questions,
      createdAt: now,
      updatedAt: now,
    };

    setQuizzes((current) => [quiz, ...current]);
    return quiz;
  }, []);

  const renameQuiz = useCallback((quizId, name) => {
    setQuizzes((current) =>
      current.map((quiz) =>
        quiz.id === quizId
          ? { ...quiz, name: normalizeName(name, quiz.name), updatedAt: new Date().toISOString() }
          : quiz,
      ),
    );
  }, []);

  const deleteQuiz = useCallback((quizId) => {
    setQuizzes((current) => current.filter((quiz) => quiz.id !== quizId));
  }, []);

  const duplicateQuiz = useCallback((quizId) => {
    setQuizzes((current) => {
      const quiz = current.find((item) => item.id === quizId);
      if (!quiz) {
        return current;
      }

      const now = new Date().toISOString();
      const copy = {
        ...quiz,
        id: createId('quiz'),
        name: `${quiz.name} Copy`,
        source: 'Duplicated quiz',
        createdAt: now,
        updatedAt: now,
        questions: quiz.questions.map((question, index) => ({
          ...question,
          id: `${question.id}-copy-${index + 1}`,
        })),
      };

      return [copy, ...current];
    });
  }, []);

  const updateSettings = useCallback((updates) => {
    setSettings((current) => ({ ...current, ...updates }));
  }, []);

  const startGame = useCallback(
    (config) => {
      const quiz = quizzes.find((item) => item.id === config.quizId);

      if (!quiz || quiz.questions.length === 0) {
        return { ok: false, error: 'Choose a quiz with at least one question.' };
      }

      const nextGame = buildGameState(quiz, config);
      setActiveGame(nextGame);
      return { ok: true, game: nextGame };
    },
    [quizzes],
  );

  const selectCell = useCallback((cellIndex) => {
    setActiveGame((current) => {
      if (!current || current.status !== 'playing' || current.activeQuestion || current.board[cellIndex]) {
        return current;
      }

      return openNextQuestion(current, cellIndex, current.currentTeam);
    });
  }, []);

  const markAnswer = useCallback((isCorrectAnswer) => {
    setActiveGame((current) => {
      if (!current?.activeQuestion) {
        return current;
      }

      return isCorrectAnswer ? resolveCorrectAnswer(current) : resolveIncorrectAnswer(current);
    });
  }, []);

  const revealAnswer = useCallback(() => {
    setActiveGame((current) => (current ? { ...current, answerVisible: true } : current));
  }, []);

  const skipQuestion = useCallback(() => {
    setActiveGame((current) => {
      if (!current?.activeQuestion) {
        return current;
      }

      const skippedState = {
        ...current,
        answerVisible: false,
        stats: {
          ...current.stats,
          skipped: current.stats.skipped + 1,
        },
      };

      if (skippedState.questionCursor >= skippedState.questionQueue.length) {
        return closeQuestion(skippedState, current.currentTeam);
      }

      return openNextQuestion(skippedState, current.selectedCell, current.currentResponder);
    });
  }, []);

  const decrementTimer = useCallback(() => {
    setActiveGame((current) => {
      if (!current?.activeQuestion || !current.settings.timerEnabled) {
        return current;
      }

      return {
        ...current,
        timerRemaining: Math.max(0, current.timerRemaining - 1),
      };
    });
  }, []);

  const clearActiveGame = useCallback(() => {
    setActiveGame(null);
  }, []);

  const playAgain = useCallback(() => {
    if (!activeGame) {
      return { ok: false, error: 'No active game to replay.' };
    }

    return startGame({
      quizId: activeGame.quizId,
      teamXName: activeGame.teams.X.name,
      teamOName: activeGame.teams.O.name,
      ...activeGame.settings,
    });
  }, [activeGame, startGame]);

  const value = useMemo(
    () => ({
      quizzes,
      settings,
      activeGame,
      addQuiz,
      renameQuiz,
      deleteQuiz,
      duplicateQuiz,
      updateSettings,
      startGame,
      selectCell,
      markAnswer,
      revealAnswer,
      skipQuestion,
      decrementTimer,
      clearActiveGame,
      playAgain,
    }),
    [
      quizzes,
      settings,
      activeGame,
      addQuiz,
      renameQuiz,
      deleteQuiz,
      duplicateQuiz,
      updateSettings,
      startGame,
      selectCell,
      markAnswer,
      revealAnswer,
      skipQuestion,
      decrementTimer,
      clearActiveGame,
      playAgain,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used inside GameProvider.');
  }

  return context;
}
