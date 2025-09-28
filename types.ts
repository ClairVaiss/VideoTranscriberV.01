export type TranscriptionStatus = 'transcribing' | 'completed' | 'error';

export interface TranscriptionJob {
  id: string;
  name: string;
  videoUrl: string;
  lang1: string;
  lang2?: string;
  status: TranscriptionStatus;
  progress: number;
  transcript?: string;
  error?: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface NewJobPayload {
  name: string;
  videoUrl: string;
  lang1: string;
  lang2: string;
}