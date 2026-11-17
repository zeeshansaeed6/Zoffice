/* global zoffice */

/**
 * Word Frequency Counter Plugin for ZWriter.
 * Computes frequency distribution, vocabulary metrics, and estimated reading time.
 */

function countWords(text) {
  if (!text) return { total: 0, unique: 0, readingTimeMinutes: 0, topWords: [] }

  // Strip HTML tags if HTML is passed
  const plainText = text.replace(/<[^>]*>/g, ' ')
  const words = plainText
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1)

  const counts = new Map()
  for (const word of words) {
    counts.set(word, (counts.get(word) || 0) + 1)
  }

  const sorted = Array.from(counts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)

  const readingTime = Math.ceil(words.length / 200)

  return {
    total: words.length,
    unique: counts.size,
    readingTimeMinutes: readingTime,
    topWords: sorted.slice(0, 10),
  }
}

module.exports = {
  analyzeText: countWords,

  openStats: function (_context) {
    const content = zoffice.document.getContent()
    const stats = countWords(content)
    const topSummary = stats.topWords.map((item) => `${item.word}: ${item.count}`).join(', ')
    zoffice.ui.showToast(
      `Document Analysis: ${stats.total} words (${stats.unique} unique). Est. read time: ${stats.readingTimeMinutes} min. Top words: ${topSummary || 'None'}`,
    )
    return stats
  },

  renderSidebar: function (_context) {
    const content = zoffice.document.getContent()
    const stats = countWords(content)
    return {
      type: 'panel',
      title: 'Word Frequency & Stats',
      metrics: [
        { label: 'Total Words', value: stats.total },
        { label: 'Unique Words', value: stats.unique },
        { label: 'Est. Reading Time', value: `${stats.readingTimeMinutes} min` },
      ],
      topWords: stats.topWords,
    }
  },
}
