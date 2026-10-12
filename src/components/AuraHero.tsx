import React from 'react';
import { FileCheck2, Camera, AlertTriangle, MapPin, ChevronRight } from 'lucide-react';

interface AuraHeroProps {
  lang: 'th' | 'en';
  onStartCalculator: () => void;
  onOpenOICGuide: () => void;
  onSelectPropertyQuick: (type: 'home' | 'car' | 'appliance') => void;
  onOpenFloodMap?: () => void;
}

export const AuraHero: React.FC<AuraHeroProps> = ({
  lang,
  onStartCalculator,
  onOpenOICGuide,
  onSelectPropertyQuick,
  onOpenFloodMap,
}) => {
  return (
    <div className="relative overflow-hidden pt-6 pb-3 px-4 text-center flex-1 flex flex-col justify-between min-h-[640px]">
      {/* Diffuse Atmospheric Aura Glowing Orb from Reference Image 1 */}
      <div 
        className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(206, 178, 252, 0.75) 0%, rgba(254, 215, 170, 0.6) 45%, rgba(254, 243, 199, 0.25) 75%, transparent 100%)'
        }}
        aria-hidden="true"
      />

      {/* Main Greeting & Atmospheric Aura Center */}
      <div className="relative z-10 max-w-lg mx-auto my-auto py-2">
        {/* Soft Aura Orb visual circle in center, exactly like Image 1 */}
        <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-4">
          <div 
            className="w-28 h-28 md:w-36 md:h-36 rounded-full blur-xl"
            style={{
              background: 'radial-gradient(circle, rgba(196, 160, 252, 0.85) 15%, rgba(254, 202, 178, 0.75) 50%, rgba(255, 237, 213, 0.35) 80%)',
            }}
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-serif-editorial text-slate-900 tracking-tight leading-snug">
          {lang === 'th' ? 'สวัสดีค่ะ คุณโอลิเวีย!' : 'Good evening, Olivia!'}
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mt-1.5 font-prompt">
          {lang === 'th' 
            ? 'วิเคราะห์สิทธิ์และประมาณการค่าสินไหมน้ำท่วมตามมาตรฐาน คปภ.' 
            : 'Analysing your flood insurance claims & eligibility...'}
        </p>

        {/* Real-time Google Maps Flood Alert Banner */}
        {onOpenFloodMap && (
          <button
            onClick={onOpenFloodMap}
            className="mt-4 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-3 text-left w-full max-w-xs sm:max-w-sm mx-auto group active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-sky-500 p-0.5 shadow-2xs shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
                  <MapPin className="w-4 h-4 text-[#00CACA]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 font-prompt">
                    {lang === 'th' ? 'แผนที่เตือนภัยน้ำท่วมสด' : 'Real-Time Flood Map'}
                  </span>
                  <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                    3 สีวิกฤต
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                  <span className="text-rose-600 font-semibold">🔴 วิกฤต</span>
                  <span>·</span>
                  <span className="text-amber-600 font-semibold">🟡 เฝ้าระวัง</span>
                  <span>·</span>
                  <span className="text-sky-600 font-semibold">🔵 น้ำลด</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors shrink-0" />
          </button>
        )}
      </div>

      {/* Quick Access Card Grid matching bottom cards in Image 1 */}
      <div className="relative z-10 max-w-md mx-auto w-full grid grid-cols-3 gap-2.5 text-left mt-auto pt-6">
        <button
          onClick={() => onSelectPropertyQuick('home')}
          className="p-3 rounded-2xl bg-white/75 hover:bg-white backdrop-blur-md border border-white/80 shadow-xs transition-all hover:shadow-sm active:scale-[0.98] group flex flex-col justify-between h-26"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800 block group-hover:text-amber-700 transition-colors font-prompt">
              {lang === 'th' ? 'เคลมบ้าน' : 'Home Claim'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {lang === 'th' ? 'โครงสร้าง/เฟอร์' : 'Structure & Built-in'}
            </span>
          </div>
        </button>

        <button
          onClick={() => onSelectPropertyQuick('car')}
          className="p-3 rounded-2xl bg-white/75 hover:bg-white backdrop-blur-md border border-white/80 shadow-xs transition-all hover:shadow-sm active:scale-[0.98] group flex flex-col justify-between h-26"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800 block group-hover:text-sky-700 transition-colors font-prompt">
              {lang === 'th' ? 'เคลมรถยนต์' : 'Vehicle Claim'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {lang === 'th' ? '5 ระดับ คปภ.' : 'OIC 5 Water Levels'}
            </span>
          </div>
        </button>

        <button
          onClick={() => onSelectPropertyQuick('appliance')}
          className="p-3 rounded-2xl bg-white/75 hover:bg-white backdrop-blur-md border border-white/80 shadow-xs transition-all hover:shadow-sm active:scale-[0.98] group flex flex-col justify-between h-26"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800 block group-hover:text-purple-700 transition-colors font-prompt">
              {lang === 'th' ? 'ถ่ายภาพตรวจ' : 'Photo Verify'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {lang === 'th' ? 'ตรวจคราบรอยน้ำ' : 'AI Watermark Scan'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
