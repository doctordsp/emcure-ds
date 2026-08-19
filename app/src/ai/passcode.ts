/** Port of cmapalyzer validate_access_password (CODE+MMDD or CODE+letter date). */

const DAY_LETTERS_27_31: Record<string, number> = {
  AA: 27,
  AB: 28,
  AC: 29,
  AD: 30,
  AE: 31,
};

export function decodeLetterDate(letters: string): { month: number; day: number } | null {
  if (!letters || letters.length < 2) return null;
  const upper = letters.toUpperCase();
  const month = upper.charCodeAt(0) - 64;
  if (month < 1 || month > 12) return null;
  const rest = upper.slice(1);
  if (rest.length === 2 && DAY_LETTERS_27_31[rest]) {
    return { month, day: DAY_LETTERS_27_31[rest] };
  }
  if (rest.length === 1) {
    const day = rest.charCodeAt(0) - 64;
    if (day >= 1 && day <= 26) return { month, day };
  }
  return null;
}

export function validateAccessPassword(
  pw: string,
  accessCodes: string[],
  accessValidityDays: number,
  accessPassword: string,
  today = new Date(),
): boolean {
  if (!pw.trim() || (accessCodes.length === 0 && !accessPassword.trim())) return false;
  const normalized = pw.trim().toUpperCase();
  if (accessPassword.trim() && normalized === accessPassword.trim().toUpperCase()) return true;

  const year = today.getFullYear();
  const codes = accessCodes.map((code) => code.trim().toUpperCase()).filter(Boolean);

  const numeric = /^([A-Z]{2,8})(\d{4})$/.exec(normalized);
  if (numeric) {
    const code = numeric[1];
    const mmdd = numeric[2];
    if (codes.includes(code)) {
      const month = Number(mmdd.slice(0, 2));
      const day = Number(mmdd.slice(2));
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const passwordDate = new Date(year, month - 1, day);
        if (passwordDate.getMonth() === month - 1) {
          const daysAgo = Math.floor(
            (startOfDay(today).getTime() - startOfDay(passwordDate).getTime()) / 86400000,
          );
          if (daysAgo >= 0 && daysAgo <= accessValidityDays) return true;
        }
      }
    }
  }

  const sorted = [...codes].sort((a, b) => b.length - a.length);
  for (const code of sorted) {
    if (!normalized.startsWith(code) || normalized.length <= code.length) continue;
    const rest = normalized.slice(code.length);
    if (!/^[A-Z]{2,3}$/.test(rest)) break;
    const decoded = decodeLetterDate(rest);
    if (decoded) {
      const passwordDate = new Date(year, decoded.month - 1, decoded.day);
      if (passwordDate.getMonth() === decoded.month - 1) {
        const daysAgo = Math.floor(
          (startOfDay(today).getTime() - startOfDay(passwordDate).getTime()) / 86400000,
        );
        if (daysAgo >= 0 && daysAgo <= accessValidityDays) return true;
      }
    }
    break;
  }
  return false;
}

function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}
