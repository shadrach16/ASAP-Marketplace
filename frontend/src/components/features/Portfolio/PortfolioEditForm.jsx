import React, { useState, useEffect } from 'react';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import FileUploader from '../../features/ProjectWorkspace/FileUploader'; // Ensure this path is correct
import { Loader2 } from 'lucide-react';

const PortfolioEditForm = ({ initialData, onSubmit, onCancel, loading, actionError }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        projectUrl: initialData?.projectUrl || '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || null);

    // Dynamic label for the form header - Changed to "Creation Sample"
    const formTitle = initialData ? 'Edit Creation Sample' : 'Add New Creation Sample';
    
    // Dynamic message for the image upload field - Changed to "Work Photo"
    const imageLabel = initialData 
        ? 'Work Photo (Optional: Upload new photo)' 
        : 'Work Photo (Required: Showcase your craft)';

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileSelect = (file) => {
        setImageFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            // If file is removed/cleared, revert to initial image URL if editing, otherwise clear preview
            setPreviewUrl(initialData?.imageUrl || null); 
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic Validation
        if (!formData.title.trim()) return; 
        if (!initialData && !imageFile) return; // Require image for new items

        const submissionData = new FormData();
        submissionData.append('title', formData.title.trim());
        submissionData.append('description', formData.description.trim());
        submissionData.append('projectUrl', formData.projectUrl.trim());
        
        // Only append file if one was selected
        if (imageFile) {
            submissionData.append('image', imageFile);
        }

        onSubmit(submissionData);
    };

    // Clean up object URL on component unmount or when previewUrl changes
    useEffect(() => {
        const urlToRevoke = previewUrl;
        return () => {
            if (urlToRevoke && typeof urlToRevoke === 'string' && urlToRevoke.startsWith('blob:')) {
                URL.revokeObjectURL(urlToRevoke);
            }
        }
    }, [previewUrl]);


    return (
        <div className="bg-white p-6 border border-gray-200 rounded-xl ">
            <h2 className="text-2xl font-bold text-text-primary mb-6 border-b pb-2">
                {formTitle}
            </h2>

            {/* Error Message */}
             {actionError && (
                <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200 mb-4">
                    {actionError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput 
                    id="title" 
                    name="title" 
                    // Changed label to "Work Title"
                    label="Creation/Work Title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    disabled={loading} 
                    placeholder="e.g., Hand-carved Oak Coffee Table, Custom Gold Leaf Painting"
                />
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description (Materials & Techniques)</label>
                    <textarea 
                        id="description" 
                        name="description" 
                        rows={4} 
                        value={formData.description} 
                        onChange={handleChange} 
                        disabled={loading} 
                        className="mt-1 block w-full p-2 border border-border rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        // Updated placeholder for artisan details
                        placeholder="Describe your work: the materials used (e.g., reclaimed wood, linen, oil paint), the key techniques, and the story behind the creation."
                    />
                </div>
                
                <FormInput 
                    id="projectUrl" 
                    name="projectUrl" 
                    // Changed label to "Showcase Link"
                    label="Online Showcase Link (Optional)" 
                    type="url"
                    value={formData.projectUrl} 
                    onChange={handleChange} 
                    disabled={loading} 
                    // Updated placeholder for artisan shop/social links
                    placeholder="e.g., Your personal website, Etsy/Shopify link, or Instagram post" 
                />
                
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">{imageLabel}</label>
                    
                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                            <img src={previewUrl} alt="Preview" className="w-full h-60 object-contain bg-gray-50 p-2" />
                        </div>
                    )}
                    
                    <FileUploader 
                        onFileSelect={handleFileSelect} 
                        acceptedTypes="image/jpeg, image/png, image/gif" 
                        disabled={loading} 
                    />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading || !formData.title.trim() || (!initialData && !imageFile)}>
                        {loading ? (
                            <span className='flex space-x-2 items-center'>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                {initialData ? 'Saving...' : 'Adding...'}
                            </span>
                        ) : (
                            initialData ? 'Save Changes' : 'Add Item'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PortfolioEditForm;