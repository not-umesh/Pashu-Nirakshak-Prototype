import type { RiskLevel, TicketStatus, SampleStatus, ZoneType } from '../types';

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return 'bg-red-600 text-white';
    case 'HIGH': return 'bg-amber-500 text-black';
    case 'MODERATE': return 'bg-yellow-500 text-black';
    case 'LOW': return 'bg-emerald-600 text-white';
    case 'ROUTINE': return 'bg-slate-600 text-white';
  }
}

export function riskDot(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL': return 'bg-red-500';
    case 'HIGH': return 'bg-amber-500';
    case 'MODERATE': return 'bg-yellow-400';
    case 'LOW': return 'bg-emerald-500';
    case 'ROUTINE': return 'bg-slate-400';
  }
}

export function statusBadge(status: TicketStatus): { label: string; cls: string } {
  switch (status) {
    case 'CONFIRMED_OUTBREAK': return { label: 'CONFIRMED OUTBREAK', cls: 'bg-red-600 text-white' };
    case 'SUSPICIOUS_TRIAGE': return { label: 'AI TRIAGE — SUSPICIOUS', cls: 'bg-amber-500 text-black' };
    case 'UNDER_INVESTIGATION': return { label: 'UNDER INVESTIGATION', cls: 'bg-blue-500 text-white' };
    case 'VERIFIED_RESOLVED': return { label: 'RESOLVED', cls: 'bg-emerald-600 text-white' };
    case 'PENDING_LAB': return { label: 'PENDING LAB', cls: 'bg-purple-500 text-white' };
  }
}

export function sampleStatusBadge(status: SampleStatus): { label: string; cls: string } {
  switch (status) {
    case 'IN_TRANSIT': return { label: 'IN TRANSIT', cls: 'bg-blue-500 text-white' };
    case 'RECEIVED': return { label: 'RECEIVED', cls: 'bg-indigo-500 text-white' };
    case 'PROCESSING': return { label: 'PROCESSING', cls: 'bg-amber-500 text-black' };
    case 'CONFIRMED_POSITIVE': return { label: 'POSITIVE', cls: 'bg-red-600 text-white' };
    case 'CONFIRMED_NEGATIVE': return { label: 'NEGATIVE', cls: 'bg-emerald-600 text-white' };
  }
}

export function zoneStyle(type: ZoneType): { color: string; fillColor: string; fillOpacity: number } {
  switch (type) {
    case 'RED_EPICENTER': return { color: '#DC2626', fillColor: '#EF4444', fillOpacity: 0.18 };
    case 'YELLOW_BUFFER': return { color: '#D97706', fillColor: '#F59E0B', fillOpacity: 0.10 };
    case 'GREEN_SAFE': return { color: '#059669', fillColor: '#10B981', fillOpacity: 0.08 };
  }
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
