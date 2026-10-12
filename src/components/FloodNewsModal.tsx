import React, { useState } from 'react';
import {
  X,
  Satellite,
  Waves,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
  BarChart3,
  CheckCircle2,
  Eye,
  Activity
} from 'lucide-react';

interface FloodNewsModalProps {
  onClose: () => void;
  lang: 'th' | 'en';
}

interface GistdaReport {
  id: string;
  badge: 'satellite' | 'warning' | 'inundation' | 'crop';
  titleTh: string;
  titleEn: string;
  satelliteSensor: string;
  timeAgoTh: string;
  timeAgoEn: string;
  detailTh: string;
  detailEn: string;
  inundatedAreaRai: string;
  provincesCovered: string;
  status: 'critical' | 'monitoring' | 'receding';
}

const GISTDA_SATELLITE_REPORTS: GistdaReport[] = [
  {
    id: 'g1',
    badge: 'satellite',
    titleTh: 'ดาวเทียม Sentinel-1 & Radarsat-2 ตรวจพบพื้นที่น้ำท่วมขังลุ่มน้ำเจ้าพระยา 3 จังหวัด รวมกว่า 150,000 ไร่',
    titleEn: 'Sentinel-1 & Radarsat-2 detect 150,000+ rai inundated across 3 Central Basin provinces',
    satelliteSensor: 'Sentinel-1A (SAR Radar)',
    timeAgoTh: '12 นาทีที่แล้ว',
    timeAgoEn: '12m ago',
    detailTh: 'ภาพถ่ายจากดาวเทียมเรดาร์ SAR บันทึกข้อมูลทะลุเมฆฝน พบมวลน้ำแผ่ขยายในพื้นที่ลุ่มต่ำนอกคันกั้นน้ำ จ.พระนครศรีอยุธยา, อ่างทอง และสุพรรณบุรี มีริ้วน้ำไหลเข้าทุ่งรับน้ำธรรมชาติ',
    detailEn: 'SAR radar penetrates cloud cover, tracking flood plumes in low-lying zones of Ayutthaya, Ang Thong, and Suphan Buri.',
    inundatedAreaRai: '154,230 ไร่',
    provincesCovered: 'พระนครศรีอยุธยา, อ่างทอง, สุพรรณบุรี',
    status: 'critical',
  },
  {
    id: 'g2',
    badge: 'crop',
    titleTh: 'GISTDA สรุปภาพรวมดาวเทียมพบน้ำท่วมขังสะสม 45 จังหวัด พื้นที่การเกษตร/นาข้าวเสียหาย 6.21 แสนไร่',
    titleEn: 'GISTDA Nationwide Satellite Synthesis: 45 provinces affected, 621,000 rai agricultural land damaged',
    satelliteSensor: 'THEOS-2 & Landsat-9',
    timeAgoTh: '35 นาทีที่แล้ว',
    timeAgoEn: '35m ago',
    detailTh: 'วิเคราะห์พื้นที่ท่วมขังรวมทั้งประเทศ 5.12 ล้านไร่ พื้นที่นาข้าวและเกษตรกรรมได้รับผลกระทบหนักสุดในภาคตะวันออกเฉียงเหนือตอนล่างและภาคกลางตอนบน ข้อมูลถูกส่งต่อให้ คปภ. และ ธ.ก.ส. เพื่อจ่ายชดเชยเร่งด่วน',
    detailEn: '5.12 million rai total inundated nationwide. Farmlands severely impacted in Lower Isan and Upper Central plains. Coordinated with OIC & BAAC.',
    inundatedAreaRai: '5,124,800 ไร่ (ทั่วประเทศ)',
    provincesCovered: '45 จังหวัดทั่วประเทศ',
    status: 'critical',
  },
  {
    id: 'g3',
    badge: 'inundation',
    titleTh: 'ดาวเทียม Sentinel-2B & Sentinel-2C บันทึกภาพมวลน้ำทุ่งปราจีนบุรี แผ่กว้างกว่า 5 แสนไร่',
    titleEn: 'Sentinel-2B & 2C capture massive flood extent in Prachin Buri exceeding 500,000 rai',
    satelliteSensor: 'Sentinel-2 (Multispectral)',
    timeAgoTh: '1 ชั่วโมงที่แล้ว',
    timeAgoEn: '1h ago',
    detailTh: 'ภาพถ่ายดาวเทียมความละเอียดสูงแสดงเฉดสีริ้วน้ำบ่งบอกความเชี่ยวของกระแสน้ำในพื้นที่ อ.บ้านสร้าง, อ.ศรีมหาโพธิ และ อ.เมืองปราจีนบุรี มีน้ำท่วมขังในพื้นที่ชุมชนและโรงงานอุตสาหกรรมบางแห่ง',
    detailEn: 'High-res multispectral imaging shows current velocity patterns across Ban Sang and Mueang Prachin Buri industrial corridors.',
    inundatedAreaRai: '512,900 ไร่',
    provincesCovered: 'ปราจีนบุรี, นครนายก, ฉะเชิงเทรา',
    status: 'monitoring',
  },
  {
    id: 'g4',
    badge: 'satellite',
    titleTh: 'ระบบแพลตฟอร์ม "เช็คน้ำ" (Check Nam) อัปเดตพยากรณ์ความเสี่ยงน้ำท่วมล่วงหน้า 3 วัน',
    titleEn: 'GISTDA "Check Nam" app updates 3-day predictive flood risk model & water runoff vector',
    satelliteSensor: 'GISTDA Life Dee & Check Nam AI',
    timeAgoTh: '2 ชั่วโมงที่แล้ว',
    timeAgoEn: '2h ago',
    detailTh: 'แบบจำลองคณิตศาสตร์ร่วมกับดาวเทียมเรดาร์ชี้ว่า มวลน้ำเหนือไหลผ่านนครสวรรค์ทรงตัวที่ 2,150 ลบ.ม./วินาที คาดการณ์ระดับน้ำท้ายเขื่อนเจ้าพระยาจะเริ่มชะลอตัวลงในอีก 48-72 ชั่วโมง',
    detailEn: 'Hydrological satellite models indicate Nakhon Sawan discharge stabilizing at 2,150 m³/s, easing lower Chao Phraya crest within 72h.',
    inundatedAreaRai: 'แบบจำลองพยากรณ์',
    provincesCovered: 'นครสวรรค์, ชัยนาท, สิงห์บุรี',
    status: 'monitoring',
  },
  {
    id: 'g5',
    badge: 'inundation',
    titleTh: 'ลุ่มน้ำปิง จ.เชียงใหม่ จากดาวเทียม THEOS-2 ระดับน้ำลดลงสู่ระดับปกติ เริ่มการฟื้นฟู',
    titleEn: 'THEOS-2 reveals Ping River in Chiang Mai fully receding back to riverbed',
    satelliteSensor: 'THEOS-2 (Thai Satellite)',
    timeAgoTh: '3 ชั่วโมงที่แล้ว',
    timeAgoEn: '3h ago',
    detailTh: 'ภาพดาวเทียมตรวจไม่พบคราบน้ำท่วมขังในเขตเศรษฐกิจเทศบาลนครเชียงใหม่แล้ว ผู้ประสบภัยสามารถใช้ภาพดาวเทียมระบุวันเกิดเหตุแนบยื่นเคลมประกันภัยตามเกณฑ์ คปภ. ได้ทันที',
    detailEn: 'THEOS-2 confirms downtown Chiang Mai is completely dry. Claimants can attach satellite timestamp evidence for OIC flood compensation.',
    inundatedAreaRai: 'ลดลงต่อเนื่อง',
    provincesCovered: 'เชียงใหม่, ลำพูน',
    status: 'receding',
  },
];

