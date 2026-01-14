import { useState, useEffect, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { Loader2, AlertCircle } from 'lucide-react';
import { unifiedTrendsApi } from '../../services/unifiedTrendsApi';
import { CountryTrendData } from '../../types/unifiedTrends';

// TopoJSON source
const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map TopoJSON country names → ISO-2 codes
const nameToISO2: Record<string, string> = {
  'United States of America': 'US',
  'China': 'CN',
  "People's Republic of China": 'CN',
  'Japan': 'JP',
  'Germany': 'DE',
  'South Korea': 'KR',
  'Republic of Korea': 'KR',
  'France': 'FR',
  'United Kingdom': 'GB',
  'India': 'IN',
  'Australia': 'AU',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Finland': 'FI',
  'Poland': 'PL',
  'Czechia': 'CZ',
  'Hungary': 'HU',
  'Romania': 'RO',
  'Ukraine': 'UA',
  'Lithuania': 'LT',
  'Luxembourg': 'LU',
  'Morocco': 'MA',
  'Slovakia': 'SK',
  'Uruguay': 'UY'
};

// ISO-2 → display name
const countryNames: Record<string, string> = {
  US: 'United States',
  CN: 'China',
  JP: 'Japan',
  DE: 'Germany',
  KR: 'South Korea',
  FR: 'France',
  GB: 'United Kingdom',
  IN: 'India',
  AU: 'Australia',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
  SE: 'Sweden',
  NO: 'Norway',
  FI: 'Finland',
  PL: 'Poland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  RO: 'Romania',
  UA: 'Ukraine',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MA: 'Morocco',
  SK: 'Slovakia',
  UY: 'Uruguay'
};

interface TooltipData {
  country: string;
  patentsViewCount: number;
  epoCount: number;
  total: number;
}

export function GlobalChoroplethMap() {
  const [data, setData] = useState<CountryTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await unifiedTrendsApi.getCountryTrends();
      setData(res);
    } catch (e: any) {
      setError('Failed to load geographic data');
      console.error('Map data load error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Build lookup map + max value
  const { dataMap, maxValue } = useMemo(() => {
    const map = new Map<string, CountryTrendData>();
    let max = 0;

    data.forEach((item) => {
      const iso2 = item.country.toUpperCase();
      const total = item.patentsViewCount + item.epoCount;
      map.set(iso2, item);
      if (total > max) max = total;
    });

    return { dataMap: map, maxValue: max };
  }, [data]);

  const getColorForValue = (total: number) => {
    if (!total || !maxValue) return '#e2e8f0';
    const ratio = total / maxValue;

    if (ratio < 0.1) return '#eff6ff';
    if (ratio < 0.2) return '#dbeafe';
    if (ratio < 0.35) return '#bfdbfe';
    if (ratio < 0.5) return '#93c5fd';
    if (ratio < 0.7) return '#60a5fa';
    if (ratio < 0.85) return '#3b82f6';
    return '#2563eb';
  };

  // ---------------- UI STATES ----------------

  if (loading) {
    return (
      <div className="h-[520px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[520px] flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <p className="text-sm text-slate-700 mb-3">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[520px] flex items-center justify-center text-slate-500">
        No geographic data available
      </div>
    );
  }

  // ---------------- MAP ----------------

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-slate-900 mb-1">
        Global Geographic Distribution
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Patent filings by country (PatentsView + EPO)
      </p>

      <div
        className="relative bg-slate-50 border border-slate-200 rounded-lg overflow-hidden"
        style={{ height: '520px' }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 160, center: [0, 20] }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo: any) => {
                  // Get country name from TopoJSON properties
                  const geoName = geo.properties?.name;
                  if (!geoName) return null;

                  // Map name → ISO-2
                  const iso2 = nameToISO2[geoName]?.toUpperCase();
                  if (!iso2) {
                    // Country not in our mapping - render as gray
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#f1f5f9"
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: '#cbd5e1' },
                          pressed: { outline: 'none' }
                        }}
                      />
                    );
                  }

                  const countryData = dataMap.get(iso2);
                  const total = countryData
                    ? countryData.patentsViewCount +
                      countryData.epoCount
                    : 0;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColorForValue(total)}
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: {
                          fill:
                            total > 0 ? '#1e40af' : '#cbd5e1',
                          cursor:
                            total > 0 ? 'pointer' : 'default'
                        },
                        pressed: { outline: 'none' }
                      }}
                      onMouseEnter={() =>
                        setTooltip({
                          country:
                            countryNames[iso2] ||
                            geoName ||
                            iso2,
                          patentsViewCount:
                            countryData?.patentsViewCount || 0,
                          epoCount: countryData?.epoCount || 0,
                          total
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div className="absolute top-4 right-4 bg-white border border-slate-300 rounded-lg shadow-lg p-4 min-w-[200px]">
            <h4 className="font-bold mb-2">{tooltip.country}</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>PatentsView</span>
                <span className="font-semibold text-blue-600">
                  {tooltip.patentsViewCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>EPO</span>
                <span className="font-semibold text-purple-600">
                  {tooltip.epoCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-bold">
                  {tooltip.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center items-center gap-2 text-xs text-slate-600">
        <span>Low</span>
        {[
          '#eff6ff',
          '#dbeafe',
          '#bfdbfe',
          '#93c5fd',
          '#60a5fa',
          '#3b82f6',
          '#2563eb'
        ].map((c) => (
          <div
            key={c}
            className="w-8 h-4 rounded"
            style={{ backgroundColor: c }}
          />
        ))}
        <span>High</span>
      </div>

      <p className="mt-2 text-xs text-center text-slate-500">
        Hover to inspect • Scroll to zoom • Drag to pan
      </p>
    </div>
  );
}
