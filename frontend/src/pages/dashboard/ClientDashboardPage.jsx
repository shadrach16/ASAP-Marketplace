// src/pages/Dashboard/ClientDashboardPage.js (NEW FILE)

import React, {
    useState,
    useEffect
} from 'react';
import {
    Loader2
} from 'lucide-react';

// Import the new dashboard components
import DashboardHeader from '../../components/features/Dashboard/DashboardHeader';
import StatsCards from '../../components/features/Dashboard/StatsCards';
import MyJobsList from '../../components/features/Dashboard/MyJobsList';
import RecentActivity from '../../components/features/Dashboard/RecentActivity';

// Import the new analytics service (we will create this in step 4)
import analyticsService from '../../services/analyticsService';
import {
    useAuth
} from '../../hooks/useAuth';

const ClientDashboardPage = () => {
    const {
        user
    } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                // This service/endpoint doesn't exist yet, we'll define it below
                const data = await analyticsService.getClientAnalytics();
                setStats(data);
            } catch (err) {
                setError(err.message || "Failed to load dashboard analytics.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

  

    return ( <>
        <DashboardHeader userName = {user?.name}/> 
        <div className = "container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6" > {
            error && ( <div className = "text-red-600 p-3 bg-red-50 border border-red-200 rounded-md" > {error} </div>
            )
        }

        { /* 1. Stats Cards */ } 
        { stats && <StatsCards stats={stats} />}

        { /* 2. Main Content Grid */ } 
            <div className = "grid grid-cols-1 lg:grid-cols-3 gap-6" >
        <div className = "lg:col-span-2" >
        { /* 3. My Jobs List */ } 
            <MyJobsList / >
        </div> 
        <div className = "lg:col-span-1 space-y-6" >
        { /* 4. Recent Activity */ } 
            <RecentActivity />
        </div> </div> </div> </>
    );
};

export default ClientDashboardPage;