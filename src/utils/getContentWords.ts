export const getContentWords = (content: string) => {
  return content
    .trim()
    .split(/\s+/)
    .filter((row) => row.trim() !== "<p></p>").length;
};
