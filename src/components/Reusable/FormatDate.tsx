interface FormatDateOptions {
  locale?: string;
  timeZone?: string;
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  hour12?: boolean;
  fallback?: string;
}

export const formatDate = (
  date?: Date | string | null,
  options: FormatDateOptions = {},
): string => {
  const {
    locale = "en-BD",
    timeZone = "Asia/Dhaka",
    year = "numeric",
    month = "short",
    day = "2-digit", 
    hour,
    minute,
    hour12 = true,
    fallback = "N/A",
  } = options;

  if (!date) return fallback;

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  const datePart = new Intl.DateTimeFormat(locale, {
    timeZone,
    year,
    month,
    day,
  }).format(parsedDate);

  if (!hour && !minute) return datePart;

  const timePart = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: hour ?? "2-digit",
    minute: minute ?? "2-digit",
    hour12,
  })
    .format(parsedDate)
    .replace(/[\u202f\u00a0]/g, " ") 
    .replace(/\b(am|pm)\b/i, (m) => m.toUpperCase()); 

  return `${datePart}, ${timePart}`;
};
