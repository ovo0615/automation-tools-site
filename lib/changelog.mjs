// Parse a public CHANGELOG.md into released sections.
// Only level-2 headings that start with "v" (e.g. "## v1.0.0（2026-10-11）：第一版") count as released;
// anything else ("## 未發布", "## Unreleased") is dropped so it cannot be read as a delivery promise.

const RELEASED = /^##\s+(v\d+(?:\.\d+)*(?:-[0-9A-Za-z.]+)?)(.*)$/;
const DATE = /(\d{4}-\d{2}-\d{2})/;

export function extractReleasedSections(markdown) {
  const sections = [];
  let current = null;
  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    if (/^##\s/.test(line)) {
      current = null;
      const m = line.match(RELEASED);
      if (m) {
        const heading = line.replace(/^##\s+/, '').trim();
        current = { version: m[1], date: (heading.match(DATE) || [])[1] || null, heading, lines: [] };
        sections.push(current);
      }
      continue;
    }
    if (current) current.lines.push(line);
  }
  return sections.map(({ lines, ...s }) => ({ ...s, body: lines.join('\n').trim() }));
}
