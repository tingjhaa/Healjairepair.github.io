import React from 'react';
import { ShieldCheck, PhoneCall, Smartphone, Monitor, BookOpen } from 'lucide-react';

interface TopBarProps {
  lang: 'th' | 'en';
  setLang: (lang: 'th' | 'en') => void;
  viewMode: 'mobile' | 'desktop';
  setViewMode: (mode: 'mobile' | 'desktop') => void;
  onOpenOICGuide: () => void;
  onOpenEmergency: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  lang,
  setLang,
  viewMode,
  setViewMode,
  onOpenOICGuide,
  onOpenEmergency,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF5ED]/90 backdrop-blur-md border-b border-amber-900/10 px-4 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#004D40] flex items-center justify-center text-[#00CACA] shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 text-sm md:text-base leading-tight font-prompt">
                {lang === 'th' ? 'ผู้ช่วยประเมินสินไหมน้ำท่วม' : 'Thai Flood Claim Assistant'}
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 hidden sm:inline-block">
                OIC Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              {lang === 'th' ? 'มาตรฐานสำนักงาน คปภ. ประเทศไทย' : 'Thailand OIC Insurance Regulations'}
            </p>
          </div>
        </div>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* OIC Guidelines Trigger */}
          <button
            onClick={onOpenOICGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white/80 hover:bg-white rounded-lg border border-slate-200 shadow-xs transition-colors min-h-[38px]"
            title={lang === 'th' ? 'คู่มือเกณฑ์ คปภ.' : 'OIC Regulations Guide'}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline font-prompt">{lang === 'th' ? 'เกณฑ์ คปภ.' : 'OIC Guide'}</span>
          </button>

          {/* Hotline Trigger */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200/80 shadow-xs transition-colors min-h-[38px]"
            title="สายด่วน คปภ. 1186"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-semibold font-prompt">1186</span>
          </button>

          {/* View Mode Toggle: Mobile Simulator vs Full Desktop */}
          <div className="hidden lg:flex items-center bg-slate-200/70 p-0.5 rounded-lg border border-slate-300/50">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View</span>
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Wide View</span>
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-white/80 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setLang('th')}
              className={`px-2 py-1 rounded transition-colors ${
                lang === 'th' ? 'bg-[#00CACA] text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ไทย
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded transition-colors ${
                lang === 'en' ? 'bg-[#00CACA] text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
