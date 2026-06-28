import Cell from './Cell';

export default function Board({ game, onSelectCell }) {
  const winningCells = new Set(game.winningCombination || []);

  return (
    <section aria-label="Tic-tac-toe board" className="board-grid">
      {game.board.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          disabled={game.status !== 'playing' || Boolean(game.activeQuestion)}
          isWinning={winningCells.has(index)}
          onSelect={onSelectCell}
        />
      ))}
    </section>
  );
}
