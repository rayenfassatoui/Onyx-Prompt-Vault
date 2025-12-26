export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string; // The template with {{variables}}
  tags: string[];
  createdAt: string;
}

export interface PromptVariable {
  name: string;
  value: string;
}

export type VariableMap = Record<string, string>;
