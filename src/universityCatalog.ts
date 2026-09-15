/** Backend-shaped academic catalog (prototype demo data). UI should not hardcode hierarchy. */

import type { CountryId } from "./coursesCatalog"

export type FacultyKind = "medicine" | "engineering" | "cs" | "commerce" | "law" | "pharmacy" | "other"

export type UniCourse = {
  id: string
  name: string
  code?: string
  pct: number
  next?: string
}

export type UniProfile = {
  universityId: string
  universityName: string
  universityType: string
  facultyId: string
  facultyName: string
  facultyKind: FacultyKind
  facultyDesc: string
  department?: string
  year: string
  semester: string
  courses: UniCourse[]
  countryId?: CountryId
}

export type UniCatalog = {
  id: string
  name: string
  type: "حكومية" | "خاصة" | "أهلية" | "دولية" | "أخرى"
  countryId: CountryId
  faculties: {
    id: string
    name: string
    kind: FacultyKind
    desc: string
    departments?: string[]
    years: string[]
    semesters: string[]
    coursesByKey: Record<string, { id: string; name: string; code?: string }[]>
  }[]
}

export const UNI_CATALOG: UniCatalog[] = [
  {
    id: "cu",
    name: "جامعة القاهرة",
    type: "حكومية",
    countryId: "eg",
    faculties: [
      {
        id: "eng",
        name: "كلية الهندسة",
        kind: "engineering",
        desc: "هندسة مدني، كهرباء، ميكانيكا والمزيد",
        departments: ["مدني", "عمارة", "كهرباء", "اتصالات", "ميكانيكا", "ميكاترونكس", "حاسبات", "أخرى"],
        years: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة", "الفرقة الخامسة"],
        semesters: ["الترم الأول", "الترم الثاني", "Summer Term"],
        coursesByKey: {
          "اتصالات|الفرقة الثالثة|الترم الأول": [
            { id: "sig", name: "Signals & Systems", code: "ECE301" },
            { id: "em", name: "Electromagnetics", code: "ECE302" },
            { id: "math3", name: "رياضيات هندسية ٣", code: "MATH301" },
            { id: "comm1", name: "Communications I", code: "ECE310" },
            { id: "lab", name: "معمل اتصالات", code: "ECE311L" },
          ],
          "كهرباء|الفرقة الثانية|الترم الأول": [
            { id: "circ", name: "Electrical Circuits", code: "EE201" },
            { id: "math2", name: "رياضيات هندسية ٢", code: "MATH201" },
            { id: "phys", name: "فيزياء هندسية", code: "PHYS201" },
            { id: "draw", name: "الرسم الهندسي", code: "ENG105" },
          ],
        },
      },
      {
        id: "fci",
        name: "كلية الحاسبات والذكاء الاصطناعي",
        kind: "cs",
        desc: "برمجة، نظم معلومات، علوم حاسب وذكاء اصطناعي",
        departments: ["علوم حاسب", "نظم معلومات", "تكنولوجيا معلومات", "ذكاء اصطناعي", "أمن سيبراني", "Data Science", "أخرى"],
        years: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة"],
        semesters: ["الترم الأول", "الترم الثاني"],
        coursesByKey: {
          "علوم حاسب|الفرقة الثانية|الترم الأول": [
            { id: "ds", name: "Data Structures", code: "CS201" },
            { id: "db", name: "Database Systems", code: "CS220" },
            { id: "dm", name: "Discrete Mathematics", code: "CS210" },
            { id: "ca", name: "Computer Architecture", code: "CS230" },
            { id: "oop", name: "Object-Oriented Programming", code: "CS205" },
          ],
          "ذكاء اصطناعي|الفرقة الثالثة|الترم الأول": [
            { id: "ml", name: "Machine Learning", code: "AI301" },
            { id: "nlp", name: "معالجة اللغات الطبيعية", code: "AI320" },
            { id: "cv", name: "Computer Vision", code: "AI330" },
          ],
        },
      },
      {
        id: "med",
        name: "كلية الطب",
        kind: "medicine",
        desc: "المواد الطبية الأساسية والإكلينيكية",
        years: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة", "الفرقة الخامسة", "الفرقة السادسة"],
        semesters: ["الترم الأول", "الترم الثاني"],
        coursesByKey: {
          "|الفرقة الأولى|الترم الأول": [
            { id: "anat", name: "Anatomy", code: "MED101" },
            { id: "physio", name: "Physiology", code: "MED102" },
            { id: "histo", name: "Histology", code: "MED103" },
            { id: "biochem", name: "Biochemistry", code: "MED104" },
          ],
        },
      },
      {
        id: "com",
        name: "كلية التجارة",
        kind: "commerce",
        desc: "محاسبة، إدارة، اقتصاد ومالية",
        departments: ["محاسبة", "إدارة أعمال", "اقتصاد", "إحصاء", "Finance", "Marketing", "أخرى"],
        years: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة"],
        semesters: ["الترم الأول", "الترم الثاني"],
        coursesByKey: {
          "محاسبة|الفرقة الثانية|الترم الأول": [
            { id: "acc2", name: "محاسبة متوسطة", code: "ACC201" },
            { id: "fin1", name: "مبادئ المالية", code: "FIN201" },
            { id: "stat", name: "إحصاء تطبيقي", code: "STAT201" },
            { id: "eco", name: "اقتصاد جزئي", code: "ECO201" },
          ],
        },
      },
      {
        id: "law",
        name: "كلية الحقوق",
        kind: "law",
        desc: "القانون المدني والجنائي والدستوري",
        years: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة"],
        semesters: ["الترم الأول", "الترم الثاني"],
        coursesByKey: {
          "|الفرقة الثانية|الترم الأول": [
            { id: "civil", name: "القانون المدني", code: "LAW201" },
            { id: "crim", name: "القانون الجنائي", code: "LAW210" },
            { id: "const", name: "القانون الدستوري", code: "LAW220" },
          ],
        },
      },
      {
        id: "pharm",
        name: "كلية الصيدلة",
        kind: "pharmacy",
        desc: "صيدلة إكلينيكية وكيمياء دوائية",
        years: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة", "الفرقة الخامسة"],
        semesters: ["الترم الأول", "الترم الثاني"],
        coursesByKey: {
          "|الفرقة الثانية|الترم الأول": [
            { id: "phchem", name: "الكيمياء الصيدلية", code: "PHARM201" },
            { id: "pharmcog", name: "العقاقير", code: "PHARM210" },
            { id: "micro", name: "الميكروبيولوجيا", code: "PHARM220" },
          ],
        },
      },
    ],
  },
  {
    id: "asu",
    name: "جامعة عين شمس",
    type: "حكومية",
    countryId: "eg",
    faculties: [
      {
        id: "eng-asu",
        name: "كلية الهندسة",
        kind: "engineering",
        desc: "هندسة مدني، كهرباء، ميكانيكا والمزيد",
        departments: ["مدني", "كهرباء", "ميكانيكا", "حاسبات", "أخرى"],
        years: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة", "الفرقة الخامسة"],
        semesters: ["الترم الأول", "الترم الثاني"],
        coursesByKey: {
          "حاسبات|الفرقة الثانية|الترم الأول": [
            { id: "prog2", name: "Programming II", code: "CSE201" },
            { id: "ds2", name: "Data Structures", code: "CSE220" },
            { id: "logic", name: "Digital Logic", code: "CSE210" },
          ],
        },
      },
      {
        id: "med-asu",
        name: "كلية الطب",
        kind: "medicine",
        desc: "المواد الطبية الأساسية والإكلينيكية",
        years: ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة", "الفرقة الخامسة", "الفرقة السادسة"],
        semesters: ["الترم الأول", "الترم الثاني"],
        coursesByKey: {
          "|الفرقة الأولى|الترم الأول": [
            { id: "anat", name: "Anatomy", code: "MED101" },
            { id: "physio", name: "Physiology", code: "MED102" },
            { id: "histo", name: "Histology", code: "MED103" },
          ],
        },
      },
    ],
  },
  {
    id: "guc",
    name: "الجامعة الألمانية بالقاهرة",
    type: "خاصة",
    countryId: "eg",
    faculties: [
      {
        id: "guc-eng",
        name: "Engineering",
        kind: "engineering",
        desc: "برامج هندسية بنظام الساعات المعتمدة",
        departments: ["Mechatronics", "Electronics", "Civil", "أخرى"],
        years: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
        semesters: ["Fall", "Spring", "Summer"],
        coursesByKey: {
          "Mechatronics|Year 2|Fall": [
            { id: "calc2", name: "Calculus II", code: "MATH202" },
            { id: "mech", name: "Mechanics", code: "MECH201" },
            { id: "circ", name: "Circuits", code: "EEE201" },
          ],
        },
      },
      {
        id: "guc-cs",
        name: "Media Engineering & Technology",
        kind: "cs",
        desc: "برمجة، وسائط، وعلوم حاسب",
        departments: ["CS", "DMET", "أخرى"],
        years: ["Year 1", "Year 2", "Year 3", "Year 4"],
        semesters: ["Fall", "Spring"],
        coursesByKey: {
          "CS|Year 2|Fall": [
            { id: "ds", name: "Data Structures", code: "CSEN202" },
            { id: "db", name: "Databases", code: "CSEN301" },
          ],
        },
      },
    ],
  },
  {
    id: "auc",
    name: "الجامعة الأمريكية بالقاهرة",
    type: "خاصة",
    countryId: "eg",
    faculties: [
      {
        id: "auc-bus",
        name: "School of Business",
        kind: "commerce",
        desc: "إدارة أعمال، مالية، ومحاسبة",
        departments: ["Finance", "Marketing", "Accounting", "أخرى"],
        years: ["Freshman", "Sophomore", "Junior", "Senior"],
        semesters: ["Fall", "Spring", "Summer"],
        coursesByKey: {
          "Finance|Sophomore|Fall": [
            { id: "fin", name: "Corporate Finance", code: "FINC202" },
            { id: "acc", name: "Financial Accounting", code: "ACCT201" },
            { id: "stat", name: "Business Statistics", code: "STAT201" },
          ],
        },
      },
    ],
  },
  {
    id: "ksu",
    name: "جامعة الملك سعود",
    type: "حكومية",
    countryId: "sa",
    faculties: [
      {
        id: "ksu-cs",
        name: "كلية علوم الحاسب والمعلومات",
        kind: "cs",
        desc: "برمجة، نظم، وذكاء اصطناعي",
        departments: ["علوم حاسب", "نظم معلومات", "هندسة برمجيات", "أخرى"],
        years: ["المستوى الأول", "المستوى الثاني", "المستوى الثالث", "المستوى الرابع"],
        semesters: ["الفصل الأول", "الفصل الثاني"],
        coursesByKey: {
          "علوم حاسب|المستوى الثاني|الفصل الأول": [
            { id: "ds", name: "هياكل البيانات", code: "CSC212" },
            { id: "oop", name: "برمجة كائنية", code: "CSC113" },
            { id: "disc", name: "رياضيات متقطعة", code: "MATH251" },
          ],
        },
      },
      {
        id: "ksu-med",
        name: "كلية الطب",
        kind: "medicine",
        desc: "المواد الطبية الأساسية",
        years: ["السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة", "السنة الخامسة", "السنة السادسة"],
        semesters: ["الفصل الأول", "الفصل الثاني"],
        coursesByKey: {
          "|السنة الأولى|الفصل الأول": [
            { id: "anat", name: "التشريح", code: "ANAT101" },
            { id: "physio", name: "وظائف الأعضاء", code: "PHYS101" },
          ],
        },
      },
    ],
  },
  {
    id: "kau",
    name: "جامعة الملك عبدالعزيز",
    type: "حكومية",
    countryId: "sa",
    faculties: [
      {
        id: "kau-eng",
        name: "كلية الهندسة",
        kind: "engineering",
        desc: "برامج هندسية متعددة",
        departments: ["كهرباء", "حاسبات", "مدني", "أخرى"],
        years: ["المستوى الأول", "المستوى الثاني", "المستوى الثالث", "المستوى الرابع"],
        semesters: ["الفصل الأول", "الفصل الثاني"],
        coursesByKey: {
          "حاسبات|المستوى الثاني|الفصل الأول": [
            { id: "circ", name: "دوائر كهربائية", code: "EE201" },
            { id: "prog", name: "برمجة ٢", code: "CPCS203" },
          ],
        },
      },
    ],
  },
  {
    id: "uaeu",
    name: "جامعة الإمارات",
    type: "حكومية",
    countryId: "ae",
    faculties: [
      {
        id: "uaeu-it",
        name: "كلية تقنية المعلومات",
        kind: "cs",
        desc: "علوم حاسب ونظم معلومات",
        departments: ["CS", "IS", "أخرى"],
        years: ["Year 1", "Year 2", "Year 3", "Year 4"],
        semesters: ["Fall", "Spring"],
        coursesByKey: {
          "CS|Year 2|Fall": [
            { id: "ds", name: "Data Structures", code: "CSBP219" },
            { id: "db", name: "Databases", code: "ITBP301" },
          ],
        },
      },
    ],
  },
  {
    id: "ju",
    name: "الجامعة الأردنية",
    type: "حكومية",
    countryId: "jo",
    faculties: [
      {
        id: "ju-it",
        name: "كلية الملك عبدالله لتكنولوجيا المعلومات",
        kind: "cs",
        desc: "علوم حاسب وهندسة برمجيات",
        departments: ["علوم حاسب", "هندسة برمجيات", "أخرى"],
        years: ["السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة"],
        semesters: ["الفصل الأول", "الفصل الثاني"],
        coursesByKey: {
          "علوم حاسب|السنة الثانية|الفصل الأول": [
            { id: "ds", name: "هياكل بيانات", code: "1901231" },
            { id: "algo", name: "خوارزميات", code: "1901233" },
          ],
        },
      },
    ],
  },
]

