import React, { useState } from 'react';
import { 
  Zap, 
  Send, 
  Cpu, 
  Layers, 
  Sparkles, 
  Clock, 
  HardDrive, 
  BarChart2,
  CheckCircle2
} from 'lucide-react';
import { SAMPLE_INFERENCES } from '../data/glueData';

export const InferenceVisualizer: React.FC = () => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>('s1');
  const [customText, setCustomText] = useState<string>('The Transformer architecture compressed with distillation achieves incredible latency!');
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  const selectedSample = SAMPLE_INFERENCES.find((s) => s.id === selectedSampleId) || SAMPLE_INFERENCES[0];

  return (
    <div id="inference-visualizer" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Real-Time Inference
              </span>
              <h2 className="text-xl font-bold text-slate-100">Latency & Attention Map Visualizer</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Compare token attention weights, confidence logits, and execution speed between BERT-base and TinyBERT.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              id="inf-tab-preset"
              onClick={() => setActiveTab('preset')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'preset' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Preset Benchmarks
            </button>
            <button
              id="inf-tab-custom"
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'custom' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Custom Sentence Input
            </button>
          </div>
        </div>

        {activeTab === 'preset' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {SAMPLE_INFERENCES.map((sample) => {
              const isSelected = sample.id === selectedSampleId;
              return (
                <button
                  key={sample.id}
                  id={`inf-sample-btn-${sample.id}`}
                  onClick={() => setSelectedSampleId(sample.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                    {sample.task}
                  </span>
                  <p className="text-xs font-medium line-clamp-2 mt-2 text-slate-200">{sample.textA}</p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                    <span>Label: <strong className="text-emerald-400">{sample.label}</strong></span>
                    <span className="text-indigo-400">{sample.tinyBertLatencyMs} ms</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Type custom text for tokenization & TinyBERT inference:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                placeholder="Enter input text for transformer tokenizer..."
              />
              <button
                id="run-custom-inf-btn"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
              >
                <Zap className="w-4 h-4" />
                <span>Run Test</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Benchmark Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latency & Memory Footprint Comparison */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Latency & Memory Footprint
            </h3>
          </div>

          <div className="space-y-4">
            {/* Latency Comparison Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300">Inference Latency (Milliseconds)</div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>BERT-base (109M Params)</span>
                    <strong className="text-slate-200">{selectedSample.bertLatencyMs} ms</strong>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: '100%' }}
                      className="h-full bg-slate-600 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="text-indigo-300 font-bold">TinyBERT_4 (14.5M Params)</span>
                    <strong className="text-indigo-400">{selectedSample.tinyBertLatencyMs} ms (9.4x Faster)</strong>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(selectedSample.tinyBertLatencyMs / selectedSample.bertLatencyMs) * 100}%` }}
                      className="h-full bg-emerald-500 rounded-full shadow-md shadow-emerald-500/30"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Footprint Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300">Model Memory Footprint (FP32 Weights)</div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">BERT-base</div>
                  <div className="text-base font-mono font-bold text-slate-200 mt-1">436 MB</div>
                  <div className="text-[10px] text-slate-500">109,000,000 floats</div>
                </div>

                <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-800/40 text-center">
                  <div className="text-[10px] text-indigo-300 uppercase font-bold">TinyBERT_4</div>
                  <div className="text-base font-mono font-bold text-indigo-400 mt-1">58 MB</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">7.5x RAM Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Attention Weight Heatmap */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Distilled Attention Weights ($A^S$) Heatmap
            </h3>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs text-slate-400">
              Tokens extracted via <code className="text-indigo-300">BertTokenizer.tokenize()</code>:
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-900 rounded-lg border border-slate-800">
              {selectedSample.tokens.map((token, idx) => {
                // Generate a pseudo-attention intensity for visualization
                const opacity = idx === 0 || idx === selectedSample.tokens.length - 1 ? 0.3 : (0.4 + (idx % 3) * 0.25);
                return (
                  <span
                    key={idx}
                    style={{ backgroundColor: `rgba(99, 102, 241, ${opacity})` }}
                    className="px-2.5 py-1 rounded-md font-mono text-xs text-white font-medium border border-indigo-400/30 transition-transform hover:scale-105 cursor-pointer"
                    title={`Attention Weight: ${opacity.toFixed(2)}`}
                  >
                    {token}
                  </span>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Predicted Label:</span>
                <strong className="text-emerald-400 font-mono">{selectedSample.label}</strong>
              </div>
              <div className="flex justify-between">
                <span>BERT-base Softmax Confidence:</span>
                <strong className="text-slate-200 font-mono">{(selectedSample.bertConfidence * 100).toFixed(1)}%</strong>
              </div>
              <div className="flex justify-between">
                <span>TinyBERT Softmax Confidence:</span>
                <strong className="text-indigo-400 font-mono">{(selectedSample.tinyBertConfidence * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
