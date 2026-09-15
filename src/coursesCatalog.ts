/** Marketplace courses + Arab country scope (prototype demo data). */

export type CountryId =
  | "eg"
  | "sa"
  | "ae"
  | "jo"
  | "kw"
  | "qa"
  | "bh"
  | "om"
  | "lb"
  | "iq"
  | "ma"
  | "tn"
  | "dz"
  | "sd"

export type ArabCountry = {
  id: CountryId
  name: string
  nameEn: string
  currency: string
  flag: string
}

export const ARAB_COUNTRIES: ArabCountry[] = [
  { id: "eg", name: "مصر", nameEn: "Egypt", currency: "ج.م", flag: "🇪🇬" },
  { id: "sa", name: "السعودية", nameEn: "Saudi Arabia", currency: "ر.س", flag: "🇸🇦" },
  { id: "ae", name: "الإمارات", nameEn: "UAE", currency: "د.إ", flag: "🇦🇪" },
  { id: "jo", name: "الأردن", nameEn: "Jordan", currency: "د.أ", flag: "🇯🇴" },
  { id: "kw", name: "الكويت", nameEn: "Kuwait", currency: "د.ك", flag: "🇰🇼" },
  { id: "qa", name: "قطر", nameEn: "Qatar", currency: "ر.ق", flag: "🇶🇦" },
  { id: "bh", name: "البحرين", nameEn: "Bahrain", currency: "د.ب", flag: "🇧🇭" },
  { id: "om", name: "عُمان", nameEn: "Oman", currency: "ر.ع", flag: "🇴🇲" },
  { id: "lb", name: "لبنان", nameEn: "Lebanon", currency: "ل.ل", flag: "🇱🇧" },
  { id: "iq", name: "العراق", nameEn: "Iraq", currency: "د.ع", flag: "🇮🇶" },
  { id: "ma", name: "المغرب", nameEn: "Morocco", currency: "د.م", flag: "🇲🇦" },
  { id: "tn", name: "تونس", nameEn: "Tunisia", currency: "د.ت", flag: "🇹🇳" },
  { id: "dz", name: "الجزائر", nameEn: "Algeria", currency: "د.ج", flag: "🇩🇿" },
  { id: "sd", name: "السودان", nameEn: "Sudan", currency: "ج.س", flag: "🇸🇩" },
]

export const DEFAULT_COUNTRY: CountryId = "eg"

export function countryById(id: CountryId) {
  return ARAB_COUNTRIES.find((c) => c.id === id) ?? ARAB_COUNTRIES[0]
}

export type CourseLesson = {
  id: string
  title: string
  duration: string
  done?: boolean
}

export type CourseLive = {
  id: string
  title: string
  when: string
}

export type MarketCourse = {
  id: string
  title: string
  trainer: string
  countryId: CountryId
  universityHint?: string
  facultyHint?: string
  level: string
  price: number
  students: number
  rating: number
  lessons: CourseLesson[]
  lives: CourseLive[]
  desc: string
  tags: string[]
  published: boolean
  owner?: "me" | "market"
}

