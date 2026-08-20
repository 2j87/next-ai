import { useId } from 'react';

interface LogoProps {
    className?: string;
}

function Logo({ className }: LogoProps) {
    const gradientId = useId();

    return (
        <svg
            viewBox="278.76 259.15 367.27 122.12"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--gradient-logo-from)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--gradient-logo-to)' }} />
                </linearGradient>
            </defs>
            <path
                d="M341.29 264.93 L379.50 264.93 L419.74 375.50 L394.91 375.50 A19.102 19.102 0 0 1 376.96 362.93 L341.29 264.93 Z M333.65 264.93 L295.45 264.93 L295.45 375.72 L333.65 375.72 L333.65 264.93 Z M446.49 264.71 L408.28 264.71 L408.28 321.67 L426.92 372.89 L427.87 375.50 A19.102 19.102 0 0 0 446.49 356.40 L446.49 264.71 Z M453.41 375.50 L480.15 375.50 L495.68 342.21 L508.69 342.21 L552.68 342.21 L568.21 375.50 L594.95 375.50 L543.28 264.70 L505.08 264.70 L453.41 375.50 Z M504.58 323.11 L524.18 281.09 L543.78 323.11 L524.18 323.11 L504.58 323.11 Z M602.59 375.50 L602.59 264.71 L629.33 264.71 L629.33 375.50 L602.59 375.50 Z"
                fill={`url(#${gradientId})`}
                fillRule="evenodd"
            />
        </svg>
    );
}

export default Logo;
