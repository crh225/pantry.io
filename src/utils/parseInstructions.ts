const JUNK = /^step\s*\d+[.:]?\s*$/i;
const NUM_PREFIX = /^(\d+[.):\s]+|STEP\s*\d+\s*[:.–-]\s*)/i;

/** Strip HTML tags from text */
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const clean = (s: string) => stripHtml(s).replace(NUM_PREFIX, '').trim();

/** Split a single long block into sentences at logical break points */
function splitBlock(text: string): string[] {
  // Split on sentence-ending punctuation followed by a space + capital
  const parts = text.split(/(?<=[.!])\s+(?=[A-Z])/).filter(s => s.length > 10);
  if (parts.length > 1) return parts;
  return [text];
}

/** Merge tiny consecutive lines (< 40 chars) into one */
function mergeTiny(lines: string[]): string[] {
  const out: string[] = [];
  let buf = '';
  for (const line of lines) {
    if (line.length < 40 && buf.length < 200) {
      buf = buf ? `${buf} ${line}` : line;
    } else {
      if (buf) { out.push(buf); buf = ''; }
      out.push(line);
    }
  }
  if (buf) out.push(buf);
  return out;
}

export function parseInstructions(raw: string): string[] {
  const text = raw.replace(/\r\n/g, '\n').trim();
  if (!text) return [];

  // Try double newlines first
  let parts = text.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);

  // If only 1 block, try numbered pattern
  if (parts.length <= 1) {
    const numbered = text.split(/(?=\n\d+[.)]\s)/).map(s => s.trim()).filter(Boolean);
    if (numbered.length > 1) parts = numbered;
  }

  // If still 1 block, try single newlines
  if (parts.length <= 1) {
    parts = text.split('\n').map(s => s.trim()).filter(Boolean);
  }

  // If STILL 1 long block, split on sentences
  if (parts.length <= 1 && text.length > 200) {
    parts = splitBlock(text);
  }

  return mergeTiny(
    parts.filter(p => !JUNK.test(p.trim())).map(clean).filter(p => p.length > 5)
  );
}
