import { DamageImage, PropertyType, WaterLevel, ClaimState } from '../types';

export const SAMPLE_DAMAGE_IMAGES: Record<PropertyType, DamageImage> = {
  car: {
    id: 'sample-car-1',
    url: '/src/assets/images/flood_damage_car_1791774607564.jpg',
    name: 'หลักฐาน_รถจมน้ำ_เชียงใหม่.jpg',
    timestamp: '11 ต.ค. 2026 14:20 น.',
    verificationStatus: 'verified',
    confidence: 98.4,
    detectedWaterline: 'ระดับน้ำตรวจพบ 42 ซม. (ระดับครึ่งล้อรถยนต์)',
    estimatedSeverity: 'ระดับปานกลาง',
    detectedItems: ['ล้อแม็กและยางแช่น้ำ', 'ท่อไอเสียจมน้ำ', 'ระบบเบรกแช่โคลน', 'ระดับน้ำต่ำกว่าห้องเครื่องยนต์หลัก'],
    notes: 'สอดคล้องกับเกณฑ์ คปภ. ระดับ 2 (น้ำท่วมถึงเบาะนั่งหรือล้อรถยนต์) แนะนำลากรถเข้าศูนย์บริการทันที ห้ามสตาร์ทเครื่องยนต์',
  },
  home: {
    id: 'sample-home-1',
    url: '/src/assets/images/flood_damage_home_1791774619001.jpg',
    name: 'หลักฐาน_บ้านน้ำท่วม_ชั้น1.jpg',
    timestamp: '11 ต.ค. 2026 15:45 น.',
    verificationStatus: 'verified',
    confidence: 99.1,
    detectedWaterline: 'รอยคราบน้ำท่วมสูง 52 ซม. บนผนังปูน',
    estimatedSeverity: 'ระดับปานกลาง',
    detectedItems: ['พื้นกระเบื้องแช่น้ำโคลน', 'บัวเชิงผนังไม้บวมเสียหาย', 'สีผนังและฉาบปูนพองร่อน', 'เฟอร์นิเจอร์ไม้ลอยน้ำ'],
    notes: 'รอยระดับน้ำชัดเจน สามารถเคลมค่าชดเชยการซ่อมแซมโครงสร้างและค่าล้างทำความสะอาดตามเกณฑ์มาตรฐาน คปภ.',
  },
  appliance: {
    id: 'sample-appliance-1',
    url: '/src/assets/images/flood_damage_appliance_1791774630048.jpg',
    name: 'หลักฐาน_เครื่องใช้ไฟฟ้าแช่น้ำ.jpg',
    timestamp: '11 ต.ค. 2026 16:10 น.',
    verificationStatus: 'verified',
    confidence: 97.6,
    detectedWaterline: 'ระดับคราบน้ำ 38 ซม. ท่วมส่วนล่างของเครื่อง',
    estimatedSeverity: 'ระดับรุนแรง',
    detectedItems: ['มอเตอร์เครื่องซักผ้าจมน้ำ', 'คอมเพรสเซอร์ตู้เย็นแช่น้ำโคลน', 'แผงวงจรอิเล็กทรอนิกส์ด้านล่างเสี่ยงช็อต'],
    notes: 'อุปกรณ์ไฟฟ้าประเภทมอเตอร์และคอมเพรสเซอร์แช่น้ำโคลน ไม่สามารถซ่อมแซมให้ปลอดภัยได้ แนะนำเปลี่ยนอะไหล่ใหม่ทั้งชุด',
  },
  commercial: {
    id: 'sample-commercial-1',
    url: '/src/assets/images/flood_damage_home_1791774619001.jpg',
    name: 'หลักฐาน_โกดังและสินค้าจมน้ำ.jpg',
    timestamp: '11 ต.ค. 2026 11:30 น.',
    verificationStatus: 'verified',
    confidence: 96.8,
    detectedWaterline: 'ระดับคราบน้ำ 45 ซม.',
    estimatedSeverity: 'ระดับปานกลาง',
    detectedItems: ['สต็อกสินค้าชั้นล่างเสียหาย', 'ชั้นวางสินค้าโลหะเกิดสนิม', 'กล่องกระดาษบรรจุภัณฑ์เปื่อย'],
    notes: 'สามารถเคลมชดเชยสต็อกสินค้าตามราคาทุนจริง พร้อมค่าทำความสะอาดสถานที่ประกอบการ',
  },
};

