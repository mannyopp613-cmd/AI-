import React, { useState } from 'react';
import { Experiment, Language } from '../types.ts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ExperimentDetailViewProps {
  experiment: Experiment;
  onBack: () => void;
  onDelete: (id: string) => void;
  language: Language;
}

const ExperimentDetailView: React.FC<ExperimentDetailViewProps> = ({ experiment, onBack, onDelete, language }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderContent = (content: string) => {
    const cleanContent = content.replace(/\[EXPERIMENT\]/g, '').trim();
    const parts = cleanContent.split(/(!\[.*?\]\(.*?\))/g);
    
    return (
      <div className="space-y-6">
        {parts.map((part, index) => {
          const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
          if (imageMatch) {
            const alt = imageMatch[1];
            const src = imageMatch[2];
            return (
              <div 
                key={index} 
                className="my-8 group relative cursor-zoom-in overflow-hidden rounded-[2rem] border border-white/10 shadow-4xl hover:border-indigo-500/50 transition-all duration-500" 
                onClick={() => setSelectedImage(src)}
              >
                <img 
                  src={src} 
                  alt={alt} 
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-8">
                  <div className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-expand-alt animate-pulse"></i>
                    {language === Language.HEBREW ? 'הגדל המחשה מדעית' : 'Zoom Illustration'}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={index} className="markdown-body prose prose-invert prose-indigo max-w-none prose-p:leading-relaxed prose-p:text-white/80 prose-headings:text-indigo-300 prose-headings:font-black prose-strong:text-indigo-300 prose-table:border prose-table:border-white/10 prose-th:bg-white/5 prose-td:border-t prose-td:border-white/5 p-8 md:p-12 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {language === Language.HEBREW ? (
                  part
                    .replace(/ציוד המעבדה שלנו:/g, '### 🧪 ציוד המעבדה שלנו')
                    .replace(/ציוד:/g, '### 🧪 ציוד נדרש')
                    .replace(/מהלך הניסוי:/g, '### 📋 מהלך הניסוי')
                    .replace(/מהלך:/g, '### 📋 מהלך הניסוי')
                    .replace(/תצפית:/g, '### 🔍 תצפיות')
                    .replace(/מסקנה מדעית:/g, '### 💡 מסקנה מדעית')
                    .replace(/תוצאות צפויות:/g, '### 📊 תוצאות צפויות')
                    .replace(/שלבי הניסוי:/g, '### 🔢 שלבי הניסוי')
                    .replace(/הוראות בטיחות:/g, '### ⚠️ הוראות בטיחות')
                    .replace(/מקרא ויזואלי:/g, '### 🎨 מקרא ויזואלי')
                ) : (
                  part
                    .replace(/Our Laboratory Equipment:/g, '### 🧪 Lab Equipment')
                    .replace(/Equipment:/g, '### 🧪 Required Equipment')
                    .replace(/Experiment Process:/g, '### 📋 Process')
                    .replace(/Steps:/g, '### 📋 Steps')
                    .replace(/Observation:/g, '### 🔍 Observations')
                    .replace(/Scientific Conclusion:/g, '### 💡 Conclusion')
                    .replace(/Expected Results:/g, '### 📊 Expected Results')
                    .replace(/Safety Instructions:/g, '### ⚠️ Safety Instructions')
                )}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`h-full w-full overflow-y-auto no-scrollbar p-6 md:p-10 flex flex-col gap-10 max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ${language === Language.HEBREW ? 'text-right' : 'text-left'}`} dir={language === Language.HEBREW ? 'rtl' : 'ltr'}>
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className={`absolute top-10 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white text-2xl transition-all border border-white/10 ${language === Language.HEBREW ? 'right-10' : 'left-10'}`}>
            <i className="fas fa-times"></i>
          </button>
          <img 
            src={selectedImage} 
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10" 
            alt="Scientific Illustration"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${language === Language.HEBREW ? 'flex-row' : 'flex-row-reverse'}`}>
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

        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const confirmText = language === Language.HEBREW ? 'האם אתה בטוח שברצונך למחוק את הניסוי?' : 'Are you sure you want to delete this experiment?';
              if (confirm(confirmText)) {
                onDelete(experiment.id);
                onBack();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/20"
          >
            <i className="fas fa-trash-alt"></i>
            <span className="text-sm font-bold">
              {language === Language.HEBREW ? 'מחק ניסוי' : 'Delete Experiment'}
            </span>
          </button>
        </div>
      </div>

      <div className="bg-[#1e293b]/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-4xl mb-10">
        <div className={`p-8 md:p-12 border-b border-white/10 bg-gradient-to-br from-indigo-600/20 to-transparent ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}>
          <div className={`flex flex-col md:flex-row items-start md:items-center gap-6 mb-2 ${language === Language.HEBREW ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <div className="w-20 h-20 rounded-[1.8rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-2xl shrink-0 border border-indigo-500/30">
              <i className="fas fa-flask-vial text-4xl"></i>
            </div>
            <div>
              <h1 className="text-2xl md:text-5xl font-black text-white tracking-tight leading-tight">{experiment.title}</h1>
              <div className={`flex flex-wrap items-center gap-3 mt-4 ${language === Language.HEBREW ? 'justify-start' : 'justify-end'}`}>
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  {language === Language.HEBREW ? 'פרוטוקול מעבדה מאושר' : 'Approved Lab Protocol'}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {new Date(experiment.timestamp).toLocaleDateString(language === Language.HEBREW ? 'he-IL' : 'en-US')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 leading-relaxed">
          {renderContent(experiment.content)}
        </div>

        <div className="px-8 md:px-12 py-8 bg-white/5 border-t border-white/10 flex items-center justify-between text-white/30 text-xs text-left" dir="ltr">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <span>Experiment ID: {experiment.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
              <span>Timestamp: {new Date(experiment.timestamp).toLocaleTimeString(language === Language.HEBREW ? 'he-IL' : 'en-US')}</span>
            </div>
          </div>
          <div className="font-black uppercase tracking-widest text-[9px] opacity-50">
            IM AGENT LABORATORY SYSTEM V6.5.4
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentDetailView;

