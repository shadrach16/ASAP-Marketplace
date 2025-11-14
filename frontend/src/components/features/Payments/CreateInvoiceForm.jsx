import React, { useState } from 'react';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import paymentService from '../../../services/paymentService';

const CreateInvoiceForm = ({ bookingId, clientName, defaultCurrency, onClose, onInvoiceCreated }) => {
    const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: '' }]);
    const [dueDate, setDueDate] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: '' }]);
    };

    const removeItem = (index) => {
        if (items.length <= 1) return; // Keep at least one item
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!dueDate) { setError("Due date is required."); return; }
        if (items.some(item => !item.description.trim() || !(item.quantity > 0) || !(item.unitPrice >= 0))) {
            setError("All items must have a description, valid quantity, and non-negative price."); return;
        }

        setLoading(true);
        try {
            const invoiceData = {
                bookingId,
                items: items.map(item => ({
                    description: item.description,
                    quantity: parseFloat(item.quantity),
                    unitPrice: parseFloat(item.unitPrice),
                })),
                dueDate,
                currency: defaultCurrency || 'USD',
                notes,
            };
            await paymentService.createInvoice(invoiceData);
            if(onInvoiceCreated) onInvoiceCreated();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create invoice.');
        } finally {
            setLoading(false);
        }
    };

    const subTotal = calculateSubtotal();

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
             <h2 className="text-xl font-semibold text-text-primary">
                Create Custom Invoice for {clientName || 'Client'}
             </h2>
             {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>}

             {/* Items Section */}
             <div className="space-y-3">
                 <label className="block text-sm font-medium text-text-secondary">Invoice Items *</label>
                 {items.map((item, index) => (
                     <div key={index} className="flex items-end gap-2 p-3 bg-background-light border border-border-light rounded relative">
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <FormInput id={`desc-${index}`} name="description" label="Description" placeholder="Service or Item" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required disabled={loading} />
                            <FormInput id={`qty-${index}`} name="quantity" label="Qty" type="number" step="0.1" min="0.1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required disabled={loading} />
                            <FormInput id={`price-${index}`} name="unitPrice" label="Unit Price" type="number" step="0.01" min="0" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} required disabled={loading} />
                        </div>
                        {items.length > 1 && (
                            <Button type="button" variant="secondary" size="sm" onClick={() => removeItem(index)} disabled={loading} className="absolute -top-2 -right-2 p-1 h-6 w-6 !rounded-full bg-red-100 text-red-600 hover:bg-red-200 leading-none">
                                &times;
                            </Button>
                        )}
                     </div>
                 ))}
                 <Button type="button" variant="secondary" onClick={addItem} disabled={loading}>+ Add Item</Button>
             </div>

             {/* Due Date and Notes */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormInput id="dueDate" name="dueDate" label="Due Date *" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required disabled={loading} />
                 <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-text-secondary">Notes (Optional)</label>
                    <textarea id="notes" name="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} disabled={loading} className="mt-1 block w-full input-style" />
                 </div>
             </div>

             {/* Total Display */}
             <div className="text-right font-semibold text-text-primary pt-2 border-t border-border-light">
                 Total: ${subTotal.toFixed(2)} {defaultCurrency || 'USD'}
             </div>

             {/* Actions */}
             <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loading || items.length === 0 || !dueDate}>
                   {loading ? 'Creating...' : 'Create & Send Invoice'}
                </Button>
            </div>
        </form>
    );
};

export default CreateInvoiceForm;