import React, { useState, useEffect, useCallback } from 'react';
import { X, Search } from 'lucide-react';
import skillService from '../../../services/skillService';
import { useDebounce } from '../../../hooks/useDebounce'; // You'll need this hook

// --- Create this hook in src/hooks/useDebounce.js ---
// export const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);
//   return debouncedValue;
// };
// -----------------------------------------------------

const SkillSelector = ({ selectedSkills, setSelectedSkills }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchSkills = useCallback(async (search) => {
    if (search.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const skills = await skillService.searchSkills(search);
      // Filter out skills already selected
      const newSkills = skills.filter(
        skill => !selectedSkills.find(s => s._id === skill._id)
      );
      setResults(newSkills); //
    } catch (error) {
      console.error('Failed to fetch skills', error);
      setResults([]);
    }
    setLoading(false);
  }, [selectedSkills]); // Re-run if selectedSkills changes

  useEffect(() => {
    fetchSkills(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchSkills]);

  const addSkill = (skill) => {
    setSelectedSkills(prev => [...prev, skill]);
    setSearchTerm('');
    setResults([]);
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(prev => prev.filter(s => s._id !== skillToRemove._id));
  };

  return (
    <div className="space-y-4">
      {/* --- Selected Skills Pill Box --- */}
      <div className="flex flex-wrap gap-2 p-3 border border-border rounded-md min-h-[44px] bg-background-light">
        {selectedSkills.length === 0 && (
          <span className="text-sm text-text-light">Selected skills will appear here...</span>
        )}
        {selectedSkills.map(skill => (
          <span
            key={skill._id}
            className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-full text-sm font-medium"
          >
            {skill.name}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-1 rounded-full hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>

      {/* --- Search Input --- */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for skills (e.g., Plumbing, React)"
          className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary"
        />
        {/* --- Search Results Dropdown --- */}
        {(loading || results.length > 0) && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading && <div className="p-3 text-sm text-text-light">Searching...</div>}
            {!loading && results.map(skill => (
              <button
                key={skill._id}
                type="button"
                onClick={() => addSkill(skill)}
                className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
              >
                {skill.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillSelector;