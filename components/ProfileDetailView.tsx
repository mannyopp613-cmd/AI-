import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, StudentProfile, ConceptStatus } from '../types.ts';
import { UI_STRINGS } from '../constants.ts';
import { UN_COUNTRIES, getCountryByCode } from '../unCountries.ts';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ProfileDetailViewProps {
  username: string;
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onBack: () => void;
  language: Language;
}

const MASCOTS = [
  {
    id: 'einstein',
    name: 'איינשטיין / Einstein',
    icon: 'fa-user-astronaut',
    avatarChar: '👨‍🚀',
    bg: 'from-amber-600/30 to-amber-500/15 border-amber-500/30 text-amber-400',
    bannerBg: 'from-amber-950/40 via-amber-900/10 to-indigo-950/20',
    color: '#f59e0b',
    quotes: {
      [Language.HEBREW]: 'הכל יחסי, חוץ מהאהבה שלך למדע המופלא! 🌌',
      [Language.ENGLISH]: 'Everything is relative, except your love for wonderful science! 🌌',
    }
  },
  {
    id: 'curie',
    name: 'מארי קירי / Marie Curie',
    icon: 'fa-vial-circle-check',
    avatarChar: '👩‍🔬',
    bg: 'from-emerald-600/30 to-emerald-500/15 border-emerald-500/30 text-emerald-400',
    bannerBg: 'from-emerald-950/40 via-emerald-900/10 to-indigo-950/20',
    color: '#10b981',
    quotes: {
      [Language.HEBREW]: 'בחיים האלו אנו חוקרים יסודות קורנים! תמשיך להאיר 🧪',
      [Language.ENGLISH]: 'In this life we research radiant elements! Keep glowing 🧪',
    }
  },
  {
    id: 'newton',
    name: 'אייזק ניוטון / Isaac Newton',
    icon: 'fa-apple-whole',
    avatarChar: '🧝‍♂️',
    bg: 'from-rose-600/30 to-rose-500/15 border-rose-500/30 text-rose-400',
    bannerBg: 'from-rose-950/40 via-rose-900/10 to-indigo-950/20',
    color: '#f43f5e',
    quotes: {
      [Language.HEBREW]: 'כוח המשיכה פה בלפצח מדע הוא מעל לכל דמיון! 🍎',
      [Language.ENGLISH]: 'The attraction here to solving science is beyond imagination! 🍎',
    }
  },
  {
    id: 'faraday',
    name: 'מייקל פאראדיי / Michael Faraday',
    icon: 'fa-bolt',
    avatarChar: '⚡',
    bg: 'from-indigo-600/30 to-indigo-500/15 border-indigo-500/30 text-indigo-400',
    bannerBg: 'from-indigo-950/40 via-indigo-900/10 to-indigo-950/20',
    color: '#6366f1',
    quotes: {
      [Language.HEBREW]: 'אף מדע אינו נפלא ומחשמל כמו המדע המעשי של השדה המגנטי! ⚡',
      [Language.ENGLISH]: 'No science is as electricity-charged as practical magnetism! ⚡',
    }
  }
];

// Historical scientists to follow
const SCIENTIST_LIST = [
  { name: 'Niels Bohr', name_he: 'נילס בוהר', icon: '⚛️', description: 'Quantum orbits', description_he: 'אורביטלים קוונטיים' },
  { name: 'Dmitri Mendeleev', name_he: 'דמיטרי מנדלייב', icon: '📊', description: 'Periodic table master', description_he: 'יוצר הטבלה המחזורית' },
  { name: 'Richard Feynman', name_he: 'ריצ׳רד פיינמן', icon: '🧮', description: 'Quantum electrodynamics', description_he: 'אלקטרודינמיקה קוונטית' },
  { name: 'Rosalind Franklin', name_he: 'רוזלינד פרנקלין', icon: '🧬', description: 'DNA structure pioneer', description_he: 'חלוצת מבנה ה-DNA' },
  { name: 'Antoine Lavoisier', name_he: 'אנטואן לבואזיה', icon: '⚖️', description: 'Mass conservation solver', description_he: 'חוק שימור המסה בתוך כלי' }
];

