import React, { useState, useEffect, useRef } from 'react';
import skillService from '../../services/skillService';

const MultiSelectSkills = ({ selectedSkills, onChange, disabled,disabledLabel=false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availableSkills, setAvailableSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch skills based on search term (debounced)
    useEffect(() => {
        const fetchSkills = async () => {
            if (!showDropdown) return; // Only fetch when dropdown is open
            setLoading(true);
            try {
                const skills = await skillService.searchSkills(searchTerm);
                // Filter out already selected skills
                const filteredSkills = skills.filter(skill => !selectedSkills.some(s => s._id === skill._id));
                setAvailableSkills(filteredSkills);
            } catch (error) {
                console.error("Error fetching skills:", error);
                setAvailableSkills([]); // Clear on error
            } finally {
                setLoading(false);
            }
        };

        // Debounce API call
        const timerId = setTimeout(() => {
            fetchSkills();
        }, 300); // 300ms debounce

        return () => clearTimeout(timerId);
    }, [searchTerm, showDropdown, selectedSkills]); // Refetch when search, dropdown visibility, or selection changes

     // Close dropdown on outside click
     useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleSelectSkill = (skill) => {
        onChange([...selectedSkills, skill]); // Add selected skill object
        setSearchTerm(''); // Clear search
        setShowDropdown(false);
    };

    const handleRemoveSkill = (skillIdToRemove) => {
        onChange(selectedSkills.filter(skill => skill._id !== skillIdToRemove));
    };

    return (
        <div ref={dropdownRef}>
           {!disabledLabel && <label className="block text-sm font-medium text-text-secondary mb-1">Required Skills *</label>}
            {/* Display Selected Skills as Tags */}
            <div className={`flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] ${disabled ? 'bg-gray-100' : 'bg-white'}`}>
                {selectedSkills.map(skill => (
                    <span key={skill._id} className="flex items-center px-2 py-0.5 bg-primary-light text-primary-dark text-sm font-medium rounded-full">
                        {skill.name}
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill._id)}
                                className="ml-1.5 text-primary-dark hover:text-red-600 focus:outline-none"
                                aria-label={`Remove ${skill.name}`}
                            >
                                &times;
                            </button>
                        )}
                    </span>
                ))}
                {/* Search Input */}
                {!disabled && (
                     <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        // onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // Delay blur to allow click
                        placeholder={selectedSkills.length === 0 ? "Search and add skills..." : "Add more..."}
                        className="flex-grow outline-none text-sm p-1"
                        disabled={disabled}
                    />
                )}
            </div>

            {/* Dropdown for available skills */}
            {showDropdown && !disabled && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {loading && <div className="px-4 py-2 text-xs text-text-light">Loading...</div>}
                    {!loading && availableSkills.length === 0 && searchTerm && (
                         <div className="px-4 py-2 text-xs text-text-light">No matching skills found.</div>
                         // Optional: Button to "Add New Skill" (requires separate logic)
                    )}
                     {!loading && availableSkills.length === 0 && !searchTerm && (
                         <div className="px-4 py-2 text-xs text-text-light">Type to search skills...</div>
                    )}
                    {!loading && availableSkills.map(skill => (
                        <div
                            key={skill._id}
                            onClick={() => handleSelectSkill(skill)}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-text-primary hover:bg-primary hover:text-white"
                        >
                            <span className="block truncate capitalize">{skill.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default MultiSelectSkills;