import type {
  FarmerProfile, SurveillanceTicket, LabSample, IncidentEvent,
  MapMarker, GeoPolygon, WeatherData, KPIMetrics, Block, CustodyEntry
} from '../types';

// ─── Administrative Blocks ─────────────────────────────────
export const BLOCKS: Block[] = [
  { id: 'BLK-001', name: 'Arang', district: 'Raipur', state: 'Chhattisgarh', center: { lat: 21.1970, lng: 81.9680 } },
  { id: 'BLK-002', name: 'Abhanpur', district: 'Raipur', state: 'Chhattisgarh', center: { lat: 21.1050, lng: 81.7300 } },
  { id: 'BLK-003', name: 'Dharsiwa', district: 'Raipur', state: 'Chhattisgarh', center: { lat: 21.3200, lng: 81.6700 } },
  { id: 'BLK-004', name: 'Patan', district: 'Durg', state: 'Chhattisgarh', center: { lat: 21.2450, lng: 81.4200 } },
];

// ─── Farmer Profiles ───────────────────────────────────────
export const SEED_FARMERS: FarmerProfile[] = [
  {
    farmerId: 'FID-7739201',
    name: 'Ramesh Patel',
    phone: '9876543210',
    village: 'Arang',
    block: 'Arang',
    district: 'Raipur',
    location: { lat: 21.1985, lng: 81.9720 },
    registeredLivestock: [
      { pashuAadhaar: '1002 9845 1204', species: 'Cattle', breed: 'Sahiwal', age: '4 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (Apr 2026)' },
      { pashuAadhaar: '1002 9845 1205', species: 'Cattle', breed: 'Red Sindhi', age: '3 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (Apr 2026)' },
      { pashuAadhaar: '1002 9845 1206', species: 'Cattle', breed: 'HF Cross', age: '2 years', sex: 'Female', vaccinationStatus: 'Pending' },
      { pashuAadhaar: '1002 9845 1207', species: 'Buffalo', breed: 'Murrah', age: '5 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (Apr 2026)' },
      { pashuAadhaar: '1002 9845 1208', species: 'Buffalo', breed: 'Murrah', age: '3 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (Apr 2026)' },
      { pashuAadhaar: '1002 9845 1209', species: 'Cattle', breed: 'Sahiwal', age: '6 years', sex: 'Male', vaccinationStatus: 'FMD Vaccinated (Apr 2026)' },
    ],
  },
  {
    farmerId: 'FID-8841023',
    name: 'Sita Devi Sahu',
    phone: '9823456789',
    village: 'Bhanpuri',
    block: 'Abhanpur',
    district: 'Raipur',
    location: { lat: 21.1120, lng: 81.7350 },
    registeredLivestock: [
      { pashuAadhaar: '2004 7812 3301', species: 'Cattle', breed: 'Gir', age: '5 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (Mar 2026)' },
      { pashuAadhaar: '2004 7812 3302', species: 'Cattle', breed: 'Gir', age: '2 years', sex: 'Female', vaccinationStatus: 'Pending' },
      { pashuAadhaar: '2004 7812 3303', species: 'Goat', breed: 'Sirohi', age: '1 year', sex: 'Female', vaccinationStatus: 'N/A' },
    ],
  },
  {
    farmerId: 'FID-5567842',
    name: 'Mukesh Kumar Yadav',
    phone: '9845671234',
    village: 'Dhamtari Rd',
    block: 'Dharsiwa',
    district: 'Raipur',
    location: { lat: 21.3240, lng: 81.6750 },
    registeredLivestock: [
      { pashuAadhaar: '3006 1234 5501', species: 'Buffalo', breed: 'Jaffarabadi', age: '4 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (Apr 2026)' },
      { pashuAadhaar: '3006 1234 5502', species: 'Buffalo', breed: 'Surti', age: '3 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (Apr 2026)' },
      { pashuAadhaar: '3006 1234 5503', species: 'Cattle', breed: 'Tharparkar', age: '6 years', sex: 'Male', vaccinationStatus: 'HS Vaccinated (Jun 2026)' },
      { pashuAadhaar: '3006 1234 5504', species: 'Cattle', breed: 'HF Cross', age: '1 year', sex: 'Female', vaccinationStatus: 'Pending' },
    ],
  },
  {
    farmerId: 'FID-4429318',
    name: 'Kamlesh Verma',
    phone: '9912345678',
    village: 'Patan Town',
    block: 'Patan',
    district: 'Durg',
    location: { lat: 21.2480, lng: 81.4250 },
    registeredLivestock: [
      { pashuAadhaar: '4008 5678 9901', species: 'Cattle', breed: 'Sahiwal', age: '3 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (May 2026)' },
      { pashuAadhaar: '4008 5678 9902', species: 'Cattle', breed: 'Red Sindhi', age: '2 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (May 2026)' },
      { pashuAadhaar: '4008 5678 9903', species: 'Goat', breed: 'Jamunapari', age: '2 years', sex: 'Male', vaccinationStatus: 'N/A' },
    ],
  },
  {
    farmerId: 'FID-6612789',
    name: 'Lakshmi Bai Thakur',
    phone: '9834567891',
    village: 'Khamharia',
    block: 'Arang',
    district: 'Raipur',
    location: { lat: 21.2050, lng: 81.9500 },
    registeredLivestock: [
      { pashuAadhaar: '5010 2345 6701', species: 'Cattle', breed: 'Rathi', age: '4 years', sex: 'Female', vaccinationStatus: 'LSD Vaccinated (Jul 2026)' },
      { pashuAadhaar: '5010 2345 6702', species: 'Buffalo', breed: 'Murrah', age: '5 years', sex: 'Female', vaccinationStatus: 'FMD Vaccinated (Apr 2026)' },
      { pashuAadhaar: '5010 2345 6703', species: 'Sheep', breed: 'Deccani', age: '2 years', sex: 'Female', vaccinationStatus: 'N/A' },
      { pashuAadhaar: '5010 2345 6704', species: 'Cattle', breed: 'Rathi', age: '1 year', sex: 'Male', vaccinationStatus: 'Pending' },
    ],
  },
];

