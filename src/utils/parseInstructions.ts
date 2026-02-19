import { splitBlock, mergeTiny } from './instructionHelpers';

const JUNK = /^step\s*\d+[.:]?\s*$/i;
const NUM_PREFIX = /^(\d+[.):\s]+|STEP\s*\d+\s*[:.–-]\s*)/i;
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const clean = (s: string) => stripHtml(s).replace(NUM_PREFIX, '').trim();

export function parseInstructions(raw: string): string[] {
  const text = raw.replace(/\r\n/g, '\n').trim();
  if (!text) return [];
  let parts = text.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
  if (parts.length <= 1) {
    const numbered = text.split(/(?=\n\d+[.)]\s)/).map(s => s.trim()).filter(Boolean);
    if (numbered.length > 1) parts = numbered;
  }
  if (parts.length <= 1) parts = text.split('\n').map(s => s.trim()).filter(Boolean);
  if (parts.length <= 1 && text.length > 200) parts = splitBlock(text);
  return mergeTiny(parts.filter(p => !JUNK.test(p.trim())).map(clean).filter(p => p.length > 5));
}
