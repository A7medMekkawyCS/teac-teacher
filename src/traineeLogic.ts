/** Trainee (متدرّب) enrollment / progress / live — pure prototype logic. */

import type { MarketCourse } from "./coursesCatalog"

export type LiveAttendStatus = "upcoming" | "attended" | "missed"

export type LiveRating = {
  stars: number
  note: string
}

export type CourseEnrollment = {
  courseId: string
  enrolledAt: string
  completedLessonIds: string[]
  liveAttendance: Record<string, LiveAttendStatus>
  liveRatings: Record<string, LiveRating>
}

export type CourseReview = {
  id: string
  name: string
  stars: number
  text: string
  when: string
}

/** Demo reviews keyed by course id (prototype). */
export const DEMO_COURSE_REVIEWS: Record<string, CourseReview[]> = {
  "c-ds-eg": [
    { id: "r1", name: "يوسف", stars: 5, text: "الـ Live قبل الميدترم فرّقت معايا جدًا.", when: "منذ أسبوع" },
    { id: "r2", name: "مريم", stars: 4, text: "الدروس مرتّبة والشرح واضح.", when: "منذ ٣ أيام" },
  ],
  "c-calc-eg": [
    { id: "r1", name: "كريم", stars: 5, text: "مراجعة الفاينال ممتازة.", when: "منذ يومين" },
  ],
  "c-med-sa": [
    { id: "r1", name: "نورة", stars: 5, text: "بنك الأسئلة مفيد جدًا.", when: "منذ ٥ أيام" },
  ],
}

export function reviewsFor(courseId: string): CourseReview[] {
  return DEMO_COURSE_REVIEWS[courseId] ?? [
    { id: "d1", name: "متدرّب", stars: 5, text: "كورس عملي ومفيد.", when: "حديثًا" },
  ]
}

export function progressPct(enrollment: CourseEnrollment | undefined, course: MarketCourse | null | undefined): number {
  if (!enrollment || !course || !course.lessons.length) return 0
  const done = enrollment.completedLessonIds.filter((id) => course.lessons.some((l) => l.id === id)).length
  const liveBonus = Object.values(enrollment.liveAttendance).filter((s) => s === "attended").length
  const raw = (done + liveBonus * 0.25) / course.lessons.length
  return Math.min(100, Math.round(raw * 100))
}

export function certificateUnlocked(enrollment: CourseEnrollment | undefined, course: MarketCourse | null | undefined): boolean {
  return progressPct(enrollment, course) >= 80
}

export function makeEnrollment(course: MarketCourse): CourseEnrollment {
  const liveAttendance: Record<string, LiveAttendStatus> = {}
  for (const lv of course.lives) liveAttendance[lv.id] = "upcoming"
  return {
    courseId: course.id,
    enrolledAt: "اليوم",
    completedLessonIds: [],
    liveAttendance,
    liveRatings: {},
  }
}

export function completeLesson(enrollment: CourseEnrollment, lessonId: string): CourseEnrollment {
  if (enrollment.completedLessonIds.includes(lessonId)) return enrollment
  return {
    ...enrollment,
    completedLessonIds: [...enrollment.completedLessonIds, lessonId],
  }
}

export function setLiveStatus(
  enrollment: CourseEnrollment,
  liveId: string,
  status: LiveAttendStatus,
): CourseEnrollment {
  return {
    ...enrollment,
    liveAttendance: { ...enrollment.liveAttendance, [liveId]: status },
  }
}

export function rateLive(
  enrollment: CourseEnrollment,
  liveId: string,
  stars: number,
  note: string,
): CourseEnrollment {
  return {
    ...enrollment,
    liveRatings: { ...enrollment.liveRatings, [liveId]: { stars, note } },
    liveAttendance: { ...enrollment.liveAttendance, [liveId]: "attended" },
  }
}

export type TraineeLiveRow = {
  courseId: string
  courseTitle: string
  liveId: string
  title: string
  when: string
  status: LiveAttendStatus
  bucket: "upcoming" | "today" | "past"
}

/** Heuristic buckets from demo `when` strings. */
export function buildTraineeLives(
  courses: MarketCourse[],
  enrollments: CourseEnrollment[],
): TraineeLiveRow[] {
  const enrolled = new Set(enrollments.map((e) => e.courseId))
  const rows: TraineeLiveRow[] = []
  for (const c of courses) {
    if (!enrolled.has(c.id)) continue
    const en = enrollments.find((e) => e.courseId === c.id)!
    for (const lv of c.lives) {
      const status = en.liveAttendance[lv.id] ?? "upcoming"
      const when = lv.when
      let bucket: TraineeLiveRow["bucket"] = "upcoming"
      if (status === "attended" || status === "missed") bucket = "past"
      else if (/اليوم|النهاردة/i.test(when)) bucket = "today"
      else if (/أمس|فاتت|سابقة/i.test(when)) bucket = "past"
      rows.push({
        courseId: c.id,
        courseTitle: c.title,
        liveId: lv.id,
        title: lv.title,
        when,
        status,
        bucket,
      })
    }
  }
  return rows
}

export function canAfford(balance: number, price: number) {
  return balance >= price
}
