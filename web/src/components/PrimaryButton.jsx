export default function PrimaryButton({ title, onClick, disabled, variant = 'primary' }) {
  const variantClass = variant === 'outline' ? 'btn-outline' : 'btn-solid';

  return (
    <button type="button" className={`btn ${variantClass}`} onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
}
