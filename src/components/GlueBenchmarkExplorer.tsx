import React, { useState } from 'react';
import { 
  BarChart3, 
  Zap, 
  Cpu, 
  Award, 
  Check, 
  Sliders, 
  Info,
  Scale,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { GLUE_BENCHMARK_DATA, MODEL_SPECS } from '../data/glueData';

export const GlueBenchmarkExplorer: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<string>('SST-2');
  const [activeModelView, setActiveModelView] = useState<'all' | 'tiny4' | 'tiny6'>('all');

  const currentTaskData = GLUE_BENCHMARK_DATA.find((t) => t.task === selectedTask) || GLUE_BENCHMARK_DATA[0];

  return (
    <div id="glue-benchmark-explorer" className="space-y-6">
      {/* Top Banner: Model Specifications Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                GLUE Benchmark
              </span>
              <h2 className="text-xl font-bold text-slate-100">Model Efficiency & Performance Comparison</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              TinyBERT vs BERT-base across parameters, layers, hidden dimensions, and latency speedups.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              id="model-view-all"
              onClick={() => setActiveModelView('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeModelView === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Models
            </button>
            <button
              id="model-view-tiny4"
              onClick={() => setActiveModelView('tiny4')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeModelView === 'tiny4' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TinyBERT_4 Focus (7.5x)
            </button>
            <button
              id="model-view-tiny6"
              onClick={() => setActiveModelView('tiny6')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeModelView === 'tiny6' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TinyBERT_6 Focus (2.0x)
            </button>
          </div>
        </div>

        {/* Specs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {MODEL_SPECS.map((spec) => {
            const isTiny4 = spec.name.includes('4-Layer');
            const isBert = spec.name.includes('Teacher');
            return (
              <div
                key={spec.name}
                className={`p-5 rounded-xl border transition-all ${
                  isTiny4
                    ? 'bg-gradient-to-br from-indigo-950/70 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-950/40'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{spec.name}</h3>
                    <span className="text-[11px] text-slate-400">
                      {spec.layers} Layers • {spec.hiddenDim} Hidden Dim
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      isTiny4
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isBert
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {spec.inferenceSpeedup}
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Parameters:</span>
                    <strong className="text-slate-200">{spec.parametersM} M ({spec.relativeSizePercent}%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Feed-Forward Dim:</span>
                    <strong className="text-slate-200">{spec.feedForwardDim}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attention Heads:</span>
                    <strong className="text-slate-200">{spec.attentionHeads}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">GLUE Avg Score:</span>
                    <strong className="text-indigo-400 font-bold">{spec.glueAvgScore} %</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Benchmark Matrix & Task Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Selector Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Select GLUE Task
            </h3>
          </div>

          <div className="space-y-2">
            {GLUE_BENCHMARK_DATA.map((t) => {
              const isSelected = t.task === selectedTask;
              return (
                <button
                  key={t.task}
                  id={`glue-task-btn-${t.task}`}
                  onClick={() => setSelectedTask(t.task)}
                  className={`w-full p-3 rounded-lg text-left transition-all border ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs">{t.task}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{t.metricName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">{t.fullName}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Task Metric Breakdown Visualizer */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  {currentTaskData.task}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-1">{currentTaskData.fullName}</h3>
                <p className="text-xs text-slate-400">{currentTaskData.description}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400">Metric Type:</span>
                <div className="text-xs font-mono font-bold text-emerald-400">{currentTaskData.metricName}</div>
              </div>
            </div>

            {/* Bar Charts for Task Scores */}
            <div className="space-y-4 my-6">
              {/* BERT-base Teacher */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>BERT-base (12-Layer Teacher)</span>
                  <span className="font-bold text-slate-100">{currentTaskData.bertBase}%</span>
                </div>
                <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    style={{ width: `${currentTaskData.bertBase}%` }}
                    className="h-full bg-slate-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* General TinyBERT (Without Task Distillation) */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>General TinyBERT (Pre-Task Distillation)</span>
                  <span className="font-bold text-amber-400">{currentTaskData.generalTinyBERT}%</span>
                </div>
                <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    style={{ width: `${currentTaskData.generalTinyBERT}%` }}
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* TinyBERT_4 (Full Distillation) */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span className="text-indigo-300 font-bold">TinyBERT_4 (4-Layer, 9.4x Faster) ⭐</span>
                  <span className="font-bold text-indigo-400">{currentTaskData.tinyBERT4}%</span>
                </div>
                <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    style={{ width: `${currentTaskData.tinyBERT4}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg shadow-indigo-500/30"
                  />
                </div>
              </div>

              {/* TinyBERT_6 (6-Layer Distillation) */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span className="text-blue-300 font-bold">TinyBERT_6 (6-Layer, 2.0x Faster)</span>
                  <span className="font-bold text-blue-400">{currentTaskData.tinyBERT6}%</span>
                </div>
                <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    style={{ width: `${currentTaskData.tinyBERT6}%` }}
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Retention Performance Summary */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">
                Retention Capacity: <strong className="text-emerald-400 font-mono">
                  {((currentTaskData.tinyBERT4 / currentTaskData.bertBase) * 100).toFixed(1)}%
                </strong> of BERT-base accuracy kept at <strong className="text-indigo-400">13.3% size</strong>!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
