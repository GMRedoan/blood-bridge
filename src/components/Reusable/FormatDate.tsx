interface FormatDateOptions {
  locale?: string;
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  fallback?: string;
}

export const formatDate = (
  date?: Date | string | null,
  options: FormatDateOptions = {},
): string => {
  const {
    locale = "en-US",
    year = "numeric",
    month = "long",
    day = "numeric",
    fallback = "N/A",
  } = options;

  if (!date) return fallback;

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    year,
    month,
    day,
  }).format(parsedDate);
};
