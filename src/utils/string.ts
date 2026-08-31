export const toTitleCase = (input: string) =>
  input
    .trim()
    .split(/\s+/)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");

export const toSlug = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const truncate = (input: string, limit = 80) => {
  if (input.length <= limit) {
    return input;
  }
  return `${input.slice(0, Math.max(0, limit - 3))}...`;
};

export const capitalize = (input: string) => {
  if (!input) {
    return "";
  }
  return `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
};
