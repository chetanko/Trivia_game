import { motion } from 'framer-motion';

const markClasses = {
  X: 'text-skyroom',
  O: 'text-coral',
};

export default function Cell({ index, value, disabled, isWinning, onSelect }) {
  const label = value ? `Cell ${index + 1}, claimed by ${value}` : `Cell ${index + 1}, empty`;

  return (
    <motion.button
      type="button"
      aria-label={label}
      disabled={disabled || Boolean(value)}
      onClick={() => onSelect(index)}
      whileHover={!disabled && !value ? { scale: 1.025 } : undefined}
      whileTap={!disabled && !value ? { scale: 0.98 } : undefined}
      className={`cell ${isWinning ? 'cell-winning' : ''}`}
    >
      {value ? (
        <motion.span
          initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          className={`cell-mark ${markClasses[value]}`}
        >
          {value}
        </motion.span>
      ) : (
        <span className="cell-empty">{index + 1}</span>
      )}
    </motion.button>
  );
}