const GISTDA_PROVINCE_LEADERBOARD = [
  { provinceTh: 'พระนครศรีอยุธยา', provinceEn: 'Ayutthaya', areaRai: '285,400', level: 'วิกฤต', statusType: 'critical' },
  { provinceTh: 'สุพรรณบุรี', provinceEn: 'Suphan Buri', areaRai: '184,300', level: 'เฝ้าระวังสูง', statusType: 'critical' },
  { provinceTh: 'พิจิตร', provinceEn: 'Phichit', areaRai: '198,200', level: 'ท่วมขัง', statusType: 'warn' },
  { provinceTh: 'นครสวรรค์', provinceEn: 'Nakhon Sawan', areaRai: '310,000', level: 'เฝ้าระวัง', statusType: 'warn' },
  { provinceTh: 'ปราจีนบุรี', provinceEn: 'Prachin Buri', areaRai: '512,900', level: 'ท่วมขังทุ่ง', statusType: 'critical' },
  { provinceTh: 'อุบลราชธานี', provinceEn: 'Ubon Ratchathani', areaRai: '118,500', level: 'ทรงตัว', statusType: 'warn' },
  { provinceTh: 'เชียงใหม่', provinceEn: 'Chiang Mai', areaRai: '32,400', level: 'ลดลงต่อเนื่อง', statusType: 'good' },
];

