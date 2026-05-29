import React from 'react';
import { Language } from '../types.ts';
import { UI_STRINGS, BADGE_DEFINITIONS } from '../constants.ts';
import { motion, AnimatePresence } from 'motion/react';

interface AchievementsViewProps {
  earnedBadgeIds: string[];
  onBack: () => void;
  language: Language;
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ earnedBadgeIds, onBack, language }) => {
  const strings = UI_STRINGS[language];

  return (
    <div className={`h-full w-full overflow-y-auto no-scrollbar p-6 md:p-10 flex flex-col gap-10 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ${language === Language.HEBREW ? 'text-right' : 'text-left'}`} dir={language === Language.HEBREW ? 'rtl' : 'ltr'}>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 text-white/50 hover:text-white transition-all group ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10">
            <i className={`fas ${language === Language.HEBREW ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
          </div>
          <span className="font-bold">
            {language === Language.HEBREW ? 'חזרה למסך הבית' : 'Back to Home'}
          </span>
        </button>
      </div>

      <div className="bg-[#1e293b]/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-4xl">
        <div className="p-8 md:p-12 border-b border-white/10 bg-gradient-to-br from-amber-600/20 to-transparent">
          <div className={`flex flex-col md:flex-row items-center gap-6 mb-2 ${language === Language.HEBREW ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <div className="w-20 h-20 rounded-[1.8rem] bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-2xl shrink-0 border border-amber-500/30">
              <i className="fas fa-trophy text-4xl"></i>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {strings.achievements}
              </h1>
              <p className="text-white/40 font-bold mt-2 uppercase tracking-widest text-[10px]">
                {language === Language.HEBREW ? 'הצלחנו! התקדמות המשימה שלך מתועדת כאן' : 'Mission success! Your progress is recorded here'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {BADGE_DEFINITIONS.map((badge) => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative group p-6 rounded-[2.5rem] border transition-all duration-500 ${
                  isEarned 
                    ? 'bg-white/5 border-white/10 grayscale-0 ring-1 ring-white/10' 
                    : 'bg-black/20 border-white/5 grayscale opacity-40'
                }`}
              >
                {!isEarned && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <i className="fas fa-lock text-white/10 text-4xl"></i>
                  </div>
                )}
                
                <div className={`flex items-start gap-6 ${language === Language.HEBREW ? '' : 'flex-row-reverse'}`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-2xl border border-white/10 ${isEarned ? 'bg-indigo-500/10' : 'bg-white/5'}`}>
                    <i className={`fas ${badge.icon} ${isEarned ? badge.color : 'text-white/20'}`}></i>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-black text-white mb-2 tracking-tight ${!isEarned && 'text-white/20'}`}>
                      {badge.title[language]}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isEarned ? 'text-white/60' : 'text-white/10'}`}>
                      {badge.description[language]}
                    </p>
                  </div>
                </div>

                {isEarned && (
                  <div className={`absolute top-4 ${language === Language.HEBREW ? 'left-4' : 'right-4'}`}>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </motion.div>
            );
          })}
          
          {earnedBadgeIds.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-30">
               <i className="fas fa-medal text-6xl mb-4"></i>
               <p className="font-black uppercase tracking-widest text-xs">{strings.no_badges}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsView;
