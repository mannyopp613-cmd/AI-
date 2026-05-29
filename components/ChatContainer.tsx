import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, InteractiveAction, Language } from '../types.ts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UI_STRINGS } from '../constants.ts';

interface ChatContainerProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onHabitTrigger: (habitId: string) => void;
  onSaveExperiment: (title: string, content: string) => void;
  isTyping: boolean;
  language: Language;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, onSendMessage, onHabitTrigger, onSaveExperiment, isTyping, language 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const strings = UI_STRINGS[language];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      setShowActions(false);
    }
  };

  const handleSave = (idx: number, content: string) => {
    const lines = content.split('\n').filter(l => l.trim());
    const defaultTitle = language === Language.HEBREW ? 'ניסוי מדעי' : 'Scientific Experiment';
    const title = lines[0].replace(/[#*]/g, '').trim() || defaultTitle;
    onSaveExperiment(title, content);
    setSavedIds(prev => new Set(prev).add(idx));
  };

  const parseQuiz = (content: string): { text: string, options: string[] } | null => {
    if (content.includes('[QUIZ]:')) {
      const parts = content.split('[QUIZ]:');
      const introText = parts[0].trim();
      const quizItems = parts[1].split('|').map(o => o.trim()).filter(o => o);
      
      if (quizItems.length > 0) {
        const question = quizItems[0];
        const options = quizItems.slice(1);
        
        return {
          text: introText ? `${introText}\n\n${question}` : question,
          options: options
        };
      }
    }
    return null;
  };

  const renderContent = (content: string) => {
    const cleanContent = content.replace(/\[Current Prediction:.*?\]/g, '').replace(/\[EXPERIMENT\]/g, '').trim();
    
    const quiz = parseQuiz(cleanContent);
    const displayContent = quiz ? quiz.text : cleanContent;

    const parts = displayContent.split(/(!\[.*?\]\(.*?\))/g);
    return (
      <div className="space-y-4">
        <div className={`markdown-body prose prose-invert prose-indigo max-w-none prose-p:leading-relaxed prose-headings:text-white prose-strong:text-indigo-300 ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}>
          {parts.map((part, index) => {
            const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
            if (imageMatch) {
              const alt = imageMatch[1];
              const src = imageMatch[2];
              return (
                <div key={index} className="my-6 group relative cursor-zoom-in overflow-hidden rounded-3xl border border-white/10 shadow-2xl" onClick={() => setSelectedImage(src)}>
                  <img 
                    src={src} 
                    alt={alt} 
                    className="max-w-full hover:scale-105 transition-all duration-700 object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl border border-white/20">
                      <i className="fas fa-expand-alt animate-pulse"></i>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                {part}
              </ReactMarkdown>
            );
          })}
        </div>
        
        {quiz && (
          <div className="grid grid-cols-1 gap-2 mt-4 animate-in slide-in-from-bottom-4 duration-500">
            {quiz.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                   onSendMessage(opt);
                   onHabitTrigger('quiz');
                }}
                className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/20 hover:border-indigo-400/50 transition-all text-sm font-bold group flex items-center ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}
              >
                <span className={`shrink-0 w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:bg-indigo-500/40 transition-colors font-black ${language === Language.HEBREW ? 'ml-4' : 'mr-4'}`}>{i + 1}</span>
                <span className="flex-1">{opt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full glass-panel rounded-[2.5rem] border-white/10 shadow-3xl overflow-hidden relative min-h-0 ${language === Language.HEBREW ? 'text-right' : 'text-left'}`} dir={language === Language.HEBREW ? 'rtl' : 'ltr'}>
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
            alt="Enlarged chemical structure"
          />
        </div>
      )}

      <div className={`absolute top-4 z-20 flex items-center justify-between pointer-events-none ${language === Language.HEBREW ? 'left-6 right-6' : 'left-6 right-6 flex-row-reverse'}`}>
        <div className="flex items-center gap-2 bg-[#10b981]/20 px-4 py-2 rounded-full border border-[#10b981]/30 backdrop-blur-xl pointer-events-auto">
          <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">
            {language === Language.HEBREW ? 'זרם נתוני למידה: פעיל' : 'Learning Data Stream: Active'}
          </span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 pt-24">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? (language === Language.HEBREW ? 'justify-start' : 'justify-end') : (language === Language.HEBREW ? 'justify-end' : 'justify-start')} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex flex-col ${(msg.role === 'user' ? (language === Language.HEBREW ? 'items-start' : 'items-end') : (language === Language.HEBREW ? 'items-end' : 'items-start'))} max-w-[85%]`}>
              <div className={`p-6 rounded-[2rem] shadow-2xl relative ${msg.role === 'user' ? 'bg-white/10 text-white border border-white/20 rounded-tr-none' : 'chat-bubble-assistant text-white rounded-tl-none'}`}>
                <div className="text-sm md:text-[15px] leading-relaxed select-text">
                  {renderContent(msg.content)}
                </div>
                {(msg.metadata?.type === 'experiment' || 
                  (msg.role === 'assistant' && (
                    msg.content.includes('תצפית:') || 
                    msg.content.includes('מהלך:') || 
                    msg.content.includes('ציוד:') || 
                    msg.content.includes('מסקנה מדעית:') ||
                    msg.content.includes('שלבי הניסוי') ||
                    msg.content.includes('תוצאות צפויות') ||
                    msg.content.includes('מקרא ויזואלי') ||
                    msg.content.includes('Observation:') ||
                    msg.content.includes('Steps:') ||
                    msg.content.includes('Equipment:') ||
                    msg.content.includes('Scientific Conclusion:') ||
                    (msg.content.includes('ניסוי') && (msg.content.includes('שלבים:') || msg.content.includes('ציוד:')))
                  ))
                ) && (
                  <div className={`mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${language === Language.HEBREW ? '' : 'flex-row-reverse'}`}>
                    <div className="flex items-center gap-3 text-sky-400 bg-sky-400/10 px-4 py-2 rounded-xl border border-sky-400/20">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${savedIds.has(idx) ? 'bg-emerald-400' : 'bg-sky-400'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                        {savedIds.has(idx) 
                          ? (language === Language.HEBREW ? 'נשמר בהצלחה' : 'Saved Successfully') 
                          : (language === Language.HEBREW ? 'ניסוי מזוהה • מוכן לשמירה' : 'Experiment Detected • Ready to Save')}
                      </span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      {savedIds.has(idx) ? (
                        <button 
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('navigate-to-home'));
                          }}
                          className="flex-1 sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-emerald-500/30"
                        >
                          <i className="fas fa-flask"></i>
                          {language === Language.HEBREW ? 'צפה במעבדה' : 'View Lab'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSave(idx, msg.content)}
                          className="flex-1 sm:w-auto px-8 py-3 rounded-2xl bg-indigo-600 border border-indigo-400 text-white hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest shadow-2xl pulse-indigo"
                        >
                          <i className="fas fa-bookmark text-sm"></i>
                          {language === Language.HEBREW ? 'שמור ניסוי למעבדה' : 'Save exp to lab'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {msg.role === 'assistant' && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className={`absolute -bottom-8 text-[8px] text-white/20 hover:text-white/50 transition-colors flex items-center gap-1 uppercase font-black tracking-widest ${language === Language.HEBREW ? 'left-0' : 'right-0'}`}
                  >
                    <i className="fas fa-copy"></i> {language === Language.HEBREW ? 'העתק הודעה' : 'Copy Message'}
                  </button>
                )}
              </div>
              <span className="text-[9px] text-white/30 mt-3 px-3 uppercase font-black tracking-widest">
                {msg.role === 'user' ? (language === Language.HEBREW ? 'סטודנט' : 'Student') : 'IM Agent'} • {msg.timestamp.toLocaleTimeString(language === Language.HEBREW ? 'he-IL' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`flex ${language === Language.HEBREW ? 'justify-end' : 'justify-start'}`}>
             <div className="bg-indigo-500/20 px-8 py-5 rounded-[2rem] rounded-tl-none border border-indigo-500/20 flex gap-2">
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-[#111827]/80 border-t border-white/5 backdrop-blur-md">
        {showActions && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <button 
              onClick={() => { 
                const q = language === Language.HEBREW ? "תן לי אנלוגיה מהחיים למושג הזה" : "Give me a real-life analogy for this concept";
                onSendMessage(q); onHabitTrigger('analogy'); setShowActions(false); 
              }}
              className="shrink-0 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <i className={`fas fa-lightbulb ${language === Language.HEBREW ? 'ml-2' : 'mr-2'}`}></i> 
              {language === Language.HEBREW ? 'בקש אנלוגיה' : 'Request Analogy'}
            </button>
            <button 
              onClick={() => { 
                const q = language === Language.HEBREW ? "בוא נבצע ניסוי וירטואלי" : "Let's perform a virtual experiment";
                onSendMessage(q); onHabitTrigger('lab'); setShowActions(false); 
              }}
              className="shrink-0 px-5 py-2.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-black uppercase tracking-widest hover:bg-sky-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <i className={`fas fa-vial ${language === Language.HEBREW ? 'ml-2' : 'mr-2'}`}></i>
              {language === Language.HEBREW ? 'ניסוי וירטואלי' : 'Virtual Lab'}
            </button>
            <button 
              onClick={() => { 
                const q = language === Language.HEBREW ? "בחן אותי על מה שלמדנו" : "Test me on what we've learned";
                onSendMessage(q); onHabitTrigger('quiz'); setShowActions(false); 
              }}
              className="shrink-0 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <i className={`fas fa-check-circle ${language === Language.HEBREW ? 'ml-2' : 'mr-2'}`}></i>
              {language === Language.HEBREW ? 'בדיקת שליטה' : 'Mastery Check'}
            </button>
          </div>
        )}
        <div className="relative group">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={language === Language.HEBREW ? "שאל שאלה, בקש ניסוי או הסבר פשוט..." : "Ask a question, request an experiment or a simple explanation..."}
            className={`w-full bg-white/5 border border-white/10 rounded-3xl py-6 focus:bg-white/10 transition-all text-white text-base resize-none shadow-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none ${language === Language.HEBREW ? 'pl-48 pr-8' : 'pr-48 pl-8'}`}
            rows={1}
          />
          <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 ${language === Language.HEBREW ? 'left-4 border-r border-white/10 pl-3' : 'right-4 border-l border-white/10 pr-3'}`}>
            <button 
              onClick={() => { 
                const prefix = language === Language.HEBREW ? 'הראה לי המחשה מדעית של: ' : 'Show me a scientific illustration of: ';
                onSendMessage(`${prefix}${inputValue}`); 
                setInputValue(''); 
                onHabitTrigger('image');
              }} 
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 bg-fuchsia-600/20 text-fuchsia-400 rounded-xl flex items-center justify-center hover:bg-fuchsia-600/40 transition-all disabled:opacity-20 hover:scale-110 active:scale-90" 
              title={language === Language.HEBREW ? "ייצר המחשה ויזואלית" : "Generate Visual"}
            >
              <i className="fas fa-microscope text-sm"></i>
            </button>
            
            <button 
              onClick={() => setShowActions(!showActions)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${showActions ? 'bg-[#4f46e5]/40 text-white rotate-45' : 'bg-white/5 text-indigo-400 border border-indigo-500/20 hover:bg-white/10'}`}
              title={language === Language.HEBREW ? "פעולות למידה נוספות" : "More Actions"}
            >
              <i className="fas fa-plus"></i>
            </button>

            <button 
              onClick={handleSend} 
              disabled={!inputValue.trim() || isTyping} 
              className="w-12 h-12 bg-[#4f46e5] text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-90 disabled:opacity-20 transition-all shadow-xl shadow-indigo-600/30 group"
            >
              <i className={`fas fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${language === Language.HEBREW ? '' : 'scale-x-[-1]'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;