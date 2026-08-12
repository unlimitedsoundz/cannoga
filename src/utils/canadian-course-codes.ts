export function generateCanadianCourseCode(departmentPrefix: string, level: number, sequence: number): string {
  const prefix = departmentPrefix.trim().toUpperCase().slice(0, 4);
  const paddedSequence = String(sequence).padStart(3, '0');
  return `${prefix} ${level}${paddedSequence.slice(1)}`;
}

export function parseCanadianCourseCode(code: string): { prefix: string; level: number; sequence: number } | null {
  const match = code.trim().toUpperCase().match(/^([A-Z]{2,4})\s*(\d)(\d{3})$/);
  if (!match) return null;
  return {
    prefix: match[1],
    level: parseInt(match[2], 10),
    sequence: parseInt(match[3], 10),
  };
}
