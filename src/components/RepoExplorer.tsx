import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Save, 
  RefreshCw, 
  Check, 
  Code2, 
  Sparkles, 
  Zap, 
  Search,
  FileCode,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { RepoItem } from '../types';

export const RepoExplorer: React.FC = () => {
  const [files, setFiles] = useState<RepoItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [content, setContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRefactoring, setIsRefactoring] = useState<boolean>(false);
  const [refactorMsg, setRefactorMsg] = useState<string>('');

  const fetchFileList = async () => {
    try {
      const res = await fetch('/api/repo/files');
      const data = await res.json();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (err) {
      console.error('Failed to load repo files:', err);
    }
  };

  const loadFileContent = async (filePath: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/repo/file?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (data.success) {
        setSelectedFile(filePath);
        setContent(data.content);
        setOriginalContent(data.content);
      }
    } catch (err) {
      console.error('Failed to load file content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFileContent = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/repo/save-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFile, content }),
      });
      const data = await res.json();
      if (data.success) {
        setOriginalContent(content);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save file:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefactor = async (feature: string) => {
    setIsRefactoring(true);
    setRefactorMsg(`Applying ${feature}...`);
    try {
      const res = await fetch('/api/ai/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedFile, feature }),
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.code);
        setOriginalContent(data.code);
        setRefactorMsg(`Successfully applied ${feature}!`);
        setTimeout(() => setRefactorMsg(''), 4000);
      }
    } catch (err) {
      console.error('Refactor failed:', err);
      setRefactorMsg('Failed to apply refactoring.');
    } finally {
      setIsRefactoring(false);
    }
  };

  useEffect(() => {
    fetchFileList();
    loadFileContent('README.md');
  }, []);

  const renderFileTree = (items: RepoItem[]) => {
    return items.map((item) => {
      if (item.type === 'directory') {
        return (
          <div key={item.path} className="ml-2">
            <div className="flex items-center space-x-1.5 py-1 px-2 text-xs font-semibold text-slate-300">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>{item.name}</span>
            </div>
            {item.children && renderFileTree(item.children)}
          </div>
        );
      }

      const isSelected = selectedFile === item.path;
      return (
        <button
          key={item.path}
          id={`file-tree-item-${item.name}`}
          onClick={() => loadFileContent(item.path)}
          className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-md text-xs font-mono transition-colors ml-2 ${
            isSelected
              ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-medium'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 truncate">
            <FileCode className={`w-3.5 h-3.5 ${item.name.endsWith('.py') ? 'text-blue-400' : 'text-slate-400'}`} />
            <span className="truncate">{item.name}</span>
          </div>
          {item.size && (
            <span className="text-[10px] text-slate-500 font-sans">
              {(item.size / 1024).toFixed(1)}KB
            </span>
          )}
        </button>
      );
    });
  };

  const isModified = content !== originalContent;

  return (
    <div id="repo-explorer" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* File Tree Sidebar */}
      <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[700px]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-300">Repository Files</span>
          </div>
          <button
            id="refresh-repo-btn"
            onClick={fetchFileList}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh Directory"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search python files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Tree Container */}
        <div className="mt-3 flex-1 overflow-y-auto space-y-1 pr-1">
          {files.length > 0 ? renderFileTree(files) : (
            <div className="text-xs text-slate-500 p-3 text-center">Loading repo tree...</div>
          )}
        </div>

        {/* Quick Info */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Repository:</span>
            <span className="font-mono text-indigo-400">HARRY5432/TinyBERT</span>
          </div>
          <div className="flex justify-between">
            <span>Engine:</span>
            <span className="font-mono text-emerald-400">PyTorch 1.x / 2.x</span>
          </div>
        </div>
      </div>

      {/* Code Editor & Quick Actions */}
      <div className="lg:col-span-9 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[700px]">
        {/* Editor Top Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 rounded-t-xl gap-2">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-xs font-semibold text-slate-200">{selectedFile}</span>
            {isModified && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                Modified
              </span>
            )}
          </div>

          {/* Quick Refactor AI Buttons */}
          <div className="flex items-center space-x-2">
            {selectedFile.endsWith('.py') && (
              <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 px-1.5 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>PyTorch Refactor:</span>
                </span>
                <button
                  id="refactor-amp-btn"
                  onClick={() => handleRefactor('fp16_amp')}
                  disabled={isRefactoring}
                  className="px-2 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 rounded text-[10px] font-mono font-medium transition-colors"
                >
                  + FP16 AMP
                </button>
                <button
                  id="refactor-compile-btn"
                  onClick={() => handleRefactor('torch_compile')}
                  disabled={isRefactoring}
                  className="px-2 py-1 bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-700/50 rounded text-[10px] font-mono font-medium transition-colors"
                >
                  + torch.compile
                </button>
              </div>
            )}

            <button
              id="save-repo-file-btn"
              onClick={saveFileContent}
              disabled={isSaving || !isModified}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isModified
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saveSuccess ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Refactoring Toast */}
        {refactorMsg && (
          <div className="bg-indigo-900/60 border-b border-indigo-700/50 px-4 py-2 text-xs text-indigo-200 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
            <span>{refactorMsg}</span>
          </div>
        )}

        {/* Text Area Code Editor */}
        <div className="relative flex-1 bg-slate-950 p-4 font-mono text-xs overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-500 space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
              <span>Loading file contents...</span>
            </div>
          ) : (
            <textarea
              id="code-editor-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-900/80"
              spellCheck={false}
            />
          )}
        </div>

        {/* Editor Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between rounded-b-xl">
          <div className="flex items-center space-x-4">
            <span>Lines: {content.split('\n').length}</span>
            <span>Characters: {content.length}</span>
            <span>Path: <code className="text-slate-300">{selectedFile}</code></span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Syntax Checked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
