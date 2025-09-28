import React, { useState } from 'react';
import { LanguageSelector } from './LanguageSelector';
import type { NewJobPayload } from '../types';

interface InputFormProps {
  onNewJob: (payload: NewJobPayload) => void;
}

export const UrlInputForm: React.FC<InputFormProps> = ({ onNewJob }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [lang1, setLang1] = useState('en');
  const [lang2, setLang2] = useState('none');
  const [error, setError] = useState('');
  
  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a video URL.');
      return;
    }
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }
    
    setError('');
    onNewJob({
      name: name.trim(),
      videoUrl: url,
      lang1,
      lang2,
    });
    setName('');
    setUrl('');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-pink-100">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="transcription-name" className="block text-sm font-medium text-gray-700 mb-2">
            Transcription Name (Optional)
          </label>
          <input
            type="text"
            id="transcription-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., My Weekly Team Meeting"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
          />
        </div>
        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <input
            type="url"
            id="video-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
            required
          />
           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LanguageSelector
            id="lang1"
            label="Primary Language (Required)"
            value={lang1}
            onChange={setLang1}
          />
          <LanguageSelector
            id="lang2"
            label="Secondary Language (Optional)"
            value={lang2}
            onChange={setLang2}
            optional
          />
        </div>
        
        <button
          type="submit"
          disabled={!url}
          className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-transform transform hover:scale-105 disabled:bg-pink-300 disabled:cursor-not-allowed disabled:transform-none"
        >
          Transcribe Video
        </button>
      </form>
    </div>
  );
};