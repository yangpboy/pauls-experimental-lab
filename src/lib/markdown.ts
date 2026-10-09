export const markdownToPlainText = (value: string) => value
  .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[`*_~>#|]/g, '')
  .replace(/^\s*[-+]\s+/gm, '')
  .replace(/^\s*\d+\.\s+/gm, '')
  .replace(/\s+/g, ' ')
  .trim();