export const FloodNewsModal: React.FC<FloodNewsModalProps> = ({ onClose, lang }) => {
  const [selectedTab, setSelectedTab] = useState<'feed' | 'provinces' | 'satellite'>('feed');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('20:15 น.');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        {/* Top Header Card with GISTDA Branding */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-[#0a2f44] to-[#004D40] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-sm shrink-0">
              <Satellite className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm md:text-base font-prompt text-white">
                  {lang === 'th' ? 'GISTDA ติดตามน้ำท่วมจากดาวเทียม' : 'GISTDA Satellite Flood Monitor'}
                </h3>
                <span className="flex items-center gap-1 text-[9px] font-mono bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-bold px-1.5 py-0.5 rounded-full">
                  <Activity className="w-2.5 h-2.5 animate-pulse text-cyan-300" />
                  SAR LIVE
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300 font-prompt mt-0.5">
                <span className="text-cyan-300 font-semibold">disaster.gistda.or.th</span>
                <span className="text-slate-400">·</span>
                <span>อัปเดตล่าสุด {lastUpdated}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ${
                isRefreshing ? 'animate-spin text-cyan-300' : ''
              }`}
              title="รีเฟรชข้อมูลดาวเทียม"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="ปิด"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GISTDA Satellite Summary Metrics Card */}
        <div className="bg-[#051e2e] text-white px-4 py-3 shrink-0 border-b border-cyan-900/40">
          <div className="grid grid-cols-3 gap-2 text-center font-prompt">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-cyan-200 block">น้ำท่วมขังสะสม</span>
              <span className="font-mono font-extrabold text-sm md:text-base text-white">
                5.12 ล้านไร่
              </span>
              <span className="text-[9px] text-slate-400 block">45 จังหวัด</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-amber-200 block">นาข้าว/เกษตรกรรม</span>
              <span className="font-mono font-extrabold text-sm md:text-base text-amber-300">
                6.21 แสนไร่
              </span>
              <span className="text-[9px] text-slate-400 block">พืชผลกระทบ</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-emerald-200 block">เซ็นเซอร์ดาวเทียม</span>
              <span className="font-mono font-extrabold text-xs md:text-sm text-emerald-300">
                THEOS / Sentinel
              </span>
              <span className="text-[9px] text-slate-400 block">SAR เรดาร์ทะลุเมฆ</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 pt-2.5 pb-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0 font-prompt text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedTab('feed')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedTab === 'feed'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              ภาพถ่ายดาวเทียมล่าสุด
            </button>
            <button
              onClick={() => setSelectedTab('provinces')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedTab === 'provinces'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              รายจังหวัด (ไร่)
            </button>
          </div>

          <a
            href="https://disaster.gistda.or.th"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-[#008f8f] hover:underline font-semibold"
          >
            <span>disaster.gistda.or.th</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50/50">
          {selectedTab === 'feed' && (
            <div className="space-y-3 font-prompt">
              {GISTDA_SATELLITE_REPORTS.map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                        <Satellite className="w-3 h-3 text-cyan-600" />
                        {report.satelliteSensor}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {report.timeAgoTh}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        report.status === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : report.status === 'monitoring'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {report.status === 'critical'
                        ? 'วิกฤตน้ำท่วมขัง'
                        : report.status === 'monitoring'
                        ? 'เฝ้าระวังมวลน้ำ'
                        : 'ระดับน้ำลดลง'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs md:text-sm leading-snug">
                    {report.titleTh}
                  </h4>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {report.detailTh}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {report.provincesCovered}
                    </span>
                    <span className="font-mono font-bold text-[#004D40] bg-[#00CACA]/10 px-2 py-0.5 rounded-md">
                      พื้นที่: {report.inundatedAreaRai}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'provinces' && (
            <div className="space-y-2 font-prompt">
              <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold block">ตารางสรุปพื้นที่น้ำท่วมขังจากดาวเทียม</span>
                  <span className="text-[10px] text-cyan-700">อ้างอิงฐานข้อมูล GISTDA Flood Database</span>
                </div>
                <span className="text-[10px] font-mono bg-cyan-200 text-cyan-900 px-2 py-0.5 rounded-full font-bold">
                  45 จังหวัด
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {GISTDA_PROVINCE_LEADERBOARD.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{item.provinceTh}</span>
                        <span className="text-[10px] text-slate-500">{item.provinceEn}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 text-xs block">
                        {item.areaRai} ไร่
                      </span>
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.2 rounded inline-block ${
                          item.statusType === 'critical'
                            ? 'bg-rose-100 text-rose-700'
                            : item.statusType === 'warn'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Callout */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-2 shrink-0 font-prompt">
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>เชื่อมโยงข้อมูลกับเกณฑ์ คปภ. 1186 และ ปภ. 1784</span>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href="https://disaster.gistda.or.th"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold text-xs flex items-center gap-1 transition-all"
            >
              <span>เปิด GISTDA</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 active:scale-95 transition-all"
            >
              {lang === 'th' ? 'ปิด' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
