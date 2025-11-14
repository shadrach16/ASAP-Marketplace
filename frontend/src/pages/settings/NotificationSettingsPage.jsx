import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import {
    Bell, Mail, MessageSquare, FileText, CheckCircle,
    DollarSign, BookOpen, AlertTriangle, ShieldCheck
} from 'lucide-react'; // Import relevant icons

// Define the structure, labels, and icons for preferences
const preferenceOptions = [
    { key: 'newMessage', label: 'New Messages', icon: MessageSquare },
    { key: 'proposalReceived', label: 'New Proposals Received', icon: FileText, roles: ['client'] }, // Role specific
    { key: 'proposalAccepted', label: 'Proposal Accepted', icon: CheckCircle, roles: ['pro'] }, // Role specific
    { key: 'bookingCreated', label: 'New Booking Started', icon: BookOpen },
    { key: 'milestoneFunded', label: 'Milestone Funded', icon: DollarSign, roles: ['pro'] }, // Role specific
    { key: 'milestoneReleased', label: 'Milestone Payment Released', icon: DollarSign, roles: ['pro'] }, // Role specific
    { key: 'reviewSubmitted', label: 'New Review Received', icon: CheckCircle }, // Assuming 'testimonial' is handled separately
    { key: 'disputeOpened', label: 'Dispute Opened', icon: AlertTriangle },
    { key: 'disputeResolved', label: 'Dispute Resolved', icon: ShieldCheck },
    // Add more as needed (e.g., KYC status updates, platform announcements)
];

// Reusable Toggle Switch Component (Slightly improved styling)
const ToggleSwitch = ({ id, label, checked, onChange, disabled }) => (
    <button
        type="button"
        id={id}
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            checked ? 'bg-primary' : 'bg-gray-200'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        role="switch"
        aria-checked={checked}
        aria-label={label} // Added aria-label
    >
        <span
            aria-hidden="true"
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                checked ? 'translate-x-5' : 'translate-x-0'
            }`}
        />
    </button>
);


const NotificationSettingsPage = () => {
    const { user, updatePreferences, loading: authLoading } = useAuth();
    const [prefs, setPrefs] = useState({}); // Local state { key: { email: bool, inApp: bool } }
    const [loading, setLoading] = useState(false); // For API call loading

    // Initialize local state from user context
    useEffect(() => {
        if (user?.notificationPreferences) {
            const userPrefs = {};
            preferenceOptions.forEach(opt => {
                // Get prefs from user context, providing defaults if key missing
                const setting = user.notificationPreferences[opt.key] || { email: true, inApp: true };
                userPrefs[opt.key] = { email: setting.email, inApp: setting.inApp };
            });
            setPrefs(userPrefs);
        }
    }, [user?.notificationPreferences]);

    // Filter options based on user role
    const relevantPreferenceOptions = preferenceOptions.filter(opt =>
        !opt.roles || opt.roles.includes(user?.role)
    );

    const handleToggle = async (key, channel) => {
        const currentSetting = prefs[key] || { email: true, inApp: true };
        const originalValue = currentSetting[channel];
        const newValue = !originalValue;

        // Optimistic UI Update
        setPrefs(prev => ({
            ...prev,
            [key]: { ...currentSetting, [channel]: newValue }
        }));

        // Prepare data for API (only send the changed key and channel)
        const updateData = { [key]: { [channel]: newValue } };

        try {
            setLoading(true);
            await updatePreferences(updateData); // Call context update function
            toast.success(`'${preferenceOptions.find(o => o.key === key)?.label}' ${channel} notifications ${newValue ? 'enabled' : 'disabled'}.`);
        } catch (err) {
            toast.error(err.message || 'Failed to update preferences.');
            // Revert optimistic update on error
            setPrefs(prev => ({
                ...prev,
                [key]: { ...currentSetting, [channel]: originalValue } // Revert the change
            }));
        } finally {
            setLoading(false);
        }
    };

    // Show loader if AuthContext is still loading the user
    if (authLoading && !user) {
         return <div className="p-6 text-center text-text-secondary">Loading settings...</div>;
    }

    return (
        <>
            <Helmet>
                <title>Notification Settings | ASAP Marketplace</title>
            </Helmet>

            <div className="bg-white  rounded-xl overflow-hidden border border-border">
                <div className="p-6 md:p-8 border-b border-border-light">
                    <h2 className="text-xl font-semibold text-text-primary mb-1 flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-primary"/> Notification Settings
                    </h2>
                    <p className="text-sm text-text-secondary">
                        Choose how you want to be notified about activity on ASAP.
                    </p>
                </div>

                {/* --- Preferences Table --- */}
                <div className="divide-y divide-border-light">
                    {/* Header Row */}
                    <div className="grid grid-cols-3 gap-4 px-6 md:px-8 py-3 bg-background-light text-xs font-semibold uppercase text-text-secondary tracking-wider">
                        <div className="col-span-1">Notification Type</div>
                        <div className="col-span-1 text-center">In-App</div>
                        <div className="col-span-1 text-center">Email</div>
                    </div>

                    {/* Preference Rows */}
                    {relevantPreferenceOptions.map(option => (
                        <div key={option.key} className="grid grid-cols-3 gap-4 px-6 md:px-8 py-4 items-center hover:bg-gray-50 transition-colors">
                            {/* Label and Icon */}
                            <div className="col-span-1 flex items-center">
                                <option.icon className="w-5 h-5 mr-3 text-primary hidden sm:inline-block" />
                                <span className="text-sm font-medium text-text-primary">{option.label}</span>
                            </div>
                            {/* In-App Toggle */}
                            <div className="col-span-1 flex justify-center">
                                <ToggleSwitch
                                    id={`${option.key}-inApp`}
                                    label={`In-App for ${option.label}`}
                                    checked={prefs[option.key]?.inApp ?? true}
                                    onChange={() => handleToggle(option.key, 'inApp')}
                                    disabled={loading}
                                />
                            </div>
                            {/* Email Toggle */}
                            <div className="col-span-1 flex justify-center">
                                <ToggleSwitch
                                    id={`${option.key}-email`}
                                    label={`Email for ${option.label}`}
                                    checked={prefs[option.key]?.email ?? true}
                                    onChange={() => handleToggle(option.key, 'email')}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Optional Footer/Save Button (if not saving on toggle) */}
                {/* <div className="bg-background-light px-6 py-4 text-right border-t border-border-light">
                    <Button variant="primary" disabled={loading}>Save All Changes</Button>
                </div> */}
            </div>
        </>
    );
};

export default NotificationSettingsPage;