const now = new Date();
const fmt = (d: Date) => d.toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000);

// ─── Surveillance Tickets ──────────────────────────────────
export const SEED_TICKETS: SurveillanceTicket[] = [
  // 2 Confirmed Red Outbreaks
  {
    id: 'TKT-001', ticketNumber: 'CG-RPR-2026-00471',
    farmerId: 'FID-7739201', farmerName: 'Ramesh Patel',
    village: 'Arang', block: 'Arang', district: 'Raipur',
    location: { lat: 21.1985, lng: 81.9720 },
    disease: 'FMD', status: 'SUSPICIOUS_TRIAGE', riskLevel: 'HIGH',
    isZoonotic: false,
    symptoms: ['Vesicular lesions on tongue', 'Excessive salivation', 'Lameness', 'Fever 104°F'],
    reportedAt: fmt(hoursAgo(36)), updatedAt: fmt(hoursAgo(2)),
    aiConfidence: 96.7, aiDetectedCondition: 'Foot-and-Mouth Disease (FMD) Suspected',
    assignedParaVet: 'Dr. Anand Mishra',
    affectedAnimals: 3, totalHerd: 6,
    pashuAadhaarTags: ['1002 9845 1204', '1002 9845 1205', '1002 9845 1206'],
    riskScore: 0.89, weatherFactor: 0.82, historicalPrecedent: 0.91,
    linkedSampleIds: ['SMP-001', 'SMP-002'],
    notes: ['Samples collected and dispatched to RDVL Raipur', 'Awaiting lab confirmation'],
  },
  {
    id: 'TKT-002', ticketNumber: 'CG-RPR-2026-00472',
    farmerId: 'FID-6612789', farmerName: 'Lakshmi Bai Thakur',
    village: 'Khamharia', block: 'Arang', district: 'Raipur',
    location: { lat: 21.2050, lng: 81.9500 },
    disease: 'LSD', status: 'SUSPICIOUS_TRIAGE', riskLevel: 'HIGH',
    isZoonotic: false,
    symptoms: ['Nodular skin lesions (2-5cm)', 'Enlarged lymph nodes', 'Reduced milk yield', 'Fever 105°F'],
    reportedAt: fmt(hoursAgo(48)), updatedAt: fmt(hoursAgo(6)),
    aiConfidence: 94.2, aiDetectedCondition: 'Lumpy Skin Disease (LSD) Suspected',
    assignedParaVet: 'Dr. Priya Sharma',
    affectedAnimals: 2, totalHerd: 4,
    pashuAadhaarTags: ['5010 2345 6701', '5010 2345 6704'],
    riskScore: 0.84, weatherFactor: 0.78, historicalPrecedent: 0.75,
    linkedSampleIds: ['SMP-003'],
    notes: ['Tissue sample dispatched to ICAR-NIVEDI', 'Awaiting lab confirmation'],
  },
  // 3 Suspicious Triage Cases
  {
    id: 'TKT-003', ticketNumber: 'CG-RPR-2026-00473',
    farmerId: 'FID-8841023', farmerName: 'Sita Devi Sahu',
    village: 'Bhanpuri', block: 'Abhanpur', district: 'Raipur',
    location: { lat: 21.1120, lng: 81.7350 },
    disease: 'HS', status: 'SUSPICIOUS_TRIAGE', riskLevel: 'HIGH',
    isZoonotic: false,
    symptoms: ['Sudden high fever', 'Swelling of throat', 'Difficulty breathing', 'Nasal discharge'],
    reportedAt: fmt(hoursAgo(8)), updatedAt: fmt(hoursAgo(3)),
    aiConfidence: 78.4, aiDetectedCondition: 'Haemorrhagic Septicaemia (HS) - Pasteurella multocida',
    assignedParaVet: 'Dr. Ravi Tiwari',
    affectedAnimals: 1, totalHerd: 3,
    pashuAadhaarTags: ['2004 7812 3301'],
    riskScore: 0.72, weatherFactor: 0.85, historicalPrecedent: 0.63,
    linkedSampleIds: ['SMP-004'],
    notes: ['Sample collected and dispatched to RDVL Raipur'],
  },
  {
    id: 'TKT-004', ticketNumber: 'CG-DRG-2026-00101',
    farmerId: 'FID-4429318', farmerName: 'Kamlesh Verma',
    village: 'Patan Town', block: 'Patan', district: 'Durg',
    location: { lat: 21.2480, lng: 81.4250 },
    disease: 'Anthrax', status: 'SUSPICIOUS_TRIAGE', riskLevel: 'HIGH',
    isZoonotic: true,
    symptoms: ['Sudden death of 1 cattle', 'Blood oozing from natural orifices', 'Bloated carcass'],
    reportedAt: fmt(hoursAgo(4)), updatedAt: fmt(hoursAgo(1)),
    aiConfidence: 87.1, aiDetectedCondition: 'Anthrax - Bacillus anthracis (ZOONOTIC)',
    assignedParaVet: 'Dr. Deepak Chandrakar',
    affectedAnimals: 1, totalHerd: 3,
    pashuAadhaarTags: ['4008 5678 9901'],
    riskScore: 0.92, weatherFactor: 0.88, historicalPrecedent: 0.95,
    linkedSampleIds: ['SMP-006'],
    notes: ['URGENT: Zoonotic risk - IDSP notification pending', 'Carcass disposal protocol initiated', 'Human contact tracing recommended'],
  },
  {
    id: 'TKT-005', ticketNumber: 'CG-RPR-2026-00474',
    farmerId: 'FID-5567842', farmerName: 'Mukesh Kumar Yadav',
    village: 'Dhamtari Rd', block: 'Dharsiwa', district: 'Raipur',
    location: { lat: 21.3240, lng: 81.6750 },
    disease: 'Brucellosis', status: 'SUSPICIOUS_TRIAGE', riskLevel: 'HIGH',
    isZoonotic: true,
    symptoms: ['Repeated abortion', 'Retained placenta', 'Orchitis in bull', 'Joint swelling'],
    reportedAt: fmt(hoursAgo(18)), updatedAt: fmt(hoursAgo(5)),
    aiConfidence: 72.8, aiDetectedCondition: 'Brucellosis - Brucella abortus (ZOONOTIC)',
    assignedParaVet: 'Dr. Anand Mishra',
    affectedAnimals: 2, totalHerd: 4,
    pashuAadhaarTags: ['3006 1234 5501', '3006 1234 5502'],
    riskScore: 0.78, weatherFactor: 0.65, historicalPrecedent: 0.82,
    linkedSampleIds: [],
    notes: ['Rose Bengal Plate Test scheduled', 'Dairy products from herd quarantined'],
  },
  // 3 Verified Resolved
  {
    id: 'TKT-006', ticketNumber: 'CG-RPR-2026-00420',
    farmerId: 'FID-7739201', farmerName: 'Ramesh Patel',
    village: 'Arang', block: 'Arang', district: 'Raipur',
    location: { lat: 21.2010, lng: 81.9650 },
    disease: 'FMD', status: 'VERIFIED_RESOLVED', riskLevel: 'LOW',
    isZoonotic: false,
    symptoms: ['Mild salivation', 'Small vesicle on tongue'],
    reportedAt: fmt(hoursAgo(240)), updatedAt: fmt(hoursAgo(120)),
    aiConfidence: 88.3, aiDetectedCondition: 'Foot-and-Mouth Disease (FMD)',
    assignedParaVet: 'Dr. Priya Sharma',
    affectedAnimals: 1, totalHerd: 6,
    pashuAadhaarTags: ['1002 9845 1207'],
    riskScore: 0.45, weatherFactor: 0.55, historicalPrecedent: 0.60,
    linkedSampleIds: [],
    notes: ['Containment successful', 'All animals recovered', 'Ring vaccination completed'],
  },
  {
    id: 'TKT-007', ticketNumber: 'CG-RPR-2026-00435',
    farmerId: 'FID-8841023', farmerName: 'Sita Devi Sahu',
    village: 'Bhanpuri', block: 'Abhanpur', district: 'Raipur',
    location: { lat: 21.1090, lng: 81.7400 },
    disease: 'LSD', status: 'VERIFIED_RESOLVED', riskLevel: 'LOW',
    isZoonotic: false,
    symptoms: ['Small nodules on neck'],
    reportedAt: fmt(hoursAgo(360)), updatedAt: fmt(hoursAgo(168)),
    aiConfidence: 91.2, aiDetectedCondition: 'Lumpy Skin Disease (LSD)',
    assignedParaVet: 'Dr. Ravi Tiwari',
    affectedAnimals: 1, totalHerd: 3,
    pashuAadhaarTags: ['2004 7812 3302'],
    riskScore: 0.35, weatherFactor: 0.52, historicalPrecedent: 0.55,
    linkedSampleIds: [],
    notes: ['Recovery complete', 'Follow-up vaccination administered'],
  },
  {
    id: 'TKT-008', ticketNumber: 'CG-DRG-2026-00089',
    farmerId: 'FID-4429318', farmerName: 'Kamlesh Verma',
    village: 'Patan Town', block: 'Patan', district: 'Durg',
    location: { lat: 21.2500, lng: 81.4300 },
    disease: 'HS', status: 'VERIFIED_RESOLVED', riskLevel: 'LOW',
    isZoonotic: false,
    symptoms: ['Mild fever', 'Nasal discharge'],
    reportedAt: fmt(hoursAgo(480)), updatedAt: fmt(hoursAgo(336)),
    aiConfidence: 65.1, aiDetectedCondition: 'Haemorrhagic Septicaemia (HS)',
    assignedParaVet: 'Dr. Deepak Chandrakar',
    affectedAnimals: 1, totalHerd: 3,
    pashuAadhaarTags: ['4008 5678 9902'],
    riskScore: 0.30, weatherFactor: 0.48, historicalPrecedent: 0.50,
    linkedSampleIds: [],
    notes: ['Treated with antibiotics', 'Full recovery'],
  },
];

