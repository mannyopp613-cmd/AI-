import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.tsx';
import ChatContainer from './components/ChatContainer.tsx';
import MocDashboard from './components/MocDashboard.tsx';
import LearningHabitsTracker from './components/LearningHabitsTracker.tsx';
import HomeView from './components/HomeView.tsx';
import ProfileDetailView from './components/ProfileDetailView.tsx';
import KnowledgeMapDetailView from './components/KnowledgeMapDetailView.tsx';
import HabitsDetailView from './components/HabitsDetailView.tsx';
import ExperimentDetailView from './components/ExperimentDetailView.tsx';
import AchievementsView from './components/AchievementsView.tsx';
import OnboardingView from './components/OnboardingView.tsx';
import { ChatMessage, StudentProfile, ConceptStatus, HabitData, Experiment, Language, UserAccount } from './types.ts';
import { INITIAL_CONCEPTS, UI_STRINGS, LEVELS, BADGE_DEFINITIONS } from './constants.ts';
import { getChatResponse, getChatResponseStream, analyzeStudentState, generateScientificImage } from './services/gemini.ts';
import { UN_COUNTRIES, getCountryByCode } from './unCountries.ts';

const INITIAL_HABITS: HabitData[] = [
  { id: 'analogy', name: 'אנלוגיות', count: 0, color: '#f59e0b' },
  { id: 'lab', name: 'ניסויים', count: 0, color: '#0ea5e9' },
  { id: 'quiz', name: 'בחנים', count: 0, color: '#10b981' },
  { id: 'image', name: 'המחשות', count: 0, color: '#d946ef' },
];

