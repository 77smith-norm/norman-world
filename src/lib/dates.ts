export const dateSlugPattern = /^\d{4}-\d{2}-\d{2}$/;
export const monthSlugPattern = /^\d{4}-\d{2}$/;

export function parseDateSlug(slug: string): Date {
  if (!dateSlugPattern.test(slug)) {
    throw new Error(`Invalid date slug "${slug}". Expected YYYY-MM-DD.`);
  }

  return new Date(`${slug}T12:00:00`);
}

export function formatEntryDate(slug: string): string {
  return parseDateSlug(slug).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
}

export function formatMonth(slug: string): string {
  if (!monthSlugPattern.test(slug)) {
    throw new Error(`Invalid month slug "${slug}". Expected YYYY-MM.`);
  }

  return new Date(`${slug}-01T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}

export function monthSlugFromDateSlug(slug: string): string {
  if (!dateSlugPattern.test(slug)) {
    throw new Error(`Invalid date slug "${slug}". Expected YYYY-MM-DD.`);
  }

  return slug.slice(0, 7);
}

export function previousLocalDateSlug(now: Date, timeZone = "America/Los_Angeles"): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  if (!year || !month || !day) {
    throw new Error(`Could not resolve local date for ${timeZone}.`);
  }

  const previous = new Date(Date.UTC(year, month - 1, day - 1, 12));
  const previousYear = previous.getUTCFullYear();
  const previousMonth = `${previous.getUTCMonth() + 1}`.padStart(2, "0");
  const previousDay = `${previous.getUTCDate()}`.padStart(2, "0");

  return `${previousYear}-${previousMonth}-${previousDay}`;
}
