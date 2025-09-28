import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { TranscriptionJobCard } from './components/TranscriptionJobCard';
import type { TranscriptionJob, NewJobPayload } from './types';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<TranscriptionJob[]>([]);

  const handleNewJob = useCallback((payload: NewJobPayload) => {
    const newJob: TranscriptionJob = {
      id: Date.now().toString(),
      name: payload.name || payload.videoUrl,
      videoUrl: payload.videoUrl,
      lang1: payload.lang1,
      lang2: payload.lang2 && payload.lang2 !== 'none' ? payload.lang2 : undefined,
      status: 'transcribing',
      progress: 0,
    };
    setJobs(prevJobs => [newJob, ...prevJobs]);
  }, []);

  const handleJobComplete = useCallback((id: string, transcript: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === id ? { ...job, status: 'completed', transcript, progress: 100 } : job
      )
    );
  }, []);
  
  const handleJobError = useCallback((id: string, error: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === id ? { ...job, status: 'error', error: error, progress: 0 } : job
      )
    );
  }, []);

  const handleUpdateProgress = useCallback((id: string, progress: number) => {
     setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === id ? { ...job, progress } : job
      )
    );
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <UrlInputForm onNewJob={handleNewJob} />
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Your Transcriptions</h2>
          <div className="space-y-6">
            {jobs.length > 0 ? (
              jobs.map(job => (
                <TranscriptionJobCard 
                  key={job.id} 
                  job={job} 
                  onComplete={handleJobComplete}
                  onError={handleJobError}
                  onProgress={handleUpdateProgress}
                />
              ))
            ) : (
              <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-pink-100">
                <p className="text-gray-500">Your transcribed videos will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;