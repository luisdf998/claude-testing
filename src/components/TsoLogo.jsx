export default function TsoLogo({ size = 40 }) {
  const scale = size / 100;
  return (
    <svg
      width={size}
      height={size * 1.12}
      viewBox="0 0 100 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Bubbles */}
      <circle cx="28" cy="5" r="5.5" fill="#29ABE2" />
      <circle cx="24" cy="18" r="4" fill="#29ABE2" opacity="0.85" />
      <circle cx="22" cy="28" r="2.8" fill="#29ABE2" opacity="0.7" />

      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="45"
          y="25"
          width="10"
          height="12"
          rx="2"
          fill="#0B5EA2"
          transform={`rotate(${angle} 50 65)`}
        />
      ))}

      {/* Gear body */}
      <circle cx="50" cy="65" r="35" fill="#0B5EA2" />

      {/* White inner circle */}
      <circle cx="50" cy="65" r="27" fill="white" />

      {/* Water drop shape coming out top-left */}
      <path
        d="M50,34 Q36,45 32,55 Q28,68 35,78 Q34,70 37,62 Q42,50 50,40 Z"
        fill="#0B5EA2"
      />

      {/* TSO text */}
      <text
        x="50"
        y="73"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#0B5EA2"
      >
        TSO
      </text>
    </svg>
  );
}
