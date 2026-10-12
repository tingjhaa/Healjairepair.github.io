export type PropertyType = 'home' | 'car' | 'appliance' | 'commercial';

export type WaterLevel = 'ankle' | 'knee' | 'waist' | 'submerged';

export interface DamageImage {
  id: string;
  url: string;
  name: string;
  timestamp: string;
  verificationStatus: 'verified' | 'analyzing' | 'warning';
  confidence: number;
  detectedWaterline: string;
  estimatedSeverity: 'ระดับเล็กน้อย' | 'ระดับปานกลาง' | 'ระดับรุนแรง' | 'เสียหายสิ้นเชิง (Total Loss)';
  detectedItems: string[];
  notes: string;
}

export interface ClaimState {
  currentStep: number; // 1 to 4
  propertyType: PropertyType;
  propertySubtype: string;
  province: string;
  district: string;
  floodDate: string;
  waterLevel: WaterLevel;
  insuranceCompany: string;
  policyType: string;
  sumInsured: number; // ทุนประกันภัย
  hasFloodEndorsement: boolean; // มีความคุ้มครองน้ำท่วม
  deductible: number; // ค่าเสียหายส่วนแรก
  images: DamageImage[];
  estimatedMarketValue: number;
  calculatedLoss: number;
  calculatedPayout: number;
  governmentRelief: number;
  ownerOutOfPocket: number;
  breakdown: {
    category: string;
    description: string;
    damageAmount: number;
    claimableAmount: number;
  }[];
  repairStoreName?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
  options?: { label: string; action: () => void }[];
  isStepTransition?: boolean;
}
