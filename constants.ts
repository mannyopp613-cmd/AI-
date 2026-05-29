import { ConceptStatus, Language } from './types.ts';

export const INITIAL_CONCEPTS = [
  { 
    id: 'atomic-structure', 
    name: 'מבנה האטום', 
    name_en: 'Atomic Structure',
    status: ConceptStatus.NOT_STARTED, 
    description: 'פרוטונים, נייטרונים, אלקטרונים וגרעין',
    description_en: 'Protons, neutrons, electrons, and nucleus'
  },
  { 
    id: 'chemical-vs-physical', 
    name: 'שינוי כימי מול פיזיקלי', 
    name_en: 'Chemical vs Physical Change',
    status: ConceptStatus.NOT_STARTED, 
    description: 'הבדלים בין תגובות כימיות לשינויי מצב צבירה',
    description_en: 'Differences between chemical reactions and phase changes'
  },
  { 
    id: 'mechanics-forces', 
    name: 'מכניקה וכוחות', 
    name_en: 'Mechanics and Forces',
    status: ConceptStatus.NOT_STARTED, 
    description: 'חוקי ניוטון, כוח המשיכה וחיכוך',
    description_en: 'Newton\'s laws, gravity, and friction'
  },
  { 
    id: 'energy-work', 
    name: 'אנרגיה ועבודה', 
    name_en: 'Energy and Work',
    status: ConceptStatus.NOT_STARTED, 
    description: 'אנרגיה קינטית, פוטנציאלית וחוק שימור האנרגיה',
    description_en: 'Kinetic, potential energy, and the law of conservation of energy'
  },
  { 
    id: 'electricity-magnetism', 
    name: 'חשמל ומגנטיות', 
    name_en: 'Electricity and Magnetism',
    status: ConceptStatus.NOT_STARTED, 
    description: 'מעגלים חשמליים, מטען וכוח מגנטי',
    description_en: 'Electric circuits, charge, and magnetic force'
  },
  { 
    id: 'periodic-table', 
    name: 'הטבלה המחזורית', 
    name_en: 'The Periodic Table',
    status: ConceptStatus.NOT_STARTED, 
    description: 'משפחות כימיות, מתכות ואל-מתכות',
    description_en: 'Chemical families, metals, and non-metals'
  },
  { 
    id: 'optics-waves', 
    name: 'אופטיקה וגלים', 
    name_en: 'Optics and Waves',
    status: ConceptStatus.NOT_STARTED, 
    description: 'החזרה, שבירת אור וספקטרום אלקטרומגנטי',
    description_en: 'Reflection, refraction, and the electromagnetic spectrum'
  },
];

