import React from 'react';
import { Concept } from '../types.ts';

interface TopicHubProps {
  concepts: Concept[];
  onSelectTopic: (topic: Concept) => void;
}

const TopicHub: React.FC<TopicHubProps> = ({ concepts, onSelectTopic }) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-5xl mx-auto py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">מרכז הלמידה הדינמי</h2>
          <p className="text-indigo-300/60 font-bold uppercase tracking-[0.4em] text-xs">Dynamic Learning Architecture</p>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-fuchsia-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept) => (
            <button
              key={concept.id}
              onClick={() => onSelectTopic(concept)}
              className="group relative text-right glass-panel rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)] hover:border-indigo-500/50 border-white/5 flex flex-col items-start h-full overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-colors"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <i className={`fas ${getIconForTopic(concept.id)} text-2xl`}></i>
              </div>

              <h3 className="text-xl font-black text-white mb-3 group-hover:text-indigo-300 transition-colors">{concept.name}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-medium mb-8">
                {concept.description}
              </p>

              <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:gap-4 transition-all">
                התחל למידה <i className="fas fa-arrow-left"></i>
              </div>
            </button>
          ))}
          
          {/* Placeholder for coming soon */}
          <div className="glass-panel rounded-[2.5rem] p-8 border-white/5 opacity-40 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 mb-4">
              <i className="fas fa-lock text-xl"></i>
            </div>
            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">בקרוב...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function getIconForTopic(id: string) {
  switch (id) {
    case 'atomic-structure': return 'fa-atom';
    case 'chemical-vs-physical': return 'fa-vials';
    case 'periodic-table': return 'fa-table-cells';
    case 'bonds': return 'fa-link';
    case 'mixtures-compounds': return 'fa-filter';
    default: return 'fa-flask';
  }
}

export default TopicHub;