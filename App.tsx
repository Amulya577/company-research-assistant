import React, { useState, useEffect } from 'react';
import ChatPanel from './components/ChatPanel';
import AccountPlanView from './components/AccountPlanView';
import { ChatMessage, AccountPlan, ResearchStatus, SectionKey, HistoryItem, Attachment } from './types';
import { sendChatMessage, generateAccountPlan, updatePlanSection } from './services/geminiService';
import { Layout, BrainCircuit, UserCircle, ChevronDown, MapPin, X, Sparkles, ChevronRight, ShieldAlert, CheckCircle, MessageSquare, ArrowLeft, RotateCw, Users, Check, PlusCircle, Settings, Sun, Moon } from 'lucide-react';

// --- Landing Page Component ---
const LandingPage = ({ onStart, onSignIn, onTry }: { onStart: () => void, onSignIn: () => void, onTry: () => void }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-zinc-900 dark:text-white flex flex-col font-sans selection:bg-indigo-500/30 overflow-y-auto transition-colors duration-300">
    {/* Navbar */}
    <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full z-50">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Research Assistant AI</span>
        </div>
        
        <div className="flex items-center gap-6">
            <button 
                onClick={onSignIn}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
                Sign In
            </button>
            <button onClick={onStart} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-5 py-2 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-black/10 dark:shadow-white/10">
                Get Started
            </button>
        </div>
    </nav>

    {/* Hero */}
    <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto mt-16 mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1] relative z-10">
            Research companies <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x">
                at the speed of thought.
            </span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed relative z-10">
            Research Assistant AI builds comprehensive account plans in seconds. Get deep insights into Work Culture, Tech Stacks, Financials, and Strategic Challenges.
        </p>
        
        <button 
            onClick={onTry}
            className="group relative z-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
        >
            Try Research Assistant AI 
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full text-left relative z-10">
            {[
                {
                    icon: <ShieldAlert className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />,
                    title: "Deep Research",
                    desc: "Real-time data on revenue, leadership, and news."
                },
                {
                    icon: <Layout className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
                    title: "Structured Plans",
                    desc: "Auto-formatted into clear, executive-ready sections."
                },
                {
                    icon: <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />,
                    title: "Tech & Culture",
                    desc: "Uncover tech stacks and employee sentiment analysis."
                }
            ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 transition-colors backdrop-blur-sm shadow-sm dark:shadow-none">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4">
                        {f.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
            ))}
        </div>
    </main>
  </div>
);

// --- Full Page History Component ---
const HistoryView = ({ items, onSelect, onBack }: { items: HistoryItem[], onSelect: (item: HistoryItem) => void, onBack: () => void }) => (
    <div className="flex-1 bg-gray-50 dark:bg-zinc-950 p-8 overflow-y-auto transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Research History</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-zinc-400 dark:text-zinc-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No research history yet.</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className="text-left p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-indigo-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-all group shadow-sm dark:shadow-none"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                                    <BrainCircuit className="w-5 h-5" />
                                </div>
                                <span className="text-xs text-zinc-500 font-mono">{item.date}</span>
                            </div>
                            <h3 className="text-zinc-900 dark:text-white font-medium mb-2 truncate pr-2">{item.title}</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                Click to resume research and view the detailed account plan for this session.
                            </p>
                        </button>
                    ))
                )}
            </div>
        </div>
    </div>
);