export const DEMO_COURSES: MarketCourse[] = [
  {
    id: "c-ds-eg",
    title: "Data Structures من الصفر للامتحان",
    trainer: "أ/ محمد حسن",
    countryId: "eg",
    universityHint: "جامعة القاهرة · حاسبات",
    facultyHint: "علوم حاسب",
    level: "فرقة ثانية",
    price: 899,
    students: 1240,
    rating: 4.8,
    desc: "دروس مسجّلة + جلسات مراجعة Live قبل الميدترم والفاينال.",
    tags: ["CS", "جامعة", "مسجّل", "Live"],
    published: true,
    owner: "market",
    lessons: [
      { id: "l1", title: "Arrays & Linked Lists", duration: "28 د" },
      { id: "l2", title: "Stacks & Queues", duration: "32 د" },
      { id: "l3", title: "Trees & Graphs", duration: "41 د" },
      { id: "l4", title: "Complexity & Exam Tips", duration: "22 د" },
    ],
    lives: [
      { id: "lv1", title: "مراجعة Midterm", when: "السبت · 8 م" },
      { id: "lv2", title: "حل Sheets مباشرة", when: "الأربعاء · 7 م" },
    ],
  },
  {
    id: "c-calc-eg",
    title: "Calculus 2 — مراجعة نهائية",
    trainer: "أ/ سارة علي",
    countryId: "eg",
    universityHint: "هندسة · عدة جامعات",
    level: "فرقة ثانية",
    price: 650,
    students: 890,
    rating: 4.6,
    desc: "فيديوهات مركّزة + جلسة Live واحدة قبل الامتحان.",
    tags: ["هندسة", "مسجّل", "Live"],
    published: true,
    owner: "market",
    lessons: [
      { id: "l1", title: "Integrals Review", duration: "35 د" },
      { id: "l2", title: "Series", duration: "30 د" },
      { id: "l3", title: "Past Exams Walkthrough", duration: "45 د" },
    ],
    lives: [{ id: "lv1", title: "Final Live Session", when: "الخميس · 9 م" }],
  },
  {
    id: "c-med-sa",
    title: "Anatomy MCQ Bank — سنة أولى",
    trainer: "د/ نورة العتيبي",
    countryId: "sa",
    universityHint: "جامعات سعودية · طب",
    level: "سنة أولى",
    price: 299,
    students: 2100,
    rating: 4.9,
    desc: "بنك أسئلة مسجّل مع شرح + جلسة Live أسبوعية.",
    tags: ["طب", "MCQ", "مسجّل", "Live"],
    published: true,
    owner: "market",
    lessons: [
      { id: "l1", title: "Upper Limb", duration: "40 د" },
      { id: "l2", title: "Thorax", duration: "38 د" },
      { id: "l3", title: "Abdomen Essentials", duration: "42 د" },
    ],
    lives: [{ id: "lv1", title: "Weekly MCQ Live", when: "الجمعة · 6 م" }],
  },
  {
    id: "c-bus-ae",
    title: "Financial Accounting Crash",
    trainer: "أ/ خالد المنصوري",
    countryId: "ae",
    universityHint: "UAE universities · Business",
    level: "Year 1–2",
    price: 449,
    students: 560,
    rating: 4.5,
    desc: "كورس مسجّل عملي مع جلستين Live لحل مسائل.",
    tags: ["أعمال", "محاسبة", "مسجّل", "Live"],
    published: true,
    owner: "market",
    lessons: [
      { id: "l1", title: "Journal Entries", duration: "25 د" },
      { id: "l2", title: "Trial Balance", duration: "27 د" },
      { id: "l3", title: "Financial Statements", duration: "33 د" },
    ],
    lives: [
      { id: "lv1", title: "Problem Solving Live", when: "الثلاثاء · 8 م" },
      { id: "lv2", title: "Exam Prep Live", when: "الأحد · 7 م" },
    ],
  },
  {
    id: "c-jo-cs",
    title: "Algorithms للمقابلات والامتحانات",
    trainer: "أ/ رامي خليل",
    countryId: "jo",
    universityHint: "الجامعة الأردنية · حاسبات",
    level: "متقدم",
    price: 520,
    students: 340,
    rating: 4.7,
    desc: "مسجّل بالكامل مع جلسات Live اختيارية لحل مسائل.",
    tags: ["CS", "Algorithms", "مسجّل", "Live"],
    published: true,
    owner: "market",
    lessons: [
      { id: "l1", title: "Sorting & Searching", duration: "30 د" },
      { id: "l2", title: "DP Basics", duration: "36 د" },
      { id: "l3", title: "Graph Algorithms", duration: "40 د" },
    ],
    lives: [{ id: "lv1", title: "Live Problem Hour", when: "السبت · 5 م" }],
  },
]

export function filterCourses(
  courses: MarketCourse[],
  opts: {
    countryId?: CountryId
    q?: string
    enrolledIds?: string[]
    mineOnly?: boolean
    liveOnly?: boolean
    minRating?: number
    maxPrice?: number
    tag?: string
  },
) {
  const q = opts.q?.trim().toLowerCase() ?? ""
  const tag = opts.tag?.trim().toLowerCase()
  return courses.filter((c) => {
    if (opts.mineOnly && c.owner !== "me") return false
    if (opts.countryId && c.countryId !== opts.countryId) return false
    if (opts.liveOnly && (!c.lives.length || !c.tags.some((t) => /live/i.test(t)))) return false
    if (opts.minRating != null && c.rating < opts.minRating) return false
    if (opts.maxPrice != null && c.price > opts.maxPrice) return false
    if (tag && !c.tags.some((t) => t.toLowerCase().includes(tag))) return false
    if (!q) return true
    return (
      c.title.toLowerCase().includes(q) ||
      c.trainer.includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      (c.universityHint?.includes(q) ?? false)
    )
  })
}

export function emptyCourseDraft(countryId: CountryId): MarketCourse {
  return {
    id: `mine-${Date.now()}`,
    title: "",
    trainer: "أ/ محمد حسن",
    countryId,
    universityHint: "",
    level: "عام",
    price: 499,
    students: 0,
    rating: 5,
    desc: "",
    tags: ["مسجّل", "Live"],
    published: false,
    owner: "me",
    lessons: [
      { id: "nl1", title: "مقدمة الكورس", duration: "15 د" },
      { id: "nl2", title: "الدرس الأول", duration: "25 د" },
    ],
    lives: [{ id: "nlv1", title: "جلسة تعريفية Live", when: "يُحدد لاحقًا" }],
  }
}
