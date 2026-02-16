const JUNK = /^(step\s*\d+[.:]?\s*$)/i;
const NUM_PREFIX = /^(\d+[.):\s]+|STEP\s*\d+\s*[:.–-]\s*)/i;

const clean = (s: string) => s.replace(NUM_PREFIX, '').trim();

export function parseInstructions(raw: string): string[] {
  const text = raw.replace(/\r\n/g, '\n').trim();
  if (!text) return [];

  // Try splitting on double newlines first (paragraph style)
  let parts = text.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);

  // If only 1 block, try numbered pattern: "1) ... 2) ..."
  if (parts.length <= 1) {
    const numbered = text.split(/(?=\n\d+[.)]\s)/).map(s => s.trim()).filter(Boolean);
    if (numbered.length > 1) parts = numbered;
  }

  // If still 1 block, split on single newlines
  if (parts.length <= 1) {
    parts = text.split('\n').map(s => s.trim()).filter(Boolean);
  }

  // Clean and filter
  return parts
    .filter(p => !JUNK.test(p.trim()))
    .map(clean)
    .filter(p => p.length > 5);
}
