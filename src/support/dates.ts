/**
 * Datas relativas para que a suíte não "apodreça" com o calendário.
 * Aceita "hoje", "hoje+7", "hoje-3" ou uma data ISO fixa "2027-01-11".
 */
export function resolveDate(expr: string, base: Date = new Date()): Date {
  const rel = expr.trim().match(/^hoje\s*([+-]\s*\d+)?$/i);
  if (rel) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    if (rel[1]) d.setDate(d.getDate() + Number(rel[1].replace(/\s/g, '')));
    return d;
  }
  const iso = expr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  throw new Error(`Data inválida no cenário: "${expr}". Use "hoje+N" ou "AAAA-MM-DD".`);
}

const pad = (n: number) => String(n).padStart(2, '0');

/** 2026-12-06 — formato usado na query string do motor */
export const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** 06/12/2026 — formato exibido em "Período selecionado" */
export const toBr = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

const MESES = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

/** "DEZEMBRO 2026" — cabeçalho do calendário (date-range-picker) */
export const toMonthCaption = (d: Date) => `${MESES[d.getMonth()]} ${d.getFullYear()}`;
