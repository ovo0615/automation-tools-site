const statuses = new Set(['received', 'evaluating', 'planned', 'completed']);
const series = new Set(['tool-guide', 'agent-workflow']);
const formHosts = new Set(['forms.office.com', 'forms.cloud.microsoft', 'forms.microsoft.com']);
export function assertResources({tools, videos, wishes, issues, forms}) {
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const slugs = new Set(tools.map(t => t.slug));
  for (const [kind, list] of Object.entries({videos, wishes, issues})) {
    if (!Array.isArray(list)) throw Error(`${kind}: expected an array`);
    const ids = new Set();
    for (const entry of list) {
      if (!slugs.has(entry.tool)) throw Error(`${kind}: unknown tool`);
      const id = kind === 'videos' ? entry.youtubeId : entry.id;
      if (!text(id) || ids.has(`${entry.tool}:${id}`)) throw Error(`${kind}: missing or duplicate identifier`);
      ids.add(`${entry.tool}:${id}`);
      if (!text(entry.title) || !text(entry.titleZh)) throw Error(`${kind}: bilingual title required`);
      if (kind === 'videos' && !/^[\w-]{11}$/.test(id)) throw Error('videos: invalid YouTube ID');
      if (kind === 'videos') assertVideo(entry, ids);
      if (kind === 'wishes' && !statuses.has(entry.status)) throw Error('wishes: invalid status');
      if (kind === 'issues' && ![entry.description, entry.descriptionZh, entry.versions].every(text)) throw Error('issues: description and affected versions required');
      if (entry.source) {
        const source = new URL(entry.source);
        if (source.protocol !== 'https:') throw Error(`${kind}: HTTPS source required`);
      }
    }
  }
  for (const [kind, value] of Object.entries(forms)) {
    if (!['trial','feedback','bug','wish'].includes(kind)) throw Error('forms: unknown kind');
    if (value === null) continue;
    const u = new URL(value);
    if (u.protocol !== 'https:' || !formHosts.has(u.hostname) || u.username || u.password) throw Error('forms: Microsoft Forms HTTPS URL required');
  }
}

// Video cards need a series, an episode number (anchor on the videos page) and a label; length and guide links are optional.
function assertVideo(v, ids) {
  if (!series.has(v.series)) throw Error('videos: invalid series');
  if (!Number.isInteger(v.episode) || v.episode < 0) throw Error('videos: episode must be a whole number');
  if (ids.has(`${v.tool}:${v.series}:${v.episode}`)) throw Error('videos: duplicate episode');
  ids.add(`${v.tool}:${v.series}:${v.episode}`);
  if (typeof v.label !== 'string' || !v.label.trim() || typeof v.titleEn !== 'string' || !v.titleEn.trim()) throw Error('videos: label and English topic required');
  if (v.duration !== undefined && !/^\d{1,2}:\d{2}(?::\d{2})?$/.test(v.duration)) throw Error('videos: duration must look like 7:29');
  for (const g of v.guide ?? []) {
    if (typeof g.label !== 'string' || !g.label.trim() || typeof g.path !== 'string' || !/^\/(?!\/)/.test(g.path)) throw Error('videos: guide links need a label and a site path');
  }
}
