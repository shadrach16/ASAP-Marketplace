import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import bookingService from '../../../services/bookingService';
import { useAuth } from '../../../hooks/useAuth';

const TimeLogForm = ({ bookingId, onTimeLogged, disabled }) => {
    const [formData, setFormData] = useState({
        hours: '',
        date: new Date().toISOString().split('T')[0], // Default to today
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.hours || !formData.date) return;
        setLoading(true); setError(null);
        try {
            await bookingService.logTimeEntry(bookingId, formData);
            setFormData({ hours: '', date: new Date().toISOString().split('T')[0], description: '' }); // Reset form
            if(onTimeLogged) onTimeLogged(); // Notify parent to refresh
        } catch (err) {
            setError(err.message || 'Failed to log time.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-background-light border border-border rounded-lg space-y-3">
             <h4 className="text-md font-semibold text-text-primary">Log Time</h4>
             {error && <p className="text-xs text-red-500">{error}</p>}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 <FormInput id="hours" name="hours" label="Hours *" type="number" step="0.1" min="0.1" max="24" value={formData.hours} onChange={handleChange} required disabled={loading || disabled} placeholder="e.g., 2.5" />
                 <FormInput id="date" name="date" label="Date *" type="date" value={formData.date} onChange={handleChange} required disabled={loading || disabled} />
                 <FormInput id="description" name="description" label="Description (Optional)" value={formData.description} onChange={handleChange} disabled={loading || disabled} placeholder="Work performed" />
             </div>
             <div className="text-right">
                <Button type="submit" variant="primary" disabled={loading || disabled || !formData.hours || !formData.date}>
                    {loading ? 'Logging...' : 'Log Time'}
                </Button>
             </div>
        </form>
    );
};

const TimeLogList = ({ entries, totalHours }) => {
     if (!entries || entries.length === 0) {
        return <p className="text-sm text-text-light mt-4">No time logged yet.</p>
    }
    return (
        <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold text-text-primary">Total Hours Logged: {totalHours}</p>
            <ul className="divide-y divide-border-light max-h-60 overflow-y-auto pr-2"> {/* Added scroll */}
                {entries.map(entry => (
                    <li key={entry._id} className="py-2">
                        <div className="flex justify-between items-start text-sm">
                            <span className="font-medium text-text-primary">{entry.hours} hours</span>
                            <span className="text-xs text-text-secondary">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                        {entry.description && <p className="text-xs text-text-secondary mt-1">{entry.description}</p>}
                        {/* Optional: Add pro name if multiple pros possible */}
                        {/* <p className="text-xs text-text-light mt-1">Logged by: {entry.pro?.name}</p> */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

const TimeTracker = ({ bookingId }) => {
    const { user } = useAuth();
    const [logData, setLogData] = useState({ entries: [], totalHours: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPro, setIsPro] = useState(false); // Determine if current user is the pro

    const loadTimeLog = useCallback(async () => {
        // setError(null); // Keep previous error visible during refresh?
        try {
            const data = await bookingService.getTimeEntries(bookingId);
            setLogData(data);
             // TODO: Need actual booking data to confirm if user is the 'pro' for this booking
             // This requires passing booking.pro._id down or fetching booking here
             setIsPro(user?.role === 'pro'); // Placeholder: Assume any pro can log time
        } catch (err) {
            setError(err.message || 'Failed to load time log.');
        } finally {
            setLoading(false);
        }
    }, [bookingId, user?.role]); // Added user?.role dependency

    useEffect(() => {
        setLoading(true);
        loadTimeLog();
    }, [loadTimeLog]); // Fetch on mount and when loadTimeLog changes (bookingId)

    // Callback for form submission
    const handleTimeLogged = () => {
        loadTimeLog(); // Refresh list after logging
    };

    return (
        <div className="bg-white p-6 shadow rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Time Log</h3>
            {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

            {/* Show form only to the Pro */}
            {isPro && <TimeLogForm bookingId={bookingId} onTimeLogged={handleTimeLogged} disabled={loading}/>}

            {/* Display Log List */}
            {loading && !logData.entries.length ? (
                <p className="text-text-secondary mt-4">Loading time log...</p>
            ) : (
                <TimeLogList entries={logData.entries} totalHours={logData.totalHours} />
            )}
        </div>
    );
};

export default TimeTracker;