// ─── Lab Samples ───────────────────────────────────────────
const makeCustody = (entries: Partial<CustodyEntry>[]): CustodyEntry[] =>
  entries.map(e => ({
    timestamp: e.timestamp || fmt(hoursAgo(12)),
    handler: e.handler || 'Unknown',
    action: e.action || 'Logged',
    location: e.location || 'Field',
    temperature: e.temperature,
  }));

export const SEED_SAMPLES: LabSample[] = [
  {
    id: 'SMP-001', sampleId: 'LAB-CG-RPR-2026-S0471A',
    ticketId: 'TKT-001', ticketNumber: 'CG-RPR-2026-00471',
    sampleType: 'Blood', collectedBy: 'Dr. Anand Mishra',
    collectedAt: fmt(hoursAgo(30)),
    originFarmer: 'Ramesh Patel', originVillage: 'Arang', originBlock: 'Arang',
    pashuAadhaar: '1002 9845 1204',
    status: 'IN_TRANSIT', labName: 'RDVL Raipur',
    qrCode: 'QR-LAB-CG-RPR-S0471A-BLD',
    disease: 'FMD',
    chainOfCustody: makeCustody([
      { timestamp: fmt(hoursAgo(30)), handler: 'Dr. Anand Mishra', action: 'Sample collected from animal ear tag 1002 9845 1204', location: 'Arang Village Farm', temperature: '4°C' },
      { timestamp: fmt(hoursAgo(28)), handler: 'Cold Chain Logistics', action: 'Picked up from collection center', location: 'Arang PHC', temperature: '3°C' },
    ]),
  },
  {
    id: 'SMP-002', sampleId: 'LAB-CG-RPR-2026-S0471B',
    ticketId: 'TKT-001', ticketNumber: 'CG-RPR-2026-00471',
    sampleType: 'Swab', collectedBy: 'Dr. Anand Mishra',
    collectedAt: fmt(hoursAgo(30)),
    originFarmer: 'Ramesh Patel', originVillage: 'Arang', originBlock: 'Arang',
    pashuAadhaar: '1002 9845 1205',
    status: 'IN_TRANSIT', labName: 'RDVL Raipur',
    qrCode: 'QR-LAB-CG-RPR-S0471B-SWB',
    disease: 'FMD',
    chainOfCustody: makeCustody([
      { timestamp: fmt(hoursAgo(30)), handler: 'Dr. Anand Mishra', action: 'Epithelial swab collected', location: 'Arang Village Farm', temperature: '4°C' },
      { timestamp: fmt(hoursAgo(28)), handler: 'Cold Chain Logistics', action: 'Dispatched to RDVL Raipur', location: 'Arang PHC', temperature: '3°C' },
    ]),
  },
  {
    id: 'SMP-003', sampleId: 'LAB-CG-RPR-2026-S0472A',
    ticketId: 'TKT-002', ticketNumber: 'CG-RPR-2026-00472',
    sampleType: 'Tissue', collectedBy: 'Dr. Priya Sharma',
    collectedAt: fmt(hoursAgo(40)),
    originFarmer: 'Lakshmi Bai Thakur', originVillage: 'Khamharia', originBlock: 'Arang',
    pashuAadhaar: '5010 2345 6701',
    status: 'IN_TRANSIT', labName: 'ICAR-NIVEDI Bengaluru',
    qrCode: 'QR-LAB-CG-RPR-S0472A-TIS',
    disease: 'LSD',
    chainOfCustody: makeCustody([
      { timestamp: fmt(hoursAgo(40)), handler: 'Dr. Priya Sharma', action: 'Skin biopsy collected from nodular lesion', location: 'Khamharia Farm', temperature: '4°C' },
      { timestamp: fmt(hoursAgo(38)), handler: 'Cold Chain Logistics', action: 'Dispatched to ICAR-NIVEDI via air consignment', location: 'Raipur Airport Cargo', temperature: '2°C' },
    ]),
  },
  {
    id: 'SMP-004', sampleId: 'LAB-CG-RPR-2026-S0473A',
    ticketId: 'TKT-003', ticketNumber: 'CG-RPR-2026-00473',
    sampleType: 'Serum', collectedBy: 'Dr. Ravi Tiwari',
    collectedAt: fmt(hoursAgo(6)),
    originFarmer: 'Sita Devi Sahu', originVillage: 'Bhanpuri', originBlock: 'Abhanpur',
    pashuAadhaar: '2004 7812 3301',
    status: 'IN_TRANSIT', labName: 'RDVL Raipur',
    qrCode: 'QR-LAB-CG-RPR-S0473A-SRM',
    disease: 'HS',
    chainOfCustody: makeCustody([
      { timestamp: fmt(hoursAgo(6)), handler: 'Dr. Ravi Tiwari', action: 'Serum sample collected', location: 'Bhanpuri Village', temperature: '4°C' },
      { timestamp: fmt(hoursAgo(5)), handler: 'Para-Vet Courier', action: 'Dispatched to RDVL Raipur', location: 'Abhanpur Collection Center', temperature: '3°C' },
    ]),
  },
  {
    id: 'SMP-005', sampleId: 'LAB-CG-RPR-2026-S0474A',
    ticketId: 'TKT-005', ticketNumber: 'CG-RPR-2026-00475',
    sampleType: 'Serum', collectedBy: 'Dr. Kavita Verma',
    collectedAt: fmt(hoursAgo(18)),
    originFarmer: 'Mohan Lal Yadav', originVillage: 'Dharsiwa', originBlock: 'Dharsiwa',
    pashuAadhaar: '3007 6521 8890',
    status: 'PROCESSING', labName: 'RDVL Raipur',
    qrCode: 'QR-LAB-CG-RPR-S0474A-SRM',
    disease: 'Brucellosis',
    chainOfCustody: makeCustody([
      { timestamp: fmt(hoursAgo(18)), handler: 'Dr. Kavita Verma', action: 'Paired serum sample collected from dairy cattle', location: 'Dharsiwa Dairy Farm', temperature: '4°C' },
      { timestamp: fmt(hoursAgo(16)), handler: 'Cold Chain Logistics', action: 'Picked up and transported under cold chain', location: 'Dharsiwa PHC', temperature: '3°C' },
      { timestamp: fmt(hoursAgo(12)), handler: 'RDVL Raipur Reception', action: 'Sample received and logged for Rose Bengal Plate Test', location: 'RDVL Raipur', temperature: '4°C' },
    ]),
  },
  {
    id: 'SMP-006', sampleId: 'LAB-CG-DRG-2026-A0101',
    ticketId: 'TKT-004', ticketNumber: 'CG-DRG-2026-00101',
    sampleType: 'Blood Smear', collectedBy: 'Dr. Deepak Chandrakar',
    collectedAt: fmt(hoursAgo(3)),
    originFarmer: 'Kamlesh Verma', originVillage: 'Patan Town', originBlock: 'Patan',
    pashuAadhaar: '4008 5678 9901',
    status: 'IN_TRANSIT', labName: 'RDVL Raipur',
    qrCode: 'QR-LAB-CG-DRG-A0101-BLD',
    disease: 'Anthrax',
    chainOfCustody: makeCustody([
      { timestamp: fmt(hoursAgo(3)), handler: 'Dr. Deepak Chandrakar', action: 'Blood smear collected from ear vein (Bio-secure)', location: 'Patan Farm', temperature: 'Ambient' },
      { timestamp: fmt(hoursAgo(2)), handler: 'Specialized Bio-Hazard Courier', action: 'Dispatched to RDVL Raipur under Level 3 transport', location: 'Patan', temperature: '4°C' },
    ]),
  },
];