const updateStreak = (p: StudentProfile): StudentProfile => {
  const todayStr = new Date().toISOString().split('T')[0];
  const completed = p.completedDays || [];
  
  if (completed.includes(todayStr)) {
    return p;
  }
  
  const newCompleted = [...completed, todayStr].sort();
  
  // Calculate consecutive days backwards from today
  let calculatedStreak = 0;
  let checkDate = new Date();
  
  while (true) {
    const checkStr = checkDate.toISOString().split('T')[0];
    if (newCompleted.includes(checkStr)) {
      calculatedStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return {
    ...p,
    streak: calculatedStreak > 0 ? calculatedStreak : 1,
    lastActiveDate: todayStr,
    completedDays: newCompleted
  };
};

const App: React.FC = () => {
  const [activeUser, setActiveUser] = useState<string | null>(() => {
    return localStorage.getItem('chemismart_active_user');
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('chemismart_language');
    return (saved as Language) || Language.HEBREW;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'mission' | 'profile-detail' | 'knowledge-map-detail' | 'habits-detail' | 'experiment-detail' | 'achievements'>('home');
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const active = localStorage.getItem('chemismart_active_user');
    if (active) {
      const saved = localStorage.getItem(`chemismart_messages_${active}`);
      if (saved) return JSON.parse(saved);
    }
    const savedOld = localStorage.getItem('chemismart_messages');
    if (savedOld) return JSON.parse(savedOld);
    return [
      {
        role: 'assistant',
        content: UI_STRINGS[Language.HEBREW].intro,
        timestamp: new Date()
      }
    ];
  });
  
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const active = localStorage.getItem('chemismart_active_user');
    if (active) {
      const saved = localStorage.getItem(`chemismart_profile_${active}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 
          ...parsed, 
          habits: parsed.habits || INITIAL_HABITS,
          learningStyle: parsed.learningStyle || UI_STRINGS[Language.HEBREW].learning_style_wait,
          savedExperiments: parsed.savedExperiments || [],
          exp: parsed.exp || 0,
          level: parsed.level || 1,
          badges: parsed.badges || []
        };
      }
    }
    
    // Check old single user profile
    const savedOld = localStorage.getItem('chemismart_profile');
    if (savedOld) {
      const parsed = JSON.parse(savedOld);
      return { 
        ...parsed, 
        habits: parsed.habits || INITIAL_HABITS,
        learningStyle: parsed.learningStyle || UI_STRINGS[Language.HEBREW].learning_style_wait,
        savedExperiments: parsed.savedExperiments || [],
        exp: parsed.exp || 0,
        level: parsed.level || 1,
        badges: parsed.badges || []
      };
    }

    return {
      name: 'תלמיד/ה',
      grade: "ז'-ט'",
      learningStyle: UI_STRINGS[Language.HEBREW].learning_style_wait,
      concepts: INITIAL_CONCEPTS,
      history: [],
      habits: INITIAL_HABITS,
      savedExperiments: [],
      exp: 0,
      level: 1,
      badges: []
    };
  });

  const [notification, setNotification] = useState<{title: string, icon: string, type: 'badge' | 'level'} | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Sync profile and messages to user-specific keys constantly
  useEffect(() => {
    if (activeUser) {
      localStorage.setItem('chemismart_active_user', activeUser);
      localStorage.setItem(`chemismart_profile_${activeUser}`, JSON.stringify(profile));
      localStorage.setItem('chemismart_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('chemismart_active_user');
    }
  }, [profile, activeUser]);

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem(`chemismart_messages_${activeUser}`, JSON.stringify(messages));
      localStorage.setItem('chemismart_messages', JSON.stringify(messages));
    }
  }, [messages, activeUser]);

  // Constantly update global users list in localStorage too to keep user stats correct on login page
  useEffect(() => {
    if (activeUser) {
      const rawUsers = localStorage.getItem('chemismart_users');
      const users: UserAccount[] = rawUsers ? JSON.parse(rawUsers) : [];
      const updated = users.map(u => {
        if (u.username === activeUser) {
          return { ...u, profile, messages };
        }
        return u;
      });
      // Handle scenario where we need to add back current user if list was deleted
      if (activeUser && !users.some(u => u.username === activeUser)) {
        users.push({
          username: activeUser,
          passwordHash: '1234', // default fallback
          profile,
          messages,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('chemismart_users', JSON.stringify(users));
      } else {
        localStorage.setItem('chemismart_users', JSON.stringify(updated));
      }
    }
  }, [profile, messages, activeUser]);

  const handleOnboardingComplete = useCallback((userData: { username: string; passwordHash: string; name: string; grade: string; learningGoal: string; dailyGoal: string; language: Language; mascotId: string; countryCode: string }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const initialProfile: StudentProfile = {
      name: userData.name,
      grade: userData.grade,
      learningStyle: UI_STRINGS[userData.language].learning_style_wait,
      concepts: INITIAL_CONCEPTS,
      history: [],
      habits: INITIAL_HABITS,
      savedExperiments: [],
      exp: 0,
      level: 1,
      badges: [],
      learningGoal: userData.learningGoal,
      dailyGoal: userData.dailyGoal,
      mascotId: userData.mascotId,
      streak: 1,
      lastActiveDate: todayStr,
      completedDays: [todayStr],
      countryCode: userData.countryCode || 'IL'
    };

    const initialMessages: ChatMessage[] = [
      {
        role: 'assistant',
        content: UI_STRINGS[userData.language].intro,
        timestamp: new Date()
      }
    ];

    // Save user to the registered users array
    const rawUsers = localStorage.getItem('chemismart_users');
    const users: UserAccount[] = rawUsers ? JSON.parse(rawUsers) : [];
    
    const newAccount: UserAccount = {
      username: userData.username,
      passwordHash: userData.passwordHash,
      profile: initialProfile,
      messages: initialMessages,
      createdAt: new Date().toISOString()
    };
    
    users.push(newAccount);
    localStorage.setItem('chemismart_users', JSON.stringify(users));

    // Commit state changes
    setLanguage(userData.language);
    setProfile(initialProfile);
    setMessages(initialMessages);
    setActiveUser(userData.username);
    
    // Explicitly write profile/messages/active keys of this user to storage immediately
    localStorage.setItem('chemismart_active_user', userData.username);
    localStorage.setItem(`chemismart_profile_${userData.username}`, JSON.stringify(initialProfile));
    localStorage.setItem(`chemismart_messages_${userData.username}`, JSON.stringify(initialMessages));

    setNotification({
      title: userData.language === Language.HEBREW ? `ברוכים הבאים, ${userData.name}! 🚀` : `Welcome, ${userData.name}! 🚀`,
      icon: 'fa-user-astronaut',
      type: 'level'
    });
  }, []);

  const handleRestoreUser = useCallback((account: UserAccount) => {
    const updatedProfile = updateStreak({
      ...account.profile,
      countryCode: account.profile.countryCode || 'IL'
    });
    localStorage.setItem('chemismart_active_user', account.username);
    localStorage.setItem(`chemismart_profile_${account.username}`, JSON.stringify(updatedProfile));
    localStorage.setItem(`chemismart_messages_${account.username}`, JSON.stringify(account.messages));

    setActiveUser(account.username);
    setProfile(updatedProfile);
    setMessages(account.messages);
    
    setNotification({
      title: language === Language.HEBREW ? `שלום שוב, ${account.profile.name}! 👋` : `Welcome back, ${account.profile.name}! 👋`,
      icon: 'fa-rocket',
      type: 'level'
    });
  }, [language]);

  const handleLogout = useCallback(() => {
    // Save current states first to localStorage of current user
    if (activeUser) {
      localStorage.setItem(`chemismart_profile_${activeUser}`, JSON.stringify(profile));
      localStorage.setItem(`chemismart_messages_${activeUser}`, JSON.stringify(messages));
      
      // Update global accounts array too
      const rawUsers = localStorage.getItem('chemismart_users');
      if (rawUsers) {
        const users: UserAccount[] = JSON.parse(rawUsers);
        const updated = users.map(u => {
          if (u.username === activeUser) {
            return { ...u, profile, messages };
          }
          return u;
        });
        localStorage.setItem('chemismart_users', JSON.stringify(updated));
      }
    }

    // Reset session
    setActiveUser(null);
    localStorage.removeItem('chemismart_active_user');
    
    // Clear sidebar state
    setIsSidebarOpen(false);
  }, [activeUser, profile, messages]);

  const handleReward = useCallback((expGain: number, badgeId?: string) => {
    setProfile(prev => {
      const activeProfile = updateStreak(prev);
      let newExp = activeProfile.exp + expGain;
      let newLevel = activeProfile.level;
      let newBadges = [...activeProfile.badges];
      let notificationToSet = null;

      // Check for level up
      const nextLevelData = LEVELS.find(l => l.level === activeProfile.level + 1);
      if (nextLevelData && newExp >= nextLevelData.minExp) {
        newLevel = nextLevelData.level;
        notificationToSet = { 
          title: UI_STRINGS[language].level_up + ": " + nextLevelData.title[language], 
          icon: 'fa-arrow-up', 
          type: 'level' as const 
        };
      }

      // Check for badge
      if (badgeId && !newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
        const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
        if (badge) {
          notificationToSet = { 
            title: UI_STRINGS[language].new_badge + ": " + badge.title[language], 
            icon: badge.icon, 
            type: 'badge' as const 
          };
        }
      }

      if (notificationToSet) {
        setNotification(notificationToSet);
      }

      return { ...activeProfile, exp: newExp, level: newLevel, badges: newBadges };
    });
  }, [language]);

  useEffect(() => {
    localStorage.setItem('chemismart_language', language);
    // Update initial message if it's the only one and language changed
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{
        role: 'assistant',
        content: UI_STRINGS[language].intro,
        timestamp: new Date()
      }]);
    }
  }, [language, messages.length]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === Language.HEBREW ? Language.ENGLISH : Language.HEBREW);
  };

  useEffect(() => {
    const handleHomeNav = () => setCurrentView('home');
    window.addEventListener('navigate-to-home', handleHomeNav);
    return () => window.removeEventListener('navigate-to-home', handleHomeNav);
  }, []);

  const [isTyping, setIsTyping] = useState(false);

  const handleHabitTrigger = useCallback((habitId: string) => {
    setProfile(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === habitId ? { ...h, count: h.count + 1 } : h)
    }));
  }, []);

  const handleSaveExperiment = useCallback((title: string, content: string) => {
    const newExperiment: Experiment = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      timestamp: new Date()
    };
    setProfile(prev => ({
      ...prev,
      savedExperiments: [newExperiment, ...prev.savedExperiments]
    }));
    
    // Reward EXP and badge
    handleReward(50, profile.savedExperiments.length === 0 ? 'test-tube-explorer' : undefined);
  }, [profile.savedExperiments.length, handleReward]);

  const handleDeleteExperiment = useCallback((id: string) => {
    setProfile(prev => ({
      ...prev,
      savedExperiments: prev.savedExperiments.filter(e => e.id !== id)
    }));
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Award engagement EXP
    handleReward(5);
    
    try {
      const lowerContent = content.toLowerCase();
      const isImageRequest = 
        lowerContent.includes('תמונה') || 
        lowerContent.includes('ייצר') || 
        lowerContent.includes('המחשה') || 
        lowerContent.includes('תרשים') || 
        lowerContent.includes('דיאגרמה');

      if (isImageRequest) {
        const imageUrl = await generateScientificImage(content);
        if (imageUrl) {
          const imgMsg: ChatMessage = { 
            role: 'assistant', 
            content: `${UI_STRINGS[language].image_labels}\n![Scientific Image](${imageUrl})\n\n${UI_STRINGS[language].image_clear}`, 
            timestamp: new Date() 
          };
          setMessages(prev => [...prev, imgMsg]);
          setIsTyping(false);
          return;
        }
      }

      // Create a placeholder for the assistant response
      const assistantMsgPlaceholder: ChatMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsgPlaceholder]);
      setIsTyping(false);

      let fullResponseText = '';
      const stream = getChatResponseStream([...messages, userMsg], profile, language);
      
      for await (const chunk of stream) {
        fullResponseText += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content = fullResponseText;
          }
          return newMessages;
        });
      }

      const responseText = fullResponseText;
      
      const predictionMatch = responseText.match(/\[תיעוד סגנון למידה:\s*(.*?)[.\]]/i) || 
                              responseText.match(/\[Current Prediction:\s*(.*?)[.\]]/i) || 
                              responseText.match(/\[Learning Style Record:\s*(.*?)[.\]]/i);
      if (predictionMatch) {
        let predictedStyle = predictionMatch[1].trim();
        // Fallback for English styles if they appear
        if (predictedStyle.toLowerCase().includes('logical') && predictedStyle.toLowerCase().includes('textual') && language === Language.HEBREW) {
          predictedStyle = 'לוגי וטקסטואלי';
        }
        setProfile(prev => ({ ...prev, learningStyle: predictedStyle }));
      }

      let type: 'experiment' | 'analogy' | 'quiz' | undefined;
      const lowerResponse = responseText.toLowerCase();
      if (
        responseText.includes('[EXPERIMENT]') || 
        responseText.includes('תצפית:') || 
        responseText.includes('מהלך:') ||
        responseText.includes('מבנה הניסוי') ||
        responseText.includes('מסקנה מדעית:') ||
        responseText.includes('ציוד:') ||
        responseText.includes('שלבי הניסוי') ||
        responseText.includes('הוראות בטיחות') ||
        responseText.includes('תוצאות צפויות') ||
        (responseText.includes('ניסוי') && (responseText.includes('ציוד') || responseText.includes('שלבים') || responseText.includes('חלק')))
      ) {
        type = 'experiment';
      }
      if (responseText.includes('כמו')) type = 'analogy';
      if (responseText.includes('[QUIZ]:')) type = 'quiz';

      // Update final message with metadata and cleaned content
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          lastMsg.content = responseText.replace('[EXPERIMENT]', '').trim();
          lastMsg.metadata = type ? { type } : undefined;
        }
        return newMessages;
      });

      // Only run analysis every 3 messages to save API quota
      if (messages.length % 3 === 0) {
        const assistantMsgFinal: ChatMessage = { role: 'assistant', content: responseText, timestamp: new Date() };
        const analysis = await analyzeStudentState([...messages, userMsg, assistantMsgFinal], profile, language);
        if (analysis) {
          setProfile(prev => ({
            ...prev,
            concepts: prev.concepts.map(c => {
              const update = analysis.updatedConcepts.find(u => u.id === c.id);
              if (!update) return c;
              
              const newStatus = update.status?.toLowerCase() as ConceptStatus;
              return { 
                ...c, 
                status: newStatus || c.status, 
                identifiedWeakness: update.identifiedWeakness || c.identifiedWeakness 
              };
            }),
            learningStyle: (analysis.suggestedLearningStyle && analysis.suggestedLearningStyle !== 'ממתין לאבחון...') 
              ? analysis.suggestedLearningStyle 
              : prev.learningStyle
          }));

          // Badge checking logic based on concepts
          analysis.updatedConcepts.forEach(update => {
            if (update.status === ConceptStatus.MASTERED) {
              if (update.id === 'mechanics-forces') handleReward(100, 'newton-master');
              if (update.id === 'atomic-structure') handleReward(100, 'quantum-wizard');
            }
          });
          
          // Curiosity king check
          const totalHabits = profile.habits.reduce((acc, h) => acc + h.count, 0);
          if (totalHabits >= 50) handleReward(0, 'curiosity-king');
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: `${UI_STRINGS[language].error_comm} ${error.message || 'שגיאה לא ידועה'}. ${UI_STRINGS[language].try_again}`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, profile]);

  if (!activeUser) {
    return (
      <OnboardingView 
        onCompleteOnboarding={handleOnboardingComplete}
        onRestoreUser={handleRestoreUser}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      <Header 
        name={profile.name} 
        grade={profile.grade} 
        concepts={profile.concepts} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        currentView={currentView}
        onNavigate={setCurrentView}
        language={language}
        onToggleLanguage={toggleLanguage}
        exp={profile.exp}
        level={profile.level}
        streak={profile.streak || 1}
      />
      
      {notification && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 fade-in duration-500`}>
          <div className="bg-indigo-600 border border-indigo-400 p-6 rounded-[3rem] shadow-4xl flex items-center gap-6 backdrop-blur-2xl bg-opacity-80">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${notification.type === 'badge' ? 'bg-amber-400/20 text-amber-400' : 'bg-emerald-400/20 text-emerald-400'}`}>
              <i className={`fas ${notification.icon}`}></i>
            </div>
            <div>
              <p className="text-white font-black text-lg tracking-tight">{notification.title}</p>
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">+ {notification.type === 'badge' ? 'Achievement Unlocked' : 'Rank Up'}</p>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 relative overflow-hidden flex flex-col min-h-0 py-6 pl-6 pr-0">
        <div className="flex-1 h-full w-full overflow-hidden max-w-[1400px] mx-auto">
          {currentView === 'home' ? (
            <HomeView 
              savedExperiments={profile.savedExperiments} 
              onDeleteExperiment={handleDeleteExperiment}
              onViewExperiment={(id) => {
                setSelectedExperimentId(id);
                setCurrentView('experiment-detail');
              }}
              onNavigateToMission={() => setCurrentView('mission')}
              onNavigateToAchievements={() => setCurrentView('achievements')}
              language={language}
            />
          ) : currentView === 'mission' ? (
            <ChatContainer 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              onHabitTrigger={handleHabitTrigger}
              onSaveExperiment={handleSaveExperiment}
              isTyping={isTyping} 
              language={language}
            />
          ) : currentView === 'profile-detail' ? (
            <ProfileDetailView 
              username={activeUser || "Student"}
              profile={profile}
              onUpdateProfile={(updated) => setProfile(updated)}
              onBack={() => setCurrentView('home')}
              language={language}
            />
          ) : currentView === 'knowledge-map-detail' ? (
            <KnowledgeMapDetailView 
              concepts={profile.concepts}
              onBack={() => setCurrentView('home')}
              language={language}
            />
          ) : currentView === 'experiment-detail' ? (
            <ExperimentDetailView 
              experiment={profile.savedExperiments.find(e => e.id === selectedExperimentId)!}
              onBack={() => setCurrentView('home')}
              onDelete={handleDeleteExperiment}
              language={language}
            />
          ) : currentView === 'achievements' ? (
            <AchievementsView 
              earnedBadgeIds={profile.badges}
              onBack={() => setCurrentView('home')}
              language={language}
            />
          ) : (
            <HabitsDetailView 
              habits={profile.habits}
              onBack={() => setCurrentView('home')}
              language={language}
            />
          )}
        </div>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] transition-all duration-500 animate-in fade-in" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div className={`fixed top-0 right-0 h-full w-[85vw] sm:w-[450px] bg-[#161b2e]/80 backdrop-blur-[60px] z-[70] border-l border-white/10 shadow-[-40px_0_80px_rgba(0,0,0,0.9)] transition-all duration-700 ease-in-out transform flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-10 pt-28 h-full flex flex-col gap-8 overflow-hidden relative">
            <div className="absolute top-10 left-10">
               <button 
                onClick={() => setIsSidebarOpen(false)}
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10 shadow-xl"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className={`mt-4 ${language === Language.HEBREW ? 'text-right' : 'text-left'}`}>
              <h2 className="text-white font-black text-3xl tracking-tight mb-2">
                {language === Language.HEBREW ? 'מרכז משימה' : 'Mission Center'}
              </h2>
              <div className={`flex items-center gap-2 ${language === Language.HEBREW ? 'justify-end' : 'justify-start'}`}>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em]">
                  {language === Language.HEBREW ? 'בקרת משימה אוטונומית' : 'Autonomous Mission Control'}
                </p>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-16 pr-1">
              <MocDashboard 
                concepts={profile.concepts} 
                learningStyle={profile.learningStyle} 
                onNavigate={(view) => {
                  setCurrentView(view as any);
                  setIsSidebarOpen(false);
                }} 
                language={language}
                level={profile.level}
              />
              <LearningHabitsTracker 
                habits={profile.habits} 
                onNavigate={(view) => {
                  setCurrentView(view as any);
                  setIsSidebarOpen(false);
                }}
                language={language}
              />
            </div>

            {/* Futuristic Sign Out Button */}
            <div className="mt-auto pt-4 border-t border-white/5 shrink-0">
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/20 hover:border-rose-500/40 text-rose-300 font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 text-xs uppercase tracking-wider shadow-lg"
              >
                <i className="fas fa-sign-out-alt text-rose-400"></i>
                <span>{language === Language.HEBREW ? 'התנתקות מהחשבון' : 'Sign Out Account'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className={`fixed bottom-6 opacity-30 pointer-events-none z-0 ${language === Language.HEBREW ? 'left-6' : 'right-6'}`}>
        <p className="text-[8px] font-black text-indigo-200 uppercase tracking-[0.5em] flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          {language === Language.HEBREW ? 'ליבת בינה IM Agent v6.5.4' : 'IM Agent Intelligence Core v6.5.4'}
        </p>
      </div>

    </div>
  );
};

export default App;