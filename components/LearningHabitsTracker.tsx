import React, { useMemo } from 'react';
import { HabitData, Language } from '../types.ts';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';

interface LearningHabitsTrackerProps {
  habits: HabitData[];
  onNavigate?: (view: string) => void;
  language: Language;
}

const LearningHabitsTracker: React.FC<LearningHabitsTrackerProps> = ({ habits, onNavigate, language }) => {
  const mostEffective = useMemo(() => {
    if (!habits || habits.length === 0) return { name: 'None', count: 0 };
    return habits.reduce((prev, current) => (prev.count >= current.count) ? prev : current);
  }, [habits]);

  const totalActions = useMemo(() => habits.reduce((sum, h) => sum + h.count, 0), [habits]);

  const translatedHabits = useMemo(() => {
    return habits.map(h => {
      let name = h.name;
      if (language === Language.ENGLISH) {
        if (name === 'אנלוגיות') name = 'Analogies';
        if (name === 'ניסויים') name = 'Experiments';
        if (name === 'בחנים') name = 'Quizzes';
        if (name === 'המחשות') name = 'Illustrations';
      }
      return { ...h, name };
    });
  }, [habits, language]);

  if (totalActions === 0) {
    return (
      <div className={`glass-panel rounded-[2rem] p-6 flex flex-col items-center justify-center text-center border-white/10 space-y-3 shrink-0 ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}>
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <i className="fas fa-chart-line text-indigo-400/30 text-xl"></i>
        </div>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{language === Language.HEBREW ? 'מעקב הרגלי למידה' : 'Learning habits tracking'}</p>
        <p className="text-white/20 text-[9px] max-w-[180px]">{language === Language.HEBREW ? 'התחל להשתמש בכלים השונים כדי לראות את ניתוח ההרגלים שלך' : 'Start using different tools to see your habits analysis'}</p>
      </div>
    );
  }

  return (
    <button 
      onClick={() => onNavigate?.('habits-detail')}
      className={`glass-panel rounded-[2rem] p-6 border-white/5 flex flex-col gap-4 shrink-0 overflow-hidden relative group bg-[#111827] w-full hover:bg-[#1f2937] transition-all duration-300 ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}
      dir={language === Language.HEBREW ? 'rtl' : 'ltr'}
    >
      <div className={`absolute w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full ${language === Language.HEBREW ? '-top-10 -right-10' : '-top-10 -left-10'}`}></div>
      
      <div className={`flex items-center justify-between mb-2 relative z-10 w-full ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981]">{language === Language.HEBREW ? 'חיבור חי (LIVE)' : 'LIVE LINK'}</h3>
          <p className="text-xs text-white/50 font-bold">{language === Language.HEBREW ? 'זרם נתוני למידה' : 'Learning data stream'}</p>
        </div>
        <div className="bg-[#10b981]/10 px-3 py-1.5 rounded-xl border border-[#10b981]/20 text-center backdrop-blur-md">
          <p className="text-[8px] text-[#10b981] font-black uppercase mb-0.5 tracking-tighter">{language === Language.HEBREW ? 'ביסוס נתונים בזמן אמת' : 'Real-time data grounding'}</p>
          <p className="text-[10px] text-white font-black">{language === Language.HEBREW ? 'פעיל' : 'Active'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 h-28 relative z-10 w-full">
        <div className="w-full h-full">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={translatedHabits} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', textAlign: language === Language.HEBREW ? 'right' : 'left' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {translatedHabits.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={translatedHabits}
                innerRadius={20}
                outerRadius={40}
                paddingAngle={5}
                dataKey="count"
                stroke="none"
              >
                {translatedHabits.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`absolute top-4 opacity-0 group-hover:opacity-100 transition-opacity ${language === Language.HEBREW ? 'right-4' : 'left-4'}`}>
        <i className="fas fa-expand-alt text-white/40 text-[10px] text-flip"></i>
      </div>
    </button>
  );
};

export default LearningHabitsTracker;