// ─── Geo Polygons (Zones) ──────────────────────────────────
export const SEED_ZONES: GeoPolygon[] = [
  // Zones will be generated dynamically upon lab confirmation
];

// ─── Map Markers ───────────────────────────────────────────
export const SEED_MARKERS: MapMarker[] = [
  { id: 'MRK-001', position: { lat: 21.1985, lng: 81.9720 }, type: 'SUSPICIOUS', label: 'FMD Suspected - Arang', details: 'Suspected FMD | 3/6 animals affected | Samples in transit', ticketId: 'TKT-001' },
  { id: 'MRK-002', position: { lat: 21.2050, lng: 81.9500 }, type: 'SUSPICIOUS', label: 'LSD Suspected - Khamharia', details: 'Suspected Lumpy Skin Disease | 2/4 animals affected | Samples in transit', ticketId: 'TKT-002' },
  { id: 'MRK-003', position: { lat: 21.1120, lng: 81.7350 }, type: 'SUSPICIOUS', label: 'HS Suspected - Bhanpuri', details: 'Suspected Haemorrhagic Septicaemia | 1/3 animals | Awaiting lab confirmation', ticketId: 'TKT-003' },
  { id: 'MRK-004', position: { lat: 21.2480, lng: 81.4250 }, type: 'SUSPICIOUS', label: 'Anthrax Suspected - Patan (ZOONOTIC)', details: 'HIGH: Suspected Anthrax | 1 sudden death | IDSP notification pending', ticketId: 'TKT-004' },
  { id: 'MRK-005', position: { lat: 21.3240, lng: 81.6750 }, type: 'SUSPICIOUS', label: 'Brucellosis Suspected - Dharsiwa', details: 'Suspected Brucellosis | 2/4 animals | Rose Bengal test scheduled', ticketId: 'TKT-005' },
  { id: 'MRK-006', position: { lat: 21.2350, lng: 81.6340 }, type: 'HEALTHY', label: 'Routine Vaccination Camp - Dharsiwa', details: 'FMD vaccination drive | 127 animals vaccinated today' },
  { id: 'MRK-007', position: { lat: 21.1750, lng: 81.8100 }, type: 'HEALTHY', label: 'Healthy Herd - Abhanpur Block', details: 'Routine surveillance | All herds clear | 340 animals checked' },
  { id: 'MRK-008', position: { lat: 21.2510, lng: 81.6290 }, type: 'LAB', label: 'RDVL Raipur (Regional Disease Diagnostic Lab)', details: 'Capacity: ELISA, PCR, Culture | 4 samples in queue' },
  { id: 'MRK-009', position: { lat: 21.1690, lng: 81.8850 }, type: 'DISPENSARY', label: 'Veterinary Dispensary - Arang', details: 'Block-level dispensary | Cold chain storage available' },
  { id: 'MRK-010', position: { lat: 21.2900, lng: 81.4550 }, type: 'DISPENSARY', label: 'Veterinary Hospital - Patan', details: 'Sub-district hospital | Emergency services available 24×7' },
];

