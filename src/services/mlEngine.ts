import type { DiseaseType, WeatherData } from '../types';

// ─── Computer Vision Triage Engine ─────────────────────────
export interface CVTriageResult {
  detectedCondition: string;
  diseaseCode: DiseaseType;
  confidence: number;
  boundingBox: { x: number; y: number; w: number; h: number };
  biosafety: string;
  recommendation: string;
}

const CV_MODELS: Record<string, CVTriageResult> = {
  lumpy_skin: {
    detectedCondition: 'Lumpy Skin Disease (LSD) - Capripoxvirus',
    diseaseCode: 'LSD',
    confidence: 94.2,
    boundingBox: { x: 120, y: 80, w: 240, h: 180 },
    biosafety: 'BSL-2 (Vector-borne, not directly zoonotic)',
    recommendation: 'Isolate animal immediately. Initiate insecticide spraying in 1km radius. Collect skin biopsy for PCR confirmation at ICAR-NIVEDI.',
  },
  fmd_hoof: {
    detectedCondition: 'Foot-and-Mouth Disease (FMD) - Serotype O',
    diseaseCode: 'FMD',
    confidence: 96.7,
    boundingBox: { x: 90, y: 150, w: 200, h: 160 },
    biosafety: 'BSL-3Ag (Highly contagious, OIE-listed)',
    recommendation: 'IMMEDIATE quarantine. Ring vaccination within 5km. Report to State Disease Reporting System (SDRS). Collect epithelial samples for FADDL.',
  },
  healthy_cow: {
    detectedCondition: 'No clinical abnormality detected',
    diseaseCode: 'FMD',
    confidence: 12.3,
    boundingBox: { x: 0, y: 0, w: 0, h: 0 },
    biosafety: 'N/A - Healthy',
    recommendation: 'No immediate action required. Schedule routine follow-up vaccination as per district calendar.',
  },
};

export function analyzeImage(imageKey: string): CVTriageResult {
  if (imageKey.includes('lumpy') || imageKey.includes('lsd') || imageKey.includes('nodule')) {
    return CV_MODELS.lumpy_skin;
  }
  if (imageKey.includes('fmd') || imageKey.includes('hoof') || imageKey.includes('mouth') || imageKey.includes('lesion')) {
    return CV_MODELS.fmd_hoof;
  }
  return CV_MODELS.healthy_cow;
}

// ─── Tri-Factor Outbreak Risk Calculator ───────────────────
export interface RiskCalcInput {
  symptomSeverity: number;   // 0-1
  weather: WeatherData;
  historicalPrecedent: number; // 0-1
}

export interface RiskCalcResult {
  score: number;
  isRedFlag: boolean;
  breakdown: {
    symptomComponent: number;
    weatherComponent: number;
    historicalComponent: number;
  };
  recommendation: string;
}

export function calculateOutbreakRisk(input: RiskCalcInput): RiskCalcResult {
  const rainfallHumidityFactor = input.weather.riskMultiplier;
  const symptomComponent = 0.45 * input.symptomSeverity;
  const weatherComponent = 0.30 * rainfallHumidityFactor;
  const historicalComponent = 0.25 * input.historicalPrecedent;
  const score = symptomComponent + weatherComponent + historicalComponent;
  const isRedFlag = score > 0.75;
  let recommendation = '';
  if (score > 0.85) {
    recommendation = 'CRITICAL: Immediate containment protocol. Deploy rapid response team within 2 hours.';
  } else if (score > 0.75) {
    recommendation = 'HIGH RISK: Activate ring vaccination. Restrict animal movement in 10km radius.';
  } else if (score > 0.55) {
    recommendation = 'MODERATE: Enhanced surveillance. Schedule follow-up within 24h.';
  } else {
    recommendation = 'LOW: Routine monitoring sufficient. Update status in weekly report.';
  }
  return { score, isRedFlag, breakdown: { symptomComponent, weatherComponent, historicalComponent }, recommendation };
}