export const THAI_PROVINCES = [
  { nameTh: 'เชียงใหม่', nameEn: 'Chiang Mai', riskLevel: 'เสี่ยงสูง (ลุ่มน้ำปิง)', reliefRate: 9000 },
  { nameTh: 'เชียงราย', nameEn: 'Chiang Rai', riskLevel: 'เสี่ยงสูง (ลุ่มน้ำกก/สาย)', reliefRate: 9000 },
  { nameTh: 'พระนครศรีอยุธยา', nameEn: 'Ayutthaya', riskLevel: 'เสี่ยงสูง (ลุ่มน้ำเจ้าพระยา)', reliefRate: 9000 },
  { nameTh: 'สุโขทัย', nameEn: 'Sukhothai', riskLevel: 'เสี่ยงสูง (ลุ่มน้ำยม)', reliefRate: 9000 },
  { nameTh: 'กรุงเทพมหานคร', nameEn: 'Bangkok', riskLevel: 'เฝ้าระวังน้ำทะเลหนุน', reliefRate: 5000 },
  { nameTh: 'นนทบุรี', nameEn: 'Nonthaburi', riskLevel: 'เฝ้าระวังริมแม่น้ำ', reliefRate: 5000 },
  { nameTh: 'ปทุมธานี', nameEn: 'Pathum Thani', riskLevel: 'เฝ้าระวังน้ำทุ่ง', reliefRate: 5000 },
  { nameTh: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani', riskLevel: 'เสี่ยงสูง (ลุ่มน้ำมูล)', reliefRate: 9000 },
  { nameTh: 'สงขลา (หาดใหญ่)', nameEn: 'Songkhla (Hat Yai)', riskLevel: 'เสี่ยงมรสุมใต้', reliefRate: 7000 },
  { nameTh: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima', riskLevel: 'เฝ้าระวังน้ำป่า', reliefRate: 5000 },
];

export const INSURANCE_COMPANIES = [
  { id: 'viriyah', name: 'วิริยะประกันภัย (Viriyah Insurance)', hotLine: '1557', marketShare: '32%' },
  { id: 'dhipaya', name: 'ทิพยประกันภัย (Dhipaya Insurance)', hotLine: '1736', marketShare: '18%' },
  { id: 'bki', name: 'กรุงเทพประกันภัย (Bangkok Insurance)', hotLine: '1620', marketShare: '16%' },
  { id: 'mti', name: 'เมืองไทยประกันภัย (Muang Thai Insurance)', hotLine: '1484', marketShare: '14%' },
  { id: 'tokio', name: 'คุ้มภัยโตเกียวมารีน (Tokio Marine)', hotLine: '02-686-8888', marketShare: '10%' },
  { id: 'msig', name: 'เอ็ม เอส ไอ จี ประกันภัย (MSIG)', hotLine: '1259', marketShare: '10%' },
];

export const WATER_LEVEL_OPTIONS: {
  level: WaterLevel;
  titleTh: string;
  titleEn: string;
  depthDescTh: string;
  depthDescEn: string;
  oicTier: string;
  multiplier: number;
}[] = [
  {
    level: 'ankle',
    titleTh: 'ระดับข้อเท้า (ท่วมพื้นผิว)',
    titleEn: 'Ankle Level (< 20 cm)',
    depthDescTh: 'น้ำซึมเข้าตัวบ้าน / ท่วมไม่เกินดุมล้อรถ',
    depthDescEn: 'Minor water ingress / floor level dampness',
    oicTier: 'ระดับ 1 ตามเกณฑ์ คปภ.',
    multiplier: 0.15,
  },
  {
    level: 'knee',
    titleTh: 'ระดับหัวเข่า (20 - 50 ซม.)',
    titleEn: 'Knee Level (20 - 50 cm)',
    depthDescTh: 'ท่วมถึงขอบประตูบ้าน / ครึ่งล้อรถยนต์',
    depthDescEn: 'Mid-wheel of vehicle / ground floor 50cm',
    oicTier: 'ระดับ 2 ตามเกณฑ์ คปภ.',
    multiplier: 0.38,
  },
  {
    level: 'waist',
    titleTh: 'ระดับเอว (50 - 100 ซม.)',
    titleEn: 'Waist Level (50 - 100 cm)',
    depthDescTh: 'ท่วมถึงปลั๊กไฟบ้าน / เบาะนั่งและคอนโซลล่างรถยนต์',
    depthDescEn: 'Electrical outlets / seats & engine bay',
    oicTier: 'ระดับ 3 ตามเกณฑ์ คปภ.',
    multiplier: 0.72,
  },
  {
    level: 'submerged',
    titleTh: 'มิดหลังคา / จมทั้งคัน (> 100 ซม.)',
    titleEn: 'Submerged (> 100 cm)',
    depthDescTh: 'น้ำมิดชั้น 1 ของบ้าน / รถยนต์จมมิดคัน (Total Loss)',
    depthDescEn: 'Ceiling flood / submerged vehicle total loss',
    oicTier: 'ระดับ 4-5 คืนทุนประกันภัยเต็มจำนวน (100%)',
    multiplier: 1.0,
  },
];

export const OIC_REGULATIONS = [
  {
    category: 'ประกันภัยรถยนต์ (ภาคสมัครใจ ชั้น 1 หรือ 2+ เพิ่มน้ำท่วม)',
    items: [
      'หากค่าซ่อมเกิน 70% ของทุนประกัน บริษัทต้องจ่ายสินไหมทดแทนเต็มจำนวนทุนประกันภัย (Total Loss)',
      'ระดับน้ำต่ำกว่าห้องเครื่องยนต์ บริษัทประกันรับผิดชอบค่าล้าง ทำความสะอาด อบโอโซน และเปลี่ยนถ่ายของเหลวทั้งหมด',
      'ค่ารถยก/รถสไลด์ฉุกเฉิน บริษัทประกันภัยให้ความคุ้มครองสูงสุดไม่เกิน 20% ของค่าซ่อมจริง',
    ],
  },
  {
    category: 'ประกันอัคคีภัยที่อยู่อาศัย (คุ้มครองภัยธรรมชาติ)',
    items: [
      'กรมธรรม์มาตรฐาน คปภ. ชดเชยภัยน้ำท่วมขั้นต่ำ 20,000 บาท หรือตามทุนประกันภัยพิบัติที่ซื้อเพิ่ม',
      'ค่าขนย้ายซากทรัพย์สินและค่าล้างทำความสะอาดบ้าน ชดเชยตามจริงสูงสุด 10% ของทุนประกัน',
      'ชดเชยค่าเช่าที่พักอาศัยชั่วคราว วันละ 500 - 1,000 บาท (สูงสุดไม่เกิน 30 วัน)',
    ],
  },
];

// Calculation helper logic strictly modeling Thai insurance claims
export function calculateFloodClaim(
  propertyType: PropertyType,
  waterLevel: WaterLevel,
  sumInsured: number,
  hasFloodEndorsement: boolean,
  deductible: number,
  province: string
) {
  const waterOption = WATER_LEVEL_OPTIONS.find((w) => w.level === waterLevel) || WATER_LEVEL_OPTIONS[1];
  const provinceData = THAI_PROVINCES.find((p) => p.nameTh === province) || THAI_PROVINCES[0];

  // Base calculation factors
  let estimatedLoss = 0;
  let breakdown: ClaimState['breakdown'] = [];

  if (propertyType === 'car') {
    // Car calculation following OIC vehicle flood guidelines
    if (waterLevel === 'submerged') {
      estimatedLoss = sumInsured;
      breakdown = [
        {
          category: 'ชดเชยความเสียหายทั้งคัน (Total Loss)',
          description: 'ตามเกณฑ์ คปภ. ค่าซ่อมเกิน 70% จ่ายเต็มทุนประกัน',
          damageAmount: sumInsured,
          claimableAmount: sumInsured,
        },
        {
          category: 'ค่ารถสไลด์/ยกลากฉุกเฉิน',
          description: 'เคลื่อนย้ายไปยังอู่ซ่อมมาตรฐาน',
          damageAmount: 5000,
          claimableAmount: 5000,
        },
      ];
    } else if (waterLevel === 'waist') {
      const repairCost = Math.round(sumInsured * 0.65);
      estimatedLoss = repairCost + 12000;
      breakdown = [
        {
          category: 'ซ่อมแซมระบบเครื่องยนต์และกล่องสมองกล (ECU)',
          description: 'เปลี่ยนเซ็นเซอร์ อะไหล่อิเล็กทรอนิกส์ และสายไฟ',
          damageAmount: Math.round(repairCost * 0.6),
          claimableAmount: Math.round(repairCost * 0.6),
        },
        {
          category: 'ถอดซักเบาะ ฟอกพรม และแผงประตู',
          description: 'ทำความสะอาดคราบโคลน อบแห้ง และฆ่าเชื้อแบคทีเรีย',
          damageAmount: Math.round(repairCost * 0.25),
          claimableAmount: Math.round(repairCost * 0.25),
        },
        {
          category: 'เปลี่ยนถ่ายของเหลวและระบบเบรก',
          description: 'น้ำมันเครื่อง เกียร์ เฟืองท้าย น้ำมันเบรก และลูกปืนล้อ',
          damageAmount: Math.round(repairCost * 0.15),
          claimableAmount: Math.round(repairCost * 0.15),
        },
      ];
    } else if (waterLevel === 'knee') {
      const repairCost = Math.round(sumInsured * 0.32);
      estimatedLoss = repairCost;
      breakdown = [
        {
          category: 'รื้อฟอกทำความสะอาดพรมและห้องโดยสาร',
          description: 'ล้างคราบโคลนใต้ท้องรถ อบโอโซนดับกลิ่นอับ',
          damageAmount: 18000,
          claimableAmount: 18000,
        },
        {
          category: 'ตรวจเช็คระบบเบรกและลูกปืนล้อ 4 ล้อ',
          description: 'เปลี่ยนจาระบีและน้ำมันเบรก',
          damageAmount: 12000,
          claimableAmount: 12000,
        },
        {
          category: 'เช็คระบบไฟช่วงล่างและเซ็นเซอร์ ABS',
          description: 'เป่าแห้งและเคลือบกันชื้น',
          damageAmount: Math.max(0, repairCost - 30000),
          claimableAmount: Math.max(0, repairCost - 30000),
        },
      ];
    } else {
      // ankle
      estimatedLoss = 25000;
      breakdown = [
        {
          category: 'ล้างอัดฉีดใต้ท้องรถและระบบช่วงล่าง',
          description: 'ขจัดคราบโคลนและดินทราย',
          damageAmount: 6000,
          claimableAmount: 6000,
        },
        {
          category: 'ตรวจเช็คผ้าเบรกและลูกปืนล้อ',
          description: 'ตรวจสอบความชื้นในห้องโดยสาร',
          damageAmount: 8000,
          claimableAmount: 8000,
        },
      ];
    }
  } else if (propertyType === 'home') {
    // Residential property
    const baseBuildingDamage = Math.round(sumInsured * waterOption.multiplier * 0.7);
    const furnitureDamage = Math.round(sumInsured * waterOption.multiplier * 0.3);
    estimatedLoss = baseBuildingDamage + furnitureDamage + 15000;

    breakdown = [
      {
        category: 'ค่าซ่อมแซมโครงสร้าง ผนัง และสีทาอาคาร',
        description: 'ขูดลอกสีพอง รอยร้าว ฉาบปูนและทาสีกันเชื้อรา',
        damageAmount: baseBuildingDamage,
        claimableAmount: Math.min(baseBuildingDamage, Math.round(sumInsured * 0.6)),
      },
      {
        category: 'ค่าล้างทำความสะอาดและขนย้ายซากทรัพย์สิน',
        description: 'ตามระเบียบ คปภ. ชดเชยสูงสุด 10% ของทุนประกันภัย',
        damageAmount: 20000,
        claimableAmount: 15000,
      },
      {
        category: 'เฟอร์นิเจอร์บิวท์อินและประตูบานไม้',
        description: 'เปลี่ยนวงกบ ประตูไม้อัด และตู้ครัวที่บวมน้ำ',
        damageAmount: furnitureDamage,
        claimableAmount: Math.min(furnitureDamage, Math.round(sumInsured * 0.3)),
      },
      {
        category: 'ระบบไฟฟ้าและเบรกเกอร์ชั้นล่าง',
        description: 'เปลี่ยนเต้ารับ ปลั๊กไฟที่จมน้ำ',
        damageAmount: 12000,
        claimableAmount: 12000,
      },
    ];
  } else if (propertyType === 'appliance') {
    // Electrical appliances
    estimatedLoss = Math.round(sumInsured * Math.min(1.0, waterOption.multiplier * 1.5));
    breakdown = [
      {
        category: 'ตู้เย็น / ตู้แช่อาหาร',
        description: 'คอมเพรสเซอร์และระบบแก๊สทำความเย็นแช่น้ำโคลน',
        damageAmount: 22000,
        claimableAmount: 22000,
      },
      {
        category: 'เครื่องซักผ้า / เครื่องอบผ้า',
        description: 'มอเตอร์ปั่นหมาดและชุดแผงควบคุมอิเล็กทรอนิกส์ช็อต',
        damageAmount: 18000,
        claimableAmount: 18000,
      },
      {
        category: 'โทรทัศน์ / อุปกรณ์ไอทีชั้นล่าง',
        description: 'แผงเมนบอร์ดและจอภาพความชื้นเกาะ',
        damageAmount: 16000,
        claimableAmount: 16000,
      },
      {
        category: 'ปั๊มน้ำอัตโนมัติประจำบ้าน',
        description: 'มอเตอร์ไหม้เนื่องจากทำงานขณะจมน้ำ',
        damageAmount: 9500,
        claimableAmount: 9500,
      },
    ];
  } else {
    // Commercial / SME
    estimatedLoss = Math.round(sumInsured * waterOption.multiplier);
    breakdown = [
      {
        category: 'สต็อกสินค้าและวัตถุดิบจมน้ำ',
        description: 'สินค้าเปียกน้ำเสียหาย ไม่สามารถจำหน่ายได้',
        damageAmount: Math.round(estimatedLoss * 0.6),
        claimableAmount: Math.round(estimatedLoss * 0.6),
      },
      {
        category: 'ตกแต่งร้านค้าและชั้นวางสินค้า',
        description: 'โครงสร้างและเฟอร์นิเจอร์จัดแสดง',
        damageAmount: Math.round(estimatedLoss * 0.25),
        claimableAmount: Math.round(estimatedLoss * 0.25),
      },
      {
        category: 'เงินชดเชยการหยุดชะงักของธุรกิจ (ถ้ามี)',
        description: 'ค่าชดเชยรายได้รายวันระหว่างรอฟื้นฟู',
        damageAmount: Math.round(estimatedLoss * 0.15),
        claimableAmount: Math.round(estimatedLoss * 0.15),
      },
    ];
  }

  // Calculate net payout
  let calculatedPayout = 0;
  if (hasFloodEndorsement) {
    const rawTotal = breakdown.reduce((sum: number, item) => sum + item.claimableAmount, 0);
    const cappedBySum = Math.min(rawTotal, sumInsured);
    calculatedPayout = Math.max(0, cappedBySum - deductible);
  } else {
    calculatedPayout = 0; // Not covered if no flood endorsement
  }

  const governmentRelief = provinceData.reliefRate;
  const totalRecovery = calculatedPayout + governmentRelief;
  const ownerOutOfPocket = Math.max(0, estimatedLoss - totalRecovery);

  return {
    estimatedLoss,
    calculatedPayout,
    governmentRelief,
    ownerOutOfPocket,
    breakdown,
  };
}
