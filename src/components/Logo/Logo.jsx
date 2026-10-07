import './Logo.css';

/**
 * ExamGuard Logo Component
 * Apple-inspired biometric shield emblem with rich squircle gradient
 */
export default function Logo({ size = 36, className = '' }) {
  return (
    <div
      className={`examguard-logo ${className}`}
      style={{ width: size, height: size }}
      aria-label="ExamGuard Logo"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Apple Cobalt Gradient */}
          <linearGradient id="eg-base-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e8cf8" />
            <stop offset="50%" stopColor="#0066ee" />
            <stop offset="100%" stopColor="#004cd6" />
          </linearGradient>

          {/* Shield Inset Fill */}
          <linearGradient id="eg-shield-gradient" x1="18" y1="8" x2="18" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
          </linearGradient>

          {/* Top Specular Glaze */}
          <linearGradient id="eg-glaze" x1="18" y1="0" x2="18" y2="17" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Squircle App Icon Base */}
        <rect width="36" height="36" rx="9" fill="url(#eg-base-gradient)" />

        {/* Specular Glaze Reflection */}
        <rect width="36" height="18" rx="9" fill="url(#eg-glaze)" />

        {/* 1px Fine Edge Border */}
        <rect
          x="0.5"
          y="0.5"
          width="35"
          height="35"
          rx="8.5"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="1"
        />

        {/* Security Shield */}
        <path
          d="M18 8.2L10.5 11.4V16.8C10.5 21.2 13.6 25.2 18 26.5C22.4 25.2 25.5 21.2 25.5 16.8V11.4L18 8.2Z"
          fill="url(#eg-shield-gradient)"
          stroke="#ffffff"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Intelligent Vision Eye */}
        <path
          d="M13.5 17.5C14.7 15.3 16.2 14.2 18 14.2C19.8 14.2 21.3 15.3 22.5 17.5C21.3 19.7 19.8 20.8 18 20.8C16.2 20.8 14.7 19.7 13.5 17.5Z"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Pupil / Neural Node */}
        <circle cx="18" cy="17.5" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
}
