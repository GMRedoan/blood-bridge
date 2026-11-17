const BloodLoader = () => {
  return (
    <div>
      <style>{`
        @keyframes rise { 0% { transform: translateY(150px); } 70%,100% { transform: translateY(22px); } }
        @keyframes slide { to { transform: translateX(-100px); } }
        @keyframes slideSlow { to { transform: translateX(-100px); } }
        @keyframes glow { 0%,100% { opacity:.5; } 50% { opacity:.85; } }
        .fill { animation: rise 3s cubic-bezier(.45,0,.25,1) infinite; }
        .wave-a { animation: slide 1.8s linear infinite; }
        .wave-b { animation: slideSlow 2.8s linear infinite reverse; }
        .halo { animation: glow 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .fill { animation: none; transform: translateY(60px); }
          .wave-a, .wave-b, .halo { animation: none; }
        }
      `}</style>

      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(40% 45% at 50% 50%, rgba(150,14,34,.3), transparent 70%)",
        }}
      />

      <div className="relative h-40 w-32">
        <div
          aria-hidden
          className="halo absolute inset-[-30%] rounded-full bg-[radial-gradient(circle,rgba(220,25,50,.45),transparent_65%)] blur-2xl"
        />
        <svg
          viewBox="0 0 120 150"
          className="relative h-full w-full"
          aria-hidden
        >
          <defs>
            <clipPath id="loadDrop">
              <path d="M60 6C60 6 12 66 12 96c0 27 21.5 48 48 48s48-21 48-48C108 66 60 6 60 6Z" />
            </clipPath>
            <linearGradient id="loadFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff4560" />
              <stop offset="1" stopColor="#7a0c20" />
            </linearGradient>
          </defs>

          <path
            d="M60 6C60 6 12 66 12 96c0 27 21.5 48 48 48s48-21 48-48C108 66 60 6 60 6Z"
            fill="rgba(255,255,255,.04)"
            stroke="rgba(255,255,255,.22)"
            strokeWidth="1.5"
          />

          <g clipPath="url(#loadDrop)">
            <g className="fill">
              <g className="wave-b" opacity=".45">
                <path
                  fill="#ff4560"
                  d="M0 8Q25 -4 50 8T100 8T150 8T200 8T250 8V200H0Z"
                />
              </g>
              <g className="wave-a">
                <path
                  fill="url(#loadFill)"
                  d="M0 12Q25 2 50 12T100 12T150 12T200 12T250 12V200H0Z"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default BloodLoader;