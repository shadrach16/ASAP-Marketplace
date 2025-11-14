// src/components/features/Services/ServiceSearchFilterBar.jsx (NEW FILE)

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import categoryService from '../../../services/categoryService'; //

const inputStyle = "block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm disabled:opacity-70 disabled:bg-gray-100";

const deliveryOptions = [
  { label: "Any Time", value: "" },
  { label: "Up to 3 Days", value: "3" },
  { label: "Up to 7 Days", value: "7" },
  { label: "Up to 14 Days", value: "14" },
];

/**
 * A vertical filter bar for the Find Services page.
 * @param {object} props
 * @param {function(object): void} props.onSearch - Callback with search params.
 * @param {boolean} props.disabled - Disables the form during loading.
 */
const ServiceSearchFilterBar = ({ onSearch, disabled }) => {
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const fetchedCategories = await categoryService.getActiveCategories();
        setCategories(fetchedCategories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    onSearch({
      category,
      minPrice,
      maxPrice,
      deliveryTime,
    });
  };

  const handleClearFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setDeliveryTime('');
    onSearch({}); // Trigger search with empty filters
  };

  return (
    <form
      onSubmit={handleApplyFilters}
      className="bg-white p-4 shadow-sm rounded-lg border border-border space-y-5"
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
        <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">
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
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* --- Budget Filter --- */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Price Range ($)
        </label>
        <div className="flex items-center gap-2">
          <FormInput
            id="minPrice"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            disabled={disabled}
            className="w-1/2"
          />
          <FormInput
            id="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            disabled={disabled}
            className="w-1/2"
          />
        </div>
      </div>
      
      {/* --- Delivery Time Filter --- */}
      <div>
        <label htmlFor="deliveryTime" className="block text-sm font-medium text-text-secondary mb-1">
          Delivery Time
        </label>
        <select
          id="deliveryTime"
          name="deliveryTime"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          disabled={disabled}
          className={`mt-1 ${inputStyle}`}
        >
          {deliveryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={disabled}>
        {disabled ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Apply Filters'}
      </Button>
    </form>
  );
};

export default ServiceSearchFilterBar;