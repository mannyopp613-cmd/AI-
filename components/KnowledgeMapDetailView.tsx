import React from 'react';
import { motion } from 'motion/react';
import { Concept, ConceptStatus, Language } from '../types.ts';

interface KnowledgeMapDetailViewProps {
  concepts: Concept[];
  onBack: () => void;
  language: Language;
}

const KnowledgeMapDetailView: React.FC<KnowledgeMapDetailViewProps> = ({ concepts, onBack, language }) => {
  const getStatusConfig = (status: ConceptStatus) => {
    const s = status?.toLowerCase();
    
    if (language === Language.HEBREW) {
      switch (s) {
        case ConceptStatus.MASTERED: 
          return { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: 'fa-check-double', label: 'שליטה מלאה', desc: 'הבנה עמוקה ויכולת יישום מלאה.' };
        case ConceptStatus.WEAK: 
          return { color: 'text-rose-400', bg: 'bg-rose-500/20', icon: 'fa-triangle-exclamation', label: 'קושי מזוהה', desc: 'ישנם פערים הדורשים התייחסות ממוקדת.', pulse: true };
        case ConceptStatus.IN_PROGRESS: 
          return { color: 'text-sky-400', bg: 'bg-sky-500/20', icon: 'fa-flask-vial', label: 'בתהליך למידה', desc: 'המושג נלמד כרגע ונמצא בתהליך הטמעה.' };
        case ConceptStatus.DIAGNOSING: 
          return { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: 'fa-satellite-dish', label: 'אבחון אקטיבי', desc: 'המערכת בודקת את רמת הידע שלך בנושא זה.', pulse: true };
        default: 
          return { color: 'text-white/20', bg: 'bg-white/5', icon: 'fa-lock', label: 'טרם נלמד', desc: 'נושא זה טרם נפתח ללמידה.' };
      }
    } else {
      switch (s) {
        case ConceptStatus.MASTERED: 
          return { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: 'fa-check-double', label: 'Mastered', desc: 'Deep understanding and full application capability.' };
        case ConceptStatus.WEAK: 
          return { color: 'text-rose-400', bg: 'bg-rose-500/20', icon: 'fa-triangle-exclamation', label: 'Needs Focus', desc: 'Identified gaps requiring targeted attention.', pulse: true };
        case ConceptStatus.IN_PROGRESS: 
          return { color: 'text-sky-400', bg: 'bg-sky-500/20', icon: 'fa-flask-vial', label: 'In Progress', desc: 'Concept is currently being learned and assimilated.' };
        case ConceptStatus.DIAGNOSING: 
          return { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: 'fa-satellite-dish', label: 'Diagnosing', desc: 'The system is assessing your knowledge level.', pulse: true };
        default: 
          return { color: 'text-white/20', bg: 'bg-white/5', icon: 'fa-lock', label: 'Not Started', desc: 'This topic has not been opened for learning yet.' };
      }
    }
  };

  const calculateTotalProgress = () => {
    if (!concepts || concepts.length === 0) return 0;
    const totalPossiblePoints = concepts.length * 100;
    let currentPoints = 0;

    concepts.forEach(c => {
      const status = c.status?.toLowerCase();
      if (status === 'mastered') currentPoints += 100;
      else if (status === 'in_progress') currentPoints += 60;
      else if (status === 'diagnosing') currentPoints += 25;
      else if (status === 'weak') currentPoints += 10;
    });

    return Math.min(100, Math.round((currentPoints / totalPossiblePoints) * 100));
  };

  const progressPercentage = calculateTotalProgress();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`h-full w-full flex flex-col p-8 overflow-y-auto no-scrollbar bg-[#0f172a] ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}
      dir={language === Language.HEBREW ? 'rtl' : 'ltr'}
    >
      <button 
        onClick={onBack}
        className={`self-start mb-8 flex items-center gap-2 text-indigo-400 hover:text-white transition-colors group ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}
      >
        <i className={`fas ${language === Language.HEBREW ? 'fa-arrow-right' : 'fa-arrow-left'} group-hover:translate-x-1 transition-transform`}></i>
        <span className="font-bold uppercase tracking-widest text-xs">
          {language === Language.HEBREW ? 'חזרה למסך הבית' : 'Back to Home'}
        </span>
      </button>

      <div className="max-w-6xl mx-auto w-full space-y-12 pb-20">
        <header className={`flex flex-col md:flex-row items-center gap-10 text-center ${language === Language.HEBREW ? 'md:text-right md:flex-row' : 'md:text-left md:flex-row-reverse'}`}>
          <div className="relative h-48 w-48 shrink-0">
             <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(79,70,229,0.4)]" viewBox="0 0 36 36">
               <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/5" />
               <circle 
                cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="2.5" 
                strokeDasharray={`${progressPercentage} 100`}
                strokeLinecap="round"
                className="text-[#4f46e5] transition-all duration-1000 ease-in-out" 
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-5xl font-black text-white">{progressPercentage}%</span>
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                {language === Language.HEBREW ? 'התקדמות' : 'Progress'}
               </span>
             </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-indigo-400">Maps of Content (MOC)</h2>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight">
              {language === Language.HEBREW ? 'מפת ידע' : 'Knowledge Map'}
            </h1>
            <p className="text-xl text-white/50 font-medium max-w-2xl leading-relaxed">
              {language === Language.HEBREW 
                ? 'מרכז הבקרה לניהול המושגים והשליטה האישית שלך. כל התקדמות בשיחה עם הסוכן משתקפת כאן בזמן אמת, ומאפשרת לך לראות את התמונה המלאה של הידע שלך בכימיה.'
                : 'The control center for managing your concepts and personal mastery. Every progress in the chat with the agent is reflected here in real-time.'}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {concepts.map((concept, idx) => {
            const config = getStatusConfig(concept.status);
            const progressValue = concept.status === 'mastered' ? 100 : concept.status === 'in_progress' ? 65 : concept.status === 'diagnosing' ? 35 : concept.status === 'weak' ? 15 : 0;
            const name = language === Language.HEBREW ? concept.name : (concept.name_en || concept.name);
            const description = language === Language.HEBREW ? concept.description : (concept.description_en || concept.description);

            return (
              <motion.div 
                key={concept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-6 rounded-[2rem] bg-white/5 border-white/10 hover:bg-white/10 transition-all group overflow-hidden relative"
              >
                <div className={`absolute w-24 h-24 ${config.bg} blur-3xl opacity-20 ${language === Language.HEBREW ? '-right-4 -bottom-4' : '-left-4 -bottom-4'}`}></div>
                
                <div className={`flex items-center justify-between mb-6 relative z-10 ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-14 h-14 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center text-2xl shadow-xl`}>
                    <i className={`fas ${config.icon} ${config.pulse ? 'animate-pulse' : ''}`}></i>
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl font-black text-white">{name}</h3>
                  <p className="text-sm text-white/50 leading-relaxed min-h-[3rem]">
                    {description}
                  </p>
                  <div className="pt-2 text-xs font-bold text-indigo-400">
                    {config.desc}
                  </div>
                </div>

                <div className="mt-8 relative z-10">
                  <div className={`flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}>
                    <span>{language === Language.HEBREW ? 'ביצועים' : 'Performance'}</span>
                    <span>{progressValue}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressValue}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + idx * 0.1 }}
                      className={`h-full ${config.color.replace('text-', 'bg-')} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default KnowledgeMapDetailView;
