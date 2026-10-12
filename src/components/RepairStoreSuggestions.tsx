import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Search,
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  Clock,
  ExternalLink,
  CheckCircle2,
  Navigation,
  SlidersHorizontal,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Download
} from 'lucide-react';
import { REPAIR_STORES, RepairStore } from '../data/repairStoresData';
import { PropertyType } from '../types';

interface RepairStoreSuggestionsProps {
  propertyType: PropertyType;
  userProvince: string;
  lang: 'th' | 'en';
  onBackToSummary: () => void;
  onSubmitWithStore: (store: RepairStore) => void;
}

const ITEMS_PER_PAGE = 50;

export const RepairStoreSuggestions: React.FC<RepairStoreSuggestionsProps> = ({
  propertyType,
  userProvince,
  lang,
  onBackToSummary,
  onSubmitWithStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'car' | 'home' | 'appliance' | 'commercial'>(
    propertyType
  );
  const [onlyInsurancePartner, setOnlyInsurancePartner] = useState(false);
  const [selectedStore, setSelectedStore] = useState<RepairStore | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & sort: Prioritize user's province, then matching category & search
  const filteredStores = useMemo(() => {
    return REPAIR_STORES.filter((store) => {
      // Category match
      const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;

      // Insurance partner filter
      const matchesPartner = !onlyInsurancePartner || store.isInsurancePartner;

      // Search query
      const matchesSearch =
        searchQuery.trim() === '' ||
        store.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.specialtyTh.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesPartner && matchesSearch;
    }).sort((a, b) => {
      // Same province prioritized first
      const aSameProv = a.province.includes(userProvince) || userProvince.includes(a.province);
      const bSameProv = b.province.includes(userProvince) || userProvince.includes(b.province);
      if (aSameProv && !bSameProv) return -1;
      if (!aSameProv && bSameProv) return 1;
      return a.distanceKm - b.distanceKm;
    });
  }, [selectedCategory, onlyInsurancePartner, searchQuery, userProvince]);

  // Pagination (Max 50 items per page as requested)
  const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE) || 1;
  const paginatedStores = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStores.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStores, currentPage]);

  return (
    <div className="space-y-4 pt-1 font-prompt">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#004D40] to-slate-900 text-white shadow-md space-y-1.5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00CACA]/20 border border-[#00CACA]/40 flex items-center justify-center text-[#00CACA]">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-white">
                {lang === 'th' ? 'ร้านซ่อม & อู่แนะนำใกล้ฉัน' : 'Suggested Repair Stores Near Me'}
              </h3>
              <p className="text-[11px] text-cyan-200">
                {lang === 'th'
                  ? `ค้นหาพิกัดใกล้: ${userProvince} · อู่มาตรฐานในเครือประกัน คปภ.`
                  : `Near: ${userProvince} · Verified OIC insurance network`}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-[#00CACA] text-slate-900 font-bold px-2 py-0.5 rounded-full">
            {filteredStores.length} {lang === 'th' ? 'ร้าน' : 'Stores'}
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-2">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={
              lang === 'th'
                ? 'ค้นหาชื่ออู่, ย่าน, อำเภอ, หรือบริการ...'
                : 'Search repair store name, area, or service...'
            }
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00CACA] shadow-2xs"
          />
        </div>

        {/* Category Pills & Insurance Toggle */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => {
                setSelectedCategory('car');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'car'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🚗 อู่ซ่อมรถ
            </button>
            <button
              onClick={() => {
                setSelectedCategory('home');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'home'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🏠 ช่างซ่อมบ้าน
            </button>
            <button
              onClick={() => {
                setSelectedCategory('appliance');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'appliance'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              ⚡ เครื่องใช้ไฟฟ้า
            </button>
          </div>

          <button
            onClick={() => {
              setOnlyInsurancePartner(!onlyInsurancePartner);
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
              onlyInsurancePartner
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ในเครือประกัน</span>
          </button>
        </div>
      </div>

      {/* Selected Store Confirmation Notification */}
      {selectedStore && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-xs text-emerald-950 block">
                เลือกร้าน: {selectedStore.nameTh}
              </span>
              <span className="text-[10px] text-emerald-700">
                โทร {selectedStore.phone} · {selectedStore.address}
              </span>
            </div>
          </div>
          <button
            onClick={() => onSubmitWithStore(selectedStore)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
          >
            ยืนยันยื่นเคลม
          </button>
        </div>
      )}

      {/* Vertical Cards Listing (Top to Bottom, Max 50 items per page) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>แสดงสูงสุด {ITEMS_PER_PAGE} รายการต่อหน้า</span>
          <span>
            หน้า {currentPage} จาก {totalPages} (พบ {filteredStores.length} ร้าน)
          </span>
        </div>

        {paginatedStores.length > 0 ? (
          <div className="space-y-2.5">
            {paginatedStores.map((store, index) => {
              const isSelected = selectedStore?.id === store.id;

              return (
                <div
                  key={store.id}
                  className={`p-3.5 rounded-2xl bg-white border transition-all text-left space-y-2.5 ${
                    isSelected
                      ? 'border-[#00CACA] ring-2 ring-[#00CACA]/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-xs md:text-sm text-slate-900 leading-snug">
                          {index + 1}. {store.nameTh}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-0.5 text-slate-700 font-medium">
                          <MapPin className="w-3 h-3 text-[#008f8f]" />
                          {store.district}, {store.province}
                        </span>
                        <span>·</span>
                        <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded text-[10px]">
                          📍 {store.distanceKm} กม.
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-amber-600 font-semibold text-[10px]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {store.rating} ({store.reviewCount})
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {store.estimatedLeadDays}
                    </span>
                  </div>

                  {/* Specialty / Description */}
                  <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800">งานเชี่ยวชาญ: </span>
                    {store.specialtyTh}
                  </p>

                  {/* Insurance Partnership Badges */}
                  {store.isInsurancePartner && store.partnerInsurers.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        ในเครือ:
                      </span>
                      {store.partnerInsurers.slice(0, 3).map((ins, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-emerald-50/70 text-emerald-800 border border-emerald-100 font-medium"
                        >
                          {ins}
                        </span>
                      ))}
                      {store.partnerInsurers.length > 3 && (
                        <span className="text-slate-400 font-mono text-[9px]">
                          +{store.partnerInsurers.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Actions Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${store.phone}`}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-slate-600" />
                        <span>โทร {store.phone}</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          store.nameTh + ' ' + store.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Navigation className="w-3 h-3 text-sky-600" />
                        <span>นำทาง</span>
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStore(store);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#00CACA] hover:bg-[#00B4B4] text-slate-900 shadow-2xs'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>เลือกร้านนี้แล้ว</span>
                        </>
                      ) : (
                        <>
                          <span>เลือกร้านนี้</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <Wrench className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">ไม่พบร้านซ่อมตามคำค้นหา</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyInsurancePartner(false);
              }}
              className="text-xs text-[#008f8f] hover:underline"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}

        {/* Pagination bar if > 50 items */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium disabled:opacity-40"
            >
              ย้อนกลับ
            </button>
            <span className="text-xs text-slate-600 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium disabled:opacity-40"
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={onBackToSummary}
          className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-100 transition-colors"
        >
          {lang === 'th' ? '← ย้อนกลับไปดูสรุปสินไหม' : '← Back to Payout Summary'}
        </button>

        <button
          onClick={() => {
            if (selectedStore) {
              onSubmitWithStore(selectedStore);
            } else if (paginatedStores.length > 0) {
              onSubmitWithStore(paginatedStores[0]);
            }
          }}
          className="flex-1 py-3 px-4 rounded-xl bg-[#00CACA] text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#00B4B4] active:scale-[0.98] transition-all"
        >
          <span>
            {selectedStore
              ? lang === 'th'
                ? `ส่งเรื่องเคลมพร้อมร้าน: ${selectedStore.nameTh}`
                : `Submit Claim with ${selectedStore.nameEn}`
              : lang === 'th'
              ? 'ส่งเรื่องเคลมประกัน'
              : 'Submit Claim'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
