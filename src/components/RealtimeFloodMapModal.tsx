import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Layers,
  MapPin,
  Waves,
  AlertTriangle,
  Droplets,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Compass,
  Plus,
  Minus,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { FLOOD_ZONES, FloodZone } from '../data/floodMapData';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

declare global {
  interface Window {
    google?: any;
  }
}

interface RealtimeFloodMapModalProps {
  onClose: () => void;
  lang: 'th' | 'en';
  onSelectZoneForClaim: (province: string) => void;
}

export const RealtimeFloodMapModal: React.FC<RealtimeFloodMapModalProps> = ({
  onClose,
  lang,
  onSelectZoneForClaim,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any | null>(null);
  const [markersRef, setMarkersRef] = useState<any[]>([]);
  const [circlesRef, setCirclesRef] = useState<any[]>([]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'red' | 'yellow' | 'blue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeZone, setActiveZone] = useState<FloodZone | null>(FLOOD_ZONES[0]);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Stats calculation
  const redCount = FLOOD_ZONES.filter((z) => z.crisisLevel === 'red').length;
  const yellowCount = FLOOD_ZONES.filter((z) => z.crisisLevel === 'yellow').length;
  const blueCount = FLOOD_ZONES.filter((z) => z.crisisLevel === 'blue').length;

  const filteredZones = FLOOD_ZONES.filter((zone) => {
    const matchesFilter = selectedFilter === 'all' || zone.crisisLevel === selectedFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      zone.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.provinceTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // SVG Marker Generator following Google Maps styling standards with 3 colors: red, yellow, blue
  const getMarkerIcon = (crisisLevel: 'red' | 'yellow' | 'blue', iconType: string) => {
    let strokeColor = '#DC2626';
    let fillColor = '#EF4444';
    let iconSvg = '';

    if (crisisLevel === 'red') {
      // RED: Severe flood / submerged house & high wave alert
      strokeColor = '#B91C1C';
      fillColor = '#DC2626';
      iconSvg = `
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#FFFFFF"/>
        <path d="M4 18c2 1 4-1 6 0s4 1 6 0 4-1 6 0" stroke="#FFFFFF" stroke-width="2" fill="none"/>
      `;
    } else if (crisisLevel === 'yellow') {
      // YELLOW: Warning / Rising water wave & caution triangle
      strokeColor = '#CA8A04';
      fillColor = '#EAB308';
      iconSvg = `
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="#FFFFFF"/>
      `;
    } else {
      // BLUE: Draining / Receding water droplet & flow
      strokeColor = '#0284C7';
      fillColor = '#0EA5E9';
      iconSvg = `
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#FFFFFF"/>
        <path d="M9 13l2 2 4-4" stroke="#0284C7" stroke-width="2" fill="none"/>
      `;
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 24 28">
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
        <path d="M12 0C6.5 0 2 4.5 2 10c0 7.5 10 18 10 18s10-10.5 10-18c0-5.5-4.5-10-10-10z" 
              fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" filter="url(#shadow)"/>
        <circle cx="12" cy="10" r="7.5" fill="#FFFFFF" fill-opacity="0.2"/>
        <g transform="translate(4, 2) scale(0.65)">
          ${iconSvg}
        </g>
      </svg>
    `;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  };

  // Initialize Google Maps instance
  useEffect(() => {
    let isMounted = true;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCgjHccql3Zsx-NuplWZLyjPmJU-PPMm90';

    const initMap = async () => {
      try {
        setOptions({
          key: apiKey,
          v: 'weekly',
          solutionChannel: 'gmp_git_agentskills_v1',
        });

        const { Map } = (await importLibrary('maps')) as any;

        if (!isMounted || !mapContainerRef.current) return;

        const map = new Map(mapContainerRef.current, {
          center: { lat: 14.85, lng: 100.45 },
          zoom: 7.2,
          mapTypeId: mapType,
          disableDefaultUI: true, // We provide custom Google Maps UI
          gestureHandling: 'greedy',
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#cbe7f8' }],
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f4ef' }],
            },
          ],
        });

        setMapInstance(map);
        setMapLoaded(true);
      } catch (err) {
        console.warn('Google Maps JS API load error, using high-fidelity fallback map canvas:', err);
        setLoadError(true);
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update map type
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setMapTypeId(mapType);
    }
  }, [mapType, mapInstance]);

  // Render Markers on Google Maps
  useEffect(() => {
    if (!mapInstance || !window.google) return;

    // Clear old markers & circles
    markersRef.forEach((m) => m.setMap(null));
    circlesRef.forEach((c) => c.setMap(null));

    const g = window.google;
    if (!g || !g.maps) return;

    const newMarkers: any[] = [];
    const newCircles: any[] = [];

    filteredZones.forEach((zone) => {
      const position = { lat: zone.lat, lng: zone.lng };

      // Radius color
      let circleColor = '#DC2626';
      if (zone.crisisLevel === 'yellow') circleColor = '#EAB308';
      if (zone.crisisLevel === 'blue') circleColor = '#0EA5E9';

      // Flood Inundation Radius Circle
      const circle = new g.maps.Circle({
        strokeColor: circleColor,
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
        fillColor: circleColor,
        fillOpacity: 0.18,
        map: mapInstance,
        center: position,
        radius: zone.crisisLevel === 'red' ? 9000 : zone.crisisLevel === 'yellow' ? 6500 : 4500,
      });
      newCircles.push(circle);

      // Standard Flood Icon Marker
      const marker = new g.maps.Marker({
        position,
        map: mapInstance,
        title: zone.nameTh,
        icon: {
          url: getMarkerIcon(zone.crisisLevel, zone.standardIcon),
          scaledSize: new g.maps.Size(34, 40),
          anchor: new g.maps.Point(17, 40),
        },
        animation: zone.crisisLevel === 'red' ? g.maps.Animation.DROP : undefined,
      });

      marker.addListener('click', () => {
        setActiveZone(zone);
        mapInstance.panTo(position);
        mapInstance.setZoom(10);
      });

      newMarkers.push(marker);
    });

    setMarkersRef(newMarkers);
    setCirclesRef(newCircles);
  }, [mapInstance, filteredZones]);

  // Center on active zone
  const handleSelectZone = (zone: FloodZone) => {
    setActiveZone(zone);
    if (mapInstance) {
      mapInstance.panTo({ lat: zone.lat, lng: zone.lng });
      mapInstance.setZoom(10);
    }
  };

  const handleZoom = (delta: number) => {
    if (mapInstance) {
      const current = mapInstance.getZoom() || 7;
      mapInstance.setZoom(current + delta);
    }
  };

  const handleResetView = () => {
    if (mapInstance) {
      mapInstance.panTo({ lat: 14.85, lng: 100.45 });
      mapInstance.setZoom(7.2);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative font-prompt">
        {/* ================= GOOGLE MAPS TOP HEADER & SEARCH ================= */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 z-20 shadow-xs">
          {/* Brand & Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#004D40] to-slate-900 flex items-center justify-center text-[#00CACA] shadow-xs">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm md:text-base text-slate-900 leading-tight">
                  {lang === 'th' ? 'แผนที่เตือนภัยน้ำท่วมเรียลไทม์' : 'Real-Time Crisis Flood Map'}
                </h3>
                <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                มาตรฐานสัญลักษณ์ คปภ. & ปภ. · แบ่งระดับวิกฤต 3 สี (แดง, เหลือง, ฟ้า)
              </p>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              🔴 วิกฤต: {redCount} จุด
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              🟡 เฝ้าระวัง: {yellowCount} จุด
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              🔵 น้ำลด/ระบาย: {blueCount} จุด
            </span>

            <button
              onClick={onClose}
              className="p-1.5 ml-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="ปิด"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= MAP CONTROLS & FLOATING SEARCH BAR ================= */}
        <div className="relative flex-1 bg-slate-100 overflow-hidden flex flex-col md:flex-row">
          {/* Main Map View Area */}
          <div className="relative flex-1 h-[55vh] md:h-full overflow-hidden">
            {/* The Google Map Container */}
            <div ref={mapContainerRef} className="w-full h-full bg-[#f2efe9]" />

            {/* Fallback Map Overlay if Google Maps is loading or blocked by iframe security */}
            {(!mapLoaded || loadError) && (
              <div className="absolute inset-0 bg-[#e5e3df] flex flex-col items-center justify-center p-4">
                <div className="relative w-full h-full max-w-xl mx-auto rounded-2xl bg-[#cad2d3] overflow-hidden border border-slate-300 shadow-inner flex flex-col items-center justify-center">
                  {/* Thailand Map Background Silhouette & River grid */}
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 text-center p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 max-w-md">
                    <Compass className="w-8 h-8 text-[#00CACA] mx-auto mb-2 animate-spin-slow" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      {lang === 'th' ? 'กำลังเชื่อมต่อ Google Maps Platform...' : 'Connecting to Google Maps Platform...'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {lang === 'th'
                        ? 'กำลังดึงพิกัดมวลน้ำเรียลไทม์และภาพถ่ายดาวเทียมสำรวจอุทกภัย'
                        : 'Fetching live flood coordinates & satellite inundation layers'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Top Floating Google Maps Search & Filter Chips (Authentic Google Maps UI) */}
            <div className="absolute top-3 inset-x-3 md:inset-x-6 z-10 space-y-2 pointer-events-none">
              {/* Google Maps Search Box */}
              <div className="max-w-md mx-auto pointer-events-auto">
                <div className="flex items-center gap-2 bg-white rounded-full shadow-lg border border-slate-200/90 px-3.5 py-2">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === 'th'
                        ? 'ค้นหาจังหวัด, อำเภอ, หรือลุ่มน้ำ...'
                        : 'Search province, district, or river...'
                    }
                    className="flex-1 text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none font-prompt"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Crisis Color Filter Chips */}
              <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white/95 text-slate-700 hover:bg-white'
                  }`}
                >
                  ทั้งหมด ({FLOOD_ZONES.length})
                </button>

                <button
                  onClick={() => setSelectedFilter('red')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1 transition-all cursor-pointer ${
                    selectedFilter === 'red'
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                      : 'bg-white/95 text-rose-700 hover:bg-rose-50 border border-rose-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  🔴 วิกฤตสีแดง ({redCount})
                </button>

                <button
                  onClick={() => setSelectedFilter('yellow')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1 transition-all cursor-pointer ${
                    selectedFilter === 'yellow'
                      ? 'bg-amber-500 text-slate-900 ring-2 ring-amber-300'
                      : 'bg-white/95 text-amber-700 hover:bg-amber-50 border border-amber-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  🟡 เฝ้าระวังสีเหลือง ({yellowCount})
                </button>

                <button
                  onClick={() => setSelectedFilter('blue')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1 transition-all cursor-pointer ${
                    selectedFilter === 'blue'
                      ? 'bg-sky-600 text-white ring-2 ring-sky-300'
                      : 'bg-white/95 text-sky-700 hover:bg-sky-50 border border-sky-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  🔵 ระบายช้า/น้ำลด ({blueCount})
                </button>
              </div>
            </div>

            {/* Google Maps Floating Navigation Toolbars (Top-Right / Right) */}
            <div className="absolute top-16 right-3 z-10 flex flex-col gap-2">
              {/* Map / Satellite Toggle */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-0.5 flex flex-col text-xs font-medium">
                <button
                  onClick={() => setMapType('roadmap')}
                  className={`px-2.5 py-1.5 rounded-lg text-left transition-colors flex items-center gap-1.5 ${
                    mapType === 'roadmap' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-[10px]">แผนที่</span>
                </button>
                <button
                  onClick={() => setMapType('hybrid')}
                  className={`px-2.5 py-1.5 rounded-lg text-left transition-colors flex items-center gap-1.5 ${
                    mapType === 'hybrid' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-mono">🛰️</span>
                  <span className="text-[10px]">ดาวเทียม</span>
                </button>
              </div>

              {/* Zoom Buttons (+ / -) */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col overflow-hidden">
                <button
                  onClick={() => handleZoom(1)}
                  className="p-2 text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-100"
                  title="ขยาย"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleZoom(-1)}
                  className="p-2 text-slate-700 hover:bg-slate-100 transition-colors"
                  title="ย่อ"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Reset Center Button */}
              <button
                onClick={handleResetView}
                className="p-2 bg-white rounded-xl shadow-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                title="กลับมุมมองประเทศไทย"
              >
                <Compass className="w-4 h-4 text-[#008f8f]" />
              </button>
            </div>

            {/* Bottom-Left Standard Flood Legend Bar (Red, Yellow, Blue) */}
            <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-slate-200/90 text-[10px] space-y-1.5 max-w-[260px] hidden sm:block">
              <span className="font-bold text-slate-900 block font-prompt">
                📌 มาตรฐานระดับเตือนภัยน้ำท่วม 3 สี:
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-900">
                  <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0"></span>
                  <span className="font-semibold">สีแดง: วิกฤตน้ำท่วมรุนแรง</span>
                  <span className="text-slate-500 font-mono">&gt;1.2 ม.</span>
                </div>
                <div className="flex items-center gap-2 text-amber-900">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="font-semibold">สีเหลือง: เฝ้าระวังน้ำล้นตลิ่ง</span>
                  <span className="text-slate-500 font-mono">0.4-1.0 ม.</span>
                </div>
                <div className="flex items-center gap-2 text-sky-900">
                  <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0"></span>
                  <span className="font-semibold">สีฟ้า/น้ำเงิน: ระบายช้า/น้ำลด</span>
                  <span className="text-slate-500 font-mono">&lt;0.3 ม.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SIDE PANEL: SELECTED FLOOD ZONE DETAILS ================= */}
          <div className="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col z-20 shrink-0 h-[38vh] md:h-full">
            {activeZone ? (
              <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3.5">
                {/* Zone Header Card with matching crisis color */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    activeZone.crisisLevel === 'red'
                      ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                      : activeZone.crisisLevel === 'yellow'
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                      : 'bg-sky-50/80 border-sky-300 text-sky-950'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                        activeZone.crisisLevel === 'red'
                          ? 'bg-rose-600 text-white'
                          : activeZone.crisisLevel === 'yellow'
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-sky-600 text-white'
                      }`}
                    >
                      {activeZone.crisisLevel === 'red'
                        ? '🔴 วิกฤตน้ำท่วมรุนแรง (Severe)'
                        : activeZone.crisisLevel === 'yellow'
                        ? '🟡 เฝ้าระวังน้ำล้นตลิ่ง (Warning)'
                        : '🔵 น้ำระบายช้า / น้ำลดระดับ'}
                    </span>
                    <span className="font-mono text-[10px] opacity-75">{activeZone.alertTime}</span>
                  </div>

                  <h4 className="font-bold text-sm md:text-base text-slate-900 leading-snug">
                    {activeZone.nameTh}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">{activeZone.provinceTh} · {activeZone.riverBasin}</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">ระดับความลึกน้ำ</span>
                    <span className="font-mono font-bold text-base text-slate-900">
                      {activeZone.waterDepthMeters} ม.
                    </span>
                    <span className="text-[9px] text-slate-500 block">{activeZone.waterDepthDesc}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">พื้นที่ท่วมขัง (GISTDA)</span>
                    <span className="font-mono font-bold text-sm text-[#004D40] block truncate">
                      {activeZone.gistdaAreaRai}
                    </span>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                      {activeZone.trend === 'rising' ? (
                        <span className="text-rose-600 font-semibold flex items-center">
                          <TrendingUp className="w-3 h-3" /> แนวโน้มเพิ่ม
                        </span>
                      ) : activeZone.trend === 'falling' ? (
                        <span className="text-emerald-600 font-semibold flex items-center">
                          <TrendingDown className="w-3 h-3" /> แนวโน้มลด
                        </span>
                      ) : (
                        <span className="text-amber-600 font-semibold flex items-center">
                          <Waves className="w-3 h-3" /> ระดับทรงตัว
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Advice Card */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#008f8f]" />
                    คำแนะนำการรับมือ & สิทธิ์สินไหม:
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {activeZone.adviceTh}
                  </p>
                </div>

                {/* Direct Action: Jump to Calculator with this Province */}
                <div className="pt-2 mt-auto space-y-2">
                  <button
                    onClick={() => {
                      onSelectZoneForClaim(activeZone.provinceTh);
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#00CACA] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#00B4B4] active:scale-[0.98] transition-all cursor-pointer font-prompt"
                  >
                    <span>ประเมินค่าสินไหมน้ำท่วมในพื้นที่นี้</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-slate-400">
                    ระบบจะเลือกจังหวัด {activeZone.provinceTh} และคำนวณสินไหมอัตโนมัติ
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs">
                <MapPin className="w-8 h-8 mb-2 opacity-50" />
                <p>คลิกเลือกจุดหมุดบนแผนที่เพื่อดูข้อมูลระดับน้ำ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