export const UI_STRINGS = {
  [Language.HEBREW]: {
    welcome: 'ברוכים הבאים ל-IM Agent',
    description: 'אני סוכן הבינה המלאכותית שלך ללימודי מדעים - כימיה ופיזיקה. אני כאן כדי לעזור לך לחקור, להבין וללמוד בדרך שמתאימה לך ביותר. מה נלמד היום?',
    start_learning: 'התחל ללמוד עכשיו',
    view_achievements: 'צפה בהישגים שלי',
    virtual_labs: 'ניסויים וירטואליים',
    virtual_labs_desc: 'במהלך הלמידה נבצע ניסויים מחשבתיים ווירטואליים שיעזרו לך לראות את המדע בעיניים.',
    knowledge_map: 'מפת מושגים אדפטיבית',
    knowledge_map_desc: 'המערכת מנתחת את הידע שלך בזמן אמת וממפה את המושגים שכבר כבשת ואלו שדורשים חיזוק.',
    personal_agent: 'סוכן אישי מלווה',
    personal_agent_desc: 'אני לומד את הרגלי הלמידה שלך (הסברים טקסטואליים מול ויזואליים) ומתאים את עצמי אליך.',
    mission_center: 'מרכז משימה',
    autonomous_control: 'בקרת משימה אוטונומית',
    hi: 'היי!',
    intro: 'אני IM Agent, הסוכן האישי שלך לכימיה ופיזיקה. מה תרצה לחקור היום? 👋',
    image_labels: 'הנה המחשה ויזואלית שייצרתי עבורך הכוללת תוויות מפורטות:',
    image_clear: 'האם התוויות ברורות? אם יש משהו לא מובן בטקסט שעל התמונה, אני כאן להסביר.',
    error_comm: 'חלה שגיאה בתקשורת עם ה-AI:',
    try_again: 'אנא נסה שוב בעוד רגע.',
    learning_style_wait: 'ממתין לאבחון...',
    creators_info: 'אותי יצרו אימרי זיו מובשוביץ ומני אופנהיים מישיבת תורה ומדע, יחד עם נחמיה שטיינברג.',
    switch_to: 'English',
    language_label: 'עברית',
    level: 'רמה',
    exp: 'XP',
    exp_next: 'לרמה הבאה',
    achievements: 'הישגים מדעיים',
    no_badges: 'עדיין אין תגים. המשך ללמוד כדי לזכות בהם!',
    new_badge: 'תג חדש הושג!',
    level_up: 'עלית רמה!'
  },
  [Language.ENGLISH]: {
    welcome: 'Welcome to IM Agent',
    description: 'I am your AI Science Mentor - Chemistry and Physics. I am here to help you explore, understand, and learn in the way that suits you best. What shall we learn today?',
    start_learning: 'Start Learning Now',
    view_achievements: 'View My Achievements',
    virtual_labs: 'Virtual Experiments',
    virtual_labs_desc: 'During our learning, we will perform thought and virtual experiments to help you visualize science.',
    knowledge_map: 'Adaptive Concept Map',
    knowledge_map_desc: 'The system analyzes your knowledge in real-time and maps concepts you\'ve mastered and those needing reinforcement.',
    personal_agent: 'Personal Accompanying Agent',
    personal_agent_desc: 'I learn your learning habits (textual vs. visual explanations) and adapt precisely to you.',
    mission_center: 'Mission Center',
    autonomous_control: 'Autonomous Mission Control',
    hi: 'Hi!',
    intro: 'I\'m IM Agent, your personal mentor for Chemistry and Physics. What would you like to explore today? 👋',
    image_labels: 'Here is a visual illustration I created for you with detailed labels:',
    image_clear: 'Are the labels clear? If anything is unclear in the text on the image, I\'m here to explain.',
    error_comm: 'An error occurred during communication with the AI:',
    try_again: 'Please try again in a moment.',
    learning_style_wait: 'Waiting for diagnosis...',
    creators_info: 'I was created by Imry Ziv Movshovitz and Manny Oppenheim from Torah and Science Yeshiva, along with Nehemiah Steinberg.',
    switch_to: 'עברית',
    language_label: 'English',
    level: 'Level',
    exp: 'XP',
    exp_next: 'Next Level',
    achievements: 'Scientific Achievements',
    no_badges: 'No badges yet. Keep studying to earn them!',
    new_badge: 'New Badge Earned!',
    level_up: 'Level Up!'
  }
};

export const LEVELS = [
  { level: 1, title: { [Language.HEBREW]: 'סטודנט מתחיל', [Language.ENGLISH]: 'Novice Student' }, minExp: 0 },
  { level: 2, title: { [Language.HEBREW]: 'חוקר זוטר', [Language.ENGLISH]: 'Junior Researcher' }, minExp: 100 },
  { level: 3, title: { [Language.HEBREW]: 'מדען מעבדה', [Language.ENGLISH]: 'Lab Scientist' }, minExp: 300 },
  { level: 4, title: { [Language.HEBREW]: 'חוקר בכיר', [Language.ENGLISH]: 'Senior Researcher' }, minExp: 700 },
  { level: 5, title: { [Language.HEBREW]: 'פרופסור', [Language.ENGLISH]: 'Professor' }, minExp: 1500 },
  { level: 6, title: { [Language.HEBREW]: 'מאסטר המדעים', [Language.ENGLISH]: 'Master of Science' }, minExp: 3000 },
];

export const BADGE_DEFINITIONS = [
  {
    id: 'test-tube-explorer',
    icon: 'fa-vial',
    color: 'text-sky-400',
    title: { [Language.HEBREW]: 'חוקר מבחנות', [Language.ENGLISH]: 'Test Tube Explorer' },
    description: { [Language.HEBREW]: 'שמרת את הניסוי הראשון שלך במעבדה.', [Language.ENGLISH]: 'Saved your first experiment to the lab.' },
  },
  {
    id: 'newton-master',
    icon: 'fa-apple-whole',
    color: 'text-red-400',
    title: { [Language.HEBREW]: 'מאסטר ניוטון', [Language.ENGLISH]: 'Newton Master' },
    description: { [Language.HEBREW]: 'הפגנת שליטה בחוקי התנועה של ניוטון.', [Language.ENGLISH]: 'Demonstrated mastery of Newton\'s laws of motion.' },
  },
  {
    id: 'quantum-wizard',
    icon: 'fa-wand-magic-sparkles',
    color: 'text-purple-400',
    title: { [Language.HEBREW]: 'אשף הקוונטים', [Language.ENGLISH]: 'Quantum Wizard' },
    description: { [Language.HEBREW]: 'חקרת לעומק את מבנה האטום והחלקיקים.', [Language.ENGLISH]: 'Explored deeply the structure of atoms and particles.' },
  },
  {
    id: 'curiosity-king',
    icon: 'fa-brain',
    color: 'text-amber-400',
    title: { [Language.HEBREW]: 'מלך הסקרנות', [Language.ENGLISH]: 'Curiosity King' },
    description: { [Language.HEBREW]: 'שאלת מעל 50 שאלות למערכת.', [Language.ENGLISH]: 'Asked over 50 questions to the system.' },
  },
];

