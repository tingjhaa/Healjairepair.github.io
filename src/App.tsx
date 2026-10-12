import React, { useState } from 'react';
import { AuraHero } from './components/AuraHero';
import { InsuranceCalculator } from './components/InsuranceCalculator';
import { ClaimReportModal } from './components/ClaimReportModal';
import { OICGuideModal } from './components/OICGuideModal';
import { EmergencyHotlineModal } from './components/EmergencyHotlineModal';
import { FloodNewsModal } from './components/FloodNewsModal';
import { RealtimeFloodMapModal } from './components/RealtimeFloodMapModal';
import { ClaimState, PropertyType } from './types';
import {
  ShieldAlert,
  Radio,
  BookOpen,
  PhoneCall,
  Satellite,
  MapPin
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [activeReportClaim, setActiveReportClaim] = useState<ClaimState | null>(null);
  const [isOICGuideOpen, setIsOICGuideOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isFloodNewsOpen, setIsFloodNewsOpen] = useState(false);
  const [isFloodMapOpen, setIsFloodMapOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyType>('home');

  const handleSelectPropertyQuick = (type: PropertyType) => {
    setSelectedProperty(type);
    setIsCalculatorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF5ED] text-slate-800 flex flex-col font-prompt relative overflow-x-hidden selection:bg-[#00CACA]/20">
      {/* Top Application Header Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF5ED]/90 backdrop-blur-md border-b border-amber-900/10 px-4 py-3 transition-colors">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#004D40] flex items-center justify-center text-[#00CACA] shadow-sm shrink-0">
              <ShieldAlert className="w-4 h-4 text-[#00CACA]" />
            </div>
            <div>
              <span className="font-bold text-sm md:text-base text-slate-900 font-prompt tracking-tight block leading-tight">
                Healjai Repair
              </span>
              <span className="text-[10px] text-slate-500 font-normal block">
                {lang === 'th' ? 'ผู้ช่วยประเมินสินไหมน้ำท่วม' : 'Flood Insurance Assistant'}
              </span>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Realtime Flood Map Button (Google Maps) */}
            <button
              onClick={() => setIsFloodMapOpen(true)}
              className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 border border-slate-700 hover:scale-105 active:scale-95 transition-all font-prompt cursor-pointer"
              title="แผนที่เตือนภัยน้ำท่วมเรียลไทม์ (Google Maps) 3 สีวิกฤต"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'th' ? 'แผนที่น้ำท่วมสด' : 'Live Flood Map'}</span>
            </button>

            {/* Real-time Flood Report Button */}
            <button
              onClick={() => setIsFloodNewsOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 border border-slate-700 hover:scale-105 active:scale-95 transition-all font-prompt cursor-pointer"
              title="รายงานสถานการณ์น้ำท่วมเรียลไทม์ (disaster.gistda.or.th)"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]"></span>
              </span>
              <span>{lang === 'th' ? 'รายงานน้ำท่วม' : 'Flood Report'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View (Only Inside the Application) */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 pb-12 flex flex-col justify-start">
        {!isCalculatorOpen ? (
          /* Atmospheric Aura & Greeting (Home View) */
          <div className="flex-1 flex flex-col justify-between py-2">
            <AuraHero
              lang={lang}
              onStartCalculator={() => handleSelectPropertyQuick('home')}
              onOpenOICGuide={() => setIsOICGuideOpen(true)}
              onSelectPropertyQuick={handleSelectPropertyQuick}
              onOpenFloodMap={() => setIsFloodMapOpen(true)}
            />
          </div>
        ) : (
          /* Guided Claim Calculator Assistant */
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsCalculatorOpen(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs hover:bg-white transition-all cursor-pointer font-prompt"
              >
                <span>← {lang === 'th' ? 'กลับหน้าหลัก' : 'Back to Home'}</span>
              </button>
              
              <button
                onClick={() => setIsEmergencyOpen(true)}
                className="text-xs font-medium text-rose-700 hover:text-rose-900 flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors font-prompt"
              >
                <PhoneCall className="w-3 h-3 text-rose-600" />
                <span>{lang === 'th' ? 'สายด่วน ปภ. 1784' : 'Hotline 1784'}</span>
              </button>
            </div>

            <InsuranceCalculator
              lang={lang}
              initialPropertyType={selectedProperty}
              onBackToHome={() => setIsCalculatorOpen(false)}
              onOpenReportModal={(claim) => setActiveReportClaim(claim)}
              onOpenOICGuide={() => setIsOICGuideOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {activeReportClaim && (
        <ClaimReportModal
          claim={activeReportClaim}
          onClose={() => setActiveReportClaim(null)}
          lang={lang}
        />
      )}

      {isOICGuideOpen && (
        <OICGuideModal
          onClose={() => setIsOICGuideOpen(false)}
          lang={lang}
        />
      )}

      {isEmergencyOpen && (
        <EmergencyHotlineModal
          onClose={() => setIsEmergencyOpen(false)}
          lang={lang}
        />
      )}

      {isFloodNewsOpen && (
        <FloodNewsModal
          onClose={() => setIsFloodNewsOpen(false)}
          lang={lang}
        />
      )}

      {isFloodMapOpen && (
        <RealtimeFloodMapModal
          onClose={() => setIsFloodMapOpen(false)}
          lang={lang}
          onSelectZoneForClaim={() => {
            setIsCalculatorOpen(true);
          }}
        />
      )}
    </div>
  );
}