export function unisByCountry(countryId: CountryId) {
  return UNI_CATALOG.filter((u) => u.countryId === countryId)
}

export function courseKey(dept: string | undefined, year: string, sem: string) {
  return `${dept ?? ""}|${year}|${sem}`
}

export function resolveCourses(
  faculty: UniCatalog["faculties"][0],
  dept: string | undefined,
  year: string,
  sem: string,
) {
  const exact = faculty.coursesByKey[courseKey(dept, year, sem)]
  if (exact?.length) return exact
  const fallback = Object.entries(faculty.coursesByKey).find(([k]) => k.includes(year) || k.endsWith(`|${sem}`))
  return fallback?.[1] ?? []
}

export function facultyQuickActions(kind: FacultyKind): { label: string; sub: string }[] {
  switch (kind) {
    case "medicine":
      return [
        { label: "حل MCQ", sub: "بنك أسئلة" },
        { label: "Case Study", sub: "افهم الحالة" },
        { label: "المحاضرات", sub: "راجع مفهوم" },
        { label: "مراجعة", sub: "قبل الامتحان" },
      ]
    case "engineering":
      return [
        { label: "حل مسألة", sub: "Sheets" },
        { label: "اشرح القانون", sub: "مفهوم" },
        { label: "Labs", sub: "تقارير" },
        { label: "مشروع", sub: "متابعة" },
      ]
    case "cs":
      return [
        { label: "اشرحلي الكود", sub: "Concept" },
        { label: "فهم Error", sub: "Debug" },
        { label: "Algorithms", sub: "اختبرني" },
        { label: "Assignment", sub: "إرشاد" },
      ]
    case "commerce":
      return [
        { label: "مسألة محاسبة", sub: "حل معايا" },
        { label: "Concept", sub: "اشرح" },
        { label: "Quiz", sub: "سريع" },
        { label: "مراجعة", sub: "امتحان" },
      ]
    case "law":
      return [
        { label: "مفهوم قانوني", sub: "اشرح" },
        { label: "لخص محاضرة", sub: "Notes" },
        { label: "اختبرني", sub: "Quiz" },
        { label: "قارن مفهومين", sub: "تحليل" },
      ]
    case "pharmacy":
      return [
        { label: "Concept", sub: "علمي" },
        { label: "محاضرة", sub: "مراجعة" },
        { label: "MCQ", sub: "أسئلة" },
        { label: "تحليل ملف", sub: "PDF" },
      ]
    default:
      return [
        { label: "اشرح", sub: "Concept" },
        { label: "لخص", sub: "محاضرة" },
        { label: "اختبرني", sub: "Quiz" },
        { label: "خطة مذاكرة", sub: "AI" },
      ]
  }
}