// ─── Incident Stream ───────────────────────────────────────
export const SEED_INCIDENTS: IncidentEvent[] = [
  { id: 'INC-001', timestamp: fmt(minsAgo(5)), type: 'REPORT', title: 'New Field Report Received', description: 'Farmer Kamlesh Verma (FID-4429318) reported sudden cattle death with blood oozing — Anthrax suspected', block: 'Patan', riskLevel: 'HIGH', ticketId: 'TKT-004' },
  { id: 'INC-002', timestamp: fmt(minsAgo(18)), type: 'DISPATCH', title: 'Lab Samples Dispatched', description: 'FMD samples from Arang dispatched to RDVL Raipur for testing', block: 'Arang', riskLevel: 'HIGH', ticketId: 'TKT-001' },
  { id: 'INC-003', timestamp: fmt(minsAgo(32)), type: 'TRIAGE', title: 'AI Triage: High-Risk Flag', description: 'Brucellosis indicators detected in Dharsiwa — Risk Score: 0.78 — Para-Vet dispatched', block: 'Dharsiwa', riskLevel: 'HIGH', ticketId: 'TKT-005' },
  { id: 'INC-005', timestamp: fmt(minsAgo(58)), type: 'TRIAGE', title: 'AI Triage: HS Suspected in Abhanpur', description: 'Automated CV analysis: 78.4% confidence — Haemorrhagic Septicaemia markers in uploaded image', block: 'Abhanpur', riskLevel: 'HIGH', ticketId: 'TKT-003' },
  { id: 'INC-006', timestamp: fmt(minsAgo(72)), type: 'ESCALATION', title: 'One Health Alert: Zoonotic Risk', description: 'Anthrax suspicion in Patan escalated to IDSP Durg for human contact tracing', block: 'Patan', riskLevel: 'HIGH', ticketId: 'TKT-004' },
  { id: 'INC-007', timestamp: fmt(minsAgo(95)), type: 'REPORT', title: 'LSD Nodules Reported - Khamharia', description: 'Lakshmi Bai Thakur reported skin nodules on 2 cattle — Photos uploaded and analyzed', block: 'Arang', riskLevel: 'HIGH', ticketId: 'TKT-002' },
  { id: 'INC-008', timestamp: fmt(minsAgo(130)), type: 'RESOLVED', title: 'Outbreak Cleared: Old FMD Case', description: 'Previous FMD case CG-RPR-2026-00420 marked resolved — All animals recovered', block: 'Arang', riskLevel: 'LOW', ticketId: 'TKT-006' },
];

