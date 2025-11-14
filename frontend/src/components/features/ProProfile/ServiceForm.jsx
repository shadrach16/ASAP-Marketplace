// src/components/features/ProProfile/ServiceForm.jsx (Updated)

import React, { useState, useEffect } from 'react';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import FormTextArea from '../../common/FormTextArea';
import FileUploader from '../ProjectWorkspace/FileUploader';
import Stepper from '../../common/Stepper';
import { HelpCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import Select from 'react-select';
import { toast } from 'sonner';
import categoryService from '../../../services/categoryService'; // <-- 1. IMPORT CATEGORY SERVICE

// (selectStyles and currencyOptions remain the same)
const selectStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: '#eee',
        boxShadow: state.isFocused ? '0 0 0 2px silver' : 'none',
        '&:hover': {
            borderColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-border)',
        },
        minHeight: '42px',
        borderRadius: '0.375rem',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'var(--color-primary)' : state.isFocused ? 'var(--color-primary-light)' : 'white',
        color: state.isSelected ? 'white' : 'var(--color-text-primary)',
        '&:active': {
            backgroundColor: 'var(--color-primary-dark)',
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--color-text-primary)',
    }),
};
const formSteps = [
    { id: 1, name: 'About' },
    { id: 2, name: 'Scope & Price' },
    { id: 3, name: 'Media' },
    { id: 4, name: 'Review' },
];
const currencyOptions = [
    { value: 'CAD', label: 'CAD (Canadian Dollar)' },
    { value: 'USD', label: 'USD (US Dollar)' },
];
// ---

