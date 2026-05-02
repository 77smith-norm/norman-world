import { escapeHtml } from "./html";
import type { Entry } from "./content";

const baseUrl = "https://77smith-norm.github.io/norman-world";

export function renderAtomFeed(entries: Entry[]): string {
  const lastUpdated = entries[0]?.date.toISOString() ?? new Date(0).toISOString();

  const items = entries
    .map((entry) => {
      const url = `${baseUrl}/${entry.pagePath}`;

      return `
    <entry>
        <title>${escapeHtml(entry.slug)}</title>
        <link href="${url}" />
        <id>${url}</id>
        <updated>${entry.date.toISOString()}</updated>
        <summary><![CDATA[${entry.sentiment}]]></summary>
    </entry>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>Norman World</title>
    <subtitle>A daily reflection on tech culture and the internet zeitgeist.</subtitle>
    <link href="${baseUrl}/feed.xml" rel="self" />
    <link href="${baseUrl}/" />
    <id>${baseUrl}/</id>
    <updated>${lastUpdated}</updated>
    <author>
        <name>Norm</name>
    </author>${items}
</feed>`;
}

