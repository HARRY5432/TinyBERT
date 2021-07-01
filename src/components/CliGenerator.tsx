import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Sliders, 
  FileCode, 
  CheckCircle2, 
  Code2,
  Sparkles
} from 'lucide-react';

export const CliGenerator: React.FC = () => {
  const [script, setScript] = useState<string>('task_distill.py');
  const [taskName, setTaskName] = useState<string>('SST-2');
  const [epoch, setEpoch] = useState<number>(10);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [lr, setLr] = useState<string>('3e-5');
  const [maxSeqLength, setMaxSeqLength] = useState<number>(128);
  const [augTrain, setAugTrain] = useState<boolean>(true);
  const [doLower, setDoLower] = useState<boolean>(true);
  const [predDistill, setPredDistill] = useState<boolean>(false);

  const [copied, setCopied] = useState<boolean>(false);
  const [dryRunLogs, setDryRunLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const generatedCommand = `python ${script} ${predDistill ? '--pred_distill ' : ''}--teacher_model \${FT_BERT_BASE_DIR}\$ --student_model \${GENERAL_TINYBERT_DIR}\$ --data_dir \${TASK_DIR}\$ --task_name ${taskName} --output_dir \${TINYBERT_DIR}\$ --max_seq_length ${maxSeqLength} --train_batch_size ${batchSize} --num_train_epochs ${epoch} --learning_rate ${lr} ${augTrain ? '--aug_train ' : ''}${doLower ? '--do_lower_case' : ''}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDryRun = async () => {
    setIsRunning(true);
    setDryRunLogs(['[INFO] Contacting local server validation API...']);
    try {
      const res = await fetch('/api/repo/run-script-dryrun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptName: script,
          args: {
            task_name: taskName,
            train_batch_size: batchSize,
            num_train_epochs: epoch,
            learning_rate: lr,
            aug_train: augTrain,
            do_lower_case: doLower,
            pred_distill: predDistill,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDryRunLogs(data.logs);
      }
    } catch (err) {
      setDryRunLogs(['[ERROR] Failed to run dry-run validation.']);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div id="cli-generator" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                CLI Command Builder
              </span>
              <h2 className="text-xl font-bold text-slate-100">TinyBERT Execution Script Generator</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure parameters for <code className="text-purple-300">task_distill.py</code>, <code className="text-purple-300">general_distill.py</code>, and <code className="text-purple-300">data_augmentation.py</code>.
            </p>
          </div>
        </div>

        {/* Script Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6">
          {[
            { id: 'task_distill.py', name: 'Task Distillation', desc: 'Intermediate & prediction layer' },
            { id: 'general_distill.py', name: 'General Distill', desc: 'Pre-training transformer distillation' },
            { id: 'data_augmentation.py', name: 'Data Augmentation', desc: 'BERT + GloVe word replacement' },
            { id: 'pregenerate_training_data.py', name: 'Pregenerate Data', desc: 'Corpus JSON preprocessing' },
          ].map((s) => (
            <button
              key={s.id}
              id={`script-select-${s.id}`}
              onClick={() => setScript(s.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                script === s.id
                  ? 'bg-purple-600/20 border-purple-500 text-slate-100 font-semibold shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="text-xs font-bold font-mono text-purple-300">{s.id}</div>
              <div className="text-[11px] text-slate-400 mt-1">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Parameter Controls & Terminal Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Command Line Flags
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Target GLUE Task (--task_name)</label>
              <select
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {['SST-2', 'MNLI', 'QQP', 'CoLA', 'QNLI', 'MRPC', 'RTE', 'STS-B'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Epochs (--num_train_epochs)</label>
                <input
                  type="number"
                  value={epoch}
                  onChange={(e) => setEpoch(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Batch Size (--train_batch_size)</label>
                <input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Learning Rate (--learning_rate)</label>
                <input
                  type="text"
                  value={lr}
                  onChange={(e) => setLr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Max Seq Length (--max_seq_length)</label>
                <input
                  type="number"
                  value={maxSeqLength}
                  onChange={(e) => setMaxSeqLength(parseInt(e.target.value) || 128)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={augTrain}
                  onChange={(e) => setAugTrain(e.target.checked)}
                  className="accent-purple-500 rounded"
                />
                <span>--aug_train (Use augmented dataset)</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={doLower}
                  onChange={(e) => setDoLower(e.target.checked)}
                  className="accent-purple-500 rounded"
                />
                <span>--do_lower_case (Uncased BERT model)</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={predDistill}
                  onChange={(e) => setPredDistill(e.target.checked)}
                  className="accent-purple-500 rounded"
                />
                <span>--pred_distill (Run Prediction Layer Phase)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Command Output & Dry Run Log Terminal */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Generated Command
                </h3>
              </div>
              <button
                id="copy-cli-command-btn"
                onClick={copyToClipboard}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 leading-relaxed overflow-x-auto select-all">
              {generatedCommand}
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase text-slate-400">Dry-Run Validation Logs</span>
                <button
                  id="run-cli-dryrun-btn"
                  onClick={handleDryRun}
                  disabled={isRunning}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow-md shadow-purple-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Validating...' : 'Validate Arguments'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 h-40 overflow-y-auto space-y-1">
                {dryRunLogs.length === 0 ? (
                  <div className="text-slate-600">Click 'Validate Arguments' to test configuration against repository python scripts.</div>
                ) : (
                  dryRunLogs.map((log, i) => (
                    <div key={i} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
