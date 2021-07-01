export interface RepoItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: RepoItem[];
}

export interface GlueTaskMetric {
  task: string;
  fullName: string;
  metricName: string;
  bertBase: number;
  generalTinyBERT: number;
  tinyBERT4: number; // 4-layer 312-dim
  tinyBERT6: number; // 6-layer 768-dim
  description: string;
}

export interface ModelSpec {
  name: string;
  layers: number;
  hiddenDim: number;
  feedForwardDim: number;
  attentionHeads: number;
  parametersM: number;
  relativeSizePercent: number;
  inferenceSpeedup: string;
  glueAvgScore: number;
}

export interface DistillationStepState {
  stage: 'general' | 'augmentation' | 'task_intermediate' | 'task_pred';
  epoch: number;
  totalEpochs: number;
  batch: number;
  totalBatches: number;
  lossAttn: number;
  lossHidden: number;
  lossEmb: number;
  lossPred: number;
  totalLoss: number;
  speed: number; // batches/sec
  status: 'idle' | 'running' | 'paused' | 'completed';
}

export interface InferenceSample {
  id: string;
  task: string;
  textA: string;
  textB?: string;
  label: string;
  bertConfidence: number;
  tinyBertConfidence: number;
  bertLatencyMs: number;
  tinyBertLatencyMs: number;
  tokens: string[];
}
