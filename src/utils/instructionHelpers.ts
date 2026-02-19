export function splitBlock(text: string): string[] {
  const parts = text.split(/(?<=[.!])\s+(?=[A-Z])/).filter(s => s.length > 10);
  return parts.length > 1 ? parts : [text];
}

export function mergeTiny(lines: string[]): string[] {
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
