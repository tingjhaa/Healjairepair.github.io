import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowUp,
  MapPin,
  Waves,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Building2,
  Wrench
} from 'lucide-react';
import { PropertyType, WaterLevel, ClaimState, ChatMessage, DamageImage } from '../types';
import {
  THAI_PROVINCES,
  WATER_LEVEL_OPTIONS,
  INSURANCE_COMPANIES,
  SAMPLE_DAMAGE_IMAGES,
  calculateFloodClaim,
} from '../data/mockData';
import { DamageVerificationSuite } from './DamageVerificationSuite';
import { RepairStoreSuggestions } from './RepairStoreSuggestions';

interface InsuranceCalculatorProps {
  lang: 'th' | 'en';
  initialPropertyType?: PropertyType;
  onBackToHome?: () => void;
  onOpenReportModal: (claim: ClaimState) => void;
  onOpenOICGuide: () => void;
}

export const InsuranceCalculator: React.FC<InsuranceCalculatorProps> = ({
  lang,
  initialPropertyType = 'home',
  onBackToHome,
  onOpenReportModal,
  onOpenOICGuide,
}) => {
  // Current claim wizard state - starts directly at Step 2/4!
  const [claim, setClaim] = useState<ClaimState>(() => {
    const propType = initialPropertyType;
    let defaultSum = 1200000;
    if (propType === 'car') defaultSum = 550000;
    if (propType === 'appliance') defaultSum = 85000;
    if (propType === 'commercial') defaultSum = 800000;

    const sampleImg = SAMPLE_DAMAGE_IMAGES[propType];
    const initialCalc = calculateFloodClaim(propType, 'knee', defaultSum, true, 0, 'เชียงใหม่');

    return {
      currentStep: 2, // Starts directly at Page 2/4
      propertyType: propType,
      propertySubtype: propType === 'home' ? 'บ้านพักอาศัยและโครงสร้าง' : 'ทรัพย์สินที่เอาประกัน',
      province: 'เชียงใหม่',
      district: 'อ.เมืองเชียงใหม่ (ลุ่มน้ำปิง)',
      floodDate: '2026-10-10',
      waterLevel: 'knee',
      insuranceCompany: 'วิริยะประกันภัย (Viriyah Insurance)',
      policyType: propType === 'home' ? 'ประกันอัคคีภัยที่อยู่อาศัย (คุ้มครองน้ำท่วม คปภ.)' : 'ประกันภัยคุ้มครองน้ำท่วม',
      sumInsured: defaultSum,
      hasFloodEndorsement: true,
      deductible: 0,
      images: [sampleImg],
      estimatedMarketValue: defaultSum * 1.2,
      calculatedLoss: initialCalc.estimatedLoss,
      calculatedPayout: initialCalc.calculatedPayout,
      governmentRelief: initialCalc.governmentRelief,
      ownerOutOfPocket: initialCalc.ownerOutOfPocket,
      breakdown: initialCalc.breakdown,
    };
  });

  // Chat conversation state
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text:
        lang === 'th'
          ? `สวัสดีค่ะ ได้รับข้อมูล: เคลม${claim.propertyType === 'home' ? 'บ้านพักอาศัย' : claim.propertyType === 'car' ? 'รถยนต์' : 'เครื่องใช้ไฟฟ้า'} เรียบร้อยค่ะ`
          : `Hello! Recorded claim for: ${claim.propertyType === 'home' ? 'Residential Home' : claim.propertyType === 'car' ? 'Vehicle' : 'Electrical Appliances'}.`,
      time: '14:02',
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      text:
        lang === 'th'
          ? 'กรุณาระบุจังหวัดที่เกิดเหตุและระดับความสูงของน้ำท่วมเพื่อประเมินสินไหมตามเกณฑ์ คปภ. ค่ะ'
          : 'Please specify the flood disaster province and water depth level to estimate OIC compensation.',
      time: '14:02',
    },
  ]);

  // Recalculate claim on property/water changes
  const updateClaimCalculations = (
    propType: PropertyType,
    wLevel: WaterLevel,
    insured: number,
    hasEndorsement: boolean,
    ded: number,
    prov: string
  ) => {
    const res = calculateFloodClaim(propType, wLevel, insured, hasEndorsement, ded, prov);
    setClaim((prev) => ({
      ...prev,
      calculatedLoss: res.estimatedLoss,
      calculatedPayout: res.calculatedPayout,
      governmentRelief: res.governmentRelief,
      ownerOutOfPocket: res.ownerOutOfPocket,
      breakdown: res.breakdown,
    }));
  };

  // Property selection handler (Step 1)
  const handleSelectProperty = (type: PropertyType) => {
    let defaultSum = 350000;
    if (type === 'car') defaultSum = 550000;
    if (type === 'home') defaultSum = 1200000;
    if (type === 'appliance') defaultSum = 85000;
    if (type === 'commercial') defaultSum = 800000;

    const sampleImg = SAMPLE_DAMAGE_IMAGES[type];

    setClaim((prev) => ({
      ...prev,
      propertyType: type,
      sumInsured: defaultSum,
      images: [sampleImg],
    }));

    updateClaimCalculations(
      type,
      claim.waterLevel,
      defaultSum,
      claim.hasFloodEndorsement,
      claim.deductible,
      claim.province
    );

    // Add conversational message
    const propertyLabels = {
      home: lang === 'th' ? 'บ้านพักอาศัย' : 'Home / Residence',
      car: lang === 'th' ? 'รถยนต์' : 'Vehicle',
      appliance: lang === 'th' ? 'เครื่องใช้ไฟฟ้า' : 'Electrical Appliances',
      commercial: lang === 'th' ? 'ร้านค้า/ธุรกิจ' : 'Commercial / SME',
    };

    setChatMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: `${lang === 'th' ? 'เลือก:' : 'Selected:'} ${propertyLabels[type]}`,
        time: new Date().toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      {
        id: `asst-${Date.now() + 1}`,
        sender: 'assistant',
        text:
          lang === 'th'
            ? `บันทึกประเภท "${propertyLabels[type]}" เรียบร้อยค่ะ ขั้นตอนต่อไปกรุณาระบุพื้นที่และระดับความสูงของน้ำท่วมค่ะ`
            : `Recorded "${propertyLabels[type]}". Next, please specify flood location and water level.`,
        time: new Date().toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  // Add damage image
  const handleAddImage = (newImg: DamageImage) => {
    setClaim((prev) => ({
      ...prev,
      images: [...prev.images, newImg],
    }));
  };

  // Remove damage image
  const handleRemoveImage = (id: string) => {
    setClaim((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  // Chat message submit
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const nowTime = new Date().toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setChatMessages((prev) => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: userText,
        time: nowTime,
      },
    ]);

    // Provide intelligent contextual response
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('บ้าน') || lower.includes('home')) {
        handleSelectProperty('home');
        reply =
          lang === 'th'
            ? 'เลือกประเภทบ้านพักอาศัยแล้วค่ะ ประกันอัคคีภัย คปภ. ชดเชยน้ำท่วมตามวงเงินคุ้มครองภัยธรรมชาติ สามารถอัปโหลดรูปคราบน้ำบนผนังได้เลยค่ะ'
            : 'Switched to Home Insurance claim.';
      } else if (lower.includes('รถ') || lower.includes('car')) {
        handleSelectProperty('car');
        reply =
          lang === 'th'
            ? 'เลือกประเภทรถยนต์แล้วค่ะ หากเป็นประกันชั้น 1 คุ้มครองน้ำท่วม 100% ตามระดับน้ำ 5 ระดับของ คปภ. ค่ะ'
            : 'Switched to Vehicle insurance claim.';
      } else if (lower.includes('เอกสาร') || lower.includes('document')) {
        reply =
          lang === 'th'
            ? 'เอกสารสำคัญในการเคลมน้ำท่วม: 1) กรมธรรม์ประกันภัย 2) สำเนาบัตรประชาชน 3) เล่มทะเบียนรถ/โฉนด 4) ภาพถ่ายคราบน้ำท่วมก่อนทำความสะอาด 5) ใบเสร็จค่าซ่อม (ถ้ามี) ค่ะ'
            : 'Required documents: Policy copy, ID card, Vehicle registration/deed, Waterline photos before cleaning, Repair receipts.';
      } else if (lower.includes('กี่วัน') || lower.includes('เงินเข้า')) {
        reply =
          lang === 'th'
            ? 'ตามระเบียบ คปภ. บริษัทประกันภัยต้องพิจารณาและจ่ายสินไหมภายใน 15 วันทำการ หลังจากได้รับเอกสารและผลสำรวจความเสียหายครบถ้วนค่ะ'
            : 'According to OIC regulations, insurers must disburse claims within 15 business days upon receiving complete documents.';
      } else {
        reply =
          lang === 'th'
            ? `รับทราบข้อความค่ะ ระบบคำนวณสินไหมเบื้องต้นสำหรับ ${
                claim.propertyType === 'car' ? 'รถยนต์' : claim.propertyType === 'home' ? 'บ้านพักอาศัย' : 'เครื่องใช้ไฟฟ้า'
              } อยู่ที่ ฿${claim.calculatedPayout.toLocaleString()} บาท สามารถกด "ส่งเรื่องเคลม" หรือดูสรุปเอกสารได้ทันทีค่ะ`
            : `Noted! Estimated compensation is ฿${claim.calculatedPayout.toLocaleString()} THB. You can proceed with the claim submission.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }, 600);
  };



  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col max-w-md mx-auto transition-all">
      {/* Wizard Step Breadcrumb & Indicator (Steps 2 to 5) */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs font-prompt">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <span className="w-5 h-5 rounded-full bg-[#004D40] text-[#00CACA] flex items-center justify-center text-[10px] font-mono">
            {claim.currentStep}
          </span>
          <span>
            {claim.currentStep === 2
              ? (lang === 'th' ? '1. พิกัด & ระดับน้ำ' : '1. Location & Water Level')
              : claim.currentStep === 3
              ? (lang === 'th' ? '2. ถ่ายภาพตรวจรอยน้ำ' : '2. Photo Verification')
              : claim.currentStep === 4
              ? (lang === 'th' ? '3. สรุปยอดสินไหม' : '3. Payout Summary')
              : (lang === 'th' ? '4. แนะนำร้านซ่อมใกล้ฉัน' : '4. Suggested Repair Stores')}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {claim.currentStep === 5 ? 'ขั้นตอนสุดท้าย (5/5)' : `หน้า ${claim.currentStep}/5`}
        </span>
      </div>

      {/* Main Interactive Content Area */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[580px] bg-slate-50/30">
        {/* Conversational Assistant Speech Bubbles from Image 2 */}
        {claim.currentStep < 5 && (
          <div className="space-y-2">
            {chatMessages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs md:text-sm font-prompt leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#004D40] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= STEP 2: LOCATION & WATER LEVEL (PAGE 2/4) ================= */}
        {claim.currentStep === 2 && (
          <div className="space-y-4 pt-1">
            {/* Province selector */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 font-prompt">
                <MapPin className="w-3.5 h-3.5 text-[#008f8f]" />
                {lang === 'th' ? 'จังหวัดที่เกิดเหตุน้ำท่วม (พื้นที่เสี่ยงภัย)' : 'Flood Disaster Province'}
              </label>
              <select
                value={claim.province}
                onChange={(e) => {
                  const prov = e.target.value;
                  setClaim((prev) => ({ ...prev, province: prov }));
                  updateClaimCalculations(
                    claim.propertyType,
                    claim.waterLevel,
                    claim.sumInsured,
                    claim.hasFloodEndorsement,
                    claim.deductible,
                    prov
                  );
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00CACA]"
              >
                {THAI_PROVINCES.map((p) => (
                  <option key={p.nameTh} value={p.nameTh}>
                    {p.nameTh} ({p.riskLevel}) - สิทธิ์เงินเยียวยารัฐ ฿{p.reliefRate.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Water Depth Level (4 OIC Standard Options) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 font-prompt">
                  <Waves className="w-3.5 h-3.5 text-sky-600" />
                  {lang === 'th' ? 'ระดับความสูงของน้ำท่วม' : 'Flood Water Depth Level'}
                </label>
                <span className="text-[11px] text-slate-500 font-prompt">เกณฑ์ คปภ.</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {WATER_LEVEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => {
                      setClaim((prev) => ({ ...prev, waterLevel: opt.level }));
                      updateClaimCalculations(
                        claim.propertyType,
                        opt.level,
                        claim.sumInsured,
                        claim.hasFloodEndorsement,
                        claim.deductible,
                        claim.province
                      );
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      claim.waterLevel === opt.level
                        ? 'bg-sky-50/80 border-[#00CACA] ring-2 ring-[#00CACA]/20 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 font-prompt">
                        {lang === 'th' ? opt.titleTh : opt.titleEn}
                      </span>
                      {claim.waterLevel === opt.level && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#008f8f]" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 font-prompt">
                      {lang === 'th' ? opt.depthDescTh : opt.depthDescEn}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Policy & Insurer selection */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 font-prompt">
                <Building2 className="w-3.5 h-3.5 text-slate-700" />
                {lang === 'th' ? 'บริษัทประกันภัยที่ถือกรมธรรม์' : 'Insurance Company'}
              </label>
              <select
                value={claim.insuranceCompany}
                onChange={(e) => setClaim((prev) => ({ ...prev, insuranceCompany: e.target.value }))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00CACA]"
              >
                {INSURANCE_COMPANIES.map((ins) => (
                  <option key={ins.id} value={ins.name}>
                    {ins.name} (สายด่วน {ins.hotLine})
                  </option>
                ))}
              </select>

              <div className="pt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 font-prompt">
                    {lang === 'th' ? 'ทุนประกันภัย (บาท):' : 'Sum Insured (THB):'}
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    ฿{claim.sumInsured.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2500000"
                  step="50000"
                  value={claim.sumInsured}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setClaim((prev) => ({ ...prev, sumInsured: val }));
                    updateClaimCalculations(
                      claim.propertyType,
                      claim.waterLevel,
                      val,
                      claim.hasFloodEndorsement,
                      claim.deductible,
                      claim.province
                    );
                  }}
                  className="w-full accent-[#00CACA] cursor-pointer"
                />
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => (onBackToHome ? onBackToHome() : setClaim((prev) => ({ ...prev, currentStep: 2 })))}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-100 transition-colors font-prompt"
              >
                {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
              </button>
              <button
                onClick={() => setClaim((prev) => ({ ...prev, currentStep: 3 }))}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00CACA] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#00B4B4] active:scale-[0.98] transition-all font-prompt"
              >
                <span>{lang === 'th' ? 'ไปอัปโหลดภาพตรวจสอบ' : 'Proceed to Damage Photos'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PHOTO VERIFICATION SUITE ================= */}
        {claim.currentStep === 3 && (
          <div className="space-y-4 pt-1">
            <DamageVerificationSuite
              propertyType={claim.propertyType}
              currentImages={claim.images}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              lang={lang}
            />

            {/* Navigation buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setClaim((prev) => ({ ...prev, currentStep: 2 }))}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-100 transition-colors font-prompt"
              >
                {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
              </button>
              <button
                onClick={() => {
                  updateClaimCalculations(
                    claim.propertyType,
                    claim.waterLevel,
                    claim.sumInsured,
                    claim.hasFloodEndorsement,
                    claim.deductible,
                    claim.province
                  );
                  setClaim((prev) => ({ ...prev, currentStep: 4 }));
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00CACA] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#00B4B4] active:scale-[0.98] transition-all font-prompt"
              >
                <span>{lang === 'th' ? 'คำนวณและดูสรุปสินไหม' : 'Calculate & View Payout'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CLAIM PAYOUT SUMMARY ================= */}
        {claim.currentStep === 4 && (
          <div className="space-y-3 pt-1">
            {/* Big Total Payout Highlight Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#004D40] to-slate-900 text-white shadow-lg space-y-2 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 rounded-full bg-[#00CACA]/20 blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-200 font-prompt">
                  {lang === 'th' ? 'ประมาณการสินไหมที่ได้รับอนุมัติ' : 'Estimated Approved Payout'}
                </span>
                <span className="text-[10px] bg-[#00CACA] text-slate-900 font-bold px-2 py-0.5 rounded-full">
                  OIC Verified
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
                  ฿{claim.calculatedPayout.toLocaleString()}
                </span>
                <span className="text-xs text-slate-300 font-prompt">บาท (THB)</span>
              </div>

              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-prompt">
                    {lang === 'th' ? 'มูลค่าความเสียหายจริง' : 'Total Loss Value'}
                  </span>
                  <span className="font-semibold text-slate-100 font-mono">
                    ฿{claim.calculatedLoss.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-prompt">
                    {lang === 'th' ? 'เงินเยียวยารัฐเพิ่ม' : 'Gov Relief Subsidy'}
                  </span>
                  <span className="font-semibold text-emerald-400 font-mono">
                    +฿{claim.governmentRelief.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Must Pay By Themselves: If insurance cannot recover all */}
            {claim.ownerOutOfPocket > 0 ? (
              <div className="p-3.5 rounded-2xl bg-amber-50/95 border-2 border-amber-300/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950 font-prompt">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      {lang === 'th'
                        ? 'ส่วนต่างที่เจ้าของต้องจ่ายเอง (ประกันไม่ครอบคลุมทั้งหมด)'
                        : 'Owner Must Pay By Themselves (Uncovered)'}
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-xs md:text-sm text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200 shadow-2xs">
                    ฿{claim.ownerOutOfPocket.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed font-prompt">
                  {lang === 'th'
                    ? `ความเสียหายรวม ฿${claim.calculatedLoss.toLocaleString()} บาท ได้รับชดเชยรวม (ประกัน + เงินช่วยเหลือรัฐ) ฿${(
                        claim.calculatedPayout + claim.governmentRelief
                      ).toLocaleString()} บาท คงเหลือส่วนต่างที่ประกันไม่ครอบคลุม ฿${claim.ownerOutOfPocket.toLocaleString()} บาท ซึ่งเจ้าของต้องรับภาระจ่ายเอง`
                    : `Total loss is ฿${claim.calculatedLoss.toLocaleString()} THB. With insurance & relief covering ฿${(
                        claim.calculatedPayout + claim.governmentRelief
                      ).toLocaleString()} THB, the uncovered balance of ฿${claim.ownerOutOfPocket.toLocaleString()} THB must be paid by the owner.`}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between font-prompt">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {lang === 'th' ? 'ประกันคุ้มครองความเสียหายครบ 100%' : '100% Fully Recovered by Insurance'}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {lang === 'th' ? 'เจ้าของไม่ต้องจ่ายเพิ่ม' : 'No owner payment required'}
                </span>
              </div>
            )}

            {/* Breakdown List */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-semibold text-slate-800 font-prompt">
                {lang === 'th' ? 'รายละเอียดค่าสินไหมแยกตามรายการ' : 'Itemized Compensation Breakdown'}
              </h4>
              <div className="space-y-2 divide-y divide-slate-100">
                {claim.breakdown.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                    <div className="pr-2">
                      <p className="font-medium text-slate-800 font-prompt">{item.category}</p>
                      <p className="text-[10px] text-slate-500 font-prompt">{item.description}</p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0 font-mono">
                      ฿{item.claimableAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons with Step 5 Repair Store Suggestion */}
            <div className="space-y-2 pt-2">
              {/* Highlight Action: Proceed to Final Step (Suggested Repair Stores Near Me) */}
              <button
                onClick={() => setClaim((prev) => ({ ...prev, currentStep: 5 }))}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-[#004D40] to-slate-900 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all font-prompt cursor-pointer border border-cyan-800/40"
              >
                <Wrench className="w-4 h-4 text-[#00CACA]" />
                <span>
                  {lang === 'th'
                    ? 'ขั้นตอนสุดท้าย: เลือกร้านซ่อม/อู่แนะนำใกล้ฉัน (Step 5)'
                    : 'Final Step: Suggest Repair Stores Near Me (Step 5)'}
                </span>
                <ChevronRight className="w-4 h-4 text-[#00CACA]" />
              </button>

              <button
                onClick={() => onOpenReportModal(claim)}
                className="w-full py-3 px-4 rounded-xl bg-[#00CACA] text-slate-900 font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-[#00B4B4] active:scale-[0.98] transition-all font-prompt"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'th' ? 'ยื่นเรื่องเคลม & ดาวน์โหลดสรุปเอกสาร' : 'Submit Claim & Download Summary'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setClaim((prev) => ({ ...prev, currentStep: 2 }))}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 font-prompt"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'th' ? 'คำนวณใหม่' : 'Recalculate'}</span>
                </button>

                <button
                  onClick={onOpenOICGuide}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 font-medium text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 font-prompt"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>{lang === 'th' ? 'เกณฑ์ คปภ. 1186' : 'OIC Hotline'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 5: SUGGESTED REPAIR STORES NEAR ME (FINAL STEP) ================= */}
        {claim.currentStep === 5 && (
          <RepairStoreSuggestions
            propertyType={claim.propertyType}
            userProvince={claim.province}
            lang={lang}
            onBackToSummary={() => setClaim((prev) => ({ ...prev, currentStep: 4 }))}
            onSubmitWithStore={(store) => {
              onOpenReportModal({
                ...claim,
                repairStoreName: store.nameTh,
              } as any);
            }}
          />
        )}
      </div>

      {/* Bottom Message Input Bar matching Image 2 with primary #00CACA send button */}
      <div className="p-3 bg-white border-t border-slate-100">
        <form onSubmit={handleSendChat} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'th' ? 'พิมพ์ข้อความ...' : 'Type a message...'}
              className="w-full py-2.5 pl-4 pr-3 rounded-full bg-slate-100/90 text-slate-800 text-xs md:text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00CACA] border border-transparent focus:border-[#00CACA] transition-all font-prompt"
            />
          </div>

          {/* Circular send button in primary color #00CACA as requested! */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-[#00CACA] hover:bg-[#00B4B4] disabled:opacity-50 text-slate-900 flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            title={lang === 'th' ? 'ส่งข้อความ' : 'Send'}
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* Quick Question Prompts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 text-[11px] no-scrollbar">
          <button
            type="button"
            onClick={() => setInputText(lang === 'th' ? 'ประกันชั้น 1 รถจมน้ำเคลมได้เต็มทุนไหม?' : 'Does Type 1 cover 100% vehicle loss?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 font-prompt"
          >
            💬 {lang === 'th' ? 'รถจมน้ำเคลมได้เต็มทุนไหม?' : 'Vehicle total loss?'}
          </button>
          <button
            type="button"
            onClick={() => setInputText(lang === 'th' ? 'เอกสารที่ต้องใช้ยื่นเคลมน้ำท่วมมีอะไรบ้าง?' : 'What documents are required?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 font-prompt"
          >
            📑 {lang === 'th' ? 'เอกสารที่ต้องใช้มีอะไรบ้าง?' : 'Required docs?'}
          </button>
          <button
            type="button"
            onClick={() => setInputText(lang === 'th' ? 'เคลมประกันน้ำท่วมเงินเข้ากี่วัน?' : 'How many days for payout?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 font-prompt"
          >
            ⏳ {lang === 'th' ? 'เงินเข้าภายในกี่วัน?' : 'Payout days?'}
          </button>
        </div>
      </div>
    </div>
  );
};
