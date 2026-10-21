// Pre-build guard: the site's own generator must not be able to publish internal data.
// Every rule here fails the build; there is no warning level.

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// ASCII names must match as whole words so they do not fire inside ordinary English words;
// CJK names have no word boundaries and match anywhere.
const termRe = (t) => (/^[\x20-\x7e]+$/.test(t) ? `(?<![A-Za-z0-9])${escapeRe(t)}(?![A-Za-z0-9])` : escapeRe(t));

const FIXED_RULES = [
  // Dashboard card numbers (#0205, #1234) and card branches (card/0116-fix).
  // Not after "&" (HTML entity &#0160;) and not before ";" or a hex letter (CSS colours #0123; #0b0f14).
  { rule: 'card-number', re: /(?<![&\w])#\d{4}(?![0-9A-Za-z;])|\bcard\/\d{4}/g },
  // Drive letters, UNC shares and Git Bash drive mounts (cd /d/AI ...).
  { rule: 'disk-path', re: /(?<![A-Za-z0-9])[A-Za-z]:[\\/](?!\/)|\\\\[A-Za-z0-9_.-]+\\|(?<=^|[\s`])\/[a-z]\/[A-Za-z]/g },
  { rule: 'private', re: /\bprivate\b|私有/gi },
];

const MD_LINK = /(!?)\[[^\]]*\]\(([^)\s]+)[^)]*\)/g;
const HTML_HREF = /<a\b[^>]*?\shref="([^"]*)"/gi;
const HTML_IMG = /<img\b[^>]*?\ssrc="([^"]*)"/gi;
const OK_TARGET = /^(?:https?:\/\/|mailto:|tel:|#|\/(?!\/))/i;

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

// Percent-encoded URLs can hide a name ("%E7%AF%84..."); restricted terms are also checked on the decoded text.
function decodedVariant(text) {
  if (!text.includes('%')) return null;
  const decoded = text.replace(/(?:%[0-9A-Fa-f]{2})+/g, (run) => {
    try {
      return decodeURIComponent(run);
    } catch {
      return run;
    }
  });
  return decoded === text ? null : decoded;
}

export function scanText(text, { file, kind }, policy) {
  const out = [];
  const add = (rule, index, match, source = text) => out.push({ rule, file, line: lineOf(source, index), match });

  const nameRules = [
    ...(policy.internalTerms?.length
      ? [{ rule: 'internal-term', re: new RegExp(policy.internalTerms.map(termRe).join('|'), 'gi') }]
      : []),
    ...(policy.extraTerms?.length
      ? [{ rule: 'restricted-term', re: new RegExp(policy.extraTerms.map(termRe).join('|'), 'gi') }]
      : []),
  ];
  // Vendor bundles (search index, minified CSS/JS) are full of code-like patterns; only names are checked there.
  const vendor = kind === 'vendor';
  for (const { rule, re } of [...(vendor ? [] : FIXED_RULES), ...nameRules]) for (const m of text.matchAll(re)) add(rule, m.index, m[0]);
  const decoded = decodedVariant(text);
  if (decoded) {
    for (const { rule, re } of nameRules) {
      for (const m of decoded.matchAll(re)) if (!text.includes(m[0])) add(rule, m.index, m[0], decoded);
    }
  }

  for (let i = 0; !vendor && i < text.length; i++) {
    const c = text.charCodeAt(i);
    if ((c >= 32 && c < 127) || c > 159 || c === 10 || c === 9) continue;
    if (c === 13 && text.charCodeAt(i + 1) === 10) continue;
    add('control-char', i, `U+${c.toString(16).padStart(4, '0')}`);
  }

  const approved = new Set(policy.approvedImages ?? []);
  if (kind === 'html') {
    for (const m of text.matchAll(HTML_HREF)) if (!OK_TARGET.test(m[1])) add('relative-link', m.index, m[1]);
    for (const m of text.matchAll(HTML_IMG)) if (!approved.has(m[1])) add('image-not-approved', m.index, m[1]);
  } else if (kind === 'markdown') {
    for (const m of text.matchAll(MD_LINK)) {
      const [, bang, target] = m;
      if (bang) {
        if (!approved.has(target)) add('image-not-approved', m.index, target);
      } else if (!OK_TARGET.test(target)) add('relative-link', m.index, target);
    }
  }
  return out;
}
