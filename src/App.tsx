import React, { useState } from 'react';
import { Header } from './components/Header';
import { RepoExplorer } from './components/RepoExplorer';
import { DistillationSimulator } from './components/DistillationSimulator';
import { GlueBenchmarkExplorer } from './components/GlueBenchmarkExplorer';
import { InferenceVisualizer } from './components/InferenceVisualizer';
import { CliGenerator } from './components/CliGenerator';
import { AiAdvisor } from './components/AiAdvisor';
import { GitPushPanel } from './components/GitPushPanel';
import { GitBranch } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simulator');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-900 selection:text-indigo-100">
      {/* Header Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulator' && <DistillationSimulator />}
        {activeTab === 'benchmark' && <GlueBenchmarkExplorer />}
        {activeTab === 'repo' && <RepoExplorer />}
        {activeTab === 'inference' && <InferenceVisualizer />}
        {activeTab === 'cli' && <CliGenerator />}
        {activeTab === 'ai' && <AiAdvisor />}
        {activeTab === 'git' && <GitPushPanel />}
      </main>

      {/* Persistent Bottom Bar for Git & Repository Link */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-300">TinyBERT Repository Cloned: ./tinybert-repo</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('git')}
              className="flex items-center space-x-1.5 hover:text-indigo-400 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Git Commit & Push Manager</span>
            </button>
            <span>•</span>
            <a
              href="https://github.com/HARRY5432/TinyBERT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 underline underline-offset-2"
            >
              HARRY5432/TinyBERT
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
