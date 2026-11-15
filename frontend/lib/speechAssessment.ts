/**
 * Oral Reading Accuracy & Fluency Assessment Engine
 * Compares recognized speech tokens against target passage words in real time.
 */

export interface WordMatchStatus {
  word: string;
  cleanWord: string;
  status: 'pending' | 'matched' | 'missed';
}

export interface ReadingAssessmentResult {
  accuracy: number;            // 0 - 100%
  wordsPerMinute: number;      // WPM
  matchedCount: number;
  totalWords: number;
  durationSeconds: number;
  wordStatuses: WordMatchStatus[];
  missedWords: string[];
}

export function cleanToken(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’“”]/g, '')
    .trim();
}

/**
 * Calculates Levenshtein Distance for fuzzy pronunciation tolerance
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Determines if a spoken token matches a target word
 */
export function isWordMatch(spoken: string, target: string): boolean {
  const s = cleanToken(spoken);
  const t = cleanToken(target);
  if (!s || !t) return false;
  if (s === t) return true;
  // Handle plurals / singulars
  if (s + 's' === t || t + 's' === s) return true;
  if (s + 'ed' === t || t + 'ed' === s) return true;
  // Fuzzy match for minor phoneme recognition differences (distance <= 1 for longer words)
  if (t.length >= 5 && levenshtein(s, t) <= 1) return true;
  return false;
}

/**
 * Align spoken transcript against the list of target words
 */
export function evaluateReading(
  targetWords: string[],
  spokenText: string,
  durationSeconds: number = 1
): ReadingAssessmentResult {
  const cleanSpoken = spokenText
    .split(/\s+/)
    .map(cleanToken)
    .filter(Boolean);

  const wordStatuses: WordMatchStatus[] = targetWords.map((word) => ({
    word,
    cleanWord: cleanToken(word),
    status: 'pending',
  }));

  let targetPtr = 0;
  let matchedCount = 0;

  for (let sIdx = 0; sIdx < cleanSpoken.length && targetPtr < targetWords.length; sIdx++) {
    const spoken = cleanSpoken[sIdx];
    let foundIndex = -1;

    // Search ahead up to 4 words to accommodate small stutter or skipped word
    const searchWindow = Math.min(targetWords.length, targetPtr + 4);
    for (let tIdx = targetPtr; tIdx < searchWindow; tIdx++) {
      if (wordStatuses[tIdx].status === 'pending' && isWordMatch(spoken, wordStatuses[tIdx].cleanWord)) {
        foundIndex = tIdx;
        break;
      }
    }

    if (foundIndex !== -1) {
      // Mark any skipped words between targetPtr and foundIndex as missed
      for (let skip = targetPtr; skip < foundIndex; skip++) {
        if (wordStatuses[skip].status === 'pending') {
          wordStatuses[skip].status = 'missed';
        }
      }
      wordStatuses[foundIndex].status = 'matched';
      matchedCount++;
      targetPtr = foundIndex + 1;
    }
  }

  // Calculate Accuracy
  const total = targetWords.length || 1;
  // Progress ratio: words spoken vs total
  const rawAccuracy = Math.round((matchedCount / total) * 100);
  const accuracy = Math.min(100, Math.max(0, rawAccuracy));

  // Calculate Words Per Minute (WPM)
  const safeSeconds = Math.max(1, durationSeconds);
  const wpm = Math.round((matchedCount / safeSeconds) * 60);

  const missedWords = wordStatuses
    .filter((w) => w.status === 'missed')
    .map((w) => w.word);

  return {
    accuracy,
    wordsPerMinute: wpm,
    matchedCount,
    totalWords: total,
    durationSeconds: Math.round(safeSeconds),
    wordStatuses,
    missedWords,
  };
}