// --- Mock Teams Data ---
const TEAMS = [
    { id: '1', name: 'Personal Workspace', plan: 'Free', initials: 'PW' },
    { id: '2', name: 'Sales Team A', plan: 'Pro', initials: 'SA' },
    { id: '3', name: 'Marketing Org', plan: 'Ent', initials: 'MO' }
];

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'workspace' | 'history'>('landing');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Workspace State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [accountPlan, setAccountPlan] = useState<AccountPlan | null>(null);
  const [status, setStatus] = useState<ResearchStatus>(ResearchStatus.IDLE);
  const [updatingSection, setUpdatingSection] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [currentTeam, setCurrentTeam] = useState(TEAMS[0]);
  
  // Auth State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('nexus_messages');
    const savedPlan = localStorage.getItem('nexus_plan');
    const savedHistory = localStorage.getItem('nexus_history');
    const savedTheme = localStorage.getItem('theme');

    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedPlan) setAccountPlan(JSON.parse(savedPlan));
    if (savedHistory) setHistoryItems(JSON.parse(savedHistory));
    else {
        // Default history for demo
        setHistoryItems([
            { id: 1, title: "Microsoft AI Strategy", date: "Previous Session" },
            { id: 2, title: "Netflix Work Culture", date: "Previous Session" }
        ]);
    }

    // Set Theme
    if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
        document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('nexus_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (accountPlan) localStorage.setItem('nexus_plan', JSON.stringify(accountPlan));
    else localStorage.removeItem('nexus_plan');
  }, [accountPlan]);

  useEffect(() => {
    localStorage.setItem('nexus_history', JSON.stringify(historyItems));
  }, [historyItems]);

  const handleSendMessage = async (text: string, attachment?: Attachment) => {
    setStatus(ResearchStatus.RESEARCHING);
    
    // Add to History if first message of a new session
    if (messages.length === 0) {
        setHistoryItems(prev => {
            const newItem = {
                id: Date.now(),
                title: text.length > 30 ? text.substring(0, 30) + '...' : (text || "Document Analysis"),
                date: new Date().toLocaleDateString()
            };
            return [newItem, ...prev];
        });
    }

    const newUserMsg: ChatMessage = {
      role: 'user',
      text,
      timestamp: Date.now(),
      attachment // Add attachment to message history
    };
    
    const updatedHistory = [...messages, newUserMsg];
    setMessages(updatedHistory);

    try {
      const response = await sendChatMessage(updatedHistory, text, attachment);
      
      const newAiMsg: ChatMessage = {
        role: 'model',
        text: response.text,
        sources: response.sources,
        timestamp: Date.now()
      };
      
      setMessages([...updatedHistory, newAiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        role: 'model',
        text: "I encountered an error while researching. Please try again.",
        timestamp: Date.now()
      };
      setMessages([...updatedHistory, errorMsg]);
    } finally {
      setStatus(ResearchStatus.IDLE);
    }
  };

  const handleGeneratePlan = async () => {
    if (messages.length === 0) return;
    
    setStatus(ResearchStatus.GENERATING_PLAN);
    try {
      const plan = await generateAccountPlan(messages);
      setAccountPlan(plan);
      // On mobile, auto-close sidebar to see plan
      if (window.innerWidth < 768) {
          setSidebarOpen(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate plan. Please try adding more research context.");
    } finally {
      setStatus(ResearchStatus.IDLE);
    }
  };

  const handleUpdateSection = async (key: string, instruction: string) => {
    if (!accountPlan) return;
    
    setStatus(ResearchStatus.UPDATING_SECTION);
    setUpdatingSection(key);
    
    try {
      // 1. Get current data for this section
      const sectionKey = key as keyof AccountPlan;
      const currentData = accountPlan[sectionKey];
      const currentJson = JSON.stringify(currentData);

      // 2. Call AI service to rewrite
      const updatedJsonString = await updatePlanSection(currentJson, instruction, key);

      // 3. Parse result - EXTENSIVELY ROBUST logic
      let updatedData;
      try {
        // Attempt 1: Direct Parse
        updatedData = JSON.parse(updatedJsonString);
      } catch (e) {
        // Attempt 2: Extract valid JSON object from potential markdown or text
        const firstBrace = updatedJsonString.indexOf('{');
        const lastBrace = updatedJsonString.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
             const manualExtract = updatedJsonString.substring(firstBrace, lastBrace + 1);
             try {
                updatedData = JSON.parse(manualExtract);
             } catch (innerError) {
                console.error("Inner JSON parse failed", innerError);
                throw new Error("Extracted JSON was invalid");
             }
        } else {
             // Attempt 3: Remove markdown code blocks and try again
             const cleanJson = updatedJsonString.replace(/```json\s*|```/g, '').trim();
             try {
                updatedData = JSON.parse(cleanJson);
             } catch (cleanError) {
                 throw new Error("Could not parse AI response as JSON");
             }
        }
      }

      // 4. Update State
      setAccountPlan(prev => {
        if (!prev) return null;
        return {
          ...prev,
          [sectionKey]: updatedData
        };
      });

    } catch (error) {
      console.error("Failed to update section:", error);
      alert("Could not update the section. Please try again with a different instruction.");
    } finally {
      setStatus(ResearchStatus.IDLE);
      setUpdatingSection(null);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setAccountPlan(null);
    setStatus(ResearchStatus.IDLE);
    localStorage.removeItem('nexus_messages');
    localStorage.removeItem('nexus_plan');
    setView('workspace');
  };
  
  // Robust Handler for Top Companies that guarantees a fresh start
  const handleTopCompanyClick = (companyName: string) => {
      // 1. Construct initial message
      const text = `Analyze ${companyName} and generate an account plan`;
      const newUserMsg: ChatMessage = {
        role: 'user',
        text,
        timestamp: Date.now()
      };
      
      // 2. Add to History
      setHistoryItems(prev => {
          const newItem = {
              id: Date.now(),
              title: text.length > 30 ? text.substring(0, 30) + '...' : text,
              date: new Date().toLocaleDateString()
          };
          // Avoid duplicates if user clicks same company rapidly
          if (prev.length > 0 && prev[0].title === newItem.title) return prev;
          return [newItem, ...prev];
      });

      // 3. Force Hard Reset of Workspace State
      setMessages([newUserMsg]);
      setAccountPlan(null); 
      setStatus(ResearchStatus.RESEARCHING);
      
      // 4. Clear Storage for new session
      localStorage.removeItem('nexus_plan');
      localStorage.setItem('nexus_messages', JSON.stringify([newUserMsg]));
      
      // 5. Trigger API Call independently
      sendChatMessage([newUserMsg], text).then(response => {
          const newAiMsg: ChatMessage = {
            role: 'model',
            text: response.text,
            sources: response.sources,
            timestamp: Date.now()
          };
          setMessages([newUserMsg, newAiMsg]);
      }).catch(err => {
           console.error(err);
           setMessages(prev => [...prev, { role: 'model', text: "I encountered an error. Please try again.", timestamp: Date.now() }]);
      }).finally(() => {
           setStatus(ResearchStatus.IDLE);
      });
  };

  const handleGetStartedClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };
  
  const handleSignInClick = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };
  
  const handleTryClick = () => {
    setView('workspace');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
        setShowAuthModal(false);
        setView('workspace'); // Auto enter workspace after login
    }, 500);
  };

  const handleTeamSwitch = (team: typeof TEAMS[0]) => {
      setCurrentTeam(team);
      // Simulate context switch
      handleNewChat();
  };

  // Nav Top Companies Data
  const TOP_HQ_COMPANIES = [
    { name: "Microsoft", location: "Redmond, WA" },
    { name: "Google", location: "Mountain View, CA" },
    { name: "Amazon", location: "Seattle, WA" },
    { name: "Apple", location: "Cupertino, CA" },
    { name: "Meta", location: "Menlo Park, CA" },
    { name: "Tesla", location: "Austin, TX" },
    { name: "Oracle", location: "Austin, TX" },
  ];

  if (view === 'landing') {
      return (
        <>
            <button
                onClick={toggleTheme}
                className="fixed top-6 right-6 z-[60] p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-zinc-800 dark:text-white hover:bg-white/20 transition-all"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <LandingPage onStart={handleGetStartedClick} onSignIn={handleSignInClick} onTry={handleTryClick} />
        </>
      );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      
      {/* Top Navbar */}
      <nav className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 z-50 flex-shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button 
                onClick={() => setView('landing')} 
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                title="Back to Home"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
                onClick={() => window.location.reload()} 
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                title="Refresh Page"
            >
                <RotateCw className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer ml-2" onClick={() => setView('landing')}>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Research Assistant AI</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Nav Links */}
             <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <button 
                    onClick={() => setView(view === 'history' ? 'workspace' : 'history')}
                    className={`hover:text-zinc-900 dark:hover:text-white transition-colors focus:outline-none ${view === 'history' ? 'text-indigo-600 dark:text-white font-semibold' : ''}`}
                >
                    History
                </button>
                
                {/* Top Companies Dropdown */}
                <div className="relative group h-full flex items-center">
                    <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white transition-colors py-4">
                        Top Companies <ChevronDown className="w-3 h-3" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-zinc-950/50 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Main Branches (HQ)</span>
                        </div>
                        <div className="py-1">
                            {TOP_HQ_COMPANIES.map((company) => (
                                <button 
                                    key={company.name}
                                    onClick={() => handleTopCompanyClick(company.name)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-between items-center group/item transition-colors"
                                >
                                    <span className="text-zinc-700 dark:text-zinc-300 group-hover/item:text-zinc-900 dark:group-hover/item:text-white text-sm">{company.name}</span>
                                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 group-hover/item:text-indigo-500 dark:group-hover/item:text-indigo-400">
                                        <MapPin className="w-3 h-3" /> {company.location}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Switcher Dropdown */}
                <div className="relative group h-full flex items-center ml-2">
                    <button className="flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 px-2 py-1.5 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white">
                            {currentTeam.initials}
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{currentTeam.name}</span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-600">{currentTeam.plan} Plan</span>
                        </div>
                        <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                    
                    <div className="absolute top-full right-0 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-zinc-950/50 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Switch Team</span>
                            <Settings className="w-3 h-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white cursor-pointer" />
                        </div>
                        <div className="py-1">
                            {TEAMS.map((team) => (
                                <button 
                                    key={team.id}
                                    onClick={() => handleTeamSwitch(team)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex justify-between items-center group/item transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${currentTeam.id === team.id ? 'bg-indigo-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                                            {team.initials}
                                        </div>
                                        <span className={`text-sm ${currentTeam.id === team.id ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-500 dark:text-zinc-400'}`}>{team.name}</span>
                                    </div>
                                    {currentTeam.id === team.id && <Check className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />}
                                </button>
                            ))}
                        </div>
                        <div className="border-t border-zinc-200 dark:border-zinc-800 p-2">
                            <button className="w-full flex items-center justify-center gap-2 p-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                <PlusCircle className="w-3 h-3" /> Create New Team
                            </button>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Theme Toggle Button */}
             <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>

             <button 
                onClick={handleGetStartedClick}
                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
              >
                  Get Started
              </button>
          </div>
      </nav>

      {/* Main Content Switcher */}
      {view === 'history' ? (
          <HistoryView 
             items={historyItems} 
             onBack={() => setView('workspace')} 
             onSelect={(item) => {
                 // Logic to restore old chat could go here, for now starts fresh
                 handleNewChat(); 
             }}
          />
      ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Split Screen Layout: 50% Chat, 50% Plan */}
            <div 
                className={`${
                sidebarOpen ? 'w-full md:w-1/2' : 'w-0'
                } transition-all duration-300 ease-in-out h-full relative z-20 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800`}
            >
                <ChatPanel 
                messages={messages} 
                onSendMessage={handleSendMessage}
                status={status}
                historyItems={historyItems}
                onNewChat={handleNewChat}
                />
                
                {/* Toggle Button for Desktop - Positioning updated for wider sidebar */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 p-1.5 rounded-r-lg shadow-md border-y border-r border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hidden md:flex hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors z-50"
                    title={sidebarOpen ? "Collapse Chat" : "Open Chat"}
                >
                    <Layout className="w-4 h-4" />
                </button>
            </div>

            {/* Main Content (Plan) */}
            <div className="flex-1 h-full overflow-hidden relative bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
                {/* Mobile Header Toggle */}
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute left-4 top-4 z-30 bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 md:hidden text-zinc-800 dark:text-white hover:text-indigo-500"
                    >
                        <Layout className="w-5 h-5"/>
                    </button>
                )}

                <AccountPlanView 
                plan={accountPlan} 
                status={status}
                updatingSection={updatingSection}
                onGenerate={handleGeneratePlan}
                onUpdateSection={handleUpdateSection}
                />
            </div>
          </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 fade-in duration-200">
                <button 
                    onClick={() => setShowAuthModal(false)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                        {authMode === 'signin' 
                            ? 'Enter your credentials to access your workspace.' 
                            : 'Get started with Research Assistant AI for free.'}
                    </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1.5">Email Address</label>
                        <input type="email" required className="w-full bg-gray-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder-zinc-400 dark:placeholder-zinc-600" placeholder="name@company.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1.5">Password</label>
                        <input type="password" required className="w-full bg-gray-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder-zinc-400 dark:placeholder-zinc-600" placeholder="••••••••" />
                    </div>
                    
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors mt-2 shadow-lg shadow-indigo-600/20">
                        {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-500">
                    {authMode === 'signin' ? (
                        <>
                            Don't have an account?{' '}
                            <button onClick={() => setAuthMode('signup')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors">
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button onClick={() => setAuthMode('signin')} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors">
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;