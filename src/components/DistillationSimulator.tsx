import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Cpu, 
  Layers, 
  TrendingDown, 
  Sliders, 
  Info, 
  CheckCircle2,
  ArrowRight,
  Flame,
  Activity
} from 'lucide-react';
import { FORMULA_EXPLANATIONS } from '../data/glueData';

export const DistillationSimulator: React.FC = () => {
  const [stage, setStage] = useState<'general' | 'augmentation' | 'task_intermediate' | 'task_pred'>('task_intermediate');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [epoch, setEpoch] = useState<number>(1);
  const [batch, setBatch] = useState<number>(0);
  const [studentLayers, setStudentLayers] = useState<number>(4);
  const [studentHiddenDim, setStudentHiddenDim] = useState<number>(312);
  const [temperature, setTemperature] = useState<number>(1.0);
  const [learningRate, setLearningRate] = useState<string>('5e-5');
  const [batchSize, setBatchSize] = useState<number>(32);

  const [lossHistory, setLossHistory] = useState<Array<{ step: number; lossAttn: number; lossHid: number; lossPred: number; total: number }>>([]);

  const totalBatches = 100;
  const totalEpochs = stage === 'general' ? 3 : 10;

  // Reset simulation when stage changes
  useEffect(() => {
    setIsPlaying(false);
    setEpoch(1);
    setBatch(0);
    setLossHistory([]);
  }, [stage]);

  // Simulation tick timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setBatch((prevBatch) => {
          if (prevBatch >= totalBatches) {
            if (epoch >= totalEpochs) {
              setIsPlaying(false);
              return prevBatch;
            }
            setEpoch((e) => e + 1);
            return 1;
          }
          const nextBatch = prevBatch + 1;
          const globalStep = (epoch - 1) * totalBatches + nextBatch;

          // Decay functions for simulation
          const decay = Math.exp(-globalStep / 120);
          const noise = () => (Math.random() - 0.5) * 0.05 * decay;

          const lossAttn = Math.max(0.01, 1.4 * decay + 0.08 + noise());
          const lossHid = Math.max(0.02, 2.1 * decay + 0.12 + noise());
          const lossPred = Math.max(0.005, 0.9 * decay + 0.04 + noise());
          const total = (stage === 'task_pred' ? lossPred : lossAttn + lossHid);

          setLossHistory((prev) => [
            ...prev.slice(-40),
            { step: globalStep, lossAttn, lossHid, lossPred, total }
          ]);

          return nextBatch;
        });
      }, 120);
    }
    return () => clearInterval(timer);
  }, [isPlaying, epoch, stage, totalEpochs]);

  // Layer mapping calculation g(m)
  const teacherLayers = 12;
  const layerRatio = teacherLayers / studentLayers;
  const layerMappings = Array.from({ length: studentLayers }, (_, i) => ({
    studentIdx: i + 1,
    teacherIdx: Math.round((i + 1) * layerRatio),
  }));

  const currentLoss = lossHistory[lossHistory.length - 1] || {
    lossAttn: 1.48,
    lossHid: 2.15,
    lossPred: 0.92,
    total: 3.63
  };

  return (
    <div id="distillation-simulator" className="space-y-6">
      {/* Top Banner with Stage Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Interactive Simulator
              </span>
              <h2 className="text-xl font-bold text-slate-100">Transformer Distillation Engine</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visualize two-stage TinyBERT distillation (L_att, L_hid, L_pred) with real-time PyTorch execution simulation.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="sim-play-pause-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Start Distillation'}</span>
            </button>
            <button
              id="sim-reset-btn"
              onClick={() => {
                setIsPlaying(false);
                setEpoch(1);
                setBatch(0);
                setLossHistory([]);
              }}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Reset State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <button
            id="sim-stage-general"
            onClick={() => setStage('general')}
            className={`p-4 rounded-xl border text-left transition-all ${
              stage === 'general'
                ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500 shadow-md shadow-indigo-900/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Step 1</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">General Distillation</h3>
            <p className="text-[11px] text-slate-400 mt-1">Pre-train on large unlabelled raw text corpus with BERT-base teacher.</p>
          </button>

          <button
            id="sim-stage-augmentation"
            onClick={() => setStage('augmentation')}
            className={`p-4 rounded-xl border text-left transition-all ${
              stage === 'augmentation'
                ? 'bg-gradient-to-br from-purple-950/80 to-slate-900 border-purple-500 shadow-md shadow-purple-900/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Step 2</span>
              <Flame className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Data Augmentation</h3>
            <p className="text-[11px] text-slate-400 mt-1">BERT + GloVe word replacement on task dataset (e.g. SST-2, QQP).</p>
          </button>

          <button
            id="sim-stage-task-intermediate"
            onClick={() => setStage('task_intermediate')}
            className={`p-4 rounded-xl border text-left transition-all ${
              stage === 'task_intermediate'
                ? 'bg-gradient-to-br from-blue-950/80 to-slate-900 border-blue-500 shadow-md shadow-blue-900/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 3</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Intermediate Distillation</h3>
            <p className="text-[11px] text-slate-400 mt-1">Align Attention matrices (L_att) & Hidden states (L_hid).</p>
          </button>

          <button
            id="sim-stage-task-pred"
            onClick={() => setStage('task_pred')}
            className={`p-4 rounded-xl border text-left transition-all ${
              stage === 'task_pred'
                ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-500 shadow-md shadow-emerald-900/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 4</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Prediction Layer Distill</h3>
            <p className="text-[11px] text-slate-400 mt-1">Soft cross-entropy logit distillation (L_pred) on downstream task.</p>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls, Layer Mapping, and Loss Live Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hyperparameter Controls & Layer Mapping */}
        <div className="lg:col-span-5 space-y-6">
          {/* Controls Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Student Model Architecture & Setup
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Student Transformer Layers ($M$): <span className="text-indigo-400 font-bold">{studentLayers} Layers</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="student-layers-4-btn"
                    onClick={() => { setStudentLayers(4); setStudentHiddenDim(312); }}
                    className={`py-2 rounded-lg border text-center font-mono text-xs transition-colors ${
                      studentLayers === 4
                        ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    4 Layers (312-dim)
                  </button>
                  <button
                    id="student-layers-6-btn"
                    onClick={() => { setStudentLayers(6); setStudentHiddenDim(768); }}
                    className={`py-2 rounded-lg border text-center font-mono text-xs transition-colors ${
                      studentLayers === 6
                        ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    6 Layers (768-dim)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Temperature Scaling ($t$): <span className="text-amber-400 font-bold">{temperature.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-400 mb-1">Learning Rate</label>
                  <select
                    value={learningRate}
                    onChange={(e) => setLearningRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="5e-5">5e-5 (Default)</option>
                    <option value="3e-5">3e-5 (Prediction Distill)</option>
                    <option value="1e-4">1e-4 (General Distill)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Batch Size</label>
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="32">32 (Task Distill)</option>
                    <option value="64">64 (Augmented Task)</option>
                    <option value="256">256 (General Distill)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Layer Mapping Function Visualizer g(m) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Transformer Layer Mapping g(m)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-purple-400 font-bold">
                g(m) = m × (N / M)
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono font-semibold px-2">
                <span>Student Layer (m)</span>
                <span>Projection Mapping</span>
                <span>Teacher Layer (g(m))</span>
              </div>

              {layerMappings.map((map) => (
                <div
                  key={map.studentIdx}
                  className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs font-mono"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[11px]">
                      S{map.studentIdx}
                    </span>
                    <span className="text-slate-300">dim={studentHiddenDim}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-purple-400">
                    <span className="text-[10px] bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                      W_h Projection
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300">dim=768</span>
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px]">
                      T{map.teacherIdx}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Metrics & Loss Graph */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Live Loss Functions & Convergence
                </h3>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-slate-400">Epoch: <strong className="text-slate-100">{epoch}/{totalEpochs}</strong></span>
                <span className="text-slate-400">Batch: <strong className="text-slate-100">{batch}/{totalBatches}</strong></span>
              </div>
            </div>

            {/* Current Metrics Cards */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Attention Loss (L_att)</div>
                <div className="text-lg font-mono font-bold text-indigo-400 mt-1">
                  {currentLoss.lossAttn.toFixed(4)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">MSE on Head Matrices</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Hidden Loss (L_hid)</div>
                <div className="text-lg font-mono font-bold text-purple-400 mt-1">
                  {currentLoss.lossHid.toFixed(4)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Projection W_h MSE</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Prediction Loss (L_pred)</div>
                <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                  {currentLoss.lossPred.toFixed(4)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Soft Cross-Entropy</div>
              </div>
            </div>

            {/* Visual Loss Sparkline Area */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 h-64 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500">
                Loss History Trajectory
              </div>

              {lossHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  Click 'Start Distillation' to run loss simulation
                </div>
              ) : (
                <div className="w-full h-44 flex items-end space-x-1 border-b border-l border-slate-800 pt-4 px-2">
                  {lossHistory.map((pt, idx) => {
                    const heightPercent = Math.min(100, Math.max(10, (pt.total / 4.0) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-indigo-500/80 group-hover:bg-indigo-400 rounded-t-sm transition-all"
                        />
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 border border-slate-700 text-[10px] font-mono p-2 rounded shadow-xl whitespace-nowrap z-20">
                          <div>Step: {pt.step}</div>
                          <div>Total Loss: {pt.total.toFixed(4)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mathematical Formula Explanation Box */}
          <div className="mt-4 bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-4 text-xs text-indigo-200">
            <div className="flex items-center space-x-2 font-bold mb-1">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>{FORMULA_EXPLANATIONS.attentionLoss.title}</span>
            </div>
            <p className="text-[11px] text-indigo-300/80 leading-relaxed font-mono mt-1">
              {FORMULA_EXPLANATIONS.attentionLoss.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
