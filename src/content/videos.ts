import { SECTION_ORDER_DATA, SECTION_VIDEO_DATA, VIDEO_DATA } from './videos.gen';

/** A teaching video for a skill, from Alberta Math 20-1 / 30-1 teachers where possible. Ids are checked against YouTube. */
export interface LessonVideo {
  id: string;
  title: string;
  channel: string;
  /** Start time in seconds, when the skill is one part of a longer lesson. */
  start?: number;
  course: 'Math 30-1' | 'Math 20-1' | 'other';
}

export const VIDEOS: Record<string, LessonVideo> = VIDEO_DATA;

/** The teacher's videos for each textbook section, in order (part 1, part 2, ...). */
export const SECTION_VIDEOS: Record<string, { id: string; title: string }[]> = SECTION_VIDEO_DATA;

/** The order the teacher's video covers each section's skills. */
export const SECTION_ORDER: Record<string, string[]> = SECTION_ORDER_DATA;
