import React from 'react';
import { 
  GitBranch, 
  Code2, 
  Cpu, 
  BarChart3, 
  Zap, 
  Terminal, 
  Bot, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'simulator', label: 'Distillation Pipeline', icon: Cpu, badge: 'Live Sim' },
    { id: 'benchmark', label: 'GLUE Benchmark', icon: BarChart3, badge: '9.4x Speed' },
    { id: 'repo', label: 'Code Explorer', icon: Code2, badge: 'PyTorch' },
    { id: 'inference', label: 'Inference Visualizer', icon: Zap },
    { id: 'cli', label: 'CLI Generator', icon: Terminal },
    { id: 'ai', label: 'AI Model Advisor', icon: Bot, badge: 'Gemini 2.5' },
    { id: 'git', label: 'Git Commit & Push', icon: GitBranch, badge: 'Deploy' },
  ];

  return (
    <header id="app-header" className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Repository Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  TinyBERT Studio
                </h1>
                <span className="px-2 py-0.5 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  HARRY5432 / TinyBERT
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Transformer Distillation Pipeline • 7.5x Smaller • 9.4x Faster
              </p>
            </div>
          </div>

          {/* Repository Links & Quick Badge */}
          <div className="flex items-center space-x-3">
            <a
              href="https://github.com/HARRY5432/TinyBERT"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-slate-500 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-md font-semibold tracking-wide ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
