const STATE_CLASS = {
  selected: 'is-selected',
  correct: 'is-correct',
  incorrect: 'is-incorrect',
  muted: 'is-muted',
};

export default function OptionButton({ label, state, onClick }) {
  const stateClass = STATE_CLASS[state] || '';

  return (
    <button
      type="button"
      className={`option-btn ${stateClass}`}
      onClick={onClick}
      disabled={state !== 'default'}
    >
      {label}
    </button>
  );
}
