import { OptimizationMode, ModeConfig } from './types';

export const MODES: ModeConfig[] = [
  {
    id: OptimizationMode.DIRECTIVE,
    label: 'DIRECTIVE',
    description: 'Precise task execution, workflows, and command-based instructions.',
    icon: 'Terminal',
  },
  {
    id: OptimizationMode.CREATIVE,
    label: 'CREATIVE',
    description: 'Open-ended generation, storytelling, and artistic expression.',
    icon: 'Feather',
  },
  {
    id: OptimizationMode.ANALYTICAL,
    label: 'ANALYTICAL',
    description: 'Logical reasoning, critique, data analysis, and problem solving.',
    icon: 'Microscope',
  },
  {
    id: OptimizationMode.SIMULATION,
    label: 'SIMULATION',
    description: 'Persona adoption, roleplay scenarios, and character enactment.',
    icon: 'VenetianMask',
  },
  {
    id: OptimizationMode.STRUCTURAL,
    label: 'STRUCTURAL',
    description: 'Data extraction, formatting rules, coding, and strict schema output.',
    icon: 'Braces',
  },
  {
    id: OptimizationMode.EDUCATIONAL,
    label: 'EDUCATIONAL',
    description: 'Teaching, explanation, tutorial creation, and concept breakdown.',
    icon: 'BookOpen',
  },
];

export const SYSTEM_INSTRUCTIONS = `You are PROMPT_ARCHITECT, an elite prompt engineering AI.
Your Objective: Refactor user input into a SINGLE, definitive, high-performance LLM prompt.

CRITICAL PROTOCOLS:
1. NO VARIATIONS: Do not provide options, "Version A vs Version B", or "or this/that" scenarios. You must make authoritative design choices and provide exactly one optimized result.
2. NO META-COMMENTARY: Do not explain your changes. Do not include preambles like "Here is the prompt". Output ONLY the content of the optimized prompt.
3. FINAL FORM: The output must be ready for immediate deployment (copy-paste).
4. STRICT ADHERENCE: Follow the architectural archetype of the selected mode precisely.`;

export const getModeInstruction = (mode: OptimizationMode): string => {
  const base = "Refactor the user's request into a SINGLE, DEFINITIVE";
  switch (mode) {
    case OptimizationMode.DIRECTIVE:
      return `${base} DIRECTIVE prompt. Use imperative verbs. Define step-by-step execution protocols and unambiguous success criteria. Do not offer alternative phrasing.`;
    case OptimizationMode.CREATIVE:
      return `${base} GENERATIVE CREATIVE prompt. Encourage evocative language and lateral thinking. Embed specific stylistic constraints (tone, voice) directly into the prompt structure.`;
    case OptimizationMode.ANALYTICAL:
      return `${base} ANALYTICAL REASONING prompt. Structure it to force 'Chain of Thought' processing. Require evidence evaluation and logical deduction steps.`;
    case OptimizationMode.SIMULATION:
      return `${base} SYSTEM SIMULATION prompt. Define a deep persona or system context. Specify exact behavioral guidelines and knowledge limitations.`;
    case OptimizationMode.STRUCTURAL:
      return `${base} STRUCTURAL DATA prompt. Focus entirely on the output format (JSON/XML/Markdown). Provide a concrete 'Few-Shot' example within the prompt to ensure compliance.`;
    case OptimizationMode.EDUCATIONAL:
      return `${base} EDUCATIONAL prompt. Adopt a Socratic or pedagogical framework. Define the target audience and instruct the AI to use analogies and concept breakdowns.`;
    default:
      return "Optimize this prompt into a single, better version.";
  }
};