// ─── Weather ───────────────────────────────────────────────
export const SEED_WEATHER: WeatherData = {
  rainfall: 78,
  humidity: 84,
  soilMoisture: 'High',
  temperature: 31,
  season: 'Monsoon (Aug-Sep)',
  riskMultiplier: 0.82,
};

// ─── KPI Metrics ───────────────────────────────────────────
export const computeKPI = (tickets: SurveillanceTicket[], samples: LabSample[]): KPIMetrics => {
  const active = tickets.filter(t => t.status === 'CONFIRMED_OUTBREAK').length;
  const suspected = tickets.filter(t => t.status === 'SUSPICIOUS_TRIAGE').length;
  const zoonotic = tickets.filter(t => t.isZoonotic && t.status !== 'VERIFIED_RESOLVED').length;
  const pending = samples.filter(s => s.status !== 'CONFIRMED_POSITIVE' && s.status !== 'CONFIRMED_NEGATIVE').length;
  const resolved = tickets.filter(t => t.status === 'VERIFIED_RESOLVED').length;
  return {
    activeEpidemics: active,
    suspectedTriageCases: suspected,
    zoonoticAlerts: zoonotic,
    vaccineColdChainLevel: 73,
    totalReportsToday: 12,
    pendingSamples: pending,
    resolvedThisWeek: resolved,
  };
};
