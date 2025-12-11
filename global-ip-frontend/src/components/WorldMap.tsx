export function WorldMap() {
  // Simulated patent activity hotspots
  const hotspots = [
    { x: "15%", y: "30%", size: "large" },  // North America
    { x: "50%", y: "25%", size: "large" },  // Europe
    { x: "70%", y: "35%", size: "extra-large" },  // Asia
    { x: "45%", y: "55%", size: "medium" }, // Africa
    { x: "20%", y: "70%", size: "medium" }, // South America
    { x: "80%", y: "65%", size: "small" },  // Australia
  ];

  const getSizeClass = (size: string) => {
    switch (size) {
      case "extra-large":
        return "w-20 h-20";
      case "large":
        return "w-16 h-16";
      case "medium":
        return "w-12 h-12";
      case "small":
        return "w-8 h-8";
      default:
        return "w-12 h-12";
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-blue-900 mb-4">
          Global Patent Activity
        </h2>
        <p className="text-slate-600 text-lg">
          Real-time visualization of IP filings worldwide
        </p>
      </div>

      <div className="relative p-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        {/* Simplified world map illustration */}
        <div className="relative w-full h-96 bg-gradient-to-b from-slate-700/50 to-slate-800/50 rounded-xl border border-blue-500/20">
          {/* Grid pattern for world map effect */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Stylized continents using SVG shapes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400">
            {/* North America */}
            <path
              d="M 100 120 Q 120 100 150 110 L 180 130 Q 190 140 185 160 L 170 180 Q 160 190 140 185 L 110 165 Q 95 150 100 120 Z"
              fill="#60a5fa"
              fillOpacity="0.3"
              stroke="#60a5fa"
              strokeWidth="1"
            />
            
            {/* South America */}
            <path
              d="M 180 260 Q 190 250 200 260 L 210 290 Q 215 310 205 325 L 185 340 Q 175 345 165 335 L 160 300 Q 165 275 180 260 Z"
              fill="#60a5fa"
              fillOpacity="0.3"
              stroke="#60a5fa"
              strokeWidth="1"
            />
            
            {/* Europe */}
            <path
              d="M 480 100 Q 495 95 510 105 L 525 120 Q 530 130 525 145 L 510 160 Q 500 165 485 160 L 470 145 Q 465 130 480 100 Z"
              fill="#60a5fa"
              fillOpacity="0.3"
              stroke="#60a5fa"
              strokeWidth="1"
            />
            
            {/* Africa */}
            <path
              d="M 470 200 Q 485 190 505 200 L 525 230 Q 530 250 520 270 L 495 285 Q 480 290 465 280 L 455 250 Q 455 220 470 200 Z"
              fill="#60a5fa"
              fillOpacity="0.3"
              stroke="#60a5fa"
              strokeWidth="1"
            />
            
            {/* Asia */}
            <path
              d="M 650 120 Q 670 110 700 120 L 740 140 Q 760 155 755 180 L 730 200 Q 710 210 685 205 L 655 185 Q 640 165 650 120 Z"
              fill="#60a5fa"
              fillOpacity="0.3"
              stroke="#60a5fa"
              strokeWidth="1"
            />
            
            {/* Australia */}
            <path
              d="M 780 260 Q 795 255 810 265 L 825 285 Q 830 300 820 310 L 800 320 Q 785 320 775 310 L 770 290 Q 770 270 780 260 Z"
              fill="#60a5fa"
              fillOpacity="0.3"
              stroke="#60a5fa"
              strokeWidth="1"
            />
          </svg>

          {/* Activity Hotspots */}
          {hotspots.map((spot, index) => (
            <div
              key={index}
              className={`absolute ${getSizeClass(spot.size)} animate-pulse`}
              style={{
                left: spot.x,
                top: spot.y,
                transform: "translate(-50%, -50%)",
                animationDuration: `${2 + index * 0.3}s`,
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-60"></div>
                <div className="absolute inset-2 bg-blue-500 rounded-full blur-sm"></div>
                <div className="absolute inset-3 bg-blue-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-slate-300">High Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-300">Medium Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-slate-300">Low Activity</span>
          </div>
        </div>
      </div>
    </section>
  );
}
