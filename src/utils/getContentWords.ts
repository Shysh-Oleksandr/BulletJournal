export const getContentWords = (content: string) => {
  if (content.trim().length === 0) return 0;

  return content
    .trim()
    .split(/\s+/)
    .filter((row) => row.trim() !== "<p></p>").length;
};
