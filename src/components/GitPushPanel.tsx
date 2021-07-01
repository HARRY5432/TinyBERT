import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  Send, 
  RefreshCw, 
  Check, 
  Copy, 
  Terminal, 
  ShieldAlert, 
  CheckCircle2,
  ExternalLink,
  Code2
} from 'lucide-react';

export const GitPushPanel: React.FC = () => {
  const [branch, setBranch] = useState<string>('main');
  const [changes, setChanges] = useState<string[]>([]);
  const [recentCommits, setRecentCommits] = useState<string[]>([]);
  const [commitMsg, setCommitMsg] = useState<string>('Improve TinyBERT pipeline with PyTorch AMP & torch.compile optimizations');
  const [authorName, setAuthorName] = useState<string>('HARRY5432 Developer');
  const [authorEmail, setAuthorEmail] = useState<string>('poter5432@gmail.com');
  const [githubPat, setGithubPat] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCommiting, setIsCommiting] = useState<boolean>(false);
  const [commitOutput, setCommitOutput] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const repoUrl = 'https://github.com/HARRY5432/TinyBERT.git';

  const fetchGitStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/git/status');
      const data = await res.json();
      if (data.success) {
        setBranch(data.branch || 'main');
        setChanges(data.changes || []);
        setRecentCommits(data.recentCommits || []);
      }
    } catch (err) {
      console.error('Failed to fetch git status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMsg.trim()) return;
    setIsCommiting(true);
    setCommitOutput('');
    try {
      const res = await fetch('/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: commitMsg,
          authorName,
          authorEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCommitOutput(`[SUCCESS] Staged changes committed!\n\nOutput:\n${data.output}`);
        fetchGitStatus();
      } else {
        setCommitOutput(`[ERROR] ${data.error}`);
      }
    } catch (err: any) {
      setCommitOutput(`[ERROR] ${err.message}`);
    } finally {
      setIsCommiting(false);
    }
  };

  useEffect(() => {
    fetchGitStatus();
  }, []);

  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [pushOutput, setPushOutput] = useState<string>('');

  const handlePush = async () => {
    setIsPushing(true);
    setPushOutput('');
    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubPat,
          branch,
          remoteUrl: repoUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPushOutput(`[SUCCESS] Pushed to GitHub repository successfully!\n\nOutput:\n${data.output}`);
        fetchGitStatus();
      } else {
        setPushOutput(`[ERROR] ${data.error}`);
      }
    } catch (err: any) {
      setPushOutput(`[ERROR] ${err.message}`);
    } finally {
      setIsPushing(false);
    }
  };

  const pushCommandWithPat = githubPat
    ? `git push https://${githubPat}@github.com/HARRY5432/TinyBERT.git ${branch}`
    : `git push origin ${branch}`;

  const copyPushCommand = () => {
    navigator.clipboard.writeText(pushCommandWithPat);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  return (
    <div id="git-push-panel" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                Git Manager & Deploy
              </span>
              <h2 className="text-xl font-bold text-slate-100">Commit & Push Changes to GitHub Repository</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Target Repository: <code className="text-blue-300">https://github.com/HARRY5432/TinyBERT.git</code> • Branch: <code className="text-emerald-400">{branch}</code>
            </p>
          </div>

          <button
            id="refresh-git-status-btn"
            onClick={fetchGitStatus}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Git Status</span>
          </button>
        </div>

        {/* Changes Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Modified Files List */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Uncommitted Local Changes</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                {changes.length} Files Modified
              </span>
            </div>

            <div className="font-mono text-xs max-h-40 overflow-y-auto space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800/80">
              {changes.length === 0 ? (
                <div className="text-emerald-400 text-center py-2 flex items-center justify-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Working tree is clean. Ready to push!</span>
                </div>
              ) : (
                changes.map((c, i) => (
                  <div key={i} className="text-amber-300 truncate">
                    {c}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Commits */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Recent Local Commit Log</span>
              <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="font-mono text-xs max-h-40 overflow-y-auto space-y-1.5 bg-slate-900 p-3 rounded-lg border border-slate-800/80">
              {recentCommits.map((c, i) => (
                <div key={i} className="text-slate-300 truncate border-b border-slate-800/60 pb-1 last:border-0">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Commit & Push Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stage 1: Commit Local Changes */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <GitCommit className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              1. Create Local Git Commit
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Author Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Author Email</label>
                <input
                  type="text"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Commit Message</label>
              <textarea
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none font-mono"
              />
            </div>

            <button
              id="git-commit-btn"
              onClick={handleCommit}
              disabled={isCommiting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20"
            >
              <GitCommit className="w-4 h-4" />
              <span>{isCommiting ? 'Creating Commit...' : 'Stage All & Commit'}</span>
            </button>

            {commitOutput && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {commitOutput}
              </div>
            )}
          </div>
        </div>

        {/* Stage 2: Push to GitHub Remote */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              2. Push Commits to GitHub Remote
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">
                GitHub Personal Access Token (PAT) [Optional for authenticated push]:
              </label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={githubPat}
                onChange={(e) => setGithubPat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Executable Git Push Command:</label>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 break-all select-all">
                {pushCommandWithPat}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                id="git-push-btn"
                onClick={handlePush}
                disabled={isPushing}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>{isPushing ? 'Pushing to GitHub...' : 'Push to GitHub Remote'}</span>
              </button>

              <button
                id="copy-git-push-cmd-btn"
                onClick={copyPushCommand}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 border border-slate-700"
              >
                {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCmd ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>

            {pushOutput && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {pushOutput}
              </div>
            )}

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center space-x-1 text-slate-300 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub Authentication Note:</span>
              </div>
              <p>
                To push directly to <code className="text-blue-300">HARRY5432/TinyBERT</code>, run the copied command in your local command prompt or supply your GitHub PAT above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
