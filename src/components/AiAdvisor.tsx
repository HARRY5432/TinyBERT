import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Cpu, 
  HelpCircle, 
  MessageSquare, 
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UserCheck,
  Zap,
  Activity
} from 'lucide-react';

interface HumanoidPersona {
  id: string;
  name: string;
  role: string;
  seed: string;
  specialty: string;
  accentColor: string;
  greeting: string;
}

const HUMANOID_PRESETS: HumanoidPersona[] = [
  {
    id: 'cyber-01',
    name: 'Aether-01 Humanoid',
    role: 'Transformer Distillation Architect',
    seed: 'AetherHumanoid01',
    specialty: 'Attention Loss ($L_{att}$) & Soft Logit Distillation',
    accentColor: 'from-indigo-500 to-purple-600',
    greeting: 'Greetings. I am Aether-01, specialized in compressed neural representation vectors.',
  },
  {
    id: 'synthia-9',
    name: 'Synthia-9 Android',
    role: 'PyTorch AMP & Memory Optimization Lead',
    seed: 'SynthiaAndroid9',
    specialty: 'Torch.compile & FP16 Mixed Precision Speedup',
    accentColor: 'from-emerald-500 to-teal-600',
    greeting: 'Unit Synthia-9 active. Optimizing GPU memory footprints and tensor strides.',
  },
  {
    id: 'nexus-prime',
    name: 'Nexus-Prime Humanoid',
    role: 'ONNX & TensorRT Edge Compiler',
    seed: 'NexusPrimeUnit',
    specialty: 'Quantization & INT8 Hardware Acceleration',
    accentColor: 'from-cyan-500 to-blue-600',
    greeting: 'Nexus-Prime online. Preparing target ONNX graphs for low-latency edge deployment.',
  },
  {
    id: 'vesper-h',
    name: 'Vesper-H Humanoid',
    role: 'Data Augmentation & Masked LM Synthetic Specialist',
    seed: 'VesperHBot',
    specialty: 'GloVe Word Replacement & Synthetic Data Augmentation',
    accentColor: 'from-amber-500 to-orange-600',
    greeting: 'Vesper-H initialized. Generating enriched training text corpora for student models.',
  },
  {
    id: 'kora-7',
    name: 'Kora-7 Synthetic Android',
    role: 'GLUE Benchmark & Evaluation Analyst',
    seed: 'Kora7Android',
    specialty: 'SQuAD, MNLI, SST-2 & CoLA Metric Optimization',
    accentColor: 'from-rose-500 to-pink-600',
    greeting: 'Kora-7 ready. Analyzing validation losses and task-specific fine-tuning curves.',
  },
];

export const AiAdvisor: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [topic, setTopic] = useState<string>('Loss Functions');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentHumanoidIndex, setCurrentHumanoidIndex] = useState<number>(0);

  const activeHumanoid = HUMANOID_PRESETS[currentHumanoidIndex];

  const presets = [
    { label: 'Explain Attention Loss ($L_{att}$)', topic: 'Attention Distillation', query: 'How does TinyBERT distill attention matrices from teacher to student, and why is MSE used per head?' },
    { label: 'Explain Layer Projection ($W_h$)', topic: 'Hidden State Distillation', query: 'Why does TinyBERT require a learnable linear projection matrix W_h for hidden states?' },
    { label: 'How does Data Augmentation work?', topic: 'Data Augmentation', query: 'Explain how TinyBERT uses BERT predictions + GloVe embeddings for word-level replacement in data augmentation.' },
    { label: 'How to export to ONNX / TensorRT?', topic: 'Model Deployment', query: 'What are the steps to convert TinyBERT PyTorch weights into ONNX format for 10x faster ONNXRuntime CPU inference?' },
  ];

  const handleRandomizeHumanoid = () => {
    const nextIdx = (currentHumanoidIndex + 1) % HUMANOID_PRESETS.length;
    setCurrentHumanoidIndex(nextIdx);
  };

  const handleAsk = async (userQuery?: string, chosenTopic?: string) => {
    const queryToSend = userQuery || prompt;
    if (!queryToSend.trim()) return;

    setIsLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `[Consulting as ${activeHumanoid.name} (${activeHumanoid.role})]: ${queryToSend}`,
          topic: chosenTopic || topic,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAnswer(data.answer);
      }
    } catch (err) {
      console.error('Failed to query Gemini:', err);
      setAnswer('An error occurred while consulting Gemini AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-advisor" className="space-y-6">
      {/* Humanoid Persona Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-5">
            {/* Humanoid Avatar Display */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-indigo-500/40 p-1 flex items-center justify-center overflow-hidden shadow-lg shadow-indigo-500/10">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${activeHumanoid.seed}`}
                  alt={activeHumanoid.name}
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Humanoid AI Persona
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {activeHumanoid.id}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{activeHumanoid.name}</h2>
              <p className="text-xs text-indigo-400 font-medium">{activeHumanoid.role}</p>
              <p className="text-xs text-slate-400 mt-1 italic">"{activeHumanoid.greeting}"</p>
            </div>
          </div>

          <button
            id="randomize-humanoid-btn"
            onClick={handleRandomizeHumanoid}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 text-xs font-bold rounded-xl border border-indigo-500/30 transition-all shadow-lg shadow-indigo-600/10"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>Randomize Humanoid Persona</span>
          </button>
        </div>

        {/* Humanoid Specs Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Core Architecture</span>
            <span className="text-xs font-bold text-slate-200 mt-0.5 block">{activeHumanoid.specialty}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Neural Model</span>
            <span className="text-xs font-bold text-indigo-400 mt-0.5 block">Gemini 2.5 Flash</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Processing Latency</span>
            <span className="text-xs font-bold text-emerald-400 mt-0.5 block">1.2 ms / token</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Distillation Mode</span>
            <span className="text-xs font-bold text-purple-400 mt-0.5 block">Two-Stage Transformer</span>
          </div>
        </div>

        {/* Preset Prompt Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {presets.map((p, idx) => (
            <button
              key={idx}
              id={`ai-preset-${idx}`}
              onClick={() => {
                setPrompt(p.query);
                setTopic(p.topic);
                handleAsk(p.query, p.topic);
              }}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-indigo-500/50 text-left transition-all"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{p.label}</span>
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.query}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Box and Response Output */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Consult {activeHumanoid.name}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Ask about PyTorch, Loss Functions, or Export</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder={`Ask ${activeHumanoid.name} anything about TinyBERT distillation, PyTorch code, loss functions...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-sans"
          />
          <button
            id="ask-ai-advisor-btn"
            onClick={() => handleAsk()}
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Consulting Humanoid...' : `Ask ${activeHumanoid.name.split(' ')[0]}`}</span>
          </button>
        </div>

        {/* AI Answer Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 min-h-[250px]">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-xs text-slate-400 font-medium">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Response from {activeHumanoid.name}:</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3 text-slate-500 text-xs">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
              <span>{activeHumanoid.name} is synthesizing explanation...</span>
            </div>
          ) : answer ? (
            <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed font-sans mt-4 whitespace-pre-wrap">
              {answer}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-xs text-slate-500">
              Select a preset prompt above or enter a question to consult {activeHumanoid.name}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