export function facultyAiBlurb(kind: FacultyKind): { title: string; text: string; note?: string } {
  switch (kind) {
    case "medicine":
      return {
        title: "Medical AI Tutor ✨",
        text: "راجع Concept، افهم Case أو اختبر نفسك في MCQ.",
        note: "المخرجات مساعدة تعليمية وليست بديلاً عن الحكم الطبي المهني.",
      }
    case "engineering":
      return { title: "Engineering AI ✨", text: "حل مسألة معايا، اشرح قانون، راجع Sheet أو جهّزك للامتحان." }
    case "cs":
      return {
        title: "CS AI Tutor ✨",
        text: "اشرح Concept، ساعد في فهم Error، اختبر Algorithms — بدون حل الواجب نيابة عنك.",
      }
    case "commerce":
      return { title: "Business AI ✨", text: "مسائل محاسبة، شرح Concept، Quiz ومراجعة قبل الامتحان." }
    case "law":
      return { title: "Legal AI Tutor ✨", text: "اشرح مفهوم قانوني، لخّص محاضرة، أو قارن بين مفهومين." }
    case "pharmacy":
      return { title: "Science AI ✨", text: "شرح علمي، مراجعة محاضرة، MCQ وتحليل ملفات." }
    default:
      return { title: "المعلم الذكي الجامعي ✨", text: "اشرح، لخّص، اختبرني، وراجع ملفاتك حسب موادك." }
  }
}

export function withProgress(courses: { id: string; name: string; code?: string }[]): UniCourse[] {
  const seeds = [74, 62, 81, 55, 68, 45, 70]
  const nexts = [
    "Quiz بعد 3 أيام",
    "تسليم Assignment غداً",
    "محاضرة الخميس",
    "Lab الأسبوع الجاي",
    "امتحان بعد 8 أيام",
  ]
  return courses.map((c, i) => ({
    ...c,
    pct: seeds[i % seeds.length],
    next: nexts[i % nexts.length],
  }))
}
