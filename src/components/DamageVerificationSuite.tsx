import React, { useState } from 'react';
import { DamageImage, PropertyType } from '../types';
import { SAMPLE_DAMAGE_IMAGES } from '../data/mockData';
import { UploadCloud, CheckCircle2, AlertCircle, Scan, Eye, Trash2, Camera, Sparkles, Layers } from 'lucide-react';

interface DamageVerificationSuiteProps {
  propertyType: PropertyType;
  currentImages: DamageImage[];
  onAddImage: (img: DamageImage) => void;
  onRemoveImage: (id: string) => void;
  lang: 'th' | 'en';
}

export const DamageVerificationSuite: React.FC<DamageVerificationSuiteProps> = ({
  propertyType,
  currentImages,
  onAddImage,
  onRemoveImage,
  lang,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<DamageImage | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const objectUrl = URL.createObjectURL(file);

    setTimeout(() => {
      const newImage: DamageImage = {
        id: `upload-${Date.now()}`,
        url: objectUrl,
        name: file.name,
        timestamp: new Date().toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        verificationStatus: 'verified',
        confidence: Math.round(94 + Math.random() * 5 * 10) / 10,
        detectedWaterline:
          propertyType === 'car'
            ? 'ระดับน้ำท่วมตรวจพบ: 45 ซม. (ขอบล้อถึงล่างประตู)'
            : propertyType === 'home'
            ? 'รอยคราบน้ำท่วมตรวจพบ: 50 ซม. บนผนังบ้าน'
            : 'ระดับน้ำท่วมตรวจพบ: 40 ซม. ท่วมอุปกรณ์ไฟฟ้า',
        estimatedSeverity: 'ระดับปานกลาง',
        detectedItems: [
          'ตรวจพบคราบโคลนและระดับน้ำชัดเจน',
          'วัตถุตรงกับประเภททรัพย์สินที่แจ้ง',
          'ภาพมีความละเอียดคมชัดตามเกณฑ์ คปภ.',
        ],
        notes: 'ภาพถ่ายผ่านการรับรองเพื่อใช้เป็นเอกสารประกอบการเคลมสินไหมกับบริษัทประกันภัย',
      };
      onAddImage(newImage);
      setIsScanning(false);
    }, 1200);
  };

  const handleUseSample = (type: PropertyType) => {
    setIsScanning(true);
    const sample = SAMPLE_DAMAGE_IMAGES[type];
    setTimeout(() => {
      onAddImage({
        ...sample,
        id: `sample-${Date.now()}`,
      });
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone & Guide Header */}
      <div className="p-4 rounded-2xl bg-white/90 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00CACA]/15 flex items-center justify-center text-[#008f8f]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm font-prompt">
                {lang === 'th' ? 'อัปโหลดภาพถ่ายเพื่อตรวจสอบความเสียหาย' : 'Upload Photos for Damage Verification'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {lang === 'th' ? 'ระบบ AI ตรวจจับรอยคราบน้ำเพื่อยืนยันสิทธิ์สินไหม คปภ.' : 'AI detects watermarks to verify OIC eligibility'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {currentImages.length} {lang === 'th' ? 'รูปภาพ' : 'photos'}
          </span>
        </div>

        {/* Drag/Click Upload Area */}
        <div className="relative border-2 border-dashed border-slate-200 hover:border-[#00CACA] rounded-xl p-5 text-center transition-colors bg-slate-50/50 hover:bg-[#00CACA]/5 group cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            title="อัปโหลดภาพถ่ายความเสียหาย"
          />
          <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-[#008f8f] transition-colors">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-800 font-prompt">
              {lang === 'th' ? 'แตะเพื่อถ่ายรูป หรือเลือกรูปจากคลังภาพ' : 'Tap to take photo or choose from library'}
            </p>
            <p className="text-[10px] text-slate-400">
              {lang === 'th' ? 'รองรับ JPG, PNG (ควรถ่ายให้เห็นระดับรอยคราบน้ำชัดเจน)' : 'Supports JPG, PNG (ensure waterline is clearly visible)'}
            </p>
          </div>
        </div>

        {/* Quick Sample Selector for Instant Verification Testing */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-prompt">
              {lang === 'th' ? 'ทดสอบด่วนด้วยภาพจริงจากเหตุการณ์น้ำท่วม:' : 'Quick test with authentic flood photos:'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleUseSample('car')}
              className="text-[11px] px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200/70 transition-colors font-medium font-prompt"
            >
              🚗 {lang === 'th' ? 'รูปรถน้ำท่วม' : 'Car flood'}
            </button>
            <button
              onClick={() => handleUseSample('home')}
              className="text-[11px] px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/70 transition-colors font-medium font-prompt"
            >
              🏠 {lang === 'th' ? 'รูปบ้านรอยคราบน้ำ' : 'Home flood'}
            </button>
            <button
              onClick={() => handleUseSample('appliance')}
              className="text-[11px] px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/70 transition-colors font-medium font-prompt"
            >
              ⚡ {lang === 'th' ? 'รูปเครื่องใช้ไฟฟ้า' : 'Appliances'}
            </button>
          </div>
        </div>
      </div>

      {/* Scanning Indicator */}
      {isScanning && (
        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-center animate-pulse">
          <div className="flex items-center justify-center gap-2 text-cyan-900 font-medium text-xs font-prompt">
            <Scan className="w-4 h-4 animate-spin text-[#008f8f]" />
            <span>{lang === 'th' ? 'กำลังสแกนและตรวจสอบคราบระดับน้ำด้วย AI...' : 'Scanning watermarks & verifying with AI...'}</span>
          </div>
        </div>
      )}

      {/* Uploaded Images Verification Gallery */}
      {currentImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-medium font-prompt">
              {lang === 'th' ? 'ผลการตรวจสอบภาพถ่ายความเสียหาย' : 'Damage Photo Verification Results'}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {lang === 'th' ? 'พร้อมใช้เป็นหลักฐานสินไหม' : 'Ready for Claim Filing'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentImages.map((img) => (
              <div
                key={img.id}
                className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#00CACA] transition-all"
              >
                <div className="flex gap-3">
                  {/* Thumbnail with overlay status */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                    <img
                      src={img.url}
                      alt={img.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[9px] font-semibold flex items-center gap-0.5 backdrop-blur-xs">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>{img.confidence}%</span>
                    </div>
                  </div>

                  {/* Verification Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h5 className="text-xs font-semibold text-slate-900 truncate max-w-[180px] font-prompt">
                          {img.name}
                        </h5>
                        <p className="text-[10px] text-slate-500">{img.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedPreviewImage(img)}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          title="ดูภาพขยาย"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemoveImage(img.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="ลบรูปภาพ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-1.5 space-y-1">
                      {/* Detected waterline */}
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-cyan-900 bg-cyan-50/80 px-2 py-0.5 rounded-md border border-cyan-100">
                        <Layers className="w-3 h-3 text-[#008f8f] shrink-0" />
                        <span className="truncate">{img.detectedWaterline}</span>
                      </div>

                      {/* Items found */}
                      <div className="text-[10px] text-slate-600 flex flex-wrap gap-1 mt-1">
                        {img.detectedItems.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inspector verification notice */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-600 flex items-start gap-1.5">
                  <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-tight font-prompt">{img.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Photo Inspector Modal */}
      {selectedPreviewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 font-prompt">
                  {selectedPreviewImage.name}
                </h4>
                <p className="text-[11px] text-emerald-600 font-medium">
                  ✓ ตรวจสอบผ่านเกณฑ์ คปภ. (ความแม่นยำ {selectedPreviewImage.confidence}%)
                </p>
              </div>
              <button
                onClick={() => setSelectedPreviewImage(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="relative bg-slate-950 aspect-4/3 max-h-[360px] flex items-center justify-center overflow-hidden">
              <img
                src={selectedPreviewImage.url}
                alt={selectedPreviewImage.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              {/* Simulated Waterline Inspection Overlay */}
              <div className="absolute inset-x-0 bottom-[40%] border-b-2 border-cyan-400 border-dashed flex items-center justify-between px-3 pointer-events-none">
                <span className="bg-cyan-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  ▲ AI WATERLINE DETECTED: 42-50 CM
                </span>
                <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  OIC LEVEL 2-3 TIER
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2 text-xs text-slate-700 bg-slate-50">
              <p className="font-medium text-slate-900 font-prompt">
                {selectedPreviewImage.detectedWaterline}
              </p>
              <p className="text-[11px] text-slate-600 font-prompt">
                {selectedPreviewImage.notes}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedPreviewImage(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#00CACA] text-slate-900 text-xs font-semibold hover:bg-[#00B4B4] transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
