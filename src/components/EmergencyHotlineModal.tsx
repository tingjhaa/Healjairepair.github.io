import React from 'react';
import { X, PhoneCall, AlertCircle, LifeBuoy } from 'lucide-react';
import { INSURANCE_COMPANIES } from '../data/mockData';

interface EmergencyHotlineModalProps {
  onClose: () => void;
  lang: 'th' | 'en';
}

export const EmergencyHotlineModal: React.FC<EmergencyHotlineModalProps> = ({ onClose, lang }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="p-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <LifeBuoy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-prompt">
                {lang === 'th' ? 'สายด่วนฉุกเฉินและบริษัทประกันภัย' : 'Emergency Hotlines & Insurers'}
              </h3>
              <p className="text-[11px] text-amber-100">บริการช่วยเหลือ 24 ชั่วโมงในประเทศไทย</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 max-h-[70vh] overflow-y-auto text-xs text-slate-700 bg-slate-50/50 font-prompt">
          {/* Government / Disaster numbers */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs text-amber-800">
              🚨 หน่วยงานรัฐและกู้ภัยฉุกเฉิน
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <a
                href="tel:1186"
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#00CACA] flex items-center justify-between group transition-all"
              >
                <div>
                  <p className="font-bold text-slate-900">สายด่วน คปภ. (ประกันภัย)</p>
                  <p className="text-[10px] text-slate-500">ปรึกษาข้อพิพาทและสิทธิ์เคลมน้ำท่วม</p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-[#00CACA] text-slate-900 font-bold text-xs flex items-center gap-1 shadow-xs">
                  <PhoneCall className="w-3.5 h-3.5" />
                  1186
                </span>
              </a>

              <a
                href="tel:1784"
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 flex items-center justify-between group transition-all"
              >
                <div>
                  <p className="font-bold text-slate-900">กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)</p>
                  <p className="text-[10px] text-slate-500">แจ้งเหตุน้ำท่วม ขอเรืออพยพ กระสอบทราย</p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                  <PhoneCall className="w-3.5 h-3.5" />
                  1784
                </span>
              </a>

              <a
                href="tel:1669"
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 flex items-center justify-between group transition-all"
              >
                <div>
                  <p className="font-bold text-slate-900">สายด่วนกู้ชีพ / การแพทย์ฉุกเฉิน</p>
                  <p className="text-[10px] text-slate-500">เจ็บป่วยฉุกเฉิน อุบัติเหตุทางน้ำ</p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                  <PhoneCall className="w-3.5 h-3.5" />
                  1669
                </span>
              </a>
            </div>
          </div>

          {/* Insurance Companies Hotline List */}
          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-slate-900 text-xs text-slate-800">
              🏢 สายด่วนแจ้งเคลมบริษัทประกันภัยชั้นนำ
            </h4>
            <div className="space-y-1.5">
              {INSURANCE_COMPANIES.map((ins) => (
                <div
                  key={ins.id}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-800">{ins.name}</span>
                  <a
                    href={`tel:${ins.hotLine}`}
                    className="font-mono font-bold text-slate-900 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#00CACA] transition-colors"
                  >
                    {ins.hotLine}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-white border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs font-prompt"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
