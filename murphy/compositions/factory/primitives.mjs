export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

// Original vector symbols; inherit the shared text/indicator color. No image assets.
export function symbol(kind) {
  const paths = {
    correct: "M5 12l4 4L19 6",
    incorrect: "M6 6l12 12M18 6L6 18",
    different: "M4 8h16M4 16h16",
    speaker: "M6 18v-3a6 6 0 0112 0v3M12 4a3 3 0 100 6 3 3 0 000-6",
  };
  return `<svg class="symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[kind]}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

export function markedText(text, phrases = []) {
  if (!phrases.length) return escapeHtml(text);
  const ranges = phrases
    .map((phrase) => ({
      start: text.indexOf(phrase),
      end: text.indexOf(phrase) + phrase.length,
    }))
    .sort((a, b) => a.start - b.start);
  let end = 0;
  let result = "";
  for (const range of ranges) {
    result +=
      escapeHtml(text.slice(end, range.start)) +
      `<strong class="text-emphasis">${escapeHtml(text.slice(range.start, range.end))}</strong>`;
    end = range.end;
  }
  return result + escapeHtml(text.slice(end));
}
