import React, { useState } from 'react';
import { ClaimState } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Printer,
  X,
  FileCheck,
  Calendar,
  Building,
  MapPin,
  Share2
} from 'lucide-react';

interface ClaimReportModalProps {
  claim: ClaimState;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const ClaimReportModal: React.FC<ClaimReportModalProps> = ({
  claim,
  onClose,
  lang,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const claimRefId = `TH-FLOOD-${Date.now().toString().slice(-6)}`;

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `ใบประเมินสินไหมน้ำท่วม คปภ. รหัสอ้างอิง: ${claimRefId} | วงเงินสินไหมประเมิน: ฿${claim.calculatedPayout.toLocaleString()} บาท`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00CACA] text-slate-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-prompt">
                {lang === 'th' ? 'หนังสือสรุปการประเมินสินไหมน้ำท่วม' : 'Flood Claim Estimation Report'}
              </h3>
              <p className="text-[11px] text-slate-300 font-mono">REF: {claimRefId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Official Report Document Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700 bg-[#FAF9F5]">
          {/* Header Badge */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                ISSUED UNDER OIC GUIDELINES
              </span>
              <span className="text-xs font-semibold text-slate-800 font-prompt">
                มาตรฐานการประเมินสินไหมอุทกภัย สำนักงาน คปภ.
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>ผ่านการยืนยัน</span>
            </div>
          </div>

          {/* General Information Grid */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs font-prompt">
              {lang === 'th' ? 'ข้อมูลทรัพย์สินและการทำประกัน' : 'Property & Policy Details'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">ประเภททรัพย์สิน:</span>
                <span className="font-semibold text-slate-900 font-prompt">
                  {claim.propertyType === 'home'
                    ? 'บ้านพักอาศัย'
                    : claim.propertyType === 'car'
                    ? 'รถยนต์'
                    : claim.propertyType === 'appliance'
                    ? 'เครื่องใช้ไฟฟ้าและเฟอร์นิเจอร์'
                    : 'ร้านค้าและสต็อกสินค้า'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">ระดับน้ำท่วม:</span>
                <span className="font-semibold text-slate-900 font-prompt">
                  {claim.waterLevel === 'ankle'
                    ? 'ระดับข้อเท้า (< 20 ซม.)'
                    : claim.waterLevel === 'knee'
                    ? 'ระดับหัวเข่า (20 - 50 ซม.)'
                    : claim.waterLevel === 'waist'
                    ? 'ระดับเอว (50 - 100 ซม.)'
                    : 'ระดับมิดหลังคา/มิดคัน (Total Loss)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">จังหวัดที่เกิดเหตุ:</span>
                <span className="font-semibold text-slate-900 font-prompt">{claim.province}</span>
              </div>
              <div>
                <span className="text-slate-500 block">บริษัทประกันภัย:</span>
                <span className="font-semibold text-slate-900 font-prompt">{claim.insuranceCompany}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ทุนประกันภัย:</span>
                <span className="font-bold text-slate-900 font-mono">฿{claim.sumInsured.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ค่าเสียหายส่วนแรก (Deductible):</span>
                <span className="font-bold text-slate-900 font-mono">฿{claim.deductible.toLocaleString()}</span>
              </div>
              {claim.repairStoreName && (
                <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">ร้านซ่อม/อู่ที่ระบุเข้ารับบริการ:</span>
                  <span className="font-bold text-[#004D40] font-prompt bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    🔧 {claim.repairStoreName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Damage Photos Verified */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs font-prompt">
                {lang === 'th' ? 'หลักฐานภาพถ่ายที่ผ่านการสแกนระดับน้ำ' : 'Verified Damage Photos'}
              </h4>
              <span className="text-[10px] text-emerald-600 font-medium">
                {claim.images.length} รูปสมบูรณ์
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {claim.images.map((img) => (
                <div key={img.id} className="rounded-xl overflow-hidden border border-slate-200 relative aspect-4/3">
                  <img
                    src={img.url}
                    alt={img.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[8px] p-0.5 text-center truncate">
                    {img.confidence}% verified
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compensation Breakdown */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs font-prompt">
              {lang === 'th' ? 'สรุปการคำนวณสินไหมทดแทน' : 'Settlement Calculation'}
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">ประมาณการมูลค่าความเสียหายรวม:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  ฿{claim.calculatedLoss.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">เงินช่วยเหลือผู้ประสบภัยจากภาครัฐ:</span>
                <span className="font-semibold text-emerald-600 font-mono">
                  +฿{claim.governmentRelief.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">หักค่าเสียหายส่วนแรก (ถ้ามี):</span>
                <span className="font-semibold text-rose-600 font-mono">
                  -฿{claim.deductible.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 pt-3 text-sm font-bold bg-cyan-50/70 p-2 rounded-xl text-slate-900">
                <span className="font-prompt">สินไหมสุทธิที่คาดว่าจะได้รับอนุมัติ:</span>
                <span className="font-mono text-[#008f8f] text-base">
                  ฿{claim.calculatedPayout.toLocaleString()}
                </span>
              </div>
              {claim.ownerOutOfPocket > 0 ? (
                <div className="flex justify-between items-center py-2 px-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold">
                  <div>
                    <span className="block font-prompt text-xs text-amber-900">
                      {lang === 'th' ? 'ส่วนต่างที่เจ้าของต้องจ่ายเอง (ประกันไม่ครอบคลุมทั้งหมด):' : 'Owner Must Pay By Themselves (Uncovered Gap):'}
                    </span>
                    <span className="block text-[10px] text-amber-700 font-normal">
                      {lang === 'th' ? 'ภาระค่าซ่อมแซมส่วนเกินที่เจ้าของต้องรับผิดชอบ' : 'Out-of-pocket expenses for uncovered damage'}
                    </span>
                  </div>
                  <span className="font-mono text-rose-700 text-sm font-extrabold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    ฿{claim.ownerOutOfPocket.toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between py-1 px-2 text-[10px] text-emerald-700 bg-emerald-50 rounded-lg font-medium">
                  <span>{lang === 'th' ? 'ความคุ้มครองครบถ้วน (เจ้าของไม่ต้องจ่ายส่วนต่าง)' : '100% Fully Covered (No self-pay)'}</span>
                  <span>฿0</span>
                </div>
              )}
            </div>
          </div>

          {/* OIC Claiming Process Next Steps */}
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <span className="font-bold block font-prompt">
              📌 ขั้นตอนการยื่นเรื่องตามข้อกำหนด คปภ.:
            </span>
            <ol className="list-decimal list-inside space-y-0.5 pl-1 font-prompt text-[10px]">
              <li>โทรแจ้งบริษัทประกันภัยทันทีเพื่อรับรหัสแจ้งเคลม (Claim Code)</li>
              <li>ยื่นภาพถ่ายรอยคราบน้ำท่วมก่อนทำความสะอาด เพื่อคงสภาพหลักฐาน</li>
              <li>บริษัทประกันต้องจ่ายค่าสินไหมภายใน 15 วันทำการหลังได้รับเอกสารครบ</li>
            </ol>
          </div>
        </div>

        {/* Modal Action Footer with #00CACA */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="พิมพ์เอกสาร"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="คัดลอกลิงก์รายงาน"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-[11px] font-prompt">{isCopied ? 'คัดลอกแล้ว!' : 'แชร์'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              alert(
                lang === 'th'
                  ? `ระบบได้ส่งคำขอเคลมและเอกสารอ้างอิง ${claimRefId} ไปยัง ${claim.insuranceCompany} เรียบร้อยแล้วค่ะ เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชม.`
                  : `Claim reference ${claimRefId} has been successfully registered with ${claim.insuranceCompany}.`
              );
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#00CACA] text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#00B4B4] active:scale-[0.98] transition-all font-prompt"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'th' ? 'ส่งเรื่องเคลมไปยังบริษัทประกันทันที' : 'Submit Directly to Insurer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