const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({
  username,
  profile,
  onUpdateProfile,
  onBack,
  language
}) => {
  const strings = UI_STRINGS[language];
  const mascotId = profile.mascotId || 'einstein';
  const currentMascot = MASCOTS.find(m => m.id === mascotId) || MASCOTS[0];

  // Mascot dynamic quote bubble when tapped
  const [mascotQuote, setMascotQuote] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Settings & Edit Profile dialog states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editGrade, setEditGrade] = useState(profile.grade);
  const [editMascot, setEditMascot] = useState(mascotId);
  const [editLearningGoal, setEditLearningGoal] = useState(profile.learningGoal || 'both');
  const [editDailyGoal, setEditDailyGoal] = useState(profile.dailyGoal || 'regular');
  const [editCountry, setEditCountry] = useState(profile.countryCode || 'IL');
  const [editCountrySearch, setEditCountrySearch] = useState('');

  // Friends & followers lists values
  const [showColleaguesModal, setShowColleaguesModal] = useState<boolean>(false);
  const [followedScientists, setFollowedScientists] = useState<string[]>(['Niels Bohr', 'Richard Feynman']);
  const [customFriendName, setCustomFriendName] = useState<string>('');

  // Course mastery stats calculations
  const totalConcepts = profile.concepts.length;
  const masteredConcepts = profile.concepts.filter(c => c.status === ConceptStatus.MASTERED).length;
  const inProgressConcepts = profile.concepts.filter(c => c.status === ConceptStatus.IN_PROGRESS || c.status === ConceptStatus.WEAK).length;
  
  const chemistryConcepts = profile.concepts.filter(c => c.id.includes('atom') || c.id.includes('bond') || c.id.includes('table') || c.id.includes('structure'));
  const masteredChem = chemistryConcepts.filter(c => c.status === ConceptStatus.MASTERED).length;
  const chemMasteryPct = chemistryConcepts.length > 0 ? Math.round((masteredChem / chemistryConcepts.length) * 100) : 0;

  const physicsConcepts = profile.concepts.filter(c => c.id.includes('force') || c.id.includes('energy') || c.id.includes('mechanic') || c.id.includes('newton'));
  const masteredPhys = physicsConcepts.filter(c => c.status === ConceptStatus.MASTERED).length;
  const physMasteryPct = physicsConcepts.length > 0 ? Math.round((masteredPhys / physicsConcepts.length) * 100) : 0;

  // Render quotes generator
  const handleMascotTap = () => {
    const qText = currentMascot.quotes[language] || currentMascot.quotes[Language.HEBREW];
    setMascotQuote(qText);
    setTimeout(() => {
      setMascotQuote(null);
    }, 4500);
  };

  const handleShareProfile = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      triggerToast(language === Language.HEBREW ? 'הקישור הועתק ללוח! 📋' : 'Profile link copied to clipboard! 📋');
    });
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  const handleSaveSettings = () => {
    const updatedProfile: StudentProfile = {
      ...profile,
      name: editName.trim() || profile.name,
      grade: editGrade,
      learningGoal: editLearningGoal,
      dailyGoal: editDailyGoal,
      mascotId: editMascot,
      countryCode: editCountry
    };
    onUpdateProfile(updatedProfile);
    setIsSettingsOpen(false);
    triggerToast(language === Language.HEBREW ? 'הפרופיל עודכן בהצלחה! ✨' : 'Profile updated successfully! ✨');
  };

  const handleAddScienceFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFriendName.trim()) return;

    const fName = customFriendName.trim();
    if (followedScientists.includes(fName)) {
      triggerToast(language === Language.HEBREW ? 'אתה כבר עוקב אחרי חוקר זה!' : 'You already follow this colleague!');
      return;
    }

    setFollowedScientists(prev => [...prev, fName]);
    setCustomFriendName('');
    triggerToast(language === Language.HEBREW ? `החוקר "${fName}" נוסף בהצלחה!` : `Researcher "${fName}" joined your team!`);
  };

  const handleToggleFollowScientist = (name: string) => {
    if (followedScientists.includes(name)) {
      setFollowedScientists(prev => prev.filter(s => s !== name));
      triggerToast(language === Language.HEBREW ? `הסרת מעקב מ-${name}` : `Unfollowed ${name}`);
    } else {
      setFollowedScientists(prev => [...prev, name]);
      triggerToast(language === Language.HEBREW ? `התחלת לעקוב אחרי ${name}!` : `Now following ${name}!`);
    }
  };

  // Profile joined date format
  const getJoinedYear = () => {
    return language === Language.HEBREW ? 'מאי 2026' : 'May 2026';
  };

  // Simulated daily XP progress chart representation to fit Duolingo screenshot
  const dayShortLabels = language === Language.HEBREW 
    ? ['ש', 'ו', 'ה', 'ד', 'ג', 'ב', 'א'] 
    : ['S', 'F', 'T', 'W', 'T', 'M', 'S'];

  // Current XP representation
  const weeklyChartData = [
    { name: dayShortLabels[6], thisWeek: 5, lastWeek: 15 },
    { name: dayShortLabels[5], thisWeek: profile.exp > 30 ? 30 : 15, lastWeek: 35 },
    { name: dayShortLabels[4], thisWeek: profile.exp > 60 ? 40 : 12, lastWeek: 25 },
    { name: dayShortLabels[3], thisWeek: profile.exp > 100 ? 55 : 30, lastWeek: 10 },
    { name: dayShortLabels[2], thisWeek: profile.exp % 50, lastWeek: 45 },
    { name: dayShortLabels[1], thisWeek: Math.max(10, profile.exp % 30), lastWeek: 20 },
    { name: dayShortLabels[0], thisWeek: Math.max(5, profile.exp % 12), lastWeek: 8 },
  ];

  // Style helper for cognitive profiles representation
  const displayStyle = profile.learningStyle;
  const isPending = displayStyle === strings.learning_style_wait || !displayStyle;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className={`h-full w-full flex flex-col p-4 md:p-8 overflow-y-auto no-scrollbar relative ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}
      dir={language === Language.HEBREW ? 'rtl' : 'ltr'}
    >
      {/* Back to Home Button floating left */}
      <button 
        onClick={onBack}
        className={`fixed top-8 ${language === Language.HEBREW ? 'right-28' : 'left-28'} z-50 px-5 py-3 rounded-full bg-[#13182b]/80 border border-white/5 backdrop-blur-md text-indigo-400 hover:text-white transition-all group flex items-center gap-2 active:scale-95 shadow-md`}
      >
        <i className={`fas ${language === Language.HEBREW ? 'fa-arrow-right' : 'fa-arrow-left'} group-hover:translate-x-1 transition-transform text-sm`}></i>
        <span className="font-bold text-xs uppercase tracking-wider">
          {language === Language.HEBREW ? 'בית' : 'Home'}
        </span>
      </button>

      {/* Main Container */}
      <div className="max-w-[750px] mx-auto w-full space-y-6 pb-24 mt-12">

        {/* 1. DUOLINGO mascot visual banner */}
        <div className={`w-full rounded-[2.5rem] bg-gradient-to-b ${currentMascot.bannerBg} border border-white/10 overflow-hidden relative shadow-2xl`}>
          
          {/* Subtle tech background shapes */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-4 left-6 border-2 border-dashed border-indigo-500 w-24 h-24 rounded-full animate-spin-slow" />
            <div className="absolute bottom-6 right-10 border border-white/30 w-32 h-32 rounded-[2rem] rotate-12" />
            <div className="absolute top-1/2 left-1/3 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <div className="p-8 md:p-10 flex flex-col items-center text-center relative z-10">
            {/* Mascot Character Avatar (Clickable with Speech bubble) */}
            <div className="relative group mb-4">
              {/* Tap Indicator */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600/90 text-[8px] font-bold text-white px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {language === Language.HEBREW ? 'לחץ לדבר! 🗣️' : 'Tap to speak! 🗣️'}
              </div>

              <button
                onClick={handleMascotTap}
                className={`w-28 h-28 rounded-full bg-gradient-to-br ${currentMascot.bg} flex items-center justify-center text-5xl shrink-0 border-4 border-slate-900 shadow-[0_0_35px_rgba(99,102,241,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden`}
              >
                <span className="relative z-10">{currentMascot.avatarChar}</span>
                {/* Visual energy core backdrop */}
                <div className="absolute inset-0 bg-white/5 hover:bg-white/10" />
              </button>

              {/* Character miniature symbol in bottom/right corner */}
              <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center text-sm ${currentMascot.color}`}>
                <i className={`fas ${currentMascot.icon}`}></i>
              </div>
            </div>

            {/* Mascot Quote Speech Bubble */}
            <AnimatePresence>
              {mascotQuote && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="bg-[#181d36]/90 border border-indigo-500/20 px-5 py-3 rounded-2xl max-w-sm mb-6 shadow-xl relative text-xs font-bold text-indigo-200"
                >
                  <p className="leading-relaxed">{mascotQuote}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User credentials details */}
            <div className="flex items-center gap-3 justify-center">
              <span className="text-3xl filter drop-shadow" title={getCountryByCode(profile.countryCode || 'IL').nameEn}>
                {getCountryByCode(profile.countryCode || 'IL').flag}
              </span>
              <h1 className="text-3xl font-black text-white tracking-tight">{profile.name}</h1>
            </div>
            <p className="text-sm font-black text-indigo-400 mt-1">@{username.toLowerCase()}</p>
            
            <div className="flex items-center gap-4 justify-center text-white/40 text-xs font-semibold mt-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <i className="far fa-calendar-alt"></i>
                <span>{language === Language.HEBREW ? `הצטרף ב-${getJoinedYear()}` : `Joined ${getJoinedYear()}`}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full text-[10px] font-black">
                <span>{getCountryByCode(profile.countryCode || 'IL').flag}</span>
                <span>{language === Language.HEBREW ? getCountryByCode(profile.countryCode || 'IL').nameHe : getCountryByCode(profile.countryCode || 'IL').nameEn}</span>
                <span className="text-white/40">|</span>
                <span>{language === Language.HEBREW ? getCountryByCode(profile.countryCode || 'IL').langHe : getCountryByCode(profile.countryCode || 'IL').langEn}</span>
              </div>
            </div>

            {/* Top right floating gear settings button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="absolute top-6 right-6 w-11 h-11 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white/50 hover:text-white flex items-center justify-center transition-all active:scale-95 shadow-md"
              title={language === Language.HEBREW ? 'הגדרות פרופיל' : 'Profile Settings'}
            >
              <i className="fas fa-cog text-lg"></i>
            </button>
          </div>
        </div>

        {/* 2. DUOLINGO-style Action bar buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setShowColleaguesModal(true)}
            className="py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/10 transition-all active:scale-95 flex items-center justify-center gap-3 text-sm tracking-wide"
          >
            <i className="fas fa-user-plus"></i>
            <span>{language === Language.HEBREW ? 'הוספת חוקרים לצוות' : 'Add Colleagues'}</span>
          </button>

          <button
            onClick={handleShareProfile}
            className="py-4 bg-[#1a213a] hover:bg-[#202948] text-indigo-400 hover:text-white border border-white/5 font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 text-sm shadow-md"
          >
            <i className="fas fa-share-alt"></i>
            <span>{language === Language.HEBREW ? 'שתף את הקישור לאתר' : 'Share Profile URL'}</span>
          </button>
        </div>

        {/* 3. Stat summaries Counters row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-[#121626] border border-white/5 p-4 rounded-xl text-center shadow-lg">
            <span className="text-xs uppercase font-black text-white/30 tracking-widest block mb-1">
              {language === Language.HEBREW ? 'רמת חוקר' : 'XP Rank'}
            </span>
            <span className="text-2xl font-black text-indigo-400 block">{profile.level}</span>
          </div>

          <div className="bg-[#121626] border border-white/5 p-4 rounded-xl text-center shadow-lg">
            <span className="text-xs uppercase font-black text-white/30 tracking-widest block mb-1">
              {language === Language.HEBREW ? 'סך הכל XP' : 'Total XP'}
            </span>
            <span className="text-2xl font-black text-indigo-400 block">{profile.exp} XP</span>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-orange-500/30 p-4 rounded-xl text-center shadow-lg">
            <span className="text-xs uppercase font-black text-orange-400 tracking-widest mb-1 flex items-center justify-center gap-1.5">
              <i className="fas fa-fire text-amber-500 animate-bounce"></i>
              <span>{language === Language.HEBREW ? 'רצף ימים' : 'Streak'}</span>
            </span>
            <span className="text-2xl font-black text-orange-500 block">
              {profile.streak || 1} {language === Language.HEBREW ? 'ימים' : 'Days'}
            </span>
          </div>

          <div className="bg-[#121626] border border-white/5 p-4 rounded-xl text-center shadow-lg cursor-pointer hover:border-indigo-500/30 transition-all" onClick={() => setShowColleaguesModal(true)}>
            <span className="text-xs uppercase font-black text-white/30 tracking-widest block mb-1">
              {language === Language.HEBREW ? 'חוקרים' : 'Following'}
            </span>
            <span className="text-2xl font-black text-emerald-400 block">{followedScientists.length}</span>
          </div>

          <div className="bg-[#121626] border border-white/5 p-4 rounded-xl text-center shadow-lg cursor-pointer hover:border-indigo-500/30 transition-all" onClick={() => setShowColleaguesModal(true)}>
            <span className="text-xs uppercase font-black text-white/30 tracking-widest block mb-1">
              {language === Language.HEBREW ? 'עמיתים' : 'Followers'}
            </span>
            <span className="text-2xl font-black text-emerald-400 block">{followedScientists.length + 4}</span>
          </div>
        </div>

        {/* 4. Active Courses Widgets Card */}
        <div className="bg-[#121626] border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <i className="fas fa-graduation-cap text-indigo-400"></i>
            <span>{language === Language.HEBREW ? 'מסלולי מחקר פעילים' : 'Current Research Courses'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Chemistry course */}
            <div className="p-5 bg-[#181d35] rounded-2xl border border-white/5 flex items-center gap-5 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                🧪
              </div>
              <div className="flex-1 space-y-1 text-right">
                <span className="text-xs font-black text-white/40 uppercase tracking-wider block">
                  {language === Language.HEBREW ? 'מסלול מדעי' : 'Course'}
                </span>
                <span className="text-sm font-black text-white block">
                  {language === Language.HEBREW ? 'כימיה ותורת החומר' : 'Chemistry & Materials'}
                </span>
                <div className="flex justify-between items-center text-[10px] font-black text-indigo-400">
                  <span>{chemMasteryPct}% {language === Language.HEBREW ? 'שליטה' : 'Mastery'}</span>
                  <span>{masteredChem}/{chemistryConcepts.length || '4'} {language === Language.HEBREW ? 'נושאים' : 'topics'}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${chemMasteryPct || 5}%` }}></div>
                </div>
              </div>
            </div>

            {/* Physics course */}
            <div className="p-5 bg-[#181d35] rounded-2xl border border-white/5 flex items-center gap-5 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <div className="flex-1 space-y-1 text-right">
                <span className="text-xs font-black text-white/40 uppercase tracking-wider block">
                  {language === Language.HEBREW ? 'מסלול מדעי' : 'Course'}
                </span>
                <span className="text-sm font-black text-white block">
                  {language === Language.HEBREW ? 'פיזיקה וכוחות פיזיולוגיים' : 'Physics & Mechanics'}
                </span>
                <div className="flex justify-between items-center text-[10px] font-black text-indigo-400">
                  <span>{physMasteryPct}% {language === Language.HEBREW ? 'שליטה' : 'Mastery'}</span>
                  <span>{masteredPhys}/{physicsConcepts.length || '4'} {language === Language.HEBREW ? 'נושאים' : 'topics'}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${physMasteryPct || 5}%` }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 5. DUOLINGO-style: Weekly Progress Graphical Chart */}
        <div className="bg-[#121626] border border-white/5 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                {language === Language.HEBREW ? 'גרף התקדמות שבועי' : 'Weekly Progress Chart'}
              </h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">
                {language === Language.HEBREW ? 'פילוח צבירת נקודות XP יומיות' : 'XP metrics earned each weekday'}
              </p>
            </div>
            {/* Visual Legends */}
            <div className="flex gap-4 items-center text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                <span className="text-white/70">{language === Language.HEBREW ? 'השבוע' : 'This week'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/30 inline-block"></span>
                <span className="text-white/40">{language === Language.HEBREW ? 'שבוע שעבר' : 'Last week'}</span>
              </div>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff33" 
                  style={{ fontSize: '11px', fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff33" 
                  style={{ fontSize: '10px' }} 
                  dx={-5}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1b223d', 
                    borderRadius: '16px', 
                    border: '1px solid #4f46e530', 
                    color: '#ffffff',
                    direction: language === Language.HEBREW ? 'rtl' : 'ltr'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="thisWeek" 
                  name={language === Language.HEBREW ? 'השבוע' : 'This week'}
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorThisWeek)" 
                  dot={{ r: 4, stroke: '#6366f1', strokeWidth: 2, fill: '#0f172a' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="lastWeek" 
                  name={language === Language.HEBREW ? 'שבוע שעבר' : 'Last week'}
                  stroke="#6366f1" 
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={0.5} 
                  fill="url(#colorLastWeek)" 
                  dot={{ r: 3, stroke: '#6366f140', fill: '#0f172a' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Cognitive profile analyzed by Gemini (Existing feature preserved!) */}
        <div className="bg-[#121626] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <i className="fas fa-brain text-purple-400"></i>
            <span>{language === Language.HEBREW ? 'ניתוח סגנון למידה קוגניטיבי' : 'Cognitive Learning Style Analysis'}</span>
          </h3>

          <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-3">
            <p className="text-xs uppercase font-black text-indigo-400 tracking-[0.2em]">
              {language === Language.HEBREW ? 'סגנון מומלץ על פי סוכן ה-AI' : 'AI-Agent Analyzed Cognitive Signature'}
            </p>
            <h4 className="text-2xl font-black text-white tracking-tight">
              {isPending ? (language === Language.HEBREW ? 'ממתין לאבחון פעיל...' : 'Awaiting active diagnostics...') : displayStyle}
            </h4>
            <p className="text-sm text-white/50 leading-relaxed font-medium">
              {isPending 
                ? (language === Language.HEBREW 
                    ? 'הסוכן עדיין עובר על תגובותיך ובונה את מפת הקישור המדעי. המשך לבצע משימות מעבדה ולענות על חידונים כדי לפתוח אפיק זה.' 
                    : 'The mentor agent is analyzing your experiment logs and questions answers details. Complete lab tasks to unlock personalized style.') 
                : (language === Language.HEBREW 
                    ? 'חתימת למידה איבואטיבית זו מביאה להתאמה מתקדמת של ההסברים והאובייקטים במעבדה אל המודוס הקוגניטיבי שלך.' 
                    : 'This customized model accommodates physical explanations and particle behaviors accurately to reflect your sensory style.')}
            </p>
          </div>
        </div>

      </div>

      {/* 7. Toast Alerts notification popup */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#161a30] border border-indigo-500/35 text-white px-6 py-4 rounded-2xl shadow-3xl text-sm font-black flex items-center gap-3"
          >
            <i className="fas fa-check-circle text-emerald-400 text-lg"></i>
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. SETTINGS / EDIT PROFILE DIALOG MODAL */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#13182b] border border-white/10 w-full max-w-lg rounded-[2rem] shadow-4xl p-8 relative max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className={`absolute top-6 ${language === Language.HEBREW ? 'left-6' : 'right-6'} w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors`}
              >
                <i className="fas fa-times"></i>
              </button>

              <h3 className="text-2xl font-black text-white tracking-tight mb-6">
                {language === Language.HEBREW ? 'עדכון ועריכת פרופיל' : 'Edit Profile Settings'}
              </h3>

              <div className="space-y-5">
                
                {/* 1. Name input */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-white/40 tracking-wider">
                    {language === Language.HEBREW ? 'שם מוצג' : 'Display name'}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* 2. Grade Select */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-white/40 tracking-wider">
                    {language === Language.HEBREW ? 'כיתת לימוד' : 'School Grade'}
                  </label>
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="ז'-ח'">{language === Language.HEBREW ? "חטיבת ביניים (ז'-ח')" : "Middle School (7-8)"}</option>
                    <option value="ט'-י'">{language === Language.HEBREW ? "מדעים בסיסיים (ט'-י')" : "Introductory Science (9-10)"}</option>
                    <option value="יא'-יב'">{language === Language.HEBREW ? "רמת תיכון מוגברת (יא'-יב')" : "Advanced High School (11-12)"}</option>
                    <option value="אחר / סטודנט">{language === Language.HEBREW ? "אקדמיה / מבוגרים" : "University / Adult"}</option>
                  </select>
                </div>

                {/* 3. Choose Mascot */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-white/40 tracking-wider block">
                    {language === Language.HEBREW ? 'בחר שותף מדעי מלווה' : 'Choose Companion Mascot'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {MASCOTS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setEditMascot(m.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-black ${editMascot === m.id ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                      >
                        <span className="text-xl">{m.avatarChar}</span>
                        <span className="text-[8px] truncate max-w-full text-center">
                          {m.name.split('/')[language === Language.HEBREW ? 0 : 1]?.trim()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Learning Goal focus */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-white/40 tracking-wider">
                    {language === Language.HEBREW ? 'התמקדות מדעית בלמידה' : 'Scientific Learning Goal'}
                  </label>
                  <select
                    value={editLearningGoal}
                    onChange={(e) => setEditLearningGoal(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="chemistry">{language === Language.HEBREW ? "🧪 כימיה וחלקיקים" : "🧪 Chemistry & Particles"}</option>
                    <option value="physics">{language === Language.HEBREW ? "⚡ פיזיקה וכוחות" : "⚡ Physics & Forces"}</option>
                    <option value="both">{language === Language.HEBREW ? "🌌 לימוד הוליסטי כולל" : "🌌 Holistic Multi-Disciplinary"}</option>
                  </select>
                </div>

                {/* 5. Daily Commitment level */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-white/40 tracking-wider font-bold">
                    {language === Language.HEBREW ? 'עוצמת מחקר יומית (XP)' : 'Daily Study Goal Commitment'}
                  </label>
                  <select
                    value={editDailyGoal}
                    onChange={(e) => setEditDailyGoal(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="casual">{language === Language.HEBREW ? "קליל (5 XP / יום)" : "Casual (5 XP / day)"}</option>
                    <option value="regular">{language === Language.HEBREW ? "רגיל (15 XP / יום)" : "Regular (15 XP / day)"}</option>
                    <option value="serious">{language === Language.HEBREW ? "רציני (30 XP / יום)" : "Serious (30 XP / day)"}</option>
                    <option value="insane">{language === Language.HEBREW ? "טירוף (50 XP / יום)" : "Insane (50 XP / day)"}</option>
                  </select>
                </div>

                {/* 6. Edit Country Selection (UN Members) */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-[10px] uppercase font-black text-white/40 tracking-wider block font-bold">
                    {language === Language.HEBREW ? 'מדינה מלווה וחברה באו"ם 🇺🇳' : 'UN Country and Flag Display 🇺🇳'}
                  </label>
                  
                  {/* Search input field inside modal */}
                  <input
                    type="text"
                    value={editCountrySearch}
                    onChange={(e) => setEditCountrySearch(e.target.value)}
                    placeholder={language === Language.HEBREW ? 'חפש מדינה חברה באו"ם...' : 'Search UN member state...'}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500"
                  />

                  <div className="max-h-[140px] overflow-y-auto space-y-1 p-1 border border-white/5 rounded-xl bg-black/10 no-scrollbar">
                    {UN_COUNTRIES.filter(c => {
                      const s = editCountrySearch.toLowerCase().trim();
                      return (
                        c.nameHe.toLowerCase().includes(s) ||
                        c.nameEn.toLowerCase().includes(s) ||
                        c.code.toLowerCase().includes(s)
                      );
                    }).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setEditCountry(c.code)}
                        className={`p-2 rounded-lg text-right transition-all flex items-center justify-between gap-3 w-full text-[11px] ${editCountry === c.code ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{c.flag}</span>
                          <span>{language === Language.HEBREW ? c.nameHe : c.nameEn}</span>
                          <span className="text-[10px] text-indigo-400">({language === Language.HEBREW ? c.langHe : c.langEn})</span>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${editCountry === c.code ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'}`}>
                          {editCountry === c.code && <i className="fas fa-check text-[6px] text-white"></i>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save controls */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl transition-all active:scale-95 text-xs text-center"
                  >
                    {language === Language.HEBREW ? 'ביטול' : 'Cancel'}
                  </button>

                  <button
                    onClick={handleSaveSettings}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 text-xs text-center"
                  >
                    {language === Language.HEBREW ? 'שמור שינויים ✨' : 'Save Changes ✨'}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. COLLEAGUES / FRIENDS COLLABORATORS LIST MODAL */}
      <AnimatePresence>
        {showColleaguesModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#13182b] border border-white/10 w-full max-w-md rounded-[2.2rem] shadow-4xl p-6 relative max-h-[80vh] overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => setShowColleaguesModal(false)}
                className={`absolute top-6 ${language === Language.HEBREW ? 'left-6' : 'right-6'} w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors`}
              >
                <i className="fas fa-times"></i>
              </button>

              <h3 className="text-xl font-black text-white tracking-tight mb-4 flex items-center gap-2">
                <i className="fas fa-user-group text-indigo-400"></i>
                <span>{language === Language.HEBREW ? 'חוקרים ועמיתים בצוות' : 'Science Team & Colleagues'}</span>
              </h3>

              {/* Add Custom Friend Form */}
              <form onSubmit={handleAddScienceFriend} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customFriendName}
                    onChange={(e) => setCustomFriendName(e.target.value)}
                    placeholder={language === Language.HEBREW ? 'שם של חבר או מדען...' : 'Add custom colleague...'}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-indigo-500 text-xs"
                    maxLength={35}
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black text-white shrink-0 active:scale-95 transition-all"
                  >
                    {language === Language.HEBREW ? 'הוסף 🤝' : 'Add 🤝'}
                  </button>
                </div>
              </form>

              {/* Scientists List */}
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                <p className="text-[10px] uppercase font-black text-white/40 tracking-wider">
                  {language === Language.HEBREW ? 'מדענים דגולים זמינים למעקב' : 'Great Minds / Young Researchers'}
                </p>

                {SCIENTIST_LIST.map((sci) => {
                  const isFollowed = followedScientists.includes(sci.name);
                  return (
                    <div 
                      key={sci.name}
                      className="p-3 bg-[#171b30] rounded-xl border border-white/5 flex items-center justify-between gap-3 text-right"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl shrink-0">{sci.icon}</span>
                        <div>
                          <p className="font-black text-xs text-white">
                            {language === Language.HEBREW ? sci.name_he : sci.name}
                          </p>
                          <p className="text-[9px] text-white/40 font-semibold leading-none mt-1">
                            {language === Language.HEBREW ? sci.description_he : sci.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleFollowScientist(sci.name)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all shrink-0 uppercase tracking-wider ${isFollowed ? 'bg-[#1e142e] text-fuchsia-400 border border-fuchsia-400/20' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                      >
                        {isFollowed 
                          ? (language === Language.HEBREW ? 'עוקב ●' : 'Following ●') 
                          : (language === Language.HEBREW ? 'עקוב' : 'Follow')}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => setShowColleaguesModal(false)}
                  className="px-5 py-2.5 bg-[#171b30] text-xs font-black text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  {language === Language.HEBREW ? 'סגור' : 'Close'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ProfileDetailView;
