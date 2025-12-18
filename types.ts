export enum OptimizationMode {
  DIRECTIVE = 'DIRECTIVE',
  CREATIVE = 'CREATIVE',
  ANALYTICAL = 'ANALYTICAL',
  SIMULATION = 'SIMULATION',
  STRUCTURAL = 'STRUCTURAL',
  EDUCATIONAL = 'EDUCATIONAL',
}

export interface OptimizationResult {
  original: string;
  optimized: string;
  mode: OptimizationMode;
  timestamp: number;
}

export interface ModeConfig {
  id: OptimizationMode;
  label: string;
  description: string;
  icon: string; // Lucide icon name representation
}