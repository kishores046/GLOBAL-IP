export function GlobalHeatmap() {
  const regions = [
    {
      name: "North America",
      x: "15%",
      y: "30%",
      intensity: "high",
      value: 1240,
    },
    {
      name: "Europe",
      x: "50%",
      y: "25%",
      intensity: "high",
      value: 1580,
    },
    {
      name: "Asia",
      x: "70%",
      y: "35%",
      intensity: "very-high",
      value: 2340,
    },
    {
      name: "South America",
      x: "20%",
      y: "70%",
      intensity: "medium",
      value: 420,
    },
    {
      name: "Africa",
      x: "45%",
      y: "55%",
      intensity: "low",
      value: 180,
    },
    {
      name: "Australia",
      x: "80%",
      y: "65%",
      intensity: "medium",
      value: 380,
    },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "very-high":
        return "from-cyan-400 to-purple-500";
      case "high":
        return "from-blue-400 to-purple-400";
      case "medium":
        return "from-blue-300 to-cyan-300";
      case "low":
        return "from-blue-200 to-cyan-200";
      default:
        return "from-blue-300 to-cyan-300";
    }
  };

  const getSize = (intensity: string) => {
    switch (intensity) {
      case "very-high":
        return "w-24 h-24";
      case "high":
        return "w-20 h-20";
      case "medium":
        return "w-16 h-16";
      case "low":
        return "w-12 h-12";
      default:
        return "w-16 h-16";
    }
  };

  return (
    <div className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
      <div className="mb-6">
        <h3 className="text-2xl text-slate-900 mb-2">
          Global Filing Density
        </h3>
        <p className="text-slate-600">
          Interactive heatmap of IP activity worldwide
        </p>
      </div>

      <div className="relative h-96 bg-gradient-to-b from-sky-50/50 to-cyan-50/50 rounded-xl border border-blue-200/30 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="heatmap-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#heatmap-grid)"
            />
          </svg>
        </div>

        {/* World map simplified */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 1000 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 100 80 Q 120 60, 180 70 L 200 90 Q 180 120, 150 140 L 120 130 Q 100 110, 100 80"
            fill="#06b6d4"
          />
          <path
            d="M 170 200 L 200 250 Q 190 280, 180 270 L 160 240 Q 165 220, 170 200"
            fill="#06b6d4"
          />
          <path
            d="M 480 70 L 520 80 L 530 110 L 500 120 L 470 100 Z"
            fill="#06b6d4"
          />
          <path
            d="M 460 140 Q 480 160, 490 200 L 500 240 Q 485 250, 470 240 L 450 200 Q 445 170, 460 140"
            fill="#06b6d4"
          />
          <path
            d="M 600 80 L 750 90 Q 780 110, 770 140 L 720 180 L 650 170 Q 610 140, 600 80"
            fill="#06b6d4"
          />
          <path
            d="M 780 250 Q 820 245, 830 265 L 810 280 Q 780 275, 780 250"
            fill="#06b6d4"
          />
        </svg>

        {/* Interactive hotspots */}
        {regions.map((region, index) => (
          <div
            key={index}
            className="absolute group cursor-pointer"
            style={{
              left: region.x,
              top: region.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Pulsing glow */}
            <div
              className={`${getSize(region.intensity)} bg-gradient-to-r ${getIntensityColor(region.intensity)} rounded-full blur-2xl opacity-40 animate-pulse`}
            ></div>

            {/* Ping animation */}
            <div
              className={`absolute inset-0 ${getSize(region.intensity)} bg-gradient-to-r ${getIntensityColor(region.intensity)} rounded-full animate-ping opacity-30`}
            ></div>

            {/* Core dot */}
            <div
              className={`absolute inset-0 flex items-center justify-center ${getSize(region.intensity)}`}
            >
              <div
                className={`w-4 h-4 bg-gradient-to-r ${getIntensityColor(region.intensity)} rounded-full shadow-lg`}
              ></div>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gradient-to-r from-cyan-500/95 to-blue-500/95 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/50 shadow-2xl whitespace-nowrap">
                <div className="text-white text-sm mb-1">
                  {region.name}
                </div>
                <div className="text-white/90 text-xs">
                  {region.value} filings
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
          <span className="text-slate-700">Very High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          <span className="text-slate-700">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full"></div>
          <span className="text-slate-700">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full"></div>
          <span className="text-slate-700">Low</span>
        </div>
      </div>
    </div>
  );
}