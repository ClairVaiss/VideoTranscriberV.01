import React, { useEffect, useState, useRef } from 'react';
import type { TranscriptionJob } from '../types';
import { transcribeVideoUrl } from '../services/geminiService';
import { DownloadIcon, CopyIcon, ErrorIcon, CheckCircleIcon, ChevronDownIcon } from './icons';

interface TranscriptionJobCardProps {
  job: TranscriptionJob;
  onComplete: (id: string, transcript: string) => void;
  onError: (id: string, error: string) => void;
  onProgress: (id: string, progress: number) => void;
}

// Define jsPDF type for window object
declare global {
  interface Window {
    jspdf: any;
  }
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-pink-100 rounded-full h-2.5">
    <div
      className="bg-pink-500 h-2.5 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const sanitizeFilename = (name: string) => {
    return name.replace(/[^a-z0-9_.-]/gi, '_').substring(0, 50);
}

export const TranscriptionJobCard: React.FC<TranscriptionJobCardProps> = ({ job, onComplete, onError, onProgress }) => {
  const [eta, setEta] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handleDownload = () => {
    if (job.transcript) {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;
        const lines = doc.splitTextToSize(job.transcript, 180);
        
        doc.setFontSize(18);
        doc.text("Video Transcript", margin, margin);
        doc.setFontSize(10);
        doc.text(job.videoUrl, margin, margin + 8)
        doc.setFontSize(12);
        let cursor = margin + 20;

        lines.forEach((line: string) => {
            if (cursor > pageHeight - margin) {
                doc.addPage();
                cursor = margin;
            }
            doc.text(line, margin, cursor);
            cursor += 7;
        });

        const filename = `transcript_${sanitizeFilename(job.name)}.pdf`;
        doc.save(filename);
      } catch (e) {
        console.error("Failed to generate PDF:", e);
        alert("Could not generate PDF. Please ensure you are online.");
      }
    }
  };

  const handleCopy = () => {
    if (job.transcript) {
      navigator.clipboard.writeText(job.transcript);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    }
  };

  useEffect(() => {
    if (job.status === 'transcribing' && job.progress < 100) {
      // Simulate progress and ETA for the URL-based job
      const estimatedSeconds = 15; // Fixed duration for simulation
      const totalDuration = estimatedSeconds * 1000;
      const startTime = Date.now() - (job.progress/100) * totalDuration;

      intervalRef.current = window.setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const currentProgress = Math.min(99, Math.floor((elapsedTime / totalDuration) * 100));
        
        onProgress(job.id, currentProgress);

        const remainingTime = totalDuration - elapsedTime;
        if (remainingTime > 0) {
          setEta(`${Math.ceil(remainingTime / 1000)}s remaining`);
        }

        if (currentProgress >= 99) {
          if(intervalRef.current) clearInterval(intervalRef.current);
          setEta('Processing...');
          transcribeVideoUrl(job.videoUrl, job.lang1, job.lang2)
            .then(transcript => {
              onComplete(job.id, transcript);
            })
            .catch(err => {
              onError(job.id, err.message || "An unknown error occurred.");
            });
        }
      }, 250);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.status, job.id]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <p className="font-semibold text-lg text-pink-800 break-words">{job.name}</p>
          <p className="font-mono text-xs text-gray-500 break-all">{job.videoUrl}</p>
        </div>
        {job.status === 'completed' && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button onClick={handleDownload} title="Download as PDF" className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-100 rounded-full transition">
                <DownloadIcon className="w-5 h-5" />
            </button>
            <button onClick={handleCopy} title="Copy Transcript" className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-100 rounded-full transition relative">
                <CopyIcon className="w-5 h-5" />
                {copyStatus && <span className="absolute -top-7 right-0 text-xs bg-gray-800 text-white px-2 py-1 rounded">Copied!</span>}
            </button>
          </div>
        )}
      </div>

      {job.status === 'transcribing' && (
        <div className="space-y-3">
          <ProgressBar progress={job.progress} />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Transcribing... {job.progress}%</span>
            <span>{eta}</span>
          </div>
        </div>
      )}

      {job.status === 'error' && (
        <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
          <ErrorIcon className="w-5 h-5 mr-3 flex-shrink-0" />
          <p><span className="font-semibold">Error:</span> {job.error}</p>
        </div>
      )}

      {job.status === 'completed' && job.transcript && (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex items-center text-green-700">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Transcription Complete</span>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-sm font-semibold text-pink-600 hover:text-pink-800 transition"
                    aria-expanded={isExpanded}
                    aria-controls={`transcript-${job.id}`}
                >
                    {isExpanded ? 'Hide' : 'View'} Transcript
                    <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {isExpanded && (
                <div id={`transcript-${job.id}`} className="mt-4 max-h-60 overflow-y-auto bg-pink-50/50 p-4 rounded-lg border border-pink-100">
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{job.transcript}</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};