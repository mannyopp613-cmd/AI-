import React from 'react';
import { Experiment, Language } from '../types.ts';
import { UI_STRINGS } from '../constants.ts';

interface HomeViewProps {
  savedExperiments: Experiment[];
  onDeleteExperiment: (id: string) => void;
  onViewExperiment: (id: string) => void;
  onNavigateToMission: () => void;
  onNavigateToAchievements: () => void;
  language: Language;
}

const HomeView: React.FC<HomeViewProps> = ({ 
  savedExperiments, onDeleteExperiment, onViewExperiment, onNavigateToMission, onNavigateToAchievements, language
}) => {
  const strings = UI_STRINGS[language];

  return (
    <div className={`h-full w-full overflow-y-auto no-scrollbar p-6 md:p-10 flex flex-col gap-10 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ${language === Language.HEBREW ? 'text-right' : 'text-left'}`} dir={language === Language.HEBREW ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] p-10 md:p-16 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/10 shadow-4xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {language === Language.HEBREW ? 'ברוכים הבאים ל-' : 'Welcome to '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">IM Agent</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-medium max-w-2xl leading-relaxed mb-10">
            {strings.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onNavigateToMission}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              <span>{language === Language.HEBREW ? 'התחל משימת למידה' : 'Start Learning Mission'}</span>
              <i className="fas fa-rocket"></i>
            </button>
            <button 
              onClick={onNavigateToAchievements}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              <span>{strings.view_achievements}</span>
              <i className="fas fa-trophy text-amber-400"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Explanation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 rounded-[2rem] bg-white/5 border-white/10 hover:bg-white/10 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-brain text-2xl"></i>
          </div>
          <h3 className="text-xl font-black text-white mb-3">{language === Language.HEBREW ? 'אבחון קוגניטיבי' : 'Cognitive Diagnosis'}</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            {language === Language.HEBREW ? 'אני מנתח כל תשובה שלך כדי להבין אם אתה מעדיף אנלוגיות, תרשימים לוגיים או ניסויים מעשיים.' : 'I analyze your every response to understand if you prefer analogies, logical diagrams, or hands-on experiments.'}
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-[2rem] bg-white/5 border-white/10 hover:bg-white/10 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-microscope text-2xl"></i>
          </div>
          <h3 className="text-xl font-black text-white mb-3">{strings.virtual_labs}</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            {strings.virtual_labs_desc}
          </p>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] bg-white/5 border-white/10 hover:bg-white/10 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-map-location-dot text-2xl"></i>
          </div>
          <h3 className="text-xl font-black text-white mb-3">{language === Language.HEBREW ? 'מפת מושגים (MOC)' : 'Concept Map (MOC)'}</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            {language === Language.HEBREW ? 'עקוב אחר ההתקדמות שלך במפת המושגים הדינמית שמתעדכנת בזמן אמת ככל שאתה שולט בחומר.' : 'Track your progress in the dynamic concept map that updates in real-time as you master the material.'}
          </p>
        </div>
      </section>

      {/* Saved Experiments Section */}
      <section className="flex flex-col gap-6 mb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <i className="fas fa-flask-vial text-indigo-400"></i>
            {language === Language.HEBREW ? 'ניסויים שמורים' : 'Saved Experiments'}
          </h2>
          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
            {savedExperiments.length} {language === Language.HEBREW ? 'פריטים' : 'Items'}
          </span>
        </div>

        {savedExperiments.length === 0 ? (
          <div className="glass-panel rounded-[2rem] p-16 bg-white/5 border-white/5 border-dashed flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-6">
              <i className="fas fa-box-open text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-white/40 mb-2">{language === Language.HEBREW ? 'אין ניסויים שמורים עדיין' : 'No saved experiments yet'}</h3>
            <p className="text-white/20 text-sm max-w-xs">
              {language === Language.HEBREW ? 'במהלך הצ\'אט, תוכל לשמור ניסויים מעניינים כדי לחזור אליהם מאוחר יותר.' : 'During the chat, you can save interesting experiments to return to them later.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedExperiments.map((exp) => (
              <div 
                key={exp.id} 
                onClick={() => onViewExperiment(exp.id)}
                className="glass-panel rounded-[2rem] p-8 bg-white/5 border-white/10 hover:border-indigo-500/30 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98]"
              >
                <div className={`absolute top-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all ${language === Language.HEBREW ? 'left-0' : 'right-0'}`}></div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">{exp.title}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const confirmText = language === Language.HEBREW ? 'האם אתה בטוח שברצונך למחוק את הניסוי?' : 'Are you sure you want to delete this experiment?';
                      if (confirm(confirmText)) {
                        onDeleteExperiment(exp.id);
                      }
                    }}
                    className="text-white/20 hover:text-red-400 transition-colors z-10"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
                <div className="text-white/50 text-sm line-clamp-4 mb-6 leading-relaxed whitespace-pre-wrap">
                  {exp.content.replace(/\[EXPERIMENT\]/g, '').trim()}
                </div>
                <div className={`flex items-center justify-between text-[10px] font-bold text-white/30 uppercase tracking-tighter ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span>{new Date(exp.timestamp).toLocaleDateString(language === Language.HEBREW ? 'he-IL' : 'en-US')}</span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-clock"></i>
                    {new Date(exp.timestamp).toLocaleTimeString(language === Language.HEBREW ? 'he-IL' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeView;
