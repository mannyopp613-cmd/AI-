import React from 'react';
import { Concept, ConceptStatus, Language } from '../types.ts';
import { UI_STRINGS, LEVELS } from '../constants.ts';

interface HeaderProps {
  name: string;
  grade: string;
  concepts: Concept[];
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  currentView: 'home' | 'mission' | 'profile-detail' | 'knowledge-map-detail' | 'habits-detail' | 'experiment-detail' | 'achievements';
  onNavigate: (view: any) => void;
  language: Language;
  onToggleLanguage: () => void;
  exp: number;
  level: number;
  streak: number;
}

const Header: React.FC<HeaderProps> = ({ 
  name, grade, concepts, onToggleSidebar, isSidebarOpen, currentView, onNavigate,
  language, onToggleLanguage, exp, level, streak
}) => {
  const masteredCount = concepts.filter(c => c.status === ConceptStatus.MASTERED).length;
  
  const currentLevelData = LEVELS.find(l => l.level === level) || LEVELS[0];
  const nextLevelData = LEVELS.find(l => l.level === level + 1);
  const masteryTitle = currentLevelData.title[language];

  const strings = UI_STRINGS[language];

  return (
    <aside className="h-full w-24 md:w-28 shrink-0 z-50 py-6 pr-6 pl-0 flex flex-col items-center">
      <div className="h-full w-full glass-panel rounded-[3rem] flex flex-col items-center justify-between py-10 bg-[#111827] border-white/5 shadow-3xl relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-fuchsia-500/5 blur-[50px] rounded-full"></div>

        {/* Top Section: Branding & Navigation */}
        <div className="flex flex-col items-center gap-8 relative z-10 w-full">
          <div className="relative group">
            <div className="w-14 h-14 bg-[#7c3aed] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-all duration-500">
              <i className="fas fa-atom text-2xl animate-spin-slow"></i>
              {/* AGENT Tag */}
              <div className="absolute -top-2 -right-2 bg-indigo-600 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/20 text-[7px] font-black text-white tracking-tighter shadow-lg">
                AGENT
              </div>
            </div>
          </div>

          {/* Duolingo style fire flame badge */}
          <button 
            onClick={() => onNavigate('profile-detail')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-transparent border border-orange-500/20 py-2 px-3 rounded-2xl hover:scale-105 active:scale-95 transition-all text-orange-400 font-extrabold shadow-sm"
            title={language === Language.HEBREW ? `רצף למידה יומי: ${streak} ימים! 🔥` : `Daily study streak: ${streak} days! 🔥`}
          >
            <i className="fas fa-fire text-orange-500 text-sm animate-pulse"></i>
            <span className="text-[11px] font-black">{streak}</span>
          </button>

          <div className="flex flex-col items-center gap-4 w-full px-4">
            <button 
              onClick={() => onNavigate('home')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${currentView === 'home' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
              title={language === Language.HEBREW ? "דף הבית" : "Home"}
            >
              <i className="fas fa-home text-lg"></i>
            </button>
            <button 
              onClick={() => onNavigate('mission')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${currentView === 'mission' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
              title={language === Language.HEBREW ? "משימת למידה" : "Learning Mission"}
            >
              <i className="fas fa-rocket text-lg"></i>
            </button>
            <button 
              onClick={() => onNavigate('profile-detail')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${currentView === 'profile-detail' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
              title={language === Language.HEBREW ? "פרופיל אישי" : "Personal Profile"}
            >
              <i className="fas fa-user-astronaut text-lg"></i>
            </button>
            <button 
              onClick={() => onNavigate('achievements' as any)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${currentView === 'achievements' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
              title={UI_STRINGS[language].achievements}
            >
              <i className="fas fa-trophy text-lg"></i>
            </button>
          </div>
        </div>

        {/* Middle Section: Language Toggle */}
        <div className="flex flex-col items-center relative z-10 gap-4">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
          
          <button 
            onClick={onToggleLanguage}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-tighter shadow-xl group relative"
          >
            <span>{language === Language.HEBREW ? 'EN' : 'HE'}</span>
            
            {/* Tooltip */}
            <div className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 bg-slate-900 px-3 py-2 rounded-lg border border-white/10 pointer-events-none whitespace-nowrap text-xs font-bold shadow-2xl">
              {strings.switch_to}
            </div>
          </button>
        </div>

        {/* Bottom Section: Profile & Menu Toggle */}
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="group relative">
            {/* User Icon now acts as the sidebar toggle */}
            <button 
              onClick={onToggleSidebar}
              className={`w-14 h-14 rounded-2xl border transition-all duration-500 flex items-center justify-center overflow-hidden shadow-2xl ${isSidebarOpen ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-indigo-300 hover:bg-white/10 hover:border-white/20'}`}
            >
               <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-user-astronaut'} text-xl transition-transform group-hover:scale-110`}></i>
            </button>
            
            {/* Pop-out Profile Data */}
            <div className={`absolute bottom-0 right-full mb-0 mr-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 bg-slate-900/95 backdrop-blur-2xl p-5 rounded-[2rem] border border-white/20 shadow-4xl pointer-events-none min-w-[220px] ${language === Language.HEBREW ? 'text-right' : 'text-left'}`} dir={language === Language.HEBREW ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <i className="fas fa-user-graduate text-indigo-400 text-xl"></i>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white border border-white/20 shadow-lg">
                    {level}
                  </div>
                </div>
                <div>
                  <p className="text-white font-black text-sm">{language === Language.HEBREW ? name : (name === 'תלמיד/ה' ? 'Student' : name)}</p>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{masteryTitle}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-1.5 px-0.5">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                      {strings.exp}
                    </span>
                    <span className="text-[10px] font-black text-white">
                      {exp}{nextLevelData ? ` / ${nextLevelData.minExp}` : ''}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 transition-all duration-1000"
                      style={{ width: `${nextLevelData ? Math.min(100, (exp / nextLevelData.minExp) * 100) : 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[8px] text-white/30 font-bold mt-1 text-center italic">
                    {nextLevelData ? `${nextLevelData.minExp - exp} ${strings.exp_next}` : 'MAX LEVEL'}
                  </p>
                </div>

                <div className="h-px w-full bg-white/10"></div>
                
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 font-black tracking-widest uppercase mb-1">{language === Language.HEBREW ? 'כיתה' : 'Grade'}</span>
                    <span className="text-xs font-black text-white">{grade}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-white/40 font-black tracking-widest uppercase mb-1">{language === Language.HEBREW ? 'מעבדה' : 'Lab'}</span>
                    <span className="text-xs font-black text-white">0{concepts.filter(c => c.status === ConceptStatus.MASTERED).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </aside>
  );
};

export default Header;