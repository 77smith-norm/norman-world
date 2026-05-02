export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function replaceBetween(
  html: string,
  startMarker: string,
  endMarker: string,
  replacement: string
): string {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start + startMarker.length);

  if (start === -1 || end === -1) {
    throw new Error(`Could not find markers "${startMarker}" and "${endMarker}".`);
  }

  return `${html.slice(0, start + startMarker.length)}${replacement}${html.slice(end)}`;
}

export function extractSentiment(html: string): string {
  const sectionMatch = html.match(/<section class="sentiment">\s*([\s\S]*?)\s*<\/section>/i);
  const divMatch = html.match(/<div class="sentiment">\s*(?:<p>)?\s*([\s\S]*?)\s*(?:<\/p>)?\s*<\/div>/i);
  const raw = sectionMatch?.[1] ?? divMatch?.[1] ?? "Daily reflection";

  return raw
    .replace(/<[^>]+>/g, "")
    .replace(/^["“]|["”]$/g, "")
    .trim();
}

