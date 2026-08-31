export const formatDate = (value: string | number | Date, locale = "en-GB") =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(value));

export const formatDateTime = (value: string | number | Date, locale = "en-GB") =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const isValidDate = (value: string | number | Date) => !Number.isNaN(new Date(value).getTime());

export const addMinutes = (value: string | number | Date, minutes: number) => {
  const date = new Date(value);
  return new Date(date.getTime() + minutes * 60 * 1000);
};