const ServiceForm = ({ initialData, onSubmit, onCancel, loading }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        // --- 2. ADD CATEGORY TO STATE ---
        // Assuming initialData.category is an ID. If it's an object, use initialData?.category?._id
        category: initialData?.category || '', 
        price: initialData?.price?.toString() || '',
        currency: initialData?.currency || 'CAD',
        revisions: initialData?.revisions?.toString() || '1',
        deliveryTimeDays: initialData?.deliveryTimeDays?.toString() || '',
        isActive: initialData ? initialData.isActive : true,
    });
    
    // --- 3. ADD STATE FOR CATEGORIES ---
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || null);
    const [formError, setFormError] = useState('');

    // --- 4. FETCH CATEGORIES ON MOUNT ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const fetchedCategories = await categoryService.getActiveCategories(); //
                // Format for react-select
                setCategories(fetchedCategories.map(cat => ({
                    value: cat._id,
                    label: cat.name
                })));
            } catch (err) {
                console.error("Failed to load categories:", err);
                setFormError("Could not load categories. Please try refreshing.");
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []); // Runs once on mount

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormError('');
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    // --- 5. HANDLERS FOR REACT-SELECT ---
    const handleCategoryChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, category: selectedOption.value }));
        setFormError('');
    };
    const handleCurrencyChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, currency: selectedOption.value }));
        setFormError('');
    };
    
    const findOption = (options, value) => options.find(option => option.value === value);
    // --- End Select Handlers ---

    const handleFileSelect = (file) => {
        // (This function remains the same)
        setImageFile(file); setFormError('');
        if (file) {
            if (previewUrl && previewUrl.startsWith('blob:')) { URL.revokeObjectURL(previewUrl); }
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            if (previewUrl && previewUrl.startsWith('blob:')) { URL.revokeObjectURL(previewUrl); }
            setPreviewUrl(initialData?.imageUrl || null);
        }
    };

    useEffect(() => {
        return () => { if (previewUrl && previewUrl.startsWith('blob:')) { URL.revokeObjectURL(previewUrl); } };
    }, [previewUrl]);

    // --- Navigation and Validation ---
    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < formSteps.length) {
                setCurrentStep(s => s + 1);
            }
        }
    };
    const handleBack = () => {
        if (currentStep > 1) {
            setFormError('');
            setCurrentStep(s => s - 1);
        }
    };

    const validateStep = (step) => {
        setFormError('');
        switch (step) {
            case 1: // About
                // --- 6. ADD CATEGORY VALIDATION ---
                if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
                    setFormError('Please provide a title, description, and category.'); 
                    return false;
                }
                break;
            case 2: // Scope & Price
                // (This logic remains the same)
                if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 1) {
                    setFormError('Price must be a number and at least 1.'); return false;
                }
                if (isNaN(parseInt(formData.deliveryTimeDays)) || parseInt(formData.deliveryTimeDays) < 1) {
                    setFormError('Delivery Time must be a whole number and at least 1 day.'); return false;
                }
                if (isNaN(parseInt(formData.revisions)) || parseInt(formData.revisions) < 0) {
                    setFormError('Revisions must be a whole number (0 or more).'); return false;
                }
                break;
            default: break;
        }
        return true; // Step is valid
    };

    // --- Final Submission ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');

        if (!validateStep(1) || !validateStep(2)) {
            if(!validateStep(1)) setCurrentStep(1);
            else if(!validateStep(2)) setCurrentStep(2);
            toast.error("Please complete all required fields in previous steps.");
            return;
        }

        const submissionData = new FormData();
        // This loop now correctly picks up 'category' from formData
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        if (imageFile) submissionData.append('serviceImage', imageFile);

        onSubmit(submissionData);
    };

    // --- Render Helper for Step Content ---
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // About
                return (
                    <section className="space-y-5">
                        <FormInput
                            id="title" name="title" label="Service Title *"
                            value={formData.title} onChange={handleChange} required disabled={loading} maxLength={100}
                            placeholder="e.g., Professional Plumbing Leak Detection & Repair"
                            helperText="A clear, concise title attracts the right clients."
                        />
                        
                        {/* --- 7. ADD CATEGORY SELECTOR --- */}
                        <div>
                            <label htmlFor="category-select" className="block text-sm font-medium text-text-secondary mb-2">
                                Category *
                            </label>
                            <Select
                                inputId="category-select"
                                name="category"
                                value={findOption(categories, formData.category)}
                                onChange={handleCategoryChange}
                                options={categories}
                                styles={selectStyles}
                                isDisabled={loading || loadingCategories}
                                isLoading={loadingCategories}
                                placeholder={loadingCategories ? 'Loading...' : 'Select a category...'}
                                required
                            />
                            <p className="text-xs text-text-light mt-1 flex items-center">
                                <HelpCircle size={14} className="mr-1"/> 
                                Select the category that best fits your service.
                            </p>
                        </div>

                        <FormTextArea
                            id="description" name="description" label="Description *" rows={6} className='mb-1'
                            value={formData.description} onChange={handleChange} required disabled={loading} maxLength={4000} // Increased limit
                            placeholder="Describe what the service includes, deliverables, your process..."
                            helperText="Be detailed about what the client will receive."
                        />
                    </section>
                );
            case 2: // Scope & Price
                return (
                    <section className="space-y-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                id="price" name="price" label="Starting Price *" type="number" step="0.01" min="1"
                                value={formData.price} onChange={handleChange} required disabled={loading}
                                prefix={formData.currency === 'CAD' ? 'C$' : '$'} // Add prefix
                            />
                            <div className="sm:col-span-1">
                                <label htmlFor="currency-select" className="block text-sm font-medium text-text-secondary mb-2">Currency</label>
                                <Select
                                    inputId="currency-select"
                                    name="currency"
                                    value={findOption(currencyOptions, formData.currency)}
                                    onChange={handleCurrencyChange}
                                    options={currencyOptions}
                                    styles={selectStyles}
                                    isDisabled={loading}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                id="deliveryTimeDays" name="deliveryTimeDays" label="Delivery Time (Days) *" type="number" min="1" step="1"
                                value={formData.deliveryTimeDays} onChange={handleChange} required disabled={loading}
                            />
                            <FormInput
                                id="revisions" name="revisions" label="Revisions Included" type="number" min="0" step="1"
                                value={formData.revisions} onChange={handleChange} required disabled={loading}
                                helperText="Number of edits included in the price."
                            />
                        </div>
                    </section>
                );
            case 3: // Media
                return (
                    // (This section remains the same)
                    <section className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Service Image {initialData?.imageUrl ? '(Optional: Replace existing)' : '(Optional)'}
                                </label>
                                <FileUploader
                                    onFileSelect={handleFileSelect}
                                    acceptedTypes="image/jpeg, image/png, image/webp"
                                    disabled={loading}
                                />
                                <p className="text-xs text-text-light mt-1 flex items-center">
                                    <HelpCircle size={14} className="mr-1"/> High-quality images attract more buyers. Max 5MB.
                                </p>
                            </div>
                            <div className="mt-1 md:mt-6">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain border rounded border-border bg-white p-1" />
                                ) : (
                                    <div className="w-full h-48 border border-dashed border-border rounded bg-white flex flex-col items-center justify-center text-text-light">
                                        <ImageIcon size={32} className="mb-1"/>
                                        <span className="text-sm">Image Preview</span>
                                    </div>
                                )}
                                {previewUrl && initialData?.imageUrl && previewUrl !== initialData.imageUrl && (
                                    <button type="button" onClick={() => handleFileSelect(null)} className="text-xs text-red-600 hover:underline mt-1" disabled={loading}>
                                        Revert to original image
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                );
            case 4: // Review
                return (
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Review Your Service</h3>
                        <div className="p-4 bg-background-light rounded-md border border-border space-y-2">
                            <p><strong>Title:</strong> {formData.title || '-'}</p>
                            {/* --- 8. ADD CATEGORY TO REVIEW --- */}
                            <p><strong>Category:</strong> {findOption(categories, formData.category)?.label || '-'}</p>
                            <p><strong>Price:</strong> ${parseFloat(formData.price || 0).toFixed(2)} {formData.currency}</p>
                            <p><strong>Delivery:</strong> {formData.deliveryTimeDays || '-'} day(s)</p>
                            <p><strong>Revisions:</strong> {formData.revisions || '0'}</p>
                            {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 w-32 h-auto object-contain border rounded border-border bg-white p-1" />}
                        </div>
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox" id="isActive" name="isActive"
                                checked={formData.isActive} onChange={handleChange} disabled={loading}
                                className="h-4 w-4 text-primary border-border rounded focus:ring-primary-light"
                            />
                            <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-text-primary">
                                Make this service active and visible upon saving
                            </label>
                        </div>
                    </section>
                );
            default: return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Stepper steps={formSteps} currentStep={currentStep} />

            {formError && (
                <div role="alert" className="my-4 text-sm text-red-700 p-3 bg-red-50 border border-red-200 rounded-md">
                    {formError}
                </div>
            )}

            <div className="min-h-[300px]">
                {renderStepContent()}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-border-light mt-8">
                <div>
                    {currentStep > 1 && (
                        <Button type="button" variant="secondary" onClick={handleBack} disabled={loading}>
                            Back
                        </Button>
                    )}
                </div>
                <div>
                    {currentStep < formSteps.length ? (
                        <Button type="button" variant="primary" onClick={handleNext} disabled={loading}>
                            Next: {formSteps[currentStep].name}
                        </Button>
                    ) : (
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? (initialData ? 'Saving...' : <Loader2 className="w-5 h-5 animate-spin" />) : (initialData ? 'Save Changes' : 'Create Service')}
                        </Button>
                    )}
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} className="ml-3">
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ServiceForm;