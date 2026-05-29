import React from 'react';
import { Concept, ConceptStatus, Language } from '../types.ts';
import { UI_STRINGS, LEVELS } from '../constants.ts';

interface MocDashboardProps {
  concepts: Concept[];
  learningStyle: string;
  onNavigate?: (view: string) => void;
  language: Language;
  level: number;
}

const MocDashboard: React.FC<MocDashboardProps> = ({ concepts, learningStyle, onNavigate, language, level }) => {
  const currentLevelData = LEVELS.find(l => l.level === level) || LEVELS[0];
  const masteryTitle = currentLevelData.title[language];
  const translateStyle = (style: string) => {
    if (!style) return style;
    const lower = style.toLowerCase();
    
    if (language === Language.HEBREW) {
      if (lower.includes('logical') && lower.includes('textual')) return 'לוגי וטקסטואלי';
      if (lower.includes('visual')) return 'ויזואלי';
      if (lower.includes('kinesthetic')) return 'קינסטטי (למידה דרך עשייה)';
      if (lower.includes('auditory')) return 'שמיעתי';
    } else {
      if (lower.includes('לוגי') && lower.includes('טקסטואלי')) return 'Logical and Textual';
      if (lower.includes('ויזואלי')) return 'Visual';
      if (lower.includes('קינסטטי')) return 'Kinesthetic (Learning by doing)';
      if (lower.includes('שמיעתי')) return 'Auditory';
    }
    return style;
  };

  const displayStyle = translateStyle(learningStyle);
  const strings = UI_STRINGS[language];

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
  const isPending = displayStyle === strings.learning_style_wait || !displayStyle;

  return (
    <div className="flex flex-col space-y-4">
      {/* Cognitive Profile Section */}
      <button 
        onClick={() => onNavigate?.('profile-detail')}
        className={`glass-panel rounded-[2rem] p-6 bg-[#312e81] border-white/5 shadow-3xl relative overflow-hidden group w-full hover:bg-[#3730a3] transition-all duration-300 ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}
        dir={language === Language.HEBREW ? 'rtl' : 'ltr'}
      >
        <div className={`absolute w-32 h-32 bg-white/5 blur-3xl rounded-full ${language === Language.HEBREW ? '-right-6 -bottom-6' : '-left-6 -bottom-6'}`}></div>
        <div className={`flex items-center justify-between mb-3 relative z-10 ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="flex gap-1 items-center">
             <i className={`fas fa-bolt text-[8px] ${isPending ? 'text-white/30' : 'text-amber-400'}`}></i>
             <span className={`text-[8px] font-black uppercase tracking-widest ${isPending ? 'text-white/30' : 'text-amber-400'}`}>
              {language === Language.HEBREW ? 'התאמה דינמית' : 'Dynamic Adaptation'}
             </span>
          </div>
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-200 opacity-70">
            {language === Language.HEBREW ? 'פרופיל קוגניטיבי' : 'Cognitive Profile'}
          </h3>
        </div>
        <div className="flex items-center gap-5 relative z-10">
          <div className={`w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-700 ${isPending ? 'animate-pulse border-indigo-500/30' : 'group-hover:scale-110'}`}>
            <i className={`fas fa-microchip text-3xl ${isPending ? 'text-indigo-300/30' : 'text-indigo-300 drop-shadow-[0_0_15px_rgba(129,140,248,0.6)]'}`}></i>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className={`text-xl font-black leading-tight mb-1 truncate ${isPending ? 'text-white/30 italic' : 'text-white'}`}>
              {displayStyle || strings.learning_style_wait}
            </p>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-tighter italic">
              {isPending 
                ? (language === Language.HEBREW ? 'השב להודעה הראשונה להתחלת ניתוח' : 'Reply to first message to start analysis') 
                : (language === Language.HEBREW ? 'חתימת למידה אופטימלית' : 'Optimal Learning Signature')}
            </p>
          </div>
        </div>
        <div className={`absolute top-4 opacity-0 group-hover:opacity-100 transition-opacity ${language === Language.HEBREW ? 'right-4' : 'left-4'}`}>
          <i className="fas fa-expand-alt text-white/40 text-xs text-flip"></i>
        </div>
      </button>

      {/* MOC Master Toggle Button */}
      <button 
        onClick={() => onNavigate?.('knowledge-map-detail')}
        className={`glass-panel rounded-[2rem] p-6 w-full transition-all duration-500 border-white/5 flex items-center justify-between group bg-[#111827] hover:bg-[#1f2937] hover:border-indigo-500/30 ${language === Language.HEBREW ? 'text-right flex-row' : 'text-left flex-row-reverse'}`}
        dir={language === Language.HEBREW ? 'rtl' : 'ltr'}
      >
        <div className={`flex items-center gap-6 ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="relative h-14 w-14 shrink-0">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
               <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
               <circle 
                cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="3" 
                strokeDasharray={`${progressPercentage} 100`}
                strokeLinecap="round"
                className="text-[#4f46e5] transition-all duration-1000 ease-in-out" 
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
               {progressPercentage}%
             </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              {language === Language.HEBREW ? 'מפת ידע (MOC)' : 'Knowledge Map (MOC)'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-500/30">
                {language === Language.HEBREW ? 'דרגה' : 'Rank'}: {masteryTitle}
              </span>
            </div>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="fas fa-expand-alt text-white/40 text-xs text-flip"></i>
        </div>
      </button>
    </div>
  );
};

export default MocDashboard;