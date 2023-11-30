export const cleanHtml = (contentHtml: string): string => {
  // Remove consecutive `<div><br></div>` tags and trim leading/trailing whitespac
  const cleanedHtml = contentHtml
    .replace(/(<div><br><\/div>\s*)+/g, "<div><br></div>")
    .trim();

  return cleanedHtml;
};
