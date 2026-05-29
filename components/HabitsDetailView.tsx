import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { HabitData, Language } from '../types.ts';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';

interface HabitsDetailViewProps {
  habits: HabitData[];
  onBack: () => void;
  language: Language;
}

const HabitsDetailView: React.FC<HabitsDetailViewProps> = ({ habits, onBack, language }) => {
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

  const mostEffective = useMemo(() => {
    if (!translatedHabits || translatedHabits.length === 0) return { name: language === Language.HEBREW ? 'אין' : 'None', count: 0 };
    return translatedHabits.reduce((prev, current) => (prev.count >= current.count) ? prev : current);
  }, [translatedHabits, language]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className={`h-full w-full flex flex-col p-8 overflow-y-auto no-scrollbar bg-[#0a0a0a] ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}
      dir={language === Language.HEBREW ? 'rtl' : 'ltr'}
    >
      <button 
        onClick={onBack}
        className={`self-start mb-8 flex items-center gap-2 text-[#10b981] hover:text-white transition-colors group ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}
      >
        <i className={`fas ${language === Language.HEBREW ? 'fa-arrow-right' : 'fa-arrow-left'} group-hover:translate-x-1 transition-transform`}></i>
        <span className="font-bold uppercase tracking-widest text-xs">
          {language === Language.HEBREW ? 'חזרה למסך הבית' : 'Back to Home'}
        </span>
      </button>

      <div className="max-w-6xl mx-auto w-full space-y-12 pb-20">
        <header className={`flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/5 pb-12 ${language === Language.HEBREW ? 'md:text-right' : 'md:text-left'}`}>
          <div className="space-y-4 flex-1">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#10b981]">Deep Habit Analysis</h2>
            <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-tight">
              {language === Language.HEBREW ? 'ניתוח הרגלים' : 'Habit Analysis'}
            </h1>
            <p className="text-xl text-white/50 font-medium max-w-2xl leading-relaxed">
              {language === Language.HEBREW 
                ? 'האלגוריתם של IM Agent מנתח את האינטראקציות שלך בזמן אמת כדי לזהות אילו כלי למידה מניבים את התוצאות הטובות ביותר עבורך.'
                : 'The IM Agent algorithm analyzes your interactions in real-time to identify which learning tools yield the best results for you.'}
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="glass-panel p-6 rounded-3xl bg-white/5 border-white/10 text-center min-w-[140px]">
              <span className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">
                {language === Language.HEBREW ? 'סה"כ פעולות' : 'Total Actions'}
              </span>
              <span className="text-4xl font-black text-white">{totalActions}</span>
            </div>
            <div className="glass-panel p-6 rounded-3xl bg-white/5 border-white/10 text-center min-w-[140px]">
              <span className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">
                {language === Language.HEBREW ? 'הכלי היעיל ביותר' : 'Most Effective Tool'}
              </span>
              <span className="text-xl font-black text-[#10b981]">{mostEffective.name}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel p-10 rounded-[3rem] bg-white/5 border-white/10 space-y-8">
            <div className={`flex items-center justify-between ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}>
              <h3 className="text-2xl font-black text-white">
                {language === Language.HEBREW ? 'פילוג הרגלי למידה' : 'Learning Habit Distribution'}
              </h3>
              <i className="fas fa-chart-pie text-[#10b981] text-xl"></i>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={translatedHabits}
                    innerRadius={110}
                    outerRadius={160}
                    paddingAngle={8}
                    dataKey="count"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {translatedHabits.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', textAlign: language === Language.HEBREW ? 'right' : 'left' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-10 rounded-[3rem] bg-white/5 border-white/10 space-y-8">
            <div className={`flex items-center justify-between ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}>
              <h3 className="text-2xl font-black text-white">
                {language === Language.HEBREW ? 'אינטנסיביות שימוש' : 'Usage Intensity'}
              </h3>
              <i className="fas fa-chart-bar text-sky-400 text-xl"></i>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={translatedHabits} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'bold' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', textAlign: language === Language.HEBREW ? 'right' : 'left' }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={50}>
                    {translatedHabits.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {translatedHabits.map((h, idx) => (
            <motion.div 
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-[2.5rem] bg-white/5 border-white/5 flex flex-col items-center gap-4 text-center group hover:bg-white/10 transition-all"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-500 group-hover:scale-110" style={{ boxShadow: `0 0 30px ${h.color}20` }}>
                 <div className="w-4 h-4 rounded-full" style={{ backgroundColor: h.color }}></div>
              </div>
              <div>
                <h4 className="text-white font-black text-lg">{h.name}</h4>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                  {language === Language.HEBREW ? 'מונה פעולות' : 'Action Counter'}
                </p>
              </div>
              <div className="text-4xl font-black text-white mt-2">
                {h.count}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-panel p-12 rounded-[3.5rem] bg-gradient-to-br from-emerald-500/10 to-transparent border-white/10 text-center space-y-6">
           <i className="fas fa-shield-halved text-5xl text-[#10b981] mb-2 opacity-50"></i>
           <h3 className="text-3xl font-black text-white leading-tight">
            {language === Language.HEBREW ? 'אלגוריתם ה-Insight פועל תמיד' : 'The Insight algorithm is always active'}
           </h3>
           <p className="text-lg text-white/50 max-w-3xl mx-auto font-medium leading-relaxed">
             {language === Language.HEBREW 
               ? 'הנתונים המוצגים כאן משמשים את ה-AI כדי לדייק את רמת המורכבות של ההסברים. ככל שתשתמש ביותר כלים, המערכת תדע לבנות עבורך מסע למידה חכם יותר.'
               : 'The data shown here is used by the AI to refine the complexity level of explanations. The more tools you use, the better the system can build a smarter learning journey for you.'}
           </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitsDetailView;
