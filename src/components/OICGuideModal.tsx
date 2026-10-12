import React from 'react';
import { X, BookOpen, CheckCircle, AlertTriangle, ShieldCheck, PhoneCall, HelpCircle } from 'lucide-react';
import { OIC_REGULATIONS } from '../data/mockData';

interface OICGuideModalProps {
  onClose: () => void;
  lang: 'th' | 'en';
}

export const OICGuideModal: React.FC<OICGuideModalProps> = ({ onClose, lang }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="p-4 bg-[#004D40] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00CACA] text-slate-900 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-prompt">
                {lang === 'th' ? 'คู่มือเกณฑ์ประเมินสินไหมน้ำท่วม คปภ.' : 'OIC Flood Insurance Claim Standards'}
              </h3>
              <p className="text-[11px] text-emerald-200">
                สำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย
              </p>
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
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700 bg-slate-50/50 font-prompt">
          {/* Key Principle Alert */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>กฎเหล็ก 3 ข้อ: ถ่ายภาพก่อนเก็บกวาด ห้ามสตาร์ทรถ จ่ายใน 15 วัน</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              หากทำความสะอาดหรือซ่อมแซมก่อนบริษัทประกันเข้าสำรวจ อาจทำให้เสียสิทธิ์หรือเคลมได้ไม่เต็มจำนวน ให้ถ่ายรูปคราบรอยน้ำทุกมุมไว้เป็นหลักฐานทันที
            </p>
          </div>

          {/* OIC Regulations breakdown */}
          <div className="space-y-3">
            {OIC_REGULATIONS.map((sec, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#008f8f]" />
                  <span>{sec.category}</span>
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  {sec.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Vehicle Flood 5-Tiers Table */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">
              เกณฑ์ คปภ. 5 ระดับความเสียหายของรถยนต์ถูกน้ำท่วม:
            </h4>
            <div className="space-y-1.5 text-[10px]">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">ระดับ 1 (ถึงพื้นรถ):</span> ค่าทำความสะอาด ฟอกพรม อบโอโซน
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">ระดับ 2 (ถึงเบาะนั่ง):</span> เปลี่ยนเบาะ ฟอกภายใน ตรวจระบบไฟช่วงล่าง
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">ระดับ 3 (ถึงคอนโซลล่าง):</span> เปลี่ยนกล่องสมองกล ECU ซ่อมเครื่องยนต์
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">ระดับ 4 (ถึงคอนโซลบน):</span> ค่าซ่อมเกิน 70% คืนซากชดเชยเต็มทุนประกัน
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">ระดับ 5 (มิดหลังคารถ):</span> จ่ายสินไหมทดแทนเต็มจำนวน 100% ทันที
              </div>
            </div>
          </div>

          {/* Hotline Box */}
          <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs">ศูนย์รับเรื่องร้องเรียนประกันภัย คปภ.</p>
              <p className="text-[10px] text-cyan-800">โทรฟรีทุกวันตลอด 24 ชั่วโมง</p>
            </div>
            <a
              href="tel:1186"
              className="px-3 py-1.5 rounded-xl bg-[#00CACA] text-slate-900 font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-[#00B4B4]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>1186</span>
            </a>
          </div>
        </div>

        <div className="p-3 bg-white border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 font-prompt"
          >
            เข้าใจแล้ว ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
