// Progress tracking utility — uses localStorage for client-side persistence
// Tracks: topic completion, mock test scores, study streaks, bookmarks

export interface TopicProgress {
  examSlug: string;
  topicId: string;
  completed: boolean;
  completedAt: string | null;
}

export interface MockTestResult {
  id: string;
  examSlug: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  attemptedQuestions: number;
  timeTaken: number; // seconds
  date: string;
  weakTopics: string[];
}

export interface ProgressData {
  topics: TopicProgress[];
  mockTests: MockTestResult[];
  bookmarks: string[]; // exam slugs
  favoriteTopics: string[]; // "examSlug:topicId"
  studyStreak: { lastStudyDate: string; currentStreak: number; longestStreak: number };
}

const STORAGE_KEY = 'sv-exam-progress';

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch {
    // ignore
  }
  return {
    topics: [],
    mockTests: [],
    bookmarks: [],
    favoriteTopics: [],
    studyStreak: { lastStudyDate: '', currentStreak: 0, longestStreak: 0 },
  };
}

function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getProgress(): ProgressData {
  return loadProgress();
}

export function toggleTopicComplete(examSlug: string, topicId: string): ProgressData {
  const data = loadProgress();
  const existing = data.topics.find(t => t.examSlug === examSlug && t.topicId === topicId);
  if (existing) {
    existing.completed = !existing.completed;
    existing.completedAt = existing.completed ? new Date().toISOString() : null;
  } else {
    data.topics.push({ examSlug, topicId, completed: true, completedAt: new Date().toISOString() });
  }
  // Update streak
  updateStreak(data);
  saveProgress(data);
  return data;
}

export function isTopicComplete(examSlug: string, topicId: string): boolean {
  const data = loadProgress();
  return data.topics.some(t => t.examSlug === examSlug && t.topicId === topicId && t.completed);
}

export function getExamProgress(examSlug: string): { completed: number; total: number; percent: number } {
  const data = loadProgress();
  const examTopics = data.topics.filter(t => t.examSlug === examSlug);
  const completed = examTopics.filter(t => t.completed).length;
  return { completed, total: 0, percent: 0 }; // total/percent calculated by caller who knows the exam
}

export function addMockTestResult(result: Omit<MockTestResult, 'id' | 'date'>): ProgressData {
  const data = loadProgress();
  data.mockTests.push({
    ...result,
    id: `mt-${Date.now()}`,
    date: new Date().toISOString(),
  });
  updateStreak(data);
  saveProgress(data);
  return data;
}

export function toggleBookmark(examSlug: string): ProgressData {
  const data = loadProgress();
  if (data.bookmarks.includes(examSlug)) {
    data.bookmarks = data.bookmarks.filter(s => s !== examSlug);
  } else {
    data.bookmarks.push(examSlug);
  }
  saveProgress(data);
  return data;
}

export function isBookmarked(examSlug: string): boolean {
  return loadProgress().bookmarks.includes(examSlug);
}

export function toggleFavoriteTopic(examSlug: string, topicId: string): ProgressData {
  const data = loadProgress();
  const key = `${examSlug}:${topicId}`;
  if (data.favoriteTopics.includes(key)) {
    data.favoriteTopics = data.favoriteTopics.filter(k => k !== key);
  } else {
    data.favoriteTopics.push(key);
  }
  saveProgress(data);
  return data;
}

export function isFavoriteTopic(examSlug: string, topicId: string): boolean {
  return loadProgress().favoriteTopics.includes(`${examSlug}:${topicId}`);
}

function updateStreak(data: ProgressData) {
  const today = new Date().toDateString();
  const last = data.studyStreak.lastStudyDate;
  if (last === today) return; // already studied today

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (last === yesterday) {
    data.studyStreak.currentStreak += 1;
  } else {
    data.studyStreak.currentStreak = 1;
  }
  data.studyStreak.lastStudyDate = today;
  if (data.studyStreak.currentStreak > data.studyStreak.longestStreak) {
    data.studyStreak.longestStreak = data.studyStreak.currentStreak;
  }
}

export function getStudyStreak(): { currentStreak: number; longestStreak: number } {
  return {
    currentStreak: loadProgress().studyStreak.currentStreak,
    longestStreak: loadProgress().studyStreak.longestStreak,
  };
}

export function getMockTestScores(examSlug?: string): MockTestResult[] {
  const data = loadProgress();
  if (examSlug) return data.mockTests.filter(m => m.examSlug === examSlug);
  return data.mockTests;
}

export function getAllCompletedTopics(examSlug: string): string[] {
  const data = loadProgress();
  return data.topics.filter(t => t.examSlug === examSlug && t.completed).map(t => t.topicId);
}

export function clearAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
