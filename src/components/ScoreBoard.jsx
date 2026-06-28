import { FaBullseye, FaClock, FaListCheck } from 'react-icons/fa6';

function TeamPanel({ team, active }) {
  return (
    <div className={`team-panel ${active ? 'team-panel-active' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Team {team.mark}</p>
          <h3 className="text-2xl font-black">{team.name}</h3>
        </div>
        <span className={`score-mark ${team.mark === 'X' ? 'text-skyroom' : 'text-coral'}`}>{team.mark}</span>
      </div>
      <p className="mt-3 text-4xl font-black">{team.score}</p>
    </div>
  );
}

export default function ScoreBoard({ game }) {
  const remainingQuestions = Math.max(0, game.questionQueue.length - game.questionCursor);
  const attempts = game.stats.correct + game.stats.incorrect;
  const accuracy = attempts === 0 ? 0 : Math.round((game.stats.correct / attempts) * 100);

  return (
    <aside className="scoreboard">
      <div className="grid gap-4 md:grid-cols-2">
        <TeamPanel team={game.teams.X} active={game.currentTeam === 'X'} />
        <TeamPanel team={game.teams.O} active={game.currentTeam === 'O'} />
      </div>

      <div className="current-turn">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">Current Turn</p>
        <p className="text-3xl font-black">{game.teams[game.currentTeam].name}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="stat-tile">
          <FaListCheck aria-hidden="true" />
          <span>{remainingQuestions}</span>
          <small>Remaining</small>
        </div>
        <div className="stat-tile">
          <FaBullseye aria-hidden="true" />
          <span>{accuracy}%</span>
          <small>Accuracy</small>
        </div>
        <div className="stat-tile">
          <FaClock aria-hidden="true" />
          <span>{game.settings.timerEnabled ? `${game.timerRemaining}s` : 'Off'}</span>
          <small>Timer</small>
        </div>
      </div>
    </aside>
  );
}
