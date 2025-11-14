// src/components/ui/SearchFilterBar.js (Redesigned)

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import MultiSelectSkills from '../common/MultiSelectSkills'; // <-- IMPORTED
import categoryService from '../../services/categoryService'; //

const inputStyle = "block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm disabled:opacity-70 disabled:bg-gray-100";

const proposalRanges = [
  { label: "Any", value: "" },
  { label: "Less than 5", value: "0-5" },
  { label: "5 to 10", value: "5-10" },
  { label: "10 to 20", value: "10-20" },
  { label: "20+", value: "20+" },
];

const EXPERIENCE_LEVELS = [
  { label: 'All Levels', value: '' },
  { label: 'Entry Level', value: 'entry' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expert', value: 'expert' },
];


/**
 * A vertical filter bar for the Find Work page.
 * @param {object} props
 * @param {function(object): void} props.onSearch - Callback with search params.
 * @param {boolean} props.disabled - Disables the form during loading.
 */
const SearchFilterBar = ({ onSearch, disabled }) => {
  // State for all filterable fields
  const [category, setCategory] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [proposalsRange, setProposalsRange] = useState('');
  const [location, setLocation] = useState('');

  // State for loading categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const fetchedCategories = await categoryService.getActiveCategories(); //
        setCategories(fetchedCategories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  /**
   * Gathers all filter states and calls the onSearch prop.
   */
  const handleApplyFilters = (e) => {
    e.preventDefault();
    onSearch({
      category,
      skills: selectedSkills.map(skill => skill._id).join(','), // Send comma-separated IDs
      minBudget,
      maxBudget,
      proposalsRange,
      location,
    });
  };

  /**
   * Resets all filters back to default.
   */
  const handleClearFilters = () => {
    setCategory('');
    setExperienceLevel('');
    setSelectedSkills([]);
    setMinBudget('');
    setMaxBudget('');
    setProposalsRange('');
    setLocation('');
    // Immediately trigger a search with no filters
    onSearch({});
  };

  return (
    <form
      onSubmit={handleApplyFilters}
      className="bg-white p-4   rounded-lg border border-border space-y-5"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
        <button
          type="button"
          onClick={handleClearFilters}
          disabled={disabled}
          className="text-sm text-primary hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* --- Category Filter --- */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-2">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={disabled || loadingCategories}
          className={`mt-1 ${inputStyle}`}
        >
          <option value="">{loadingCategories ? 'Loading...' : 'All Categories'}</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option> //
          ))}
        </select>
      </div>

      {/* --- Skills Filter --- */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Skills
        </label>
        <MultiSelectSkills
          selectedSkills={selectedSkills}
          onChange={setSelectedSkills}
          disabled={disabled}
          disabledLabel
        />
        <p className="text-xs text-text-light mt-1">Select one or more skills.</p>
      </div>

      {/* --- Budget Filter --- */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Budget ($)
        </label>
        <div className="flex items-center gap-2">
          <FormInput
            id="minBudget"
            type="number"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            placeholder="Min"
            disabled={disabled}
            className="w-1/2"
          />
          <FormInput
            id="maxBudget"
            type="number"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            placeholder="Max"
            disabled={disabled}
            className="w-1/2"
          />
        </div>
      </div>
      
      {/* --- Proposals Filter --- */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Number of Proposals
        </label>
        <div className="space-y-2">
          {proposalRanges.map(range => (
            <label key={range.value} className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="proposalsRange"
                value={range.value}
                checked={proposalsRange === range.value}
                onChange={(e) => setProposalsRange(e.target.value)}
                disabled={disabled}
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>


      {/* --- Category Filter --- */}
      <div>
        <label htmlFor="experienceLevel" className="block text-sm font-medium text-text-secondary mb-2">
          Experience Level
        </label>
        <select
          id="experienceLevel"
          name="experienceLevel"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          disabled={disabled  }
          className={`mt-1 ${inputStyle}`}
        >
          <option value="">{ 'All Levels'}</option>
          {EXPERIENCE_LEVELS.map(level => (
             <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>
      </div>


      {/* --- Location Filter --- */}
      <FormInput
        id="location"
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g., Remote, Toronto"
        disabled={disabled}
      />
      
      <Button type="submit" variant="primary" className="w-full" disabled={disabled}>
        {disabled ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Apply Filters'}
      </Button>
    </form>
  );
};

export default SearchFilterBar;