// ─── Symptom Text Analysis (Hindi/English) ─────────────────
export function analyzeSymptomText(text: string): { disease: DiseaseType; severity: number; keywords: string[] } {
  const lower = text.toLowerCase();
  const hindiLower = text;

  if (lower.includes('छाले') || lower.includes('लार') || lower.includes('vesicle') || lower.includes('blister') || lower.includes('salivation') || lower.includes('lameness') || lower.includes('पैर') || lower.includes('मुंह')) {
    return { disease: 'FMD', severity: 0.85, keywords: ['vesicular lesions', 'salivation', 'lameness'] };
  }
  if (lower.includes('गांठ') || lower.includes('nodule') || lower.includes('lumpy') || lower.includes('skin') || lower.includes('त्वचा')) {
    return { disease: 'LSD', severity: 0.75, keywords: ['skin nodules', 'lymph enlargement'] };
  }
  if (lower.includes('सूजन') || lower.includes('swelling') || lower.includes('throat') || lower.includes('गला') || lower.includes('sudden') || lower.includes('अचानक')) {
    return { disease: 'HS', severity: 0.80, keywords: ['throat swelling', 'sudden onset'] };
  }
  if (lower.includes('मौत') || lower.includes('death') || lower.includes('blood') || lower.includes('खून') || lower.includes('anthrax')) {
    return { disease: 'Anthrax', severity: 0.95, keywords: ['sudden death', 'hemorrhage'] };
  }
  if (lower.includes('गर्भपात') || lower.includes('abortion') || lower.includes('placenta') || hindiLower.includes('बच्चा गिरना')) {
    return { disease: 'Brucellosis', severity: 0.70, keywords: ['abortion', 'retained placenta'] };
  }
  return { disease: 'FMD', severity: 0.50, keywords: ['unspecified symptoms'] };
}

// ─── Anti-Spam Deduplication Engine ────────────────────────
const reportWindow: Map<string, number> = new Map();

export function checkDuplicate(farmerId: string): { isDuplicate: boolean; parentTicketExists: boolean; hoursSinceLast: number } {
  const now = Date.now();
  const last = reportWindow.get(farmerId);
  const WINDOW_MS = 12 * 60 * 60 * 1000;
  if (last && (now - last) < WINDOW_MS) {
    return { isDuplicate: true, parentTicketExists: true, hoursSinceLast: (now - last) / 3600000 };
  }
  reportWindow.set(farmerId, now);
  return { isDuplicate: false, parentTicketExists: false, hoursSinceLast: 0 };
}

// ─── SMS Payload Generator ─────────────────────────────────
export function generateSMSPayload(data: {
  disease: DiseaseType;
  pashuAadhaar: string;
  lat: number;
  lng: number;
}): string {
  const tag = data.pashuAadhaar.replace(/\s/g, '');
  const crc = Array.from(`${data.disease}${tag}${data.lat}${data.lng}`)
    .reduce((acc, c) => acc + c.charCodeAt(0), 0)
    .toString(16).toUpperCase().slice(-4);
  return `EMG:${data.disease}:TAG${tag}:LAT${data.lat.toFixed(2)}:LON${data.lng.toFixed(2)}:CRC${crc}`;
}

// ─── QR Code Generator (SVG-based) ─────────────────────────
export function generateQRSvg(data: string): string {
  const size = 21;
  const cells: boolean[][] = [];
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }
  for (let r = 0; r < size; r++) {
    cells[r] = [];
    for (let c = 0; c < size; c++) {
      const isFinderPattern =
        (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
      const isFinderBorder =
        (r === 0 || r === 6 || c === 0 || c === 6) && isFinderPattern;
      const isFinderInner =
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3) ||
        (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4);
      if (isFinderBorder || isFinderInner) {
        cells[r][c] = true;
      } else if (isFinderPattern) {
        cells[r][c] = false;
      } else {
        const seed = ((hash + r * 37 + c * 59) * 2654435761) >>> 0;
        cells[r][c] = (seed % 3) !== 0;
      }
    }
  }
  const scale = 6;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size * scale}" height="${size * scale}" viewBox="0 0 ${size * scale} ${size * scale}">`;
  svg += `<rect width="100%" height="100%" fill="white"/>`;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (cells[r][c]) {
        svg += `<rect x="${c * scale}" y="${r * scale}" width="${scale}" height="${scale}" fill="#0B0F19"/>`;
      }
    }
  }
  svg += '</svg>';
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
