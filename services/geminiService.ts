import { LANGUAGES } from '../constants';

const getLanguageName = (code: string) => {
    return LANGUAGES.find(lang => lang.code === code)?.name || code;
}

/**
 * NOTE: This function simulates a video transcription.
 * Directly fetching and processing video from arbitrary URLs (e.g., YouTube) 
 * is not feasible in a client-side browser environment due to security restrictions (CORS)
 * and the complexity of audio extraction.
 * This mock service allows the UI to demonstrate its transcription workflow.
 */
export const transcribeVideoUrl = async (
  videoUrl: string,
  lang1Code: string,
  lang2Code?: string
): Promise<string> => {
  console.log(`Simulating transcription for URL: ${videoUrl}`);

  // Simulate network delay and processing time
  await new Promise(resolve => setTimeout(resolve, 3000));

  const lang1Name = getLanguageName(lang1Code);
  const lang2Name = lang2Code ? getLanguageName(lang2Code) : undefined;
  
  // Return a mock transcript
  return `[00:00:01] Speaker 1: This is a simulated transcript for the video from ${videoUrl}.
[00:00:05] Speaker 1: The primary language selected was ${lang1Name}.${lang2Name ? ` The secondary language was ${lang2Name}.` : ''}
[00:00:10] Speaker 2: In a real-world application, a backend server would be required to download the video, extract the audio, and send it to a transcription service.
[00:00:18] Speaker 1: This demonstration showcases the user interface and the flow of a transcription job from start to completion.
[00:00:25] Speaker 2: Thank you for trying out the Video Transcriber!`;
};