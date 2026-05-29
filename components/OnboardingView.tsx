import React, { useState } from 'react';
import { Language, StudentProfile, ChatMessage, UserAccount } from '../types.ts';
import { INITIAL_CONCEPTS } from '../constants.ts';
import { UN_COUNTRIES, getCountryByCode } from '../unCountries.ts';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingViewProps {
  onCompleteOnboarding: (userData: { username: string; passwordHash: string; name: string; grade: string; learningGoal: string; dailyGoal: string; language: Language; mascotId: string; countryCode: string }) => void;
  onRestoreUser: (account: UserAccount) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

// 4 scientific mascots
const MASCOTS = [
  {
    id: 'einstein',
    name: 'איינשטיין / Einstein',
    icon: 'fa-user-astronaut',
    bg: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    bubbleTexts: {
      [Language.HEBREW]: 'הכל יחסי, חוץ מהתשוקה שלך למדע! בוא נתחיל לחקור 🌌',
      [Language.ENGLISH]: 'Everything is relative, except your passion for science! Let\'s begin 🌌',
    }
  },
  {
    id: 'curie',
    name: 'מארי קירי / Marie Curie',
    icon: 'fa-vial-circle-check',
    bg: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    bubbleTexts: {
      [Language.HEBREW]: 'אין ממה לפחד בחיים, רק צריך להבין! מוכנה לגלות איתך עולמות חלקיקיים 🧪',
      [Language.ENGLISH]: 'Nothing in life is to be feared, it is only to be understood! Ready to explore atoms with you 🧪',
    }
  },
  {
    id: 'newton',
    name: 'אייזק ניוטון / Isaac Newton',
    icon: 'fa-apple-whole',
    bg: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
    bubbleTexts: {
      [Language.HEBREW]: 'כוח המשיכה פה חזק מאוד! בוא נפעיל כוחות על חוקי הפיזיקה 🍎',
      [Language.ENGLISH]: 'The attraction here is very strong! Let\'s master the physics of force 🍎',
    }
  },
  {
    id: 'faraday',
    name: 'מייקל פאראדיי / Michael Faraday',
    icon: 'fa-bolt',
    bg: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    bubbleTexts: {
      [Language.HEBREW]: 'חשמל זורם לנו בעורקים! בוא ניצור ניצוצות בלמידה ⚡',
      [Language.ENGLISH]: 'Electricity runs through our wires! Let\'s make sparks in our learning ⚡',
    }
  }
];

const OnboardingView: React.FC<OnboardingViewProps> = ({
  onCompleteOnboarding,
  onRestoreUser,
  language,
  onLanguageChange
}) => {
  const [isLoginView, setIsLoginView] = useState(false);
  const [step, setStep] = useState(1); // 1 to 8
  const [selectedMascot, setSelectedMascot] = useState('einstein');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState("ז'-ט'");
  const [learningGoal, setLearningGoal] = useState('both'); // chemistry, physics, both
  const [dailyGoal, setDailyGoal] = useState('regular'); // casual (5 xp), regular (15 xp), serious (30 xp), master (50 xp)
  const [selectedCountry, setSelectedCountry] = useState('IL');
  const [countrySearch, setCountrySearch] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const numOnboardingSteps = 7;

  // Local Accounts Helper
  const getStoredUsers = (): UserAccount[] => {
    const raw = localStorage.getItem('chemismart_users');
    return raw ? JSON.parse(raw) : [];
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim() || !name.trim()) {
      setErrorMessage(language === Language.HEBREW ? 'נא למלא את כל השדות!' : 'Please fill in all fields!');
      return;
    }

    if (username.length < 3) {
      setErrorMessage(language === Language.HEBREW ? 'שם המשתמש חייב להכיל לפחות 3 תווים.' : 'Username must be at least 3 characters.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage(language === Language.HEBREW ? 'הסיסמה חייבת להכיל לפחות 4 תווים.' : 'Password must be at least 4 characters.');
      return;
    }

    const users = getStoredUsers();
    const cleanUsername = username.trim().toLowerCase();

    if (users.some(u => u.username === cleanUsername)) {
      setErrorMessage(language === Language.HEBREW ? 'שם המשתמש הזה כבר תפוס, נסו שם אחר.' : 'Username is already taken, try another.');
      return;
    }

    // Complete Onboarding & create account
    onCompleteOnboarding({
      username: cleanUsername,
      passwordHash: password,
      name: name.trim(),
      grade,
      learningGoal,
      dailyGoal,
      language,
      mascotId: selectedMascot,
      countryCode: selectedCountry
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setErrorMessage(language === Language.HEBREW ? 'נא למלא שם משתמש וסיסמה!' : 'Please fill in username and password!');
      return;
    }

    const users = getStoredUsers();
    const cleanUsername = loginUsername.trim().toLowerCase();
    const matchedUser = users.find(u => u.username === cleanUsername && u.passwordHash === loginPassword);

    if (!matchedUser) {
      setErrorMessage(language === Language.HEBREW ? 'שם משתמש או סיסמה שגויים!' : 'Invalid username or password!');
      return;
    }

    onRestoreUser(matchedUser);
  };

  const currentMascot = MASCOTS.find(m => m.id === selectedMascot) || MASCOTS[0];

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] text-white flex flex-col items-center justify-center p-4 relative overflow-y-auto" dir={language === Language.HEBREW ? 'rtl' : 'ltr'}>
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Main container card */}
      <div className="w-full max-w-[650px] bg-[#13182b] border border-white/10 rounded-[3rem] shadow-4xl overflow-hidden backdrop-blur-2xl p-8 md:p-12 relative z-10 flex flex-col my-8">

        {/* Top Header Selector & Progressive Indicator */}
        {!isLoginView && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                {language === Language.HEBREW ? `שלב ${step} מתוך ${numOnboardingSteps}` : `Step ${step} of ${numOnboardingSteps}`}
              </span>
              
              {/* Language Switcher */}
              <button
                onClick={() => onLanguageChange(language === Language.HEBREW ? Language.ENGLISH : Language.HEBREW)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black transition-all border border-white/5 active:scale-95 flex items-center gap-2"
              >
                <i className="fas fa-globe text-indigo-400"></i>
                <span>{language === Language.HEBREW ? 'English' : 'עברית'}</span>
              </button>
            </div>

            {/* Duolingo Progress Bar */}
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${(step / numOnboardingSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {isLoginView && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black tracking-tight text-white">
              {language === Language.HEBREW ? 'התחברות לחשבון קיים' : 'Sign In To Your Account'}
            </h2>
            <button
              onClick={() => onLanguageChange(language === Language.HEBREW ? Language.ENGLISH : Language.HEBREW)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black transition-all border border-white/5 flex items-center gap-2"
            >
              <i className="fas fa-globe text-indigo-400"></i>
              <span>{language === Language.HEBREW ? 'English' : 'עברית'}</span>
            </button>
          </div>
        )}

        {/* Error notification bar */}
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-bold flex items-center gap-3"
          >
            <i className="fas fa-triangle-exclamation text-lg shrink-0 text-rose-400"></i>
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Main interactive views */}
        <div className="flex-1 flex flex-col justify-between min-h-[350px]">
          
          <AnimatePresence mode="wait">
            {!isLoginView ? (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: language === Language.HEBREW ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: language === Language.HEBREW ? 15 : -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1"
              >
                
                {/* Visual Mascot Speach Bubble (Top Section for steps) */}
                <div className={`mb-8 flex items-start gap-4 ${language === Language.HEBREW ? '' : 'flex-row-reverse text-right'}`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentMascot.bg} flex items-center justify-center text-2xl shrink-0 border shadow-lg`}>
                    <i className={`fas ${currentMascot.icon}`}></i>
                  </div>
                  <div className="bg-[#1a213a] border border-white/10 p-4 rounded-[1.5rem] rounded-tr-none text-sm font-semibold max-w-full leading-relaxed relative flex-1 text-white shadow-xl">
                    <div className="absolute right-0 top-3 translate-x-2 w-4 h-4 bg-[#1a213a] border-t border-r border-white/10 rotate-45 hidden md:block"></div>
                    <p className={language === Language.HEBREW ? 'text-right' : 'text-left'}>
                      {currentMascot.bubbleTexts[language] || currentMascot.bubbleTexts[Language.HEBREW]}
                    </p>
                  </div>
                </div>

                {/* STEP 1: Welcome & Choose Language & Country */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="text-center md:text-right">
                      <h1 className="text-2xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-1.5 tracking-tight">
                        {language === Language.HEBREW ? 'ברוכים הבאים ל-IM Agent!' : 'Welcome to IM Agent!'}
                      </h1>
                      <p className="text-white/50 text-xs font-semibold leading-relaxed">
                        {language === Language.HEBREW 
                          ? 'סוכן ה-AI האינטראקטיבי שמסייע לך להצליח בלימודי כימיה ופיזיקה תוך שימוש במעבדת מחקר וירטואלית ובמפת מושגים חכמה.' 
                          : 'Interactive AI mentor designed to help you excel in Physics and Chemistry through concept mapping and interactive diagnostics.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => onLanguageChange(Language.HEBREW)}
                        type="button"
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 active:scale-95 ${language === Language.HEBREW ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                        <span className="text-xl">🇮🇱</span>
                        <span className="font-black text-xs">עברית / Hebrew</span>
                      </button>
                      <button
                        onClick={() => onLanguageChange(Language.ENGLISH)}
                        type="button"
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 active:scale-95 ${language === Language.ENGLISH ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                        <span className="text-xl">🇺🇸</span>
                        <span className="font-black text-xs">English / אנגלית</span>
                      </button>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/5">
                      <div className="text-right">
                        <label className="text-[11px] font-black text-indigo-400 uppercase tracking-wider block mb-0.5">
                          {language === Language.HEBREW ? 'בחר מדינת ליווי מתוך 193 חברות האו"ם 🇺🇳' : 'Choose companion UN country from 193 member states 🇺🇳'}
                        </label>
                        <p className="text-[9px] text-white/40 font-bold leading-none mb-2">
                          {language === Language.HEBREW 
                            ? 'לכל מדינה דגל, שפה ומראה מותאמים עבור הכרטיס המדעי שלך!' 
                            : 'Choose your flag for custom credentials decoration and national stats!'}
                        </p>
                      </div>

                      {/* Search box for countries list */}
                      <div className="relative">
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder={language === Language.HEBREW ? 'חפש מדינה באו"ם...' : 'Search UN nation...'}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all text-right"
                        />
                        <div className={`absolute top-2.5 ${language === Language.HEBREW ? 'left-3' : 'right-3'} text-white/20`}>
                          <i className="fas fa-search text-[10px]"></i>
                        </div>
                      </div>

                      {/* UN Member states list scrollable */}
                      <div className="max-h-[110px] overflow-y-auto space-y-1 p-1 border border-white/5 rounded-xl bg-black/20 custom-scrollbar">
                        {UN_COUNTRIES.filter(c => {
                          const s = countrySearch.toLowerCase().trim();
                          return (
                            c.nameHe.toLowerCase().includes(s) ||
                            c.nameEn.toLowerCase().includes(s) ||
                            c.code.toLowerCase().includes(s)
                          );
                        }).map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => setSelectedCountry(c.code)}
                            className={`p-1.5 rounded-lg border text-right transition-all flex items-center justify-between gap-3 w-full text-xs ${selectedCountry === c.code ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base" role="img" aria-label={c.nameEn}>{c.flag}</span>
                              <div className="text-right flex items-center gap-1.5">
                                <span className="font-bold text-[10px] text-white/95">{language === Language.HEBREW ? c.nameHe : c.nameEn}</span>
                                <span className="text-[8px] text-indigo-400 font-medium">({language === Language.HEBREW ? c.langHe : c.langEn})</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <span className="text-[7px] bg-indigo-500/15 text-indigo-300 font-bold px-1 rounded uppercase">UN member</span>
                              <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${selectedCountry === c.code ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'}`}>
                                {selectedCountry === c.code && <i className="fas fa-check text-[4px] text-white"></i>}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Selected display banner */}
                      {(() => {
                        const c = getCountryByCode(selectedCountry);
                        return (
                          <div className="p-2 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{c.flag}</span>
                              <div className="text-right">
                                <p className="text-[8px] text-emerald-400 font-black tracking-widest leading-none mb-0.5 uppercase">
                                  {language === Language.HEBREW ? 'מדינה ושותף דגל פעילים' : 'ACTIVE NATION COMPANION'}
                                </p>
                                <h4 className="text-[11px] font-black text-white">
                                  {language === Language.HEBREW ? `${c.nameHe} (${c.code})` : `${c.nameEn} (${c.code})`}
                                </h4>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* STEP 2: Choose Mascot Companion */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {language === Language.HEBREW ? 'בחר את השותף המדעי שלך לדרך:' : 'Choose your companion character:'}
                      </h3>
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                        {language === Language.HEBREW ? 'הוא ילווה אותך בצ׳אט ויחגוג איתך הצלחות!' : 'They will accompany you and support your path!'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MASCOTS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMascot(m.id)}
                          className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-4 active:scale-95 ${selectedMascot === m.id ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.bg} flex items-center justify-center text-lg shrink-0 border`}>
                            <i className={`fas ${m.icon}`}></i>
                          </div>
                          <span className="font-black text-sm text-white flex-1">{m.name}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMascot === m.id ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'}`}>
                            {selectedMascot === m.id && <i className="fas fa-check text-[8px] text-white"></i>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: Register - Name */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {language === Language.HEBREW ? 'איך תרצה שבסגל המדעי יקראו לך?' : 'What is your name?'}
                      </h3>
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                        {language === Language.HEBREW ? 'שמך המלא או כינוי:' : 'Your full name or display nickname:'}
                      </p>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrorMessage('');
                        }}
                        autoFocus
                        placeholder={language === Language.HEBREW ? 'למשל: ד"ר ישראל ישראלי' : 'e.g., Dr. Jane Watson'}
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-bold placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 focus:ring-1 focus:ring-indigo-500/30 transition-all text-lg"
                      />
                      <div className={`absolute top-5 ${language === Language.HEBREW ? 'left-6' : 'right-6'} text-white/20`}>
                        <i className="fas fa-signature text-xl"></i>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Choose Grade */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {language === Language.HEBREW ? 'מהי כיתת הלימוד שלך?' : 'What grade are you in?'}
                      </h3>
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                        {language === Language.HEBREW ? 'כדי שנתאים את רמת המשימות בדיוק אליך:' : 'So we can tailor the scientific materials precisely:'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "ז'-ח'", label: "חטיבת ביניים (ז'-ח')", labelEn: "Middle School (7-8)" },
                        { id: "ט'-י'", label: "מדעים בסיסיים (ט'-י')", labelEn: "Introductory Science (9-10)" },
                        { id: "יא'-יב'", label: "רמת תיכון מוגברת (יא'-יב')", labelEn: "Advanced High School (11-12)" },
                        { id: "אחר / סטודנט", label: "אקדמיה / מבוגרים", labelEn: "University / Adult Learner" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setGrade(item.id)}
                          className={`p-5 rounded-2xl border text-center transition-all flex flex-col justify-center items-center gap-2 active:scale-95 ${grade === item.id ? 'bg-indigo-600/20 border-indigo-500 text-white font-black' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                        >
                          <span className="text-sm font-black text-white">{language === Language.HEBREW ? item.label : item.labelEn}</span>
                          <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Grade {item.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: Learning focus */}
                {step === 5 && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {language === Language.HEBREW ? 'במה תרצה להתמקד בעיקר?' : 'What is your primary scientific focus?'}
                      </h3>
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                        {language === Language.HEBREW ? 'מה מעניין אותך במיוחד:' : 'Choose what you want to master first:'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: 'chemistry', label: '🧪 כימיה וחלקיקים', desc: 'אטומים, קשרים כימיים, תגובות ומעבדות', labelEn: '🧪 Chemistry & Bonding', descEn: 'Atoms, reactions, state of matter and molecular formulas' },
                        { id: 'physics', label: '⚡ פיזיקה וכוחות', desc: 'מכניקה, גרוויטציה, אופטיקה וחשמל', labelEn: '⚡ Forces & Physics', descEn: 'Mechanics, Newton\'s laws, optics and electromagnetism' },
                        { id: 'both', label: '🌌 שניהם בהרמוניה (מדע רחב)', desc: 'לימוד הוליסטי המשלב כימיה, פיזיקה ויסודות מדעיים', labelEn: '🌌 Multi-disciplinary Science', descEn: 'A holistic course connecting particles, physical forces & law structures' }
                      ].map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => setLearningGoal(goal.id)}
                          className={`p-5 rounded-2xl border text-right transition-all flex items-center justify-between gap-4 active:scale-95 w-full ${learningGoal === goal.id ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                        >
                          <div>
                            <p className="font-black text-sm text-white text-right">{language === Language.HEBREW ? goal.label : goal.labelEn}</p>
                            <p className="text-[10px] text-white/40 mt-1 text-right">{language === Language.HEBREW ? goal.desc : goal.descEn}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${learningGoal === goal.id ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'}`}>
                            {learningGoal === goal.id && <i className="fas fa-check text-[8px] text-white"></i>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Daily commitment goal */}
                {step === 6 && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {language === Language.HEBREW ? 'מהי עוצמת המחקר היומית שלך?' : 'What is your daily study commitment?'}
                      </h3>
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                        {language === Language.HEBREW ? 'מטרה יומית לצבירת XP שתשמור על מוטיבציה:' : 'A daily XP streak goal to help keep structured motivation:'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'casual', label: 'קליל / Casual', desc: '5 XP / יום', descEn: '5 XP / day', icon: 'fa-shoe-print text-indigo-400' },
                        { id: 'regular', label: 'רגיל / Regular', desc: '15 XP / יום', descEn: '15 XP / day', icon: 'fa-graduation-cap text-sky-400' },
                        { id: 'serious', label: 'רציני / Serious', desc: '30 XP / יום', descEn: '30 XP / day', icon: 'fa-brain text-purple-400' },
                        { id: 'insane', label: 'טירוף / Insane', desc: '50 XP / יום', descEn: '50 XP / day', icon: 'fa-fire text-amber-500' }
                      ].map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setDailyGoal(g.id)}
                          className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 active:scale-95 ${dailyGoal === g.id ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/20' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <i className={`fas ${g.icon} text-lg`}></i>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${dailyGoal === g.id ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'}`}>
                              {dailyGoal === g.id && <i className="fas fa-check text-[6px] text-white"></i>}
                            </div>
                          </div>
                          <div>
                            <p className="font-black text-xs text-white">{g.label}</p>
                            <p className="text-[10px] text-indigo-400/80 font-bold mt-1">{language === Language.HEBREW ? g.desc : g.descEn}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 7: UN Country Representation with Custom Flag */}
                {step === 7 && (
                  <div className="space-y-4">
                    <div className="mb-2">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {language === Language.HEBREW ? 'מדינה ודגל מלווה 🇺🇳' : 'UN country & companion flag 🇺🇳'}
                      </h3>
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                        {language === Language.HEBREW ? 'בחר את המדינה שלך מחברות האומות המאוחדות (או"ם):' : 'Select your UN member country representation:'}
                      </p>
                    </div>

                    {/* Search input field */}
                    <div className="relative">
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder={language === Language.HEBREW ? 'חפש מדינה באו"ם...' : 'Search UN nation...'}
                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all"
                      />
                      <div className={`absolute top-3 ${language === Language.HEBREW ? 'left-4' : 'right-4'} text-white/20`}>
                        <i className="fas fa-search text-xs"></i>
                      </div>
                    </div>

                    {/* Country List container */}
                    <div className="max-h-[180px] overflow-y-auto space-y-1.5 p-1 border border-white/5 rounded-2xl bg-black/20 custom-scrollbar">
                      {UN_COUNTRIES.filter(c => {
                        const s = countrySearch.toLowerCase().trim();
                        return (
                          c.nameHe.toLowerCase().includes(s) ||
                          c.nameEn.toLowerCase().includes(s) ||
                          c.code.toLowerCase().includes(s)
                        );
                      }).map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => setSelectedCountry(c.code)}
                          className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between gap-3 w-full text-sm ${selectedCountry === c.code ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl" role="img" aria-label={c.nameEn}>{c.flag}</span>
                            <div className="text-right">
                              <p className="font-bold text-xs text-white/95">{language === Language.HEBREW ? c.nameHe : c.nameEn}</p>
                              <p className="text-[9px] text-indigo-400 font-medium">{language === Language.HEBREW ? `שפה: ${c.langHe}` : `Language: ${c.langEn}`}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded-md uppercase">UN member</span>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedCountry === c.code ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'}`}>
                              {selectedCountry === c.code && <i className="fas fa-check text-[5px] text-white"></i>}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Selected showoff representation */}
                    {(() => {
                      const c = getCountryByCode(selectedCountry);
                      return (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900/40 border border-indigo-500/25 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-2xl shadow-sm border border-white/10">
                              {c.flag}
                            </div>
                            <div className="text-right">
                              <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase">Dynamic Flag Companion</span>
                              <h4 className="text-xs font-black text-white mt-0.5">
                                {language === Language.HEBREW ? `${c.nameHe} (${c.code})` : `${c.nameEn} (${c.code})`}
                              </h4>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* STEP 8: Register Account (Username / Password) */}
                {step === 8 && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="mb-2">
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {language === Language.HEBREW ? 'נעילת ההתקורסות שלך! 🔒' : 'Lock in your progress! 🔒'}
                      </h3>
                      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                        {language === Language.HEBREW ? 'צור שם משתמש וסיסמה לשמירת הניסויים וצבירת ה-XP:' : 'Create a username and secure password to save your progress:'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Username */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-1">
                          {language === Language.HEBREW ? 'שם משתמש (ללא רווחים)' : 'Username'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                              setUsername(e.target.value.replace(/\s+/g, ''));
                              setErrorMessage('');
                            }}
                            placeholder={language === Language.HEBREW ? 'למשל: neilsbohr' : 'e.g., neilsbohr'}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/10 focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all"
                          />
                          <div className={`absolute top-4 ${language === Language.HEBREW ? 'left-4' : 'right-4'} text-white/20`}>
                            <i className="fas fa-user text-sm"></i>
                          </div>
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-1">
                          {language === Language.HEBREW ? 'סיסמה' : 'Password'}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setErrorMessage('');
                            }}
                            placeholder={language === Language.HEBREW ? 'לפחות 4 תווים' : 'at least 4 characters'}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-white/10 focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute top-4 ${language === Language.HEBREW ? 'left-4' : 'right-4'} text-white/30 hover:text-white transition-colors`}
                          >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="hidden" /> {/* invisible submit for enter key */}
                  </form>
                )}

                {/* BOTTOM REGULAR BUTTON CONTROLS */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-white/10 items-center justify-between">
                  {step > 1 ? (
                    <button
                      onClick={() => {
                        setStep(prev => prev - 1);
                        setErrorMessage('');
                      }}
                      className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all active:scale-95 flex items-center gap-2"
                    >
                      <i className={`fas ${language === Language.HEBREW ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
                      <span>{language === Language.HEBREW ? 'אחורה' : 'Back'}</span>
                    </button>
                  ) : <div />}

                  {step < numOnboardingSteps ? (
                    <button
                      onClick={() => {
                        // validations
                        if (step === 3 && !name.trim()) {
                          setErrorMessage(language === Language.HEBREW ? 'נא להזין את שמך!' : 'Please enter your name!');
                          return;
                        }
                        setStep(prev => prev + 1);
                        setErrorMessage('');
                      }}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span>{language === Language.HEBREW ? 'המשך' : 'Continue'}</span>
                      <i className={`fas ${language === Language.HEBREW ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span>{language === Language.HEBREW ? 'הרשמו ונתחיל! 🎉' : 'Register and Start! 🎉'}</span>
                    </button>
                  )}
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setIsLoginView(true);
                      setErrorMessage('');
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-colors"
                  >
                    {language === Language.HEBREW 
                      ? 'כבר יש לך חשבון? לחץ כאן להתחברות' 
                      : 'Already have an account? Sign in here'}
                  </button>
                </div>

              </motion.div>
            ) : (
              // LOGIN VIEW
              <motion.div
                key="login-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1"
              >
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-1">
                      {language === Language.HEBREW ? 'שם משתמש' : 'Username'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginUsername}
                        onChange={(e) => {
                          setLoginUsername(e.target.value.replace(/\s+/g, ''));
                          setErrorMessage('');
                        }}
                        autoFocus
                        placeholder={language === Language.HEBREW ? 'הזן שם משתמש' : 'Enter username'}
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all-300"
                      />
                      <div className={`absolute top-4 ${language === Language.HEBREW ? 'left-4' : 'right-4'} text-white/20`}>
                        <i className="fas fa-user text-sm"></i>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest px-1">
                      {language === Language.HEBREW ? 'סיסמה' : 'Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          setErrorMessage('');
                        }}
                        placeholder={language === Language.HEBREW ? 'הזן סיסמה' : 'Enter password'}
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/5 transition-all-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute top-4 ${language === Language.HEBREW ? 'left-4' : 'right-4'} text-white/30 hover:text-white transition-colors`}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginView(false);
                        setErrorMessage('');
                        setStep(1);
                      }}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all active:scale-95"
                    >
                      {language === Language.HEBREW ? 'חזרה להרשמה' : 'Back to Register'}
                    </button>
                    
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                    >
                      {language === Language.HEBREW ? 'התחבר עכשיו' : 'Sign In Now'}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-10 p-6 bg-indigo-600/5 rounded-3xl border border-indigo-500/10 max-w-sm mx-auto">
                  <p className="text-xs text-white/40 leading-relaxed font-bold">
                    💡 {language === Language.HEBREW 
                      ? 'החשבון וה-XP שלך מאוחסנים בצורה מאובטחת במערכת זו. צור משתמש כדי לנעול את ההקבצים ולהישאר רציף.' 
                      : 'Accounts and progress XP are validated locally on this container application instantly.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
