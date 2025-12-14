const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(199, 89%, 48%)" />
            <stop offset="100%" stopColor="hsl(173, 58%, 39%)" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#logoGradient)" />
        
        {/* Medical cross */}
        <path
          d="M17 12H23V17H28V23H23V28H17V23H12V17H17V12Z"
          fill="white"
          opacity="0.9"
        />
        
        {/* Document corner fold */}
        <path
          d="M28 12L32 16H28V12Z"
          fill="white"
          opacity="0.5"
        />
        
        {/* AI nodes - small circles connected */}
        <circle cx="10" cy="30" r="2" fill="white" opacity="0.7" />
        <circle cx="30" cy="30" r="2" fill="white" opacity="0.7" />
        <circle cx="20" cy="34" r="2" fill="white" opacity="0.7" />
        
        {/* Connection lines */}
        <path
          d="M10 30L20 34M20 34L30 30"
          stroke="white"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground leading-tight">
          MedEase
        </span>
        <span className="text-xs font-medium text-primary leading-tight">
          AI
        </span>
      </div>
    </div>
  );
};

export default Logo;