export const getSystemPrompt = (language: Language) => `
אתה "IM Agent" - סוכן בינה מלאכותית מתקדם ללמידת מדעים (כימיה ופיזיקה).
המשימה שלך: לעזור למשתמש ללמוד מדעים בצורה המותאמת לו ביותר, תוך שימוש באלגוריתם "Insight" לניתוח הרגלים.

CURRENT LANGUAGE: ${language === Language.HEBREW ? 'Hebrew (עברית)' : 'English'}.
IMPORTANT: You MUST respond in ${language === Language.HEBREW ? 'HEBREW' : 'ENGLISH'}. All explanations, quizzes, and experiment descriptions must be in this language.

עקרונות פעולה:
1. שיתוף פעולה: אל תחליט לבד מה ללמד. שאל את המשתמש מה מעניין אותו או מה הוא רוצה לחקור במדעי הטבע.
2. התאמה אישית דינמית (Insight Algorithm): 
   נתח את "פרופיל התלמיד" (Student Profile) המצורף. 
   - אם המשתמש מעדיף פיזיקה, השתמש בדוגמאות מוחשיות של תנועה ואנרגיה.
   - אם הוא מעדיף כימיה, התמקד בתגובות ומבנים מולקולריים.
   - התאם את רמת המורכבות לפי רמת השליטה (Concept Status).
3. פרואקטיביות מתונה: הצע כיוונים חדשים (למשל: "רוצה לראות איך חוקי ניוטון קשורים למבנה האטום?") רק לאחר שהמשתמש הביע עניין.
4. אימות נתונים: השתמש בידע המדעי המדויק ביותר לספק מידע מדויק בכימיה ופיזיקה.

מידע על היוצרים (חשוב!):
- אם שואלים אותך מי יצר אותך, עליך לענות: "${UI_STRINGS[language].creators_info}"

חוקי ויזואליזציה:
- ייצר תרשימים מדעיים כשהם עוזרים להבנה או כשהמשתמש מבקש.
- חובה: ספק תמיד "מקרא ויזואלי" (Visual Legend) בטקסט בתוך ההודעה.

מנגנוני ליבה:
1. הקשבה ואבחון: הבן מה המשתמש רוצה ללמוד ומה רמת הידע שלו דרך שיחה פתוחה.
2. התאמה אדפטיבית: שנה את סגנון ההסבר שלך בהתאם למשוב ולנתוני השימוש (Habits) בזמן אמת.

חוקי אינטראקציה:
- היה מעודד, סבלני ומשתף פעולה.
- חובה: בסוף כל הודעה, כלול שורת "תיעוד סגנון למידה" בסוגריים מרובעים.
  Hebrew: [תיעוד סגנון למידה: <תיאור>]
  English: [Learning Style Record: <description>]
- חובה: השתמש רק בשפה ${language === Language.HEBREW ? 'העברית' : 'האנגלית'} עבור כל ערכי הפרופיל והאבחון.

מבנה ניסוי:
חובה: כשאתה מציע, מתאר או מבצע ניסוי וירטואלי, התחל את ההודעה בסימון המפורש [EXPERIMENT]. סימון זה קריטי להפעלת ממשק השמירה של המשתמש. 
ודא שהניסוי כולל שלבים ברורים (ציוד, מהלך, תוצאה צפויה).
בסוף ההודעה של הניסוי, הצע למשתמש ללחוץ על כפתור השמירה הכחול הגדול שיופיע בתחתית ההודעה כדי לשמור את הניסוי למעבדה שלו.

Hebrew Experiment structure:
[EXPERIMENT]
ציוד: ...
מהלך: ...
תוצאה צפויה: ...

English Experiment structure:
[EXPERIMENT]
Equipment: ...
Steps: ...
Expected Result: ...

מבנה חידון:
[QUIZ]: שאלה? | אופציה א | אופציה ב | אופציה ג
[QUIZ]: Question? | Option A | Option B | Option C
`;
