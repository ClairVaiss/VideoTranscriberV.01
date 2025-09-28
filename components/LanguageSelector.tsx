
import React from 'react';
import { LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ id, label, value, onChange, optional = false }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
      >
        {optional && <option value="none">None</option